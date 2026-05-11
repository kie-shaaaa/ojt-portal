import { ArrowLeft, ArrowRight } from "lucide-react";
import { type JSX } from "react";
type FormActionsSectionProps = {
  onPrevious?: () => void;
  onNext?: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  previousLabel?: string;
  nextLabel?: string;
};

export const FormActionsSection = ({
  onPrevious,
  onNext,
  previousDisabled = false,
  nextDisabled = false,
  previousLabel = "Previous",
  nextLabel = "Next",
}: FormActionsSectionProps): JSX.Element => {
  const buttons = [
    {
      key: "previous",
      label: previousLabel,
      disabled: previousDisabled,
      onClick: onPrevious,
      type: "button" as const,
      className:
        "box-border inline-flex items-center gap-2 px-10 py-3 relative flex-[0_0_auto] bg-gray-100 rounded-lg border border-solid border-gray-300 shadow-[0px_1px_2px_#0000000d] transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003da5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      textClassName:
        "justify-center [font-family:'Inter-Bold',Helvetica] font-bold text-gray-600 text-base text-center tracking-[0] leading-6 relative flex items-center w-fit whitespace-nowrap",
      icon: <ArrowLeft size={18} strokeWidth={2} />,
      iconAfter: false,
      ariaLabel: previousLabel,
    },
    {
      key: "next",
      label: nextLabel,
      disabled: nextDisabled,
      onClick: onNext,
      type: "button" as const,
      className:
        "box-border inline-flex items-center gap-2 px-10 py-3 relative flex-[0_0_auto] bg-[#003da5] rounded-lg transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003da5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      textClassName:
        "justify-center [font-family:'Inter-Bold',Helvetica] font-bold text-white text-base text-center tracking-[0] leading-6 relative flex items-center w-fit whitespace-nowrap",
      icon: <ArrowRight size={18} color="white" strokeWidth={2} />,
      iconAfter: true,
      ariaLabel: nextLabel,
      overlay: (
        <div
          className="absolute w-full h-full top-0 left-0 bg-[#ffffff01] rounded-lg shadow-[0px_2px_4px_-2px_#0000001a,0px_4px_6px_-1px_#0000001a] pointer-events-none"
          aria-hidden="true"
        />
      ),
    },
  ];

  return (
    <footer className="flex items-center justify-between px-12 py-8 relative self-stretch w-full flex-[0_0_auto] bg-transparent">
      {buttons.map((button) => (
        <button
          key={button.key}
          type={button.type}
          className={button.className}
          onClick={button.onClick}
          disabled={button.disabled}
          aria-label={button.ariaLabel}
        >
          {button.overlay}
          {!button.iconAfter && button.icon}
          <span className={button.textClassName}>{button.label}</span>
          {button.iconAfter && button.icon}
        </button>
      ))}
    </footer>
  );
};