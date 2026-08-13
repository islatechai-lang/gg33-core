import Lesson from "@/pages/lesson";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function LessonPage() {
  return (
    <ProtectedRoute>
      <Lesson />
    </ProtectedRoute>
  );
}
