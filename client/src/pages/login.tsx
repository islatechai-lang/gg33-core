import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { auth, googleProvider } from "../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { FcGoogle } from "react-icons/fc";
import { 
  Loader2, 
  KeyRound, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff 
} from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
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
      await signInWithEmailAndPassword(auth, email.trim(), password);
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
      const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
      const isMobileWebView = /wv|Android|iPhone|iPad|iPod|Median|GoNative/i.test(userAgent);

      if (isMobileWebView) {
        await signInWithRedirect(auth, googleProvider);
      } else {
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
    <div className="min-h-[100dvh] w-full flex flex-col justify-between items-center bg-black px-5 py-8 sm:py-12 relative overflow-x-hidden selection:bg-amber-400 selection:text-black">
      {/* Background Starfield */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
        <StarField />
      </div>

      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/[0.05] rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Top spacing on mobile */}
      <div className="hidden sm:block" />

      {/* Seamless Full-Page Content Form */}
      <div className="w-full max-w-[360px] sm:max-w-[380px] flex flex-col my-auto relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/" className="inline-block">
            <div className="w-11 h-11 rounded-2xl overflow-hidden ring-1 ring-white/15 shadow-md flex items-center justify-center bg-zinc-900 active:scale-95 transition-transform cursor-pointer">
              <img
                src="/images/logo.png?v=1"
                alt="GG33 Core"
                className="w-11 h-11 object-cover"
                width={44}
                height={44}
              />
            </div>
          </Link>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Sign in to GG33 Core
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Welcome back. Enter your details to continue.
            </p>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-3.5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-medium text-zinc-300">
              Email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isGoogleLoading}
                className="pl-10 h-12 rounded-2xl bg-zinc-900/60 border-white/[0.08] hover:border-white/15 focus:border-amber-400 focus:bg-zinc-900/90 text-zinc-100 placeholder:text-zinc-600 text-sm shadow-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-xs font-medium text-zinc-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setShowForgotModal(true);
                }}
                className="text-xs text-amber-400/90 hover:text-amber-300 transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isGoogleLoading}
                className="pl-10 pr-11 h-12 rounded-2xl bg-zinc-900/60 border-white/[0.08] hover:border-white/15 focus:border-amber-400 focus:bg-zinc-900/90 text-zinc-100 placeholder:text-zinc-600 text-sm shadow-none transition-all"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full h-12 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-sm transition-all duration-150 active:scale-[0.98] cursor-pointer mt-2 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/[0.08]" />
          <span className="flex-shrink mx-3 text-zinc-500 text-xs">
            or
          </span>
          <div className="flex-grow border-t border-white/[0.08]" />
        </div>

        {/* Google Continue */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isLoading || isGoogleLoading}
          className="w-full h-12 rounded-2xl bg-zinc-900/40 hover:bg-zinc-850 border-white/[0.08] hover:border-white/20 text-zinc-200 text-sm font-medium flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer shadow-none"
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span className="text-zinc-300 text-sm">Connecting...</span>
            </>
          ) : (
            <>
              <FcGoogle className="w-4 h-4 flex-shrink-0" />
              <span>Continue with Google</span>
            </>
          )}
        </Button>

        {/* Switch Link */}
        <p className="text-xs text-zinc-400 text-center pt-2">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>

      {/* Footer Legal Links */}
      <footer className="w-full max-w-[380px] pt-6 pb-2 text-center relative z-10">
        <div className="text-[11px] text-zinc-500 leading-relaxed">
          By continuing, you agree to our{" "}
          <button
            type="button"
            onClick={() => setLegalType('terms')}
            className="text-zinc-400 hover:text-zinc-200 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            type="button"
            onClick={() => setLegalType('privacy')}
            className="text-zinc-400 hover:text-zinc-200 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
        </div>
      </footer>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotModal} onOpenChange={setShowForgotModal}>
        <DialogContent className="w-[92vw] sm:max-w-md p-0 rounded-3xl border border-white/[0.1] bg-zinc-950/95 backdrop-blur-2xl overflow-hidden text-zinc-100 shadow-2xl">
          <div className="p-6 space-y-4">
            <DialogHeader className="space-y-1.5 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <DialogTitle className="text-base font-semibold text-white">
                  Reset Password
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-zinc-400">
                Enter your email address and we will send you a password reset link.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSendResetEmail} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label htmlFor="reset-email" className="block text-xs font-medium text-zinc-300">
                  Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="name@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    disabled={isResetting}
                    className="pl-10 h-11 rounded-xl bg-zinc-900 border-white/[0.08] focus:border-amber-400 text-zinc-100 placeholder:text-zinc-600 text-sm shadow-none"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 h-10 rounded-xl border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] cursor-pointer"
                  onClick={() => setShowForgotModal(false)}
                  disabled={isResetting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="flex-1 h-10 rounded-xl text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-black cursor-pointer"
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
