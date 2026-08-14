import React, { createContext, useContext, useEffect, useState } from "react";
import { User as FirebaseUser, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { setFirebaseToken } from "../lib/queryClient";

export interface DBUser {
  id: string;
  odisId: string;
  fullName: string;
  birthDate: string;
  birthTime?: string;
  birthLocation?: string;
  firebaseUid?: string;
  email?: string;
  isPro: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  dbUser: DBUser | null;
  loading: boolean;
  needsOnboarding: boolean;
  token: string | null;
  logout: () => Promise<void>;
  refreshDbUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function syncMedianOneSignalUser(odisId?: string | null) {
  if (typeof window === "undefined") return;
  const win = window as any;
  try {
    if (odisId) {
      // OneSignal SDK v5+ via Median
      if (typeof win.median?.onesignal?.login === "function") {
        win.median.onesignal.login(odisId);
      } else if (typeof win.median?.onesignal?.externalId?.set === "function") {
        win.median.onesignal.externalId.set({ externalId: odisId });
      } else if (typeof win.gonative?.onesignal?.login === "function") {
        win.gonative.onesignal.login(odisId);
      } else if (typeof win.gonative?.onesignal?.externalId?.set === "function") {
        win.gonative.onesignal.externalId.set({ externalId: odisId });
      }
    } else {
      if (typeof win.median?.onesignal?.logout === "function") {
        win.median.onesignal.logout();
      } else if (typeof win.median?.onesignal?.externalId?.delete === "function") {
        win.median.onesignal.externalId.delete();
      } else if (typeof win.gonative?.onesignal?.logout === "function") {
        win.gonative.onesignal.logout();
      }
    }
  } catch (err) {
    console.warn("[OneSignal Bridge] Error syncing user:", err);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  const fetchProfile = async (idToken: string) => {
    try {
      setFirebaseToken(idToken);
      const res = await fetch("/api/me", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setDbUser(data.user);
        setNeedsOnboarding(data.needsOnboarding);
        if (data.user?.odisId) {
          localStorage.setItem('gg33-odis-id', data.user.odisId);
          syncMedianOneSignalUser(data.user.odisId);
        } else {
          localStorage.removeItem('gg33-odis-id');
        }
      } else {
        setDbUser(null);
        setNeedsOnboarding(true);
        localStorage.removeItem('gg33-odis-id');
      }
    } catch (err) {
      console.error("[AuthContext] Error fetching profile:", err);
      setDbUser(null);
      setNeedsOnboarding(true);
      localStorage.removeItem('gg33-odis-id');
    }
  };

  const refreshDbUser = async () => {
    if (auth.currentUser) {
      const idToken = await auth.currentUser.getIdToken(true);
      setToken(idToken);
      await fetchProfile(idToken);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          const idToken = await firebaseUser.getIdToken();
          setToken(idToken);
          setFirebaseToken(idToken);
          await fetchProfile(idToken);

          // If running inside Median.co / GoNative In-App Browser modal, close it to return to main app view
          if (typeof window !== "undefined") {
            const win = window as any;
            if (win.median?.inappbrowser?.close) {
              win.median.inappbrowser.close();
            } else if (win.gonative?.inappbrowser?.close) {
              win.gonative.inappbrowser.close();
            }
          }
        } else {
          setUser(null);
          setDbUser(null);
          setToken(null);
          setFirebaseToken(null);
          setNeedsOnboarding(false);
          localStorage.removeItem('gg33-odis-id');
          syncMedianOneSignalUser(null);
        }
      } catch (error) {
        console.error("[AuthContext] Auth state change handler error:", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      syncMedianOneSignalUser(null);
      await signOut(auth);
      localStorage.removeItem('gg33-odis-id');
    } catch (err) {
      console.error("[AuthContext] Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        loading,
        needsOnboarding,
        token,
        logout,
        refreshDbUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
