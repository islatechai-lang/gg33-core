import Learn from "@/pages/learn";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function LearnPage() {
  return (
    <ProtectedRoute>
      <Learn />
    </ProtectedRoute>
  );
}
