import NumberDetailPage from "@/pages/number-detail";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function NumberDetailRoute() {
  return (
    <ProtectedRoute>
      <NumberDetailPage />
    </ProtectedRoute>
  );
}
