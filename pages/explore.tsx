import Explore from "@/pages/explore";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function ExplorePage() {
  return (
    <ProtectedRoute>
      <Explore />
    </ProtectedRoute>
  );
}
