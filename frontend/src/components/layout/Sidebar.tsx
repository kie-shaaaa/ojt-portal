"use client";

import {
  Calendar,
  House,
  FileText,
  GraduationCap,
  Users,
  UserRoundCheck,
  LogOut,
  ScrollText,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { JSX } from "react/jsx-dev-runtime";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

const navigationItems = [
  { label: "Dashboard", icon: House, href: "/dashboard" },
  { label: "Applications", icon: FileText, href: "/applications" },
  { label: "Calendar", icon: Calendar, href: "/calendar" },
  { label: "OJT Data", icon: GraduationCap, href: "/ojt-data" },
  { label: "Accounts", icon: Users, href: "/accounts" },
  { label: "Logs", icon: ScrollText, href: "/admin-logs" },
];

interface SidebarProps {
  email?: string;
  account_type?: string;
}

export const AsideSidebar = ({
  email,
  account_type,
}: SidebarProps): JSX.Element => {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      <aside
        className="fixed top-0 left-0 hidden md:flex flex-col w-64 min-h-screen items-start bg-[#0038a8] z-10"
        aria-label="Sidebar navigation"
      >
        <div className="absolute inset-0 w-64 md:w-64 bg-[#ffffff01] shadow-[0px_8px_10px_-6px_#0000001a,0px_20px_25px_-5px_#0000001a] pointer-events-none" />

        {/* Top brand */}
        <div className="flex items-center p-4 md:p-6 w-full border-b border-[#1e40af80]">
          <div className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden">
            <Image
              src="/ntc-logo.png"
              alt="NTC logo"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div className="hidden md:flex flex-col pl-3">
            <div className="font-bold text-xl text-white">NTC Admin</div>
          </div>
        </div>

        {/* User block */}
        <div className="flex flex-col items-center justify-center p-4 md:p-8 w-full">
          <div className="w-22 h-22 flex items-center justify-center rounded-full bg-white">
            <UserRoundCheck className="w-12 h-12 text-[#0033A0]" />
          </div>
          {/* Show email as display name since there's no username field */}
          <div className="mt-2 text-white text-s font-semibold hidden md:block">
            {email ?? "—"}
          </div>
          <div className="mt-1 hidden md:block">
            <div className="px-2 py-0.5 bg-white/20 rounded opacity-80 text-[10px] text-white capitalize">
              {account_type ?? "—"}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-2 md:px-4 py-2 flex-1 w-full overflow-auto">
          {navigationItems.map((item) => {
            const isActive = item.href
              ? pathname?.startsWith(item.href)
              : false;
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href ?? "#"}
                aria-current={isActive ? "page" : undefined}
                className={`${isActive ? "bg-white/12" : "opacity-90 hover:bg-white/6"} flex items-center justify-start md:justify-between gap-3 px-3 py-3 rounded-lg w-full`}
              >
                <div className="flex items-center">
                  <Icon className="w-5 h-5 text-white" />
                  <span className="ml-3 text-white text-sm font-semibold hidden md:inline">
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 w-full">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="group flex items-center gap-3 w-full bg-white/12 rounded-lg px-3 py-3"
          >
            <LogOut className="w-5 h-5 text-white rotate-180 group-hover:text-[#e74c3c] transition-colors" />
            <span className="text-white font-semibold hidden md:inline group-hover:text-[#e74c3c] transition-colors">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile / Tablet bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0038a8] z-40 border-t border-[#1e40af80]">
        <div className="flex items-center justify-between gap-1.5 px-2 pt-1 pb-[calc(env(safe-area-inset-bottom)+0.25rem)]">
          {navigationItems.map((item) => {
            const isActive = item.href
              ? pathname?.startsWith(item.href)
              : false;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href ?? "#"}
                aria-current={isActive ? "page" : undefined}
                className="flex flex-1 flex-col items-center justify-center py-2 text-xs text-white"
              >
                <Icon
                  className={`w-6 h-6 ${isActive ? "text-white" : "text-white/80"}`}
                />
                <span
                  className={`mt-1 text-[10px] leading-tight text-center ${isActive ? "text-white" : "text-white/80"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex flex-1 flex-col items-center justify-center py-2 text-xs text-white"
          >
            <LogOut className="w-6 h-6 text-white" />
            <span className="mt-1">Logout</span>
          </button>
        </div>
      </nav>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="w-full max-w-sm max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
            <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
              Confirm Logout
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to logout?
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  void handleLogout();
                }}
                className="rounded-lg bg-[#e74c3c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#cf3f31] transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
