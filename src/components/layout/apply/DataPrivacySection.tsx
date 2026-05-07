import { JSX, useId } from "react";
import { AlertCircle, Lock } from "lucide-react";

interface DataPrivacyData {
  agreed: boolean;
}

interface DataPrivacySectionProps {
  data: DataPrivacyData;
  onDataChange: (data: DataPrivacyData) => void;
  errors: Record<string, string>;
}

const agreementItems = [
  "I hereby authorize the National Telecommunications Commission (NTC) to collect, process, store, and use my personal data for OJT training application purposes.",
  "I certify that all information provided in this application is true, correct, and complete to the best of my knowledge.",
  "I understand that any misrepresentation or omission of facts may be grounds for disqualification or termination.",
  "I authorize NTC to conduct background checks as necessary for the application process.",
  "I understand that my information will be handled securely and in accordance with the Data Privacy Act of 2012.",
];

export const DataPrivacySection = ({
  data,
  onDataChange,
  errors,
}: DataPrivacySectionProps): JSX.Element => {
  const checkboxId = useId();

  return (
    <section className="flex flex-col items-start gap-12 p-12 relative self-stretch w-full flex-[0_0_auto]">
      <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative w-6 h-6" aria-hidden="true">
          <Lock className="absolute inset-0 w-full h-full" />
        </div>
        <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
          <h2 className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-blue-900 text-lg tracking-[0.45px] leading-7 whitespace-nowrap">
            DATA PRIVACY AGREEMENT
          </h2>
        </div>
      </div>
      <div className="flex flex-col items-start gap-6 pt-6 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto] border-t [border-top-style:solid] border">
        <div
          className="relative self-stretch w-full h-64 bg-[#eff6ff4c] rounded-xl overflow-y-auto overflow-x-hidden border-2 border-solid border-[#16a34a80] p-6"
          role="region"
          aria-label="Data Privacy Agreement content"
        >
          <div className="flex flex-col items-start gap-4 relative w-full flex-[0_0_auto]">
            <h3 className="relative flex items-center w-fit mt-0 [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-blue-800 text-base tracking-[0] leading-6 whitespace-nowrap">
              Data Privacy Agreement
            </h3>
            <p className="relative flex items-start w-full mt-0 [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-gray-700 text-sm tracking-[0] leading-[22.8px]">
              By submitting this application form, you acknowledge and agree to
              the following terms:
            </p>
            <div className="flex flex-col items-start gap-4 relative w-full flex-[0_0_auto]">
              {agreementItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start gap-2 relative w-full flex-[0_0_auto]"
                >
                  <p className="relative mt-0 [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-gray-700 text-sm tracking-[0] leading-[22.8px] w-full">
                    {index + 1}. {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative self-stretch w-full h-5">
          <div className="inline-flex h-5 items-center absolute top-0 -left-px">
            <input
              id={checkboxId}
              type="checkbox"
              checked={data.agreed}
              onChange={(event) =>
                onDataChange({ agreed: event.target.checked })
              }
              className="sr-only peer"
              aria-required="true"
              aria-invalid={!!errors.agreed}
              aria-describedby={errors.agreed ? `${checkboxId}-error` : undefined}
            />
            <label
              htmlFor={checkboxId}
              className={`flex flex-col w-[22px] h-[22px] items-center justify-center relative mt-[-1.00px] mb-[-1.00px] rounded overflow-hidden border cursor-pointer peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 ${
                errors.agreed
                  ? "bg-red-500 border-red-500 peer-focus-visible:outline-red-500"
                  : "bg-blue-900 border-blue-900 peer-focus-visible:outline-blue-900"
              }`}
            >
              {data.agreed && (
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </label>
          </div>
          <label
            htmlFor={checkboxId}
            className="absolute top-0 left-8 h-5 flex items-center [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-transparent text-sm tracking-[0] leading-5 whitespace-nowrap cursor-pointer"
          >
            <span className="text-gray-800">
              I have read, understood, and agree to the terms and conditions
              above.{" "}
            </span>
            <span className="text-red-500">*</span>
          </label>
        </div>
        {errors.agreed && (
          <div
            id={`${checkboxId}-error`}
            className="flex items-center gap-1 text-red-500 text-xs mt-2"
          >
            <AlertCircle size={14} />
            {errors.agreed}
          </div>
        )}
      </div>
    </section>
  );
};

export default DataPrivacySection;