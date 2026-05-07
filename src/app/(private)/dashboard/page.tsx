import { JSX } from "react";

import { ApplicationsHeaderSection } from "@/components/layout/private/Dashboard/ApplicationsHeaderSection";
import { ApplicationChartsSection } from "@/components/layout/private/Dashboard/ApplicationCharts";
import { ApplicationDetailsSection } from "@/components/layout/private/Dashboard/ApplicationDetailsSection";
import { ApplicationStatsSection } from "@/components/layout/private/Dashboard/ApplicationStatsSection";

export default function DashboardPage(): JSX.Element {
  return (
    <main
      className="relative flex w-full flex-col items-start gap-6 p-8"
      data-id="main-content"
    >
      <ApplicationsHeaderSection />
      <ApplicationStatsSection />
      <ApplicationChartsSection />
      <ApplicationDetailsSection />
    </main>
  );
}