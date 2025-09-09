import { Suspense } from "react";
import PrintableMISReport from "./PrintableMISReport";

export default function AnalyticsPrintPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading MIS Report...</div>}>
      <PrintableMISReport />
    </Suspense>
  );
}
