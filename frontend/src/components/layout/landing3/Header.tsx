import React from "react";
import Image from "next/image";
import { User } from "lucide-react";
export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full overflow-hidden relative">
            <Image
              src="/ntc-logo.png"
              alt="NTC logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg leading-tight">
              NTC OJT Portal
            </span>
            <span className="text-cyan-400 text-xs font-medium">
              HR Department
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-white hover:text-cyan-400 transition-colors text-sm font-medium"
          >
            Home
          </a>
          <a
            href="#"
            className="text-white hover:text-cyan-400 transition-colors text-sm font-medium"
          >
            Start Here
          </a>
          <a
            href="#"
            className="text-white hover:text-cyan-400 transition-colors text-sm font-medium"
          >
            Requirements
          </a>
          <a
            href="#"
            className="text-white hover:text-cyan-400 transition-colors text-sm font-medium"
          >
            FAQs
          </a>
          <a
            href="#"
            className="text-white hover:text-cyan-400 transition-colors text-sm font-medium"
          >
            Submit Application
          </a>
        </nav>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors text-sm font-medium">
          <User className="w-4 h-4" />
          Login
        </button>
      </div>
    </header>
  );
}
