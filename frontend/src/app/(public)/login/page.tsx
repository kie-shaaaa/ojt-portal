"use client";

import { LoginFormSection } from "../../../components/layout/login/LoginFormSection";
import { LoginScrollLock } from "../../../components/layout/login/LoginScrollLock";
import { NavBar } from "../../../components/layout/NavBar";
import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const LoginPage = (): JSX.Element => {
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

  return (
    <main className="bg-white w-full min-h-screen flex flex-col overflow-hidden">
      <LoginScrollLock />
      <NavBar />
      <LoginFormSection />
    </main>
  );
};

export default LoginPage;
