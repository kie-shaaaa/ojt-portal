import { JSX } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export const HeaderSection = (): JSX.Element => {
  const router = useRouter();
  const accentBars = ["bg-red-600", "bg-gray-100", "bg-blue-700"];

  return (
    <header className="relative self-stretch w-full flex-[0_0_auto] overflow-hidden bg-[#002b80] px-4 md:px-8 pt-6 md:pt-8 pb-6">
      <div className="flex w-full items-center justify-between gap-1 sm:gap-4">
        {/* Spacer to balance the X button and keep title centered */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 shrink-0" aria-hidden="true" />
        
        {/* Center Content */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 text-center flex-1 min-w-0">
          <div aria-hidden="true" className="flex items-center justify-center text-white text-lg sm:text-2xl md:text-3xl leading-none shrink-0">
            📝
          </div>
          <h1 className="m-0 [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-white text-[15px] sm:text-xl md:text-3xl tracking-[-0.25px] sm:tracking-[-0.5px] md:tracking-[-0.75px] leading-tight md:leading-9 break-words">
            OJT Application Form
          </h1>
        </div>

        {/* Right Close Button */}
        <div className="flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg text-white transition-colors hover:bg-white/20"
            aria-label="Exit to landing page"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" strokeWidth={2.5} />
          </button>
        </div>
      </div>
      <div className="mt-6 flex w-full justify-center">
        <p className="m-0 text-center [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-white text-sm leading-5 opacity-90">
          National Telecommunications Commission — Please review all information carefully before submitting.
        </p>
      </div>
      <div
        className="absolute inset-x-0 bottom-0 flex h-1.5 items-start"
        aria-hidden="true"
      >
        {accentBars.map((barClassName) => (
          <div
            key={barClassName}
            className={`relative flex-1 self-stretch grow ${barClassName}`}
          />
        ))}
      </div>
    </header>
  );
};

export default HeaderSection;