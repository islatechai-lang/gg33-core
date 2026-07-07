import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Home from "@/pages/home";
import Compatibility from "@/pages/compatibility";
import Cues from "@/pages/cues";
import Explore from "@/pages/explore";
import CueChats from "@/pages/cuechats";
import Learn from "@/pages/learn";
import NumberDetailPage from "@/pages/number-detail";
import Course from "@/pages/course";
import Lesson from "@/pages/lesson";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import { Loader2 } from "lucide-react";

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />

      {/* Protected Routes */}
      <Route path="/">
        {!user ? <Redirect to="/login" /> : <Home />}
      </Route>
      <Route path="/compatibility">
        {!user ? <Redirect to="/login" /> : <Compatibility />}
      </Route>
      <Route path="/cues">
        {!user ? <Redirect to="/login" /> : <Cues />}
      </Route>
      <Route path="/explore">
        {!user ? <Redirect to="/login" /> : <Explore />}
      </Route>
      <Route path="/cuechats">
        {!user ? <Redirect to="/login" /> : <CueChats />}
      </Route>
      <Route path="/learn">
        {!user ? <Redirect to="/login" /> : <Learn />}
      </Route>
      <Route path="/course/:courseId">
        {() => !user ? <Redirect to="/login" /> : <Course />}
      </Route>
      <Route path="/learn/:courseId/:lessonId">
        {() => !user ? <Redirect to="/login" /> : <Lesson />}
      </Route>
      <Route path="/number/:type/:number">
        {() => !user ? <Redirect to="/login" /> : <NumberDetailPage />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="dark min-h-screen bg-background">
            <Router />
          </div>
          <Toaster />
          <Sonner position="top-right" theme="dark" />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
