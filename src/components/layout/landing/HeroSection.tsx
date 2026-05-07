import { Send, Search } from "lucide-react";
import { JSX } from "react";

const actions = [
  {
    label: "Submit Application",
    icon: Send,
    variant: "primary" as const,
    type: "button" as const,
  },
  {
    label: "Track Application",
    icon: Search,
    variant: "secondary" as const,
    type: "button" as const,
  },
];

export const HeroSection = (): JSX.Element => {
  return (
    <section
      className="flex flex-1 max-h-[528px] relative flex-col w-[1280px] min-h-[500px] items-center justify-center px-6 py-20 bg-[#00153cd9]"
      aria-labelledby="hero-banner-title"
    >
      <div className="items-start pt-0 pb-6 px-0 inline-flex flex-col relative flex-[0_0_auto]">
        <div className="inline-flex flex-col items-center gap-4 relative flex-[0_0_auto]">
          <div className="inline-flex items-start p-2 relative flex-[0_0_auto] bg-white rounded-full">
            <div
              className="absolute w-full h-full top-0 left-0 bg-[#ffffff01] rounded-full shadow-[0px_8px_10px_-6px_#0000001a,0px_20px_25px_-5px_#0000001a]"
              aria-hidden="true"
            />
            <div
              className="w-20 h-20 border-2 border-solid border-[#002b7f] bg-[url(/NTC-seal.png)] relative rounded-full bg-cover bg-[50%_50%]"
              role="img"
              aria-label="National Telecommunications Commission seal"
            />
          </div>
          <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
            <div className="flex items-center justify-center mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-slate-200 text-sm text-center tracking-[0.35px] leading-5 whitespace-nowrap relative w-fit">
              HR DEPARTMENT
            </div>
          </div>
        </div>
      </div>
      <div className="inline-flex items-start pt-0 pb-4 px-0 flex-col relative flex-[0_0_auto]">
        <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
          <h1
            id="hero-banner-title"
            className="flex items-center justify-center mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-5xl text-center tracking-[-1.20px] leading-[48px] whitespace-nowrap relative w-fit"
          >
            NTC OJT Application Portal
          </h1>
        </div>
      </div>
      <div className="items-center pl-[290.13px] pr-[290.14px] pt-0 pb-10 inline-flex flex-col relative flex-[0_0_auto]">
        <p className="mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-200 text-lg text-center tracking-[0] leading-7 relative w-fit">
          Submit your applications for internship opportunities or on-the-job
          training
          <br />
          programs at the National Telecommunications Commission of the
          Philippines
        </p>
      </div>
      <div
        className="inline-flex items-start justify-center gap-[16.01px] relative flex-[0_0_auto]"
        role="group"
        aria-label="Application actions"
      >
        {actions.map((action) => {
          const isPrimary = action.variant === "primary";

          return (
            <button
              key={action.label}
              type={action.type}
              className={
                isPrimary
                  ? "all-[unset] box-border inline-flex justify-center gap-3 px-8 py-3.5 bg-[#3b66f5] rounded items-center relative flex-[0_0_auto] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  : "all-[unset] box-border inline-flex justify-center gap-3 px-8 py-3 rounded border-2 border-solid border-slate-400 items-center relative flex-[0_0_auto] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              }
              aria-label={action.label}
            >
              {isPrimary && (
                <div
                  className="absolute w-full h-full top-0 left-0 bg-[#ffffff01] rounded shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a]"
                  aria-hidden="true"
                />
              )}
              <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                {action.icon && (
                  <action.icon
                    className={
                      isPrimary
                        ? "relative w-[16.01px] h-[16.01px] text-white"
                        : "relative w-4 h-4 text-white"
                    }
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