"use client";

import {
    Calendar,
    House,
    FileText,
    GraduationCap,
    Users,
    UserStar,
    LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { JSX } from "react/jsx-dev-runtime";

    const navigationItems = [
      { label: "Dashboard", icon: House, href: "/dashboard" },
      { label: "Applications", icon: FileText, href: "/applications", badge: "1" },
      { label: "Calendar", icon: Calendar, href: "/calendar" },
      { label: "OJT Data", icon: GraduationCap, href: "/ojt-data" },
      { label: "Accounts", icon: Users, href: "/accounts" },
    ];

    export const AsideSidebar = (): JSX.Element => {
      const pathname = usePathname();
      const router = useRouter();

      return (
        <aside
          className="flex flex-col w-20 md:w-64 min-h-screen items-start bg-[#0038a8]"
          aria-label="Sidebar navigation"
        >
          <div className="absolute inset-0 w-64 md:w-64 bg-[#ffffff01] shadow-[0px_8px_10px_-6px_#0000001a,0px_20px_25px_-5px_#0000001a] pointer-events-none" />

          {/* Top brand */}
          <div className="flex items-center p-4 md:p-6 w-full border-b border-[#1e40af80]">
            <div className="flex items-center justify-center w-10 h-10 p-1 bg-white rounded-full">
              <div className="w-8 h-8 bg-(assets/ntc-logo.png)] bg-cover bg-center" />
            </div>
            <div className="hidden md:flex flex-col pl-3">
              <div className="font-bold text-xl text-white">NTC Admin</div>
            </div>
          </div>

          {/* User block */}
          <div className="flex flex-col items-center justify-center p-4 md:p-8 w-full">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/20">
              <UserStar className="w-8 h-8 text-white" />
            </div>
            <div className="mt-2 text-white text-sm font-semibold hidden md:block">admin</div>
            <div className="mt-1 hidden md:block">
              <div className="px-2 py-0.5 bg-white/20 rounded opacity-80 text-[10px]">admin</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 px-2 md:px-4 py-2 flex-1 w-full overflow-auto">
            {navigationItems.map((item) => {
              const isActive = item.href ? pathname?.startsWith(item.href) : false;
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
                    <span className="ml-3 text-white text-sm font-medium hidden md:inline">{item.label}</span>
                  </div>

                  {item.badge ? (
                    <div className="ml-auto hidden md:flex items-center justify-center bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </div>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 w-full">
            <button
              type="button"
              onClick={() => router.push("/logout-placeholder")}
              className="flex items-center gap-3 w-full bg-white/12 rounded-lg px-3 py-3"
            >
              <LogOut className="w-5 h-5 text-white rotate-180" />
              <span className="text-white font-semibold hidden md:inline">Logout</span>
            </button>
          </div>
        </aside>
      );
    };