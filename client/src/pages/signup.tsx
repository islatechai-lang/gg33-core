import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { auth, googleProvider } from "../lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult 
} from "firebase/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { FcGoogle } from "react-icons/fc";
import { 
  Loader2, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  Check,
  AlertCircle
} from "lucide-react";
import { StarField } from "../components/StarField";
import { LegalModal } from "../components/LegalModal";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [legalType, setLegalType] = useState<'terms' | 'privacy' | null>(null);

  // Check redirect result for mobile / in-app WebView auth (Median.co, iOS, Android)
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          toast({
            title: "Welcome to GG33 Core!",
            description: "Successfully signed up with Google.",
          });
          setLocation("/");
        }
      })
      .catch((err) => {
        console.error("[Auth Redirect Error]:", err);
      });
  }, [setLocation, toast]);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "Passwords do not match.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Password should be at least 6 characters.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      toast({
        title: "Account Created!",
        description: "Successfully signed up. Let's set up your profile.",
      });
      setLocation("/");
    } catch (err: any) {
      console.error(err);
      let message = "Failed to sign up. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        message = "This email is already in use.";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email format.";
      } else if (err.code === "auth/weak-password") {
        message = "The password is too weak.";
      }
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
      const isMobileWebView = /wv|Android|iPhone|iPad|iPod|Median|GoNative/i.test(userAgent);

      if (isMobileWebView) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
        toast({
          title: "Welcome to GG33 Core!",
          description: "Successfully signed up with Google.",
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
        description: err?.message || "An error occurred during Google sign-in. You can also sign up with email.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-10 relative overflow-hidden selection:bg-amber-400 selection:text-black">
      {/* Background Starfield */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <StarField />
      </div>

      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-amber-500/[0.07] rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Main Card */}
      <div className="w-full max-w-[400px] relative z-10">
        <div className="rounded-3xl p-7 sm:p-8 bg-zinc-950/80 border border-white/[0.08] backdrop-blur-xl shadow-2xl">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center space-y-3 pb-6">
            <Link href="/" className="inline-block">
              <div className="w-13 h-13 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-lg flex items-center justify-center bg-zinc-900 active:scale-95 transition-transform cursor-pointer">
                <img
                  src="/images/logo.png?v=1"
                  alt="GG33 Core"
                  className="w-13 h-13 object-cover"
                />
              </div>
            </Link>

            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Create an account
              </h1>
              <p className="text-xs text-zinc-400">
                Enter your details below to get started with GG33 Core
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSignup} className="space-y-3.5">
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
                  className="pl-10 h-11 rounded-xl bg-white/[0.03] border-white/[0.08] hover:border-white/15 focus:border-amber-400 focus:bg-zinc-900/90 text-zinc-100 placeholder:text-zinc-600 text-sm shadow-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-medium text-zinc-300">
                  Password
                </label>
                <span className="text-[10px] text-zinc-500">Min 6 characters</span>
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
                  className="pl-10 pr-10 h-11 rounded-xl bg-white/[0.03] border-white/[0.08] hover:border-white/15 focus:border-amber-400 focus:bg-zinc-900/90 text-zinc-100 placeholder:text-zinc-600 text-sm shadow-none transition-colors"
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

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-zinc-300">
                  Confirm Password
                </label>
                {passwordsMatch && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Passwords match
                  </span>
                )}
                {passwordsMismatch && (
                  <span className="text-[10px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Must match
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <ShieldCheck className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  className="pl-10 pr-10 h-11 rounded-xl bg-white/[0.03] border-white/[0.08] hover:border-white/15 focus:border-amber-400 focus:bg-zinc-900/90 text-zinc-100 placeholder:text-zinc-600 text-sm shadow-none transition-colors"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 p-1 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? (
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
              className="w-full h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-sm transition-all duration-150 active:scale-[0.99] cursor-pointer mt-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-white/[0.08]" />
            <span className="flex-shrink mx-3 text-zinc-500 text-xs">
              or
            </span>
            <div className="flex-grow border-t border-white/[0.08]" />
          </div>

          {/* Google Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignup}
            disabled={isLoading || isGoogleLoading}
            className="w-full h-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] hover:border-white/20 text-zinc-200 text-sm font-medium flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] cursor-pointer shadow-none"
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

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-white/[0.06] text-center space-y-3">
            <p className="text-xs text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>

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
          </div>
        </div>
      </div>

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
