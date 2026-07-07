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
        } else {
          setUser(null);
          setDbUser(null);
          setToken(null);
          setFirebaseToken(null);
          setNeedsOnboarding(false);
          localStorage.removeItem('gg33-odis-id');
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
