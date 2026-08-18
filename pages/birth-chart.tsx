import BirthChartPage from "@/pages/birth-chart";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function BirthChartNextPage() {
  return (
    <ProtectedRoute>
      <BirthChartPage />
    </ProtectedRoute>
  );
}
