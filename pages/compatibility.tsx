import Compatibility from "@/pages/compatibility";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function CompatibilityPage() {
  return (
    <ProtectedRoute>
      <Compatibility />
    </ProtectedRoute>
  );
}
