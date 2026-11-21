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
  EyeOff, 
  ArrowLeft, 
  Sparkles,
  ArrowRight
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
      // Check if user is in an in-app WebView (Median.co, iOS/Android WebView) or mobile
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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-x-hidden px-4 py-8 sm:py-12 selection:bg-amber-400 selection:text-black">
      {/* Background Starfield */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <StarField />
      </div>

      {/* Atmospheric Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] bg-gradient-to-tr from-amber-500/15 via-amber-400/8 to-transparent rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-gradient-to-br from-amber-600/10 to-transparent rounded-full blur-[90px] pointer-events-none z-0" />

      {/* Top Floating Bar */}
      <header className="fixed top-0 inset-x-0 z-30 p-4 sm:p-6 flex items-center justify-between pointer-events-auto max-w-5xl mx-auto w-full">
        <Link href="/">
          <button
            type="button"
            className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-zinc-900/70 hover:bg-zinc-800/80 border border-white/[0.08] hover:border-amber-400/30 text-zinc-400 hover:text-white backdrop-blur-xl transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-zinc-400 group-hover:text-amber-400" />
            <span className="text-xs font-medium">Home</span>
          </button>
        </Link>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/60 border border-white/[0.06] backdrop-blur-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-zinc-300 tracking-wider uppercase">GG33 Portal</span>
        </div>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-[430px] relative z-10 my-auto pt-14 pb-6">
        {/* Segmented Auth Switcher */}
        <div className="mb-4 p-1 rounded-2xl bg-zinc-900/70 border border-white/[0.08] backdrop-blur-xl flex items-center shadow-inner">
          <div className="flex-1 py-2 text-center rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 font-semibold text-xs tracking-wide shadow-sm">
            Sign In
          </div>
          <Link href="/signup" className="flex-1">
            <button
              type="button"
              className="w-full py-2 text-center rounded-xl text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
            >
              Create Account
            </button>
          </Link>
        </div>

        {/* Glass Card */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-zinc-950/75 border border-white/[0.1] backdrop-blur-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.06)] overflow-hidden">
          {/* Top Sheen */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />

          {/* Header Brand */}
          <div className="flex flex-col items-center text-center space-y-3 pb-6">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/25 via-amber-400/10 to-transparent border border-amber-400/35 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]">
                <Sparkles className="w-7 h-7 text-amber-400 animate-pulse" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-amber-400/15 blur-lg pointer-events-none -z-10" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight text-white">
                Welcome Back
              </h1>
              <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                Sign in to access your cosmic numerology blueprint and personal astrological profiles.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  className="pl-10 h-12 rounded-2xl bg-zinc-900/70 border-white/[0.08] hover:border-white/15 focus:border-amber-400/60 focus:bg-zinc-900/90 text-zinc-100 placeholder:text-zinc-600 text-sm shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                  Password
                </label>
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
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  className="pl-10 pr-11 h-12 rounded-2xl bg-zinc-900/70 border-white/[0.08] hover:border-white/15 focus:border-amber-400/60 focus:bg-zinc-900/90 text-zinc-100 placeholder:text-zinc-600 text-sm shadow-sm transition-all"
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

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 font-black text-sm tracking-wide shadow-[0_4px_25px_rgba(245,158,11,0.3)] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-white/[0.08]" />
            <span className="flex-shrink mx-3 text-zinc-500 text-[11px] font-semibold uppercase tracking-wider">
              Or continue with
            </span>
            <div className="flex-grow border-t border-white/[0.08]" />
          </div>

          {/* Google Sign-in */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            className="w-full h-12 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800/80 border-white/[0.08] hover:border-white/20 text-zinc-100 text-sm font-semibold flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span className="text-amber-300 text-sm font-medium">Connecting...</span>
              </>
            ) : (
              <>
                <FcGoogle className="w-5 h-5 flex-shrink-0" />
                <span>Continue with Google</span>
              </>
            )}
          </Button>

          {/* Bottom Card Footer */}
          <div className="mt-6 pt-5 border-t border-white/[0.06] text-center space-y-3">
            <p className="text-xs text-zinc-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 transition-colors">
                Sign up
              </Link>
            </p>

            <div className="text-[11px] text-zinc-500 leading-relaxed">
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
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotModal} onOpenChange={setShowForgotModal}>
        <DialogContent className="w-[94vw] sm:max-w-md p-0 rounded-3xl border border-white/[0.1] bg-zinc-950/95 backdrop-blur-2xl overflow-hidden text-zinc-100 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)]">
          <div className="p-6 sm:p-7 space-y-4">
            <DialogHeader className="space-y-2 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-sm">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold text-white">
                    Reset Your Password
                  </DialogTitle>
                  <DialogDescription className="text-xs text-zinc-400">
                    We&apos;ll send a secure password reset link to your email.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSendResetEmail} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label htmlFor="reset-email" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                  Email Address
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
                    className="pl-10 h-11 rounded-2xl bg-zinc-900/70 border-white/[0.08] focus:border-amber-400/60 text-zinc-100 placeholder:text-zinc-600 text-xs shadow-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 h-10 rounded-xl border-white/[0.08] text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.06] cursor-pointer"
                  onClick={() => setShowForgotModal(false)}
                  disabled={isResetting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="flex-1 h-10 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 shadow-md cursor-pointer"
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
