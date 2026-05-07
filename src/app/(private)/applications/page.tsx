import { JSX } from "react";

import { ApplicationStatsSection } from "@/components/layout/private/Dashboard/ApplicationStatsSection";
import { ApplicationsHeaderSection } from "@/components/layout/private/Applications/ApplicationsHeaderSection";
import { ApplicationsFilterSection } from "@/components/layout/private/Applications/ApplicationsFilterSection";
import { ApplicationsTableSection } from "@/components/layout/private/Applications/ApplicationsTableSection";

export default function ApplicationPage(): JSX.Element {
  return (
    <main
      className="relative flex w-full flex-col items-start gap-6 p-8"
      data-id="main-content"
    >
      <ApplicationsHeaderSection />
      <ApplicationStatsSection />
      <ApplicationsFilterSection />
      <ApplicationsTableSection />
    </main>
  );
}
