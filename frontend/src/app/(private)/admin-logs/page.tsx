"use client";

import { AdminLogsHeaderSection } from "@/components/layout/private/Admin Logs/AdminLogsHeader";
import {
  AdminLogsFilteringSection,
  type LogFilters,
} from "@/components/layout/private/Admin Logs/AdminLogsFilteringSection";
import { AdminLogsTable } from "@/components/layout/private/Admin Logs/AdminLogsTable";
import { JSX, useState } from "react";

export default function AdminLogsPage(): JSX.Element {
  const [filters, setFilters] = useState<LogFilters>({
    action: "",
    userId: "",
    dateFrom: "",
    dateTo: "",
  });

  return (
    <main
      className="relative flex w-full flex-col items-start gap-6 p-8"
      data-id="main-content"
    >
      <AdminLogsHeaderSection />
      <AdminLogsFilteringSection
        filters={filters}
        onFiltersChange={setFilters}
      />
      <AdminLogsTable filters={filters} />
    </main>
  );
}
