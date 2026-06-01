"use client";

import { useEffect, ReactNode, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import { ApplicationsHeaderSection } from "@/components/layout/private/Dashboard/ApplicationsHeaderSection";
import { ApplicationChartsSection } from "@/components/layout/private/Dashboard/ApplicationCharts";
import { ApplicationDetailsSection } from "@/components/layout/private/Dashboard/ApplicationDetailsSection";
import { ApplicationStatsSection } from "@/components/layout/private/Dashboard/ApplicationStatsSection";

export default function DashboardPage(): ReactNode {
  const router = useRouter();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    setIsCheckingAccess(false);

    const successMessage = sessionStorage.getItem("login_success_toast");
    if (successMessage) {
      sessionStorage.removeItem("login_success_toast");
      toast.success(successMessage);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isCheckingAccess) {
    return null;
  }

  return (
    <main
      className="relative flex w-full flex-col items-start gap-6 p-4 sm:p-6 lg:p-8"
      data-id="main-content"
    >
      <ApplicationsHeaderSection />
      <div className=" grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[1fr_1.25fr]">
        <ApplicationStatsSection />
        <ApplicationDetailsSection />
      </div>
      <ApplicationChartsSection />
    </main>
  );
}
