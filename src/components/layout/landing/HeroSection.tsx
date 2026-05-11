import Image from "next/image";
import Link from "next/link";
import { Send, Search } from "lucide-react";
import { JSX } from "react";

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
  return (
    <section
      id="home"
      className="flex flex-1 max-h-[528px] relative flex-col w-full min-h-[700px] items-center justify-center px-6 py-20 bg-[url('/landing/portal-bg.png')] bg-cover bg-center bg-no-repeat"
      aria-labelledby="hero-banner-title"
    >
      <div className="absolute inset-0 bg-black/80" />

      <div className="items-start pt-0 pb-6 px-0 inline-flex flex-col relative flex-[0_0_auto]">
        <div className="inline-flex flex-col items-center gap-4 relative flex-[0_0_auto]">
          <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-[0_0_24px_rgba(59,130,246,0.16)]">
            <Image
              src="/ntc-logo.png"
              alt="National Telecommunications Commission seal"
              fill
              className="object-cover object-center"
              sizes="112px"
            />
          </div>
          <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
            <div className="flex items-center justify-center mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-100 text-base text-center tracking-[0.35px] leading-5 whitespace-nowrap relative w-fit">
              HR Department
            </div>
          </div>
        </div>
      </div>

      <div className="inline-flex items-start pt-0 pb-4 px-0 flex-col relative flex-[0_0_auto]">
        <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
          <h1
            id="hero-banner-title"
            className="flex items-center justify-center mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-5xl text-center tracking-[-1.20px] leading-[1.05] relative whitespace-nowrap"
          >
            NTC OJT Application Portal
          </h1>
        </div>
      </div>

      <div className="items-center px-10 pt-0 pb-10 inline-flex flex-col relative flex-[0_0_auto] max-w-3xl text-center">
        <p className="mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-200 text-lg tracking-[0] leading-8 relative">
          Submit your applications for internship opportunities or on-the-job
          <br />
          training programs at the National Telecommunications Commission
          <br />
          of the Philippines
        </p>
      </div>

      <div
        className="inline-flex items-center justify-center gap-5 relative flex-[0_0_auto]"
        role="group"
        aria-label="Application actions"
      >
        {actions.map((action) => {
          const isPrimary = action.variant === "primary";
          const className = isPrimary
            ? "all-[unset] box-border inline-flex items-center justify-center gap-3 px-12 py-4 bg-[#2668ff] rounded-[28px] shadow-[0_16px_40px_-24px_rgba(0,0,0,0.8)] text-white relative flex-[0_0_auto] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            : "all-[unset] box-border inline-flex items-center justify-center gap-3 px-12 py-4 rounded-[28px] border border-white/70 bg-transparent text-white relative flex-[0_0_auto] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

          if (action.href) {
            return (
              <Link key={action.label} href={action.href} className={className} aria-label={action.label}>
                <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                  {action.icon && (
                    <action.icon
                      className="relative w-5 h-5 text-white"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="flex items-center justify-center [font-family:'Inter-SemiBold',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-6 whitespace-nowrap relative w-fit">
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
                    className="relative w-5 h-5 text-white"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="flex items-center justify-center [font-family:'Inter-SemiBold',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-6 whitespace-nowrap relative w-fit">
                {action.label}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
