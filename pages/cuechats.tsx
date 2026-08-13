import CueChats from "@/pages/cuechats";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function CueChatsPage() {
  return (
    <ProtectedRoute>
      <CueChats />
    </ProtectedRoute>
  );
}
