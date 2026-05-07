"use client";
import { useId, useState } from "react";
import { JSX } from "react";
import { HelpCircle, FileText, GraduationCap, Timer, Search, ChevronDown } from "lucide-react";

type FaqItem = {
  id: string;
  question: string;
  answer?: React.ReactNode;
  leftIcon: React.ElementType;
  leftIconClassName: string;
  rightIcon: React.ElementType;
  expanded: boolean;
};

export const FaqSection = (): JSX.Element => {
  const accordionId = useId();
  const [openItemId, setOpenItemId] = useState<string>("submit-application");

  const faqItems: FaqItem[] = [
    {
      id: "submit-application",
      question: "How do I submit an application on this website?",
      answer: (
        <p className="mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-600 text-sm tracking-[0] leading-[22.8px] relative w-fit">
          Click the &#34;Submit Application&#34; button on our homepage to
          access the online application form. Fill out all required information,
          upload
          <br />
          necessary documents (resume, proof of enrollment, endorsement, MOA,
          and other documents), and submit your application. You&#39;ll receive
          <br />a confirmation email with your application reference number.
        </p>
      ),
      leftIcon: HelpCircle,
      leftIconClassName: "relative w-3.5 h-3.5 text-[#0047ab]",
      rightIcon: ChevronDown,
      expanded: true,
    },
    {
      id: "required-documents",
      question: "What documents are required for OJT/Internship applications?",
      leftIcon: FileText,
      leftIconClassName: "relative w-[18px] h-4 text-[#0047ab]",
      rightIcon: ChevronDown,
      expanded: false,
    },
    {
      id: "qualified-programs",
      question: "What courses/programs are qualified for OJT?",
      leftIcon: GraduationCap,
      leftIconClassName: "relative w-[18px] h-[14px] text-[#0047ab]",
      rightIcon: ChevronDown,
      expanded: false,
    },
    {
      id: "application-process-time",
      question: "How long does the application process take?",
      leftIcon: Timer,
      leftIconClassName: "relative w-3.5 h-3.5 text-[#0047ab]",
      rightIcon: ChevronDown,
      expanded: false,
    },
    {
      id: "application-status",
      question: "How can I check my application status?",
      leftIcon: Search,
      leftIconClassName: "relative w-3.5 h-[14px] text-[#0047ab]",
      rightIcon: ChevronDown,
      expanded: false,
    },
  ];

  return (
    <section
      aria-labelledby={`${accordionId}-heading`}
      className="ml-32 mr-32 flex-1 max-h-[755.25px] max-w-screen-lg w-[1024px] gap-12 px-6 py-20 flex relative flex-col items-start"
    >
      <div className="flex items-center self-stretch w-full flex-col relative flex-[0_0_auto]">
        <h2
          id={`${accordionId}-heading`}
          className="flex items-center justify-center mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#0047ab] text-3xl text-center tracking-[0] leading-9 whitespace-nowrap relative w-fit"
        >
          Frequently Asked Questions
        </h2>
      </div>
      <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
        {faqItems.map((item) => {
          const isOpen = openItemId === item.id;
          const panelId = `${accordionId}-${item.id}-panel`;
          const buttonId = `${accordionId}-${item.id}-button`;

          return (
            <div
              key={item.id}
              className="self-stretch w-full flex-[0_0_auto] bg-[#ffffff01] rounded-lg overflow-hidden border border-solid border-slate-200 shadow-[0px_1px_2px_#0000000d] flex relative flex-col items-start"
            >
              <h3 className="relative self-stretch w-full flex-[0_0_auto]">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenItemId(isOpen ? "" : item.id)}
                  className={`flex w-full items-center justify-between p-5 relative self-stretch flex-[0_0_auto] text-left ${
                    isOpen
                      ? "bg-[#0047ab]"
                      : "bg-white border-b [border-bottom-style:solid] border-transparent"
                  }`}
                >
                  <span className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                    <span className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                      {item.leftIcon && (
                        <item.leftIcon className={item.leftIconClassName} aria-hidden="true" />
                      )}
                    </span>
                    <span className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                      <span
                        className={`flex items-center mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-base tracking-[0] leading-6 whitespace-nowrap relative w-fit ${
                          isOpen ? "text-white" : "text-[#0047ab]"
                        }`}
                      >
                        {item.question}
                      </span>
                    </span>
                  </span>
                  <span
                    className={`inline-flex flex-col items-start relative flex-[0_0_auto] ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    {item.rightIcon && (
                      <item.rightIcon
                        className={`relative w-3.5 h-2 text-[#0047ab] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </button>
              </h3>
              {isOpen && item.answer ? (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="max-h-[200px] pt-[22.75px] pb-[24.5px] px-6 flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white"
                >
                  {item.answer}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
};