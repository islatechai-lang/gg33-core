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
  ArrowLeft, 
  Sparkles,
  ArrowRight,
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
          <Link href="/login" className="flex-1">
            <button
              type="button"
              className="w-full py-2 text-center rounded-xl text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </Link>
          <div className="flex-1 py-2 text-center rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 font-semibold text-xs tracking-wide shadow-sm">
            Create Account
          </div>
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
                Create Account
              </h1>
              <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                Join the GG33 Core community and unlock your complete numerological blueprint and readings.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSignup} className="space-y-3.5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                Email Address
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
                <span className="text-[10px] text-zinc-500 font-medium">Min 6 characters</span>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
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

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="confirmPassword" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                  Confirm Password
                </label>
                {passwordsMatch && (
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Passwords match
                  </span>
                )}
                {passwordsMismatch && (
                  <span className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Must match
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <ShieldCheck className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  className="pl-10 pr-11 h-12 rounded-2xl bg-zinc-900/70 border-white/[0.08] hover:border-white/15 focus:border-amber-400/60 focus:bg-zinc-900/90 text-zinc-100 placeholder:text-zinc-600 text-sm shadow-sm transition-all"
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

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 font-black text-sm tracking-wide shadow-[0_4px_25px_rgba(245,158,11,0.3)] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 mt-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
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

          {/* Google Sign-up */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignup}
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
              Already have an account?{" "}
              <Link href="/login" className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 transition-colors">
                Log in
              </Link>
            </p>

            <div className="text-[11px] text-zinc-500 leading-relaxed">
              By signing up, you agree to our{" "}
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
