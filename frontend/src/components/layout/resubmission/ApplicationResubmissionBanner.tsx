import { AlertTriangle } from "lucide-react";
import { JSX } from "react";
export const ApplicationResubmissionBannerSection = (): JSX.Element => {
  return (
    <section
      className="flex flex-col items-center px-6 md:px-48 py-8 relative self-stretch w-full bg-[#0038a8]"
      aria-labelledby="application-resubmission-banner-title"
    >
      <div className="flex flex-col max-w-4xl items-center gap-4 w-full">
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-full"
            aria-hidden="true"
          >
            <AlertTriangle className="w-8 h-8 text-black" aria-hidden="true" />
          </div>
          <h1
            id="application-resubmission-banner-title"
            className="text-center font-bold text-white text-2xl md:text-3xl tracking-tight"
          >
            OJT Application Resubmission Form
          </h1>
        </div>
        <p className="text-center text-blue-100 text-sm md:text-base opacity-90">
          National Telecommunications Commission — Please review and resubmit the required documents.
        </p>
      </div>
      <div
        className="absolute w-full left-0 bottom-0 h-1 bg-red-500"
        aria-hidden="true"
      />
    </section>
  );
};







