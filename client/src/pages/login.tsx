import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult, sendPasswordResetEmail } from "firebase/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { FcGoogle } from "react-icons/fc";
import { Loader2, KeyRound, Mail } from "lucide-react";
import { StarField } from "../components/StarField";
import { LegalModal } from "../components/LegalModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [legalType, setLegalType] = useState<'terms' | 'privacy' | null>(null);

  // Check redirect result for mobile / in-app WebView auth (Median.co, iOS, Android)
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
          toast({
            title: isNewUser ? "Account Created!" : "Welcome back!",
            description: isNewUser
              ? "Your account has been created with Google."
              : "Successfully signed in with Google.",
          });
          setLocation("/");
        }
      })
      .catch((err) => {
        console.error("[Auth Redirect Error]:", err);
      });
  }, [setLocation, toast]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
      setLocation("/");
    } catch (err: any) {
      console.error(err);
      let message = "Failed to log in. Please check your credentials.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        message = "Incorrect email or password.";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email format.";
      }
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      // Check if user is in an in-app WebView (Median.co, iOS/Android WebView) or mobile
      const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
      const isMobileWebView = /wv|Android|iPhone|iPad|iPod|Median|GoNative/i.test(userAgent);

      if (isMobileWebView) {
        // Use redirect auth for WebViews to avoid stuck popups
        await signInWithRedirect(auth, googleProvider);
      } else {
        // Use popup for desktop web browsers
        const result = await signInWithPopup(auth, googleProvider);
        const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
        toast({
          title: isNewUser ? "Account Created!" : "Welcome back!",
          description: isNewUser
            ? "Your account has been created with Google."
            : "Successfully signed in with Google.",
        });
        setLocation("/");
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        return;
      }
      // If popup is blocked by browser/WebView, fallback to redirect automatically
      if (err.code === "auth/popup-blocked" || err.code === "auth/operation-not-allowed") {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr) {
          console.error(redirectErr);
        }
      }

      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: err?.message || "An error occurred during Google sign-in. You can also log in with email.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address to receive the password reset link.",
      });
      return;
    }
    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      toast({
        title: "Reset Email Sent!",
        description: `We've sent a password reset link to ${resetEmail.trim()}. Please check your inbox.`,
      });
      setShowForgotModal(false);
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: err?.message || "Could not send password reset email. Please ensure your email is correct.",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-4 py-8">
      {/* Background Starfield effect */}
      <div className="absolute inset-0 z-0 opacity-40">
        <StarField />
      </div>

      {/* Decorative premium radial gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(212,163,62,0.15)_0%,transparent_70%)] blur-3xl z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(212,163,62,0.1)_0%,transparent_70%)] blur-3xl z-0 pointer-events-none" />

      <Card className="w-full max-w-md bg-zinc-950/70 border-zinc-800/80 backdrop-blur-xl shadow-[0_0_50px_rgba(212,163,62,0.05)] relative z-10">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-2">
            <span className="text-3xl font-extrabold tracking-widest bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(212,163,62,0.3)]">
              GG33 CORE
            </span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-zinc-100">Welcome Back</CardTitle>
          <CardDescription className="text-zinc-400">
            Sign in to access your custom numerology & astrology profiles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-300">Email Address</label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isGoogleLoading}
                className="bg-zinc-900/60 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-zinc-300">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isGoogleLoading}
                className="bg-zinc-900/60 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-800" />
            <span className="flex-shrink mx-4 text-zinc-500 text-xs uppercase">Or continue with</span>
            <div className="flex-grow border-t border-zinc-800" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            className="w-full border-zinc-800 hover:bg-zinc-900/50 text-zinc-200 bg-transparent flex items-center justify-center gap-3 transition-colors duration-300 h-10"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                <span className="text-amber-300 text-sm font-medium">Connecting to Google...</span>
              </>
            ) : (
              <>
                <FcGoogle className="h-5 w-5" />
                <span>Continue with Google</span>
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 justify-center border-t border-zinc-900/50 py-4">
          <p className="text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              Sign up
            </Link>
          </p>

          <div className="text-[11px] text-zinc-500 text-center leading-relaxed">
            By signing in, you agree to our{" "}
            <button
              type="button"
              onClick={() => setLegalType('terms')}
              className="text-zinc-400 hover:text-amber-400 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={() => setLegalType('privacy')}
              className="text-zinc-400 hover:text-amber-400 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>
        </CardFooter>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotModal} onOpenChange={setShowForgotModal}>
        <DialogContent className="w-[95vw] sm:max-w-md p-0 rounded-2xl border-zinc-800 bg-zinc-950 overflow-hidden text-zinc-100">
          <div className="p-6 space-y-4">
            <DialogHeader className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                </div>
                <DialogTitle className="text-lg font-bold text-zinc-100">
                  Reset Your Password
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-zinc-400">
                Enter your account email and we'll send you a link to reset your password.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSendResetEmail} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label htmlFor="reset-email" className="text-xs font-medium text-zinc-300">
                  Email Address
                </label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="name@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  disabled={isResetting}
                  className="bg-zinc-900/60 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 border-zinc-800 text-xs"
                  onClick={() => setShowForgotModal(false)}
                  disabled={isResetting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="flex-1 text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950"
                  disabled={isResetting}
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Legal Modal */}
      {legalType && (
        <LegalModal
          open={!!legalType}
          onOpenChange={(isOpen) => !isOpen && setLegalType(null)}
          type={legalType}
        />
      )}
    </div>
  );
}
