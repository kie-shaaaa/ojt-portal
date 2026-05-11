"use client";

import { type ChangeEvent, type ReactElement, useId } from "react";
import { FileText, AlertCircle } from "lucide-react";

interface PersonalDetailsData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface PersonalDetailsSectionProps {
  data: PersonalDetailsData;
  onDataChange: (data: PersonalDetailsData) => void;
  errors: Record<string, string>;
}

export const PersonalDetailsSection = ({
  data,
  onDataChange,
  errors,
}: PersonalDetailsSectionProps): ReactElement => {
  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const emailHintId = useId();

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;

    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  };

  const handleChange =
    (field: keyof PersonalDetailsData) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "phone"
          ? event.target.value.replace(/\D/g, "").slice(0, 10)
          : event.target.value;

      onDataChange({
        ...data,
        [field]: value,
      });
    };

  return (
    <section className="flex flex-col items-start gap-4 pt-12 pb-16 px-12 relative self-stretch w-full flex-[0_0_auto]">
      <div className="flex items-center gap-2 pt-0 pb-2 px-0 relative self-stretch w-full flex-[0_0_auto]">
        <FileText className="w-6 h-6 text-[#002b80]" aria-hidden="true" />
        <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
          <h2 className="mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-[#002b80] text-lg tracking-[0.90px] leading-7 relative flex items-center w-fit whitespace-nowrap">
            PERSONAL DETAILS
          </h2>
        </div>
      </div>
      <div className="relative self-stretch w-full h-px border-t [border-top-style:solid] border" />
      <form className="flex flex-col items-start gap-6 pt-4 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto]">
        <div className="grid grid-cols-2 grid-rows-[78px] h-fit gap-6 self-stretch w-full">
          <div className="relative row-[1_/_2] col-[1_/_2] w-full h-fit flex flex-col items-start gap-2">
            <label
              htmlFor={firstNameId}
              className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]"
            >
              <span className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-transparent text-sm tracking-[0] leading-5">
                <span className="text-blue-900">First Name </span>
                <span className="text-red-500">*</span>
              </span>
            </label>
            <div
              className={`flex items-start justify-center px-4 py-3 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg overflow-hidden border ${
                errors.firstName
                  ? "border-red-500 border-2"
                  : "border-gray-300 border"
              }`}
            >
              <input
                id={firstNameId}
                name="firstName"
                value={data.firstName}
                onChange={handleChange("firstName")}
                placeholder="Enter your first name"
                autoComplete="given-name"
                required
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? `${firstNameId}-error` : undefined}
                className="relative flex items-center self-stretch w-full border-0 bg-transparent [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-6 p-0 outline-none"
              />
            </div>
            {errors.firstName && (
              <div
                id={`${firstNameId}-error`}
                className="flex items-center gap-1 text-red-500 text-xs"
              >
                <AlertCircle size={14} />
                {errors.firstName}
              </div>
            )}
          </div>
          <div className="relative row-[1_/_2] col-[2_/_3] w-full h-fit flex flex-col items-start gap-2">
            <label
              htmlFor={lastNameId}
              className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]"
            >
              <span className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-transparent text-sm tracking-[0] leading-5">
                <span className="text-blue-900">Last Name </span>
                <span className="text-red-500">*</span>
              </span>
            </label>
            <div
              className={`flex items-start justify-center px-4 py-3 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg overflow-hidden border ${
                errors.lastName
                  ? "border-red-500 border-2"
                  : "border-gray-300 border"
              }`}
            >
              <input
                id={lastNameId}
                name="lastName"
                value={data.lastName}
                onChange={handleChange("lastName")}
                placeholder="Enter your last name"
                autoComplete="family-name"
                required
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? `${lastNameId}-error` : undefined}
                className="relative flex items-center self-stretch w-full border-0 bg-transparent [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-6 p-0 outline-none"
              />
            </div>
            {errors.lastName && (
              <div
                id={`${lastNameId}-error`}
                className="flex items-center gap-1 text-red-500 text-xs"
              >
                <AlertCircle size={14} />
                {errors.lastName}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
          <label
            htmlFor={emailId}
            className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]"
          >
            <span className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-transparent text-sm tracking-[0] leading-5">
              <span className="text-blue-900">Email Address </span>
              <span className="text-red-500">*</span>
            </span>
          </label>
          <div
            className={`justify-center w-full flex-[0_0_auto] rounded-lg flex items-start px-4 py-3 relative self-stretch bg-[#eff6ff4c] overflow-hidden border ${
              errors.email ? "border-red-500 border-2" : "border-gray-300 border"
            }`}
          >
            <input
              id={emailId}
              name="email"
              value={data.email}
              onChange={handleChange("email")}
              placeholder="you@example.com"
              aria-describedby={emailHintId}
              autoComplete="email"
              required
              type="email"
              aria-invalid={!!errors.email}
              className="relative grow border-[none] [background:none] self-stretch [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-6 p-0 outline-none"
            />
          </div>
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            {errors.email ? (
              <div
                id={emailId}
                className="flex items-center gap-1 text-red-500 text-xs"
              >
                <AlertCircle size={14} />
                {errors.email}
              </div>
            ) : (
              <p
                id={emailHintId}
                className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-gray-400 text-xs tracking-[0] leading-4"
              >
                Kindly use an active email address
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
          <label
            htmlFor={phoneId}
            className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]"
          >
            <span className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-blue-900 text-sm tracking-[0] leading-5">
              Phone Number
            </span>
          </label>
          <div className="flex items-start relative self-stretch w-full flex-[0_0_auto]">
            <div className="inline-flex items-center px-4 py-0 relative self-stretch flex-[0_0_auto] bg-[#eff6ff4c] rounded-[8px_0px_0px_8px] border-t [border-top-style:solid] border-b [border-bottom-style:solid] border-l [border-left-style:solid] border-gray-300">
              <div className="[font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5 relative flex items-center w-fit whitespace-nowrap">
                +63
              </div>
            </div>
            <div
              className={`flex-col flex-1 grow rounded-[0px_8px_8px_0px] flex items-start px-4 py-3 relative self-stretch bg-[#eff6ff4c] overflow-hidden border ${
                errors.phone ? "border-red-500 border-2" : "border-gray-300 border"
              }`}
            >
              <input
                id={phoneId}
                name="phone"
                value={formatPhoneNumber(data.phone)}
                onChange={handleChange("phone")}
                placeholder="912 345 6789"
                autoComplete="tel-national"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={12}
                type="text"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
                className="relative flex items-center self-stretch w-full border-0 bg-transparent [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-6 p-0 outline-none"
              />
            </div>
          </div>
          {errors.phone && (
            <div
              id={`${phoneId}-error`}
              className="flex items-center gap-1 text-red-500 text-xs"
            >
              <AlertCircle size={14} />
              {errors.phone}
            </div>
          )}
        </div>
      </form>
    </section>
  );
};

export default PersonalDetailsSection;