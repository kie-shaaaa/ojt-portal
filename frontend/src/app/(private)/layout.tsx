import React from "react";
import { AsideSidebar } from "../../components/layout/Sidebar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <AsideSidebar />
      <main className="ml-64">{children}</main>
    </div>
  );
}
