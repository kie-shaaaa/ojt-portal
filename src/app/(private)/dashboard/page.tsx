import { JSX } from "react";

import { ApplicationChartsSection } from "@/components/layout/private/Dashboard/ApplicationCharts";
import { ApplicationDetailsSection } from "@/components/layout/private/Dashboard/ApplicationDetailsSection";
import { ApplicationStatsSection } from "@/components/layout/private/Dashboard/ApplicationStatsSection";

export default function DashboardPage(): JSX.Element {
  return (
    <main
      className="flex flex-col items-start p-6 relative w-full"
      aria-label="Dashboard analytics main content"
    >
      <section
        className="flex flex-col items-start pt-0 pb-6 px-0 relative self-stretch w-full flex-[0_0_auto]"
        aria-labelledby="dashboard-analytics-heading"
      >
        <div className="flex flex-col items-start p-5 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-xl border border-solid border-slate-200 shadow-[0px_1px_2px_#0000000d]">
          <header className="relative self-stretch w-full flex-[0_0_auto] flex flex-col items-start">
            <h1
              id="dashboard-analytics-heading"
              className="relative flex items-center self-stretch mt-[-1.00px] font-bold text-slate-700 text-xl tracking-[0] leading-7"
            >
              Dashboard Analytics
            </h1>
          </header>
        </div>
      </section>

      <ApplicationStatsSection />
      <ApplicationChartsSection />
      <ApplicationDetailsSection />
    </main>
  );
}