"use client";

import { LandingPage } from "../../components/layout/landing/LandingPage";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const NtcOjtApplication = (): ReactNode => {
  const router = useRouter();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    const accessToken =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");

    if (accessToken) {
      router.replace("/dashboard");
      return;
    }

    setIsCheckingAccess(false);
  }, [router]);

  if (isCheckingAccess) {
    return null;
  }

  return <LandingPage />;
};

export default NtcOjtApplication;
