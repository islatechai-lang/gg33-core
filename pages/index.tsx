import Home from "@/pages/home";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  );
}
