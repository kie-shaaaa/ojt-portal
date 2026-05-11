import { JSX } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export const HeaderSection = (): JSX.Element => {
  const router = useRouter();
  const accentBars = ["bg-red-600", "bg-gray-100", "bg-blue-700"];

  return (
    <header className="relative self-stretch w-full flex-[0_0_auto] overflow-hidden bg-[#002b80] px-8 pt-8 pb-6">
      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-start">
        <div />
        <div className="flex items-center justify-center gap-3 text-center min-w-0">
          <div aria-hidden="true" className="flex items-center justify-center text-white text-3xl leading-none">
            📝
          </div>
          <h1 className="m-0 flex items-center justify-center whitespace-nowrap [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-white text-3xl tracking-[-0.75px] leading-9">
            OJT Application Form
          </h1>
        </div>
        <div className="flex items-start justify-end">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center justify-center w-12 h-12 rounded-lg text-white transition-colors hover:bg-white/20"
            aria-label="Exit to landing page"
          >
            <X size={32} strokeWidth={2.5} />
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