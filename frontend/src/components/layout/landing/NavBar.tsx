"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound } from "lucide-react";
import { JSX } from "react";

const navLinks = [
  { label: "FAQs", targetId: "faqs" },
  { label: "Contact", targetId: "contact" },
];

export const NavBar = (): JSX.Element => {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (targetId: string) => {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <header className="sticky top-0 z-50 flex w-full min-h-[96px] items-center justify-between px-12 py-4 bg-[#0b49d4] shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="inline-flex items-center gap-4 relative flex-[0_0_auto]">
        <div className="w-14 h-14 relative rounded-full overflow-hidden">
          <Image
            src="/ntc-logo.png"
            alt="NTC OJT Application logo"
            fill
            className="object-cover object-center"
            sizes="56px"
          />
        </div>
        {isLandingPage ? (
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex flex-col items-start relative flex-[0_0_auto] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-sm text-left"
          >
            <div className="flex items-start self-stretch w-full flex-col relative flex-[0_0_auto]">
              <div className="flex items-center mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-xl tracking-[0] leading-7 whitespace-nowrap relative w-fit">
                NTC OJT APPLICATION
              </div>
            </div>
            <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-200 text-sm tracking-[0] leading-5 whitespace-nowrap relative w-fit">
                HR Department
              </div>
            </div>
          </button>
        ) : (
          <Link
            href="/"
            className="inline-flex flex-col items-start relative flex-[0_0_auto] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-sm text-left"
          >
            <div className="flex items-start self-stretch w-full flex-col relative flex-[0_0_auto]">
              <div className="flex items-center mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-xl tracking-[0] leading-7 whitespace-nowrap relative w-fit">
                NTC OJT APPLICATION
              </div>
            </div>
            <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-200 text-sm tracking-[0] leading-5 whitespace-nowrap relative w-fit">
                HR Department
              </div>
            </div>
          </Link>
        )}
      </div>
      <nav
        aria-label="Primary navigation"
        className="inline-flex items-center gap-6 relative flex-[0_0_auto]"
      >
        {navLinks.map((link) => (
          <button
            key={link.label}
            type="button"
            onClick={() => scrollToSection(link.targetId)}
            className="inline-flex flex-col items-start relative flex-[0_0_auto] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-sm"
          >
            <div className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
              {link.label}
            </div>
          </button>
        ))}

        <Link href="/login" className="all-[unset] box-border inline-flex gap-3 px-5 py-2.5 rounded-full border border-white/90 bg-transparent text-white items-center relative flex-[0_0_auto] cursor-pointer hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
          <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
            <UserRound
              className="relative w-5 h-5 text-white"
              aria-hidden="true"
            />
          </div>
          <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
            <div className="flex items-center justify-center mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-white text-sm text-center tracking-[0] leading-5 whitespace-nowrap relative w-fit">
              Login
            </div>
          </div>
        </Link>
      </nav>
    </header>
  );
};
