import MorePage from "@/pages/more";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function More() {
  return (
    <ProtectedRoute>
      <MorePage />
    </ProtectedRoute>
  );
}
