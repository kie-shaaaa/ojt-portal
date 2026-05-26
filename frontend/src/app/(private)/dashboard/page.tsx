"use client";

import { JSX, useEffect } from "react";
import { toast } from "sonner";

import { ApplicationsHeaderSection } from "@/components/layout/private/Dashboard/ApplicationsHeaderSection";
import { ApplicationChartsSection } from "@/components/layout/private/Dashboard/ApplicationCharts";
import { ApplicationDetailsSection } from "@/components/layout/private/Dashboard/ApplicationDetailsSection";
import { ApplicationStatsSection } from "@/components/layout/private/Dashboard/ApplicationStatsSection";

export default function DashboardPage(): JSX.Element {
  useEffect(() => {
    const successMessage = sessionStorage.getItem("login_success_toast");

    if (!successMessage) return;

    sessionStorage.removeItem("login_success_toast");
    toast.success(successMessage);
  }, []);

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