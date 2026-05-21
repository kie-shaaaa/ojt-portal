"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { AsideSidebar } from "../../components/layout/Sidebar";
import { Loader2 } from "lucide-react";
import { fetchToken } from "@/lib/token";

interface StoredUser {
  id: number;
  email: string;
  account_type: string;
}

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  
    useEffect(() => {
      const data = fetchToken();
      if (!data?.user) return;
  
      try {
        // fetchToken returns user as a raw JSON string — parse it
        const parsed: StoredUser =
          typeof data.user === "string" ? JSON.parse(data.user) : data.user;
        requestAnimationFrame(() => setCurrentUser(parsed));
      } catch {
        // Ignore malformed data
      }
    }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#002068]" />
        <p className="text-sm font-medium text-[#444653] animate-pulse">
          Authenticating...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <AsideSidebar account_type={currentUser?.account_type} email={currentUser?.email}/>
      <main className="ml-64">{children}</main>
    </div>
  );
}
