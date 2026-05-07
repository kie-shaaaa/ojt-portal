import React from "react";
import { AsideSidebar } from "../../components/Sidebar";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen flex bg-white">
			<AsideSidebar />
			<main className="flex-1">{children}</main>
		</div>
	);
}
