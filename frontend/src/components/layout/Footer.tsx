"use client";

import Image from "next/image";
import { JSX } from "react";
import { Home, HelpCircle, Mail, MapPin, Phone, FileText, BookOpen } from "lucide-react";

const quickLinks = [
  { label: "Home", icon: Home, iconClassName: "w-4 h-4 text-slate-200", href: "#top" },
  { label: "How to Apply", icon: FileText, iconClassName: "w-4 h-4 text-slate-200", href: "#process" },
  { label: "FAQs", icon: HelpCircle, iconClassName: "w-4 h-4 text-slate-200", href: "#faqs" },
  { label: "Contact", icon: Mail, iconClassName: "w-4 h-4 text-slate-200", href: "#contact" },
];

const contactItems = [
  {
    label: "Address:",
    value: (
      <>
        NTC Central Office, BIR Road, Diliman,
        <br />
        Quezon City, Philippines
      </>
    ),
    icon: MapPin,
    iconClassName: "w-5 h-5 text-slate-200",
  },
  {
    label: "Phone:",
    value: "8-924-3775",
    icon: Phone,
    iconClassName: "w-5 h-5 text-slate-200",
  },
  {
    label: "Email:",
    value: "human.resource@ntc.gov.ph",
    icon: Mail,
    iconClassName: "w-5 h-5 text-slate-200",
  },
];

const resourceItems = [
  {
    label: "OJT Requirements",
    icon: BookOpen,
    iconClassName: "w-5 h-5 text-slate-200",
    href: "/NTC-OJT-Requirements.pdf",
    download: true,
  },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Admin Login", href: "/login" },
];

export const Footer = (): JSX.Element => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (targetId: string) => {
    if (targetId === "top") {
      scrollToTop();
      return;
    }

    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <footer className="flex flex-1 relative flex-col w-full items-center gap-6 md:gap-8 pt-8 md:pt-16 pb-6 md:pb-8 px-4 sm:px-6 md:px-8 lg:px-16 bg-[#001d4e] overflow-x-hidden">
      <div className="w-full max-w-7xl grid grid-cols-2 lg:grid-cols-4 h-fit gap-6 md:gap-8 lg:gap-12 pb-8 md:pb-16 border-b border-[#ffffff1a]">
        <section className="relative col-span-2 lg:col-span-1 w-full h-fit flex flex-col items-start gap-4 md:gap-6 pt-0 pb-0 md:pb-8 px-0">
          <div className="flex items-center gap-2 md:gap-3 relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative w-8 md:w-10 h-8 md:h-10 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
              <Image
                src="/ntc-logo.png"
                alt="NTC logo"
                className="object-cover object-center"
                width={40}
                height={40}
                priority
              />
            </div>
            <div className="inline-flex flex-col items-start relative flex-[0_0_auto] min-w-0">
              <div className="flex items-start self-stretch w-full flex-col relative flex-[0_0_auto]">
                <div className="flex items-center mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-semibold text-white text-sm md:text-base tracking-[0] leading-5 md:leading-6 relative">
                  NTC OJT APPLICATION
                </div>
              </div>
              <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-400 text-[10px] md:text-[12px] tracking-[0] leading-3 md:leading-4 relative">
                  HR Department
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            <p className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-400 text-xs md:text-sm tracking-[0] leading-5 md:leading-6">
              Official application portal for internship opportunities or on-the-job training programs at the National Telecommunications Commission of the Philippines.
            </p>
          </div>
        </section>
        <nav
          aria-label="Quick Links"
          className="relative col-span-1 lg:col-span-1 w-full h-fit flex flex-col items-start gap-4 md:gap-6 pt-0 pb-0 md:pb-8 px-0"
        >
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-semibold text-slate-300 text-sm md:text-base tracking-[0] leading-5 md:leading-6">
              Quick Links
            </div>
            <div className="mt-1 md:mt-2 h-px w-8 md:w-10 bg-[#3b82f6] rounded-full" />
          </div>
          <ul className="flex flex-col items-start gap-2 md:gap-3 relative self-stretch w-full flex-[0_0_auto]">
            {quickLinks.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]"
              >
                <div className="inline-flex flex-col items-start relative flex-[0_0_auto] flex-shrink-0">
                  {item.icon && (
                    <item.icon className={`relative w-3 md:w-4 h-3 md:h-4 text-slate-200`} aria-hidden="true" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => scrollToSection(item.href.replace("#", ""))}
                  className="flex items-center mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-200 text-xs md:text-sm tracking-[0] leading-4 md:leading-5 relative w-fit focus:outline-none focus:underline hover:underline"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <address className="not-italic col-span-1 lg:col-span-1 w-full h-fit gap-4 md:gap-6 flex relative flex-col items-start pb-0 md:pb-8">
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-semibold text-white text-sm md:text-base tracking-[0] leading-5 md:leading-6">
              Contact Info
            </div>
            <div className="mt-1 md:mt-2 h-px w-8 md:w-10 bg-[#3b82f6] rounded-full" />
          </div>
          <div className="flex flex-col items-start gap-3 md:gap-4 relative self-stretch w-full flex-[0_0_auto]">
            {contactItems.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-2 md:gap-3 relative self-stretch w-full flex-[0_0_auto]"
              >
                <div className="inline-flex flex-col items-start justify-center pt-0.5 pb-0 px-0 relative flex-[0_0_auto] flex-shrink-0">
                  <div className="inline-flex flex-col items-start relative">
                    {item.icon && (
                      <item.icon className={`relative w-4 md:w-5 h-4 md:h-5 text-slate-200`} aria-hidden="true" />
                    )}
                  </div>
                </div>
                <div className="inline-flex flex-col items-start relative self-stretch flex-1 min-w-0">
                  <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                    <div className="flex items-center mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-slate-200 text-[10px] md:text-xs tracking-[0] leading-3 md:leading-4 relative">
                      {item.label}
                    </div>
                  </div>
                  <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                    <p className="mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-400 text-[10px] md:text-xs tracking-[0] leading-4 md:leading-[15px] relative break-all">
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </address>
        <nav
          aria-label="Resources"
          className="relative col-span-1 lg:col-span-1 w-full h-fit flex flex-col items-start gap-4 md:gap-6 pt-0 pb-0 md:pb-8 px-0"
        >
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-semibold text-white text-sm md:text-base tracking-[0] leading-5 md:leading-6">
              Resources
            </div>
            <div className="mt-1 md:mt-2 h-px w-8 md:w-10 bg-[#3b82f6] rounded-full" />
          </div>
          <ul className="flex flex-col items-start gap-2 md:gap-3 relative self-stretch w-full flex-[0_0_auto]">
            {resourceItems.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]"
              >
                <div className="inline-flex flex-col items-start relative flex-[0_0_auto] flex-shrink-0">
                  {item.icon && (
                    <item.icon className={`relative w-4 md:w-5 h-4 md:h-5 text-slate-200`} aria-hidden="true" />
                  )}
                </div>
                <a
                  href={item.href}
                  download={item.download ? true : undefined}
                  className="flex items-center mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-200 text-xs md:text-sm tracking-[0] leading-4 md:leading-5 relative w-fit focus:outline-none focus:underline hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6 text-center md:text-left">
        <div className="flex flex-col gap-1 md:max-w-2xl">
          <p className="[font-family:'Inter-Regular',Helvetica] font-normal text-slate-300 text-[10px] md:text-[11px] tracking-[0] leading-4 md:leading-[15px]">
            © 2026 National Telecommunications Commission - Philippines. All rights reserved.
          </p>
          <p className="[font-family:'Inter-Italic',Helvetica] font-normal italic text-slate-400 text-[9px] md:text-[10px] tracking-[0] leading-3 md:leading-[15px]">
            This is an official OJT application portal of NTC. Unauthorized access is prohibited.
          </p>
        </div>

        <nav aria-label="Legal" className="flex flex-nowrap items-center justify-center md:justify-end gap-2 md:gap-4 overflow-x-auto pb-1 whitespace-nowrap">
          {legalLinks.map((item, index) => (
            <div key={item.label} className="flex items-center gap-2 md:gap-4">
              <a
                href={item.href}
                className="[font-family:'Inter-Regular',Helvetica] font-normal text-slate-400 text-[9px] md:text-[10px] tracking-[0] leading-3 md:leading-[15px] whitespace-nowrap hover:underline focus:outline-none focus:underline"
              >
                {item.label}
              </a>
              {index < legalLinks.length - 1 && <span className="text-slate-400 text-[9px] md:text-[10px]">|</span>}
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
};