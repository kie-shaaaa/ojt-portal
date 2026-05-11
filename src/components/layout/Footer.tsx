"use client";

import Image from "next/image";
import { JSX } from "react";
import { Home, HelpCircle, Mail, MapPin, Phone, FileText, BookOpen } from "lucide-react";

const quickLinks = [
  { label: "Home", icon: Home, iconClassName: "w-4 h-4 text-slate-200", href: "#top" },
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
    href: "tel:8-924-3775",
  },
  {
    label: "Email:",
    value: "human.resource@ntc.gov.ph",
    icon: Mail,
    iconClassName: "w-5 h-5 text-slate-200",
    href: "mailto:human.resource@ntc.gov.ph",
  },
];

const resourceItems = [
  {
    label: "OJT Requirements",
    icon: BookOpen,
    iconClassName: "w-5 h-5 text-slate-200",
    href: "#",
  },
];

const legalLinks = [
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Developer", href: "#" },
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
    <footer className="flex flex-1 max-h-[421px] relative flex-col w-full items-center gap-8 pt-16 pb-8 px-6 md:px-16 bg-[#001d4e]">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 h-fit gap-12 pb-16 border-b border-[#ffffff1a]">
        <section className="relative row-[1_/_2] col-[1_/_2] w-full h-fit flex flex-col items-start gap-6 pt-0 pb-[32.5px] px-0">
          <div className="flex items-center gap-3 relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/10">
              <Image
                src="/ntc-logo.png"
                alt="NTC logo"
                className="object-cover object-center"
                width={40}
                height={40}
                priority
              />
            </div>
            <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
              <div className="flex items-start self-stretch w-full flex-col relative flex-[0_0_auto]">
                <div className="flex items-center mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-semibold text-white text-base tracking-[0] leading-6 whitespace-nowrap relative w-fit">
                  NTC OJT APPLICATION
                </div>
              </div>
              <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-400 text-[12px] tracking-[0] leading-[16px] whitespace-nowrap relative w-fit">
                  HR Department
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            <p className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-400 text-sm tracking-[0] leading-6">
              Official application portal for internship
              <br />
              opportunities or on-the-job training
              <br />
              programs at the National
              <br />
              Telecommunications Commission of the
              <br />
              Philippines.
            </p>
          </div>
        </section>
        <nav
          aria-label="Quick Links"
          className="relative row-[1_/_2] col-[2_/_3] w-full h-fit flex flex-col items-start gap-6 pt-0 pb-[70px] px-0"
        >
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-semibold text-slate-300 text-base tracking-[0] leading-6">
              Quick Links
            </div>
            <div className="mt-2 h-px w-10 bg-[#3b82f6] rounded-full" />
          </div>
          <ul className="flex flex-col items-start gap-[15.5px] relative self-stretch w-full flex-[0_0_auto]">
            {quickLinks.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]"
              >
                <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                  {item.icon && (
                    <item.icon className={`relative ${item.iconClassName}`} aria-hidden="true" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => scrollToSection(item.href.replace("#", ""))}
                  className="flex items-center mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-200 text-sm tracking-[0] leading-5 whitespace-nowrap relative w-fit focus:outline-none focus:underline hover:underline"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <address className="not-italic row-[1_/_2] col-[3_/_4] w-full h-fit gap-6 flex relative flex-col items-start">
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-semibold text-white text-base tracking-[0] leading-6">
              Contact Info
            </div>
            <div className="mt-2 h-px w-10 bg-[#3b82f6] rounded-full" />
          </div>
          <div className="flex flex-col items-start gap-5 relative self-stretch w-full flex-[0_0_auto]">
            {contactItems.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 relative self-stretch w-full flex-[0_0_auto]"
              >
                <div className="inline-flex flex-col items-start justify-center pt-0.5 pb-0 px-0 relative self-stretch flex-[0_0_auto]">
                  <div className="inline-flex flex-col items-start relative flex-1 grow">
                    {item.icon && (
                      <item.icon className={`relative ${item.iconClassName}`} aria-hidden="true" />
                    )}
                  </div>
                </div>
                <div className="inline-flex flex-col items-start relative self-stretch flex-[0_0_auto]">
                  <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                    <div className="flex items-center mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-slate-200 text-xs tracking-[0] leading-4 whitespace-nowrap relative w-fit">
                      {item.label}
                    </div>
                  </div>
                  <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="flex items-center mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-400 text-xs tracking-[0] leading-4 whitespace-nowrap relative w-fit focus:outline-none focus:underline hover:underline"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-400 text-xs tracking-[0] leading-[15px] relative w-fit">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </address>
        <nav
          aria-label="Resources"
          className="relative row-[1_/_2] col-[4_/_5] w-full h-fit flex flex-col items-start gap-[23.5px] pt-0 pb-[134px] px-0"
        >
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-semibold text-white text-base tracking-[0] leading-6">
              Resources
            </div>
            <div className="mt-2 h-px w-10 bg-[#3b82f6] rounded-full" />
          </div>
          <ul className="flex flex-col items-start gap-0 relative self-stretch w-full flex-[0_0_auto]">
            {resourceItems.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]"
              >
                <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                  {item.icon && (
                    <item.icon className={`relative ${item.iconClassName}`} aria-hidden="true" />
                  )}
                </div>
                <a
                  href={item.href}
                  className="flex items-center mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-200 text-xs tracking-[0] leading-4 whitespace-nowrap relative w-fit focus:outline-none focus:underline hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-4 text-center md:text-left">
    
        {/* Left Side */}
        <div className="flex flex-col gap-1">
          <p className="[font-family:'Inter-Regular',Helvetica] font-normal text-slate-300 text-[12px] tracking-[0] leading-[15px]">
            © 2026 National Telecommunications Commission - Philippines. All rights reserved.
          </p>

          <p className="[font-family:'Inter-Italic',Helvetica] font-normal italic text-slate-400 text-[10px] tracking-[0] leading-[15px]">
            This is an official OJT application portal of NTC. Unauthorized access is prohibited.
          </p>
        </div>

        {/* Right Side */}
        <nav
          aria-label="Legal"
          className="flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-6"
        >
          {legalLinks.map((item, index) => (
            <div
              key={item.label}
              className="flex items-center gap-4 md:gap-6"
            >
              <a
                href={item.href}
                className="[font-family:'Inter-Regular',Helvetica] font-normal text-slate-400 text-[10px] tracking-[0] leading-[15px] hover:underline focus:outline-none focus:underline"
              >
                {item.label}
              </a>

              {index < legalLinks.length - 1 && (
                <span className="text-slate-400 text-[10px]">|</span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
};