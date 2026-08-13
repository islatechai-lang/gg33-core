import Course from "@/pages/course";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function CoursePage() {
  return (
    <ProtectedRoute>
      <Course />
    </ProtectedRoute>
  );
}
