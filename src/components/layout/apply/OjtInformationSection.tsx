import { Info, AlertCircle } from "lucide-react";
import { JSX, ChangeEvent } from "react";
import DatePicker from "@/components/layout/DatePicker";

interface OjtInformationData {
  school: string;
  course: string;
  hours: string;
  deploymentDate: string;
}

interface OjtInformationSectionProps {
  data: OjtInformationData;
  onDataChange: (data: OjtInformationData) => void;
  errors: Record<string, string>;
}

const selectFields = [
  {
    id: "school",
    label: "Name of School",
  },
  {
    id: "course",
    label: "Course / Program",
  },
];

const textFields = [
  {
    id: "hours",
    label: "Hours to Render",
  },
  {
    id: "deploymentDate",
    label: "Preferred Deployment Date",
  },
];

export const OjtInformationSection = ({
  data,
  onDataChange,
  errors,
}: OjtInformationSectionProps): JSX.Element => {
  const handleSelectChange =
    (field: keyof OjtInformationData) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onDataChange({
        ...data,
        [field]: event.target.value,
      });
    };

  const handleTextChange =
    (field: keyof OjtInformationData) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;
      // Restrict hours field to numbers only
      if (field === "hours") {
        value = value.replace(/[^0-9]/g, "");
      }
      onDataChange({
        ...data,
        [field]: value,
      });
    };

  return (
    <section
      aria-labelledby="ojt-information-heading"
      className="flex flex-col items-start gap-6 pt-10 pb-14 px-12 relative self-stretch w-full flex-[0_0_auto]"
    >
      <div className="flex items-center gap-2 pt-0 pb-2 px-0 relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border">
        <div className="relative w-6 h-6 shrink-0 text-[#0047ab]" aria-hidden="true">
          <Info className="absolute inset-0 w-full h-full" />
        </div>
        <div className="items-start inline-flex flex-col relative flex-[0_0_auto]">
          <h2
            id="ojt-information-heading"
            className="mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#0047ab] text-lg tracking-[0.90px] leading-7 relative flex items-center w-fit whitespace-nowrap"
          >
            OJT INFORMATION
          </h2>
        </div>
      </div>
      <div className="flex flex-col items-start gap-6 relative self-stretch w-full flex-[0_0_auto]">
        {selectFields.map((field) => (
          <div
            key={field.id}
            className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]"
          >
            <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
              <label
                htmlFor={field.id}
                className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-transparent text-sm tracking-[0] leading-5"
              >
                <span className="text-[#0047ab]">{field.label} </span>
                <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative self-stretch w-full flex-[0_0_auto]">
                <input
                  id={field.id}
                  name={field.id}
                  type="text"
                  aria-required="true"
                  placeholder={field.label}
                  value={data[field.id as keyof OjtInformationData] || ""}
                  onChange={handleSelectChange(
                    field.id as keyof OjtInformationData,
                  )}
                  aria-invalid={!!errors[field.id]}
                  aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                  className={`flex items-center justify-center px-4 py-3 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border shadow-[0px_1px_2px_#0000000d] [font-family:'Inter-Regular',Helvetica] font-normal text-gray-700 text-base tracking-[0] leading-6 outline-none ${
                    errors[field.id]
                      ? "border-red-500 border-2"
                      : "border-gray-300 border"
                  }`}
                />
              </div>
              {errors[field.id] && (
                <div
                  id={`${field.id}-error`}
                  className="flex items-center gap-1 text-red-500 text-xs mt-1"
                >
                  <AlertCircle size={14} />
                  {errors[field.id]}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="grid grid-cols-2 grid-rows-[78px] h-fit gap-6 self-stretch w-full">
          {textFields.map((field, index) => (
            <div
              key={field.id}
              className={`relative row-[1_/_2] ${index === 0 ? "col-[1_/_2]" : "col-[2_/_3]"} w-full h-fit flex flex-col items-start gap-2`}
            >
              {field.id === "deploymentDate" ? (
                <DatePicker
                  id={field.id}
                  label={field.label}
                  value={data.deploymentDate}
                  onChange={(value: string) =>
                    onDataChange({ ...data, deploymentDate: value })
                  }
                  error={errors[field.id]}
                  required
                  placeholder="dd/mm/yyyy"
                />
              ) : (
                <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                    <label
                      htmlFor={field.id}
                      className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-transparent text-sm tracking-[0] leading-5"
                    >
                      <span className="text-[#0047ab]">{field.label} </span>
                      <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div
                    className={`flex items-start justify-center px-4 py-3 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg overflow-hidden border shadow-[0px_1px_2px_#0000000d] ${
                      errors[field.id]
                        ? "border-red-500 border-2"
                        : "border-gray-300 border"
                    }`}
                  >
                    <input
                      id={field.id}
                      name={field.id}
                      type="text"
                      aria-required="true"
                      placeholder={field.label}
                      value={data[field.id as keyof OjtInformationData] || ""}
                      onChange={handleTextChange(
                        field.id as keyof OjtInformationData,
                      )}
                      aria-invalid={!!errors[field.id]}
                      aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                      className="relative flex items-center w-full border-0 bg-transparent [font-family:'Inter-Regular',Helvetica] font-normal text-gray-700 text-base tracking-[0] leading-6 outline-none placeholder:text-gray-400"
                    />
                  </div>
                  {errors[field.id] && (
                    <div
                      id={`${field.id}-error`}
                      className="flex items-center gap-1 text-red-500 text-xs"
                    >
                      <AlertCircle size={14} />
                      {errors[field.id]}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OjtInformationSection;
