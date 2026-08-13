import Cues from "@/pages/cues";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function CuesPage() {
  return (
    <ProtectedRoute>
      <Cues />
    </ProtectedRoute>
  );
}
