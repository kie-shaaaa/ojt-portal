"use client";

import { LoginFormSection } from "../../../components/layout/login/LoginFormSection";
import { LoginScrollLock } from "../../../components/layout/login/LoginScrollLock";
import { NavBar } from "../../../components/layout/NavBar";
import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export const LoginPage = (): JSX.Element | null => {
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

  return (
    <main className="bg-white w-full min-h-screen flex flex-col overflow-hidden">
      <LoginScrollLock />
      <NavBar />
      <LoginFormSection />
    </main>
  );
};

export default LoginPage;
