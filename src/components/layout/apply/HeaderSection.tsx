import { JSX } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export const HeaderSection = (): JSX.Element => {
  const router = useRouter();
  const accentBars = ["bg-red-600", "bg-white-400", "bg-blue-700"];

  return (
    <header className="flex flex-col items-start p-8 relative self-stretch w-full flex-[0_0_auto] bg-[#002b80]">
      <div className="flex items-start justify-between w-full mb-2">
        <div className="flex flex-col items-center gap-2 relative flex-1">
          <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
            <div
              className="inline-flex flex-col items-center relative flex-[0_0_auto]"
              aria-hidden="true"
            >
              <div className="justify-center mt-[-1.00px] [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-white text-3xl text-center tracking-[0] leading-9 relative flex items-center w-fit whitespace-nowrap">
                📝
              </div>
            </div>
            <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
              <h1 className="justify-center mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-white text-3xl text-center tracking-[-0.75px] leading-9 relative flex items-center w-fit whitespace-nowrap m-0">
                OJT Application Form
              </h1>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-white/20 text-white transition-colors flex-shrink-0"
          aria-label="Exit to landing page"
        >
          <X size={32} strokeWidth={2.5} />
        </button>
      </div>
      <div className="flex flex-col items-start pt-2 pb-0 px-0 relative flex-[0_0_auto] w-full">
        <div className="inline-flex flex-col items-center relative flex-[0_0_auto] opacity-90">
          <p className="justify-center mt-[-1.00px] [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-white text-sm text-center tracking-[0] leading-5 relative flex items-center w-fit whitespace-nowrap m-0">
            National Telecommunications Commission — Please review all
            information carefully before submitting.
          </p>
        </div>
      </div>
      <div
        className="flex w-full h-1.5 items-start absolute left-0 bottom-0"
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