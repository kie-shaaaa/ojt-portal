"use client";

import Image from "next/image";
import Link from "next/link";
import { Send, Search } from "lucide-react";
import { JSX, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ApplicationPortalClosedModal } from "@/components/modals/ApplicationPortalClosedModal";

const actions = [
  {
    label: "Submit Application",
    icon: Send,
    variant: "primary" as const,
    type: "button" as const,
    href: "/apply",
  },
  {
    label: "Track Application",
    icon: Search,
    variant: "secondary" as const,
    type: "button" as const,
    href: "/track",
  },
];

export const HeroSection = (): JSX.Element => {
  const router = useRouter();
  const [isPortalOpen, setIsPortalOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load portal status on mount
  useEffect(() => {
    const saved = localStorage.getItem("portalSettings");
    if (saved) {
      try {
        const { isOpen } = JSON.parse(saved);
        setIsPortalOpen(isOpen);
      } catch (error) {
        console.error("Failed to load portal settings:", error);
      }
    }
  }, []);

  const handleSubmitApplication = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isPortalOpen) {
      setIsModalOpen(true);
    } else {
      router.push("/apply");
    }
  };
  return (
    <section
      id="home"
      className="flex flex-1 relative flex-col w-full min-h-screen md:min-h-[700px] items-center justify-center px-4 md:px-6 py-12 md:py-20 bg-[url('/landing/portal-bg.png')] bg-cover bg-center bg-no-repeat"
      aria-labelledby="hero-banner-title"
    >
      <div className="absolute inset-0 bg-black/80" />

      <div className="items-start pt-0 pb-4 md:pb-6 px-0 inline-flex flex-col relative flex-[0_0_auto]">
        <div className="inline-flex flex-col items-center gap-3 md:gap-4 relative flex-[0_0_auto]">
          <div className="relative w-20 md:w-28 h-20 md:h-28 rounded-full overflow-hidden shadow-[0_0_24px_rgba(59,130,246,0.16)]">
            <Image
              src="/ntc-logo.png"
              alt="National Telecommunications Commission seal"
              fill
              className="object-cover object-center"
              sizes="112px"
            />
          </div>
          <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
            <div className="flex items-center justify-center mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-100 text-sm md:text-base text-center tracking-[0.35px] leading-5 relative w-fit">
              HR Department
            </div>
          </div>
        </div>
      </div>

      <div className="inline-flex items-start pt-0 pb-3 md:pb-4 px-0 flex-col relative flex-[0_0_auto]">
        <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
          <h1
            id="hero-banner-title"
            className="flex items-center justify-center mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-3xl md:text-4xl lg:text-5xl text-center tracking-[-0.6px] md:tracking-[-1.20px] leading-tight md:leading-[1.05] relative"
          >
            NTC OJT Application Portal
          </h1>
        </div>
      </div>

      <div className="items-center px-4 md:px-6 lg:px-10 pt-0 pb-6 md:pb-10 inline-flex flex-col relative flex-[0_0_auto] max-w-3xl text-center">
        <p className="mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-200 text-sm md:text-base lg:text-lg tracking-[0] leading-6 md:leading-8 relative">
          Submit your applications for internship opportunities or on-the-job
          training programs at the National Telecommunications Commission
          of the Philippines
        </p>
      </div>

      <div
        className="inline-flex items-center justify-center gap-3 md:gap-5 flex-wrap relative flex-[0_0_auto]"
        role="group"
        aria-label="Application actions"
      >
        {actions.map((action) => {
          const isPrimary = action.variant === "primary";
          const className = isPrimary
            ? "all-[unset] box-border inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-12 py-3 md:py-4 bg-[#2668ff] rounded-full md:rounded-[28px] shadow-[0_16px_40px_-24px_rgba(0,0,0,0.8)] text-white relative flex-[0_0_auto] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hover:bg-[#1e52e0] transition-colors"
            : "all-[unset] box-border inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-12 py-3 md:py-4 rounded-full md:rounded-[28px] border border-white/70 bg-transparent text-white relative flex-[0_0_auto] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hover:bg-white/10 transition-colors";

          if (action.label === "Submit Application") {
            return (
              <button
                key={action.label}
                type="button"
                className={className}
                aria-label={action.label}
                onClick={handleSubmitApplication}
              >
                <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                  {action.icon && (
                    <action.icon
                      className="relative w-4 md:w-5 h-4 md:h-5 text-white"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="flex items-center justify-center [font-family:'Inter-SemiBold',Helvetica] font-semibold text-white text-sm md:text-base text-center tracking-[0] leading-5 md:leading-6 relative w-fit">
                  {action.label}
                </div>
              </button>
            );
          }

          if (action.href) {
            return (
              <Link key={action.label} href={action.href} className={className} aria-label={action.label}>
                <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                  {action.icon && (
                    <action.icon
                      className="relative w-4 md:w-5 h-4 md:h-5 text-white"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="flex items-center justify-center [font-family:'Inter-SemiBold',Helvetica] font-semibold text-white text-sm md:text-base text-center tracking-[0] leading-5 md:leading-6 relative w-fit">
                  {action.label}
                </div>
              </Link>
            );
          }

          return (
            <button
              key={action.label}
              type={action.type}
              className={className}
              aria-label={action.label}
            >
              <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                {action.icon && (
                  <action.icon
                    className="relative w-4 md:w-5 h-4 md:h-5 text-white"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="flex items-center justify-center [font-family:'Inter-SemiBold',Helvetica] font-semibold text-white text-sm md:text-base text-center tracking-[0] leading-5 md:leading-6 relative w-fit">
                {action.label}
              </div>
            </button>
          );
        })}
      </div>

      <ApplicationPortalClosedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};
