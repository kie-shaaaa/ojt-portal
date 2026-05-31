"use client";

import { LandingPage } from "../../components/layout/landing/LandingPage";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export const NtcOjtApplication = (): ReactNode => {
  const router = useRouter();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
      return;
    }

    setIsCheckingAccess(false);
  }, [isAuthenticated, isLoading, router]);

  if (isCheckingAccess) {
    return null;
  }

  return <LandingPage />;
};

export default NtcOjtApplication;
