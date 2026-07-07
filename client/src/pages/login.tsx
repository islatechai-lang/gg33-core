import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { StarField } from "../components/StarField";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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
      await signInWithPopup(auth, googleProvider);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in with Google.",
      });
      setLocation("/");
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Google Login Failed",
        description: err?.message || "An error occurred during Google sign-in.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-4">
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
              <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
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
                <Label htmlFor="password" className="text-zinc-300">Password</Label>
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
            className="w-full border-zinc-800 hover:bg-zinc-900/50 text-zinc-200 bg-transparent flex items-center justify-center gap-3 transition-colors duration-300"
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            ) : (
              <FcGoogle className="h-5 w-5" />
            )}
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-zinc-900/50 py-4">
          <p className="text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
