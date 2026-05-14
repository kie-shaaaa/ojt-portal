"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound, Menu, X } from "lucide-react";
import { JSX, useState } from "react";

const navLinks = [
  { label: "FAQs", targetId: "faqs" },
  { label: "Contact", targetId: "contact" },
];

export const NavBar = (): JSX.Element => {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isLoginPage = pathname === "/login";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (targetId: string) => {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 relative flex w-full items-center justify-between px-4 md:px-8 lg:px-12 py-3 md:py-4 bg-[#0b49d4] shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      {/* Logo and Brand */}
      <div className="inline-flex items-center gap-2 md:gap-4 relative flex-[0_0_auto]">
        <div className="w-10 md:w-14 h-10 md:h-14 relative rounded-full overflow-hidden flex-shrink-0">
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
              <div className="flex items-center mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-base md:text-lg lg:text-xl tracking-[0] leading-6 md:leading-7 relative w-fit">
                NTC OJT APPLICATION
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-200 text-xs md:text-sm tracking-[0] leading-5 relative w-fit">
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
              <div className="flex items-center mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-base md:text-lg lg:text-xl tracking-[0] leading-6 md:leading-7 relative w-fit">
                NTC OJT APPLICATION
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-200 text-xs md:text-sm tracking-[0] leading-5 relative w-fit">
                HR Department
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Desktop Navigation */}
      {!isLoginPage ? (
        <>
          {/* Desktop Menu */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:inline-flex items-center gap-6 relative flex-[0_0_auto]"
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

            <Link
              href="/login"
              className="all-[unset] box-border inline-flex gap-3 px-5 py-2.5 rounded-full border border-white/90 bg-transparent text-white items-center relative flex-[0_0_auto] cursor-pointer hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
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

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 text-white hover:bg-white/10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </>
      ) : null}

      {/* Mobile Menu */}
      {!isLoginPage && isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 -mt-px md:hidden bg-[#0b49d4] shadow-[0_10px_30px_rgba(0,0,0,0.18)] border-t border-white/10 z-40">
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col items-stretch divide-y divide-white/10"
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => scrollToSection(link.targetId)}
                className="text-left px-4 py-3 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 [font-family:'Inter-Medium',Helvetica] font-medium text-sm"
              >
                {link.label}
              </button>
            ))}
            <Link
              href="/login"
              className="mx-3 mb-3 mt-3 inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white px-4 py-3 text-[#0b49d4] shadow-[0_10px_20px_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-sm"
            >
              <UserRound className="w-4 h-4" />
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
