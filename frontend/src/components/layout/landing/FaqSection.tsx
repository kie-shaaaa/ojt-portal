"use client";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { JSX } from "react";
import {
  HelpCircle,
  FileText,
  GraduationCap,
  Timer,
  Search,
  ChevronDown,
} from "lucide-react";

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
  const [openItemId, setOpenItemId] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/faqs") {
      document.getElementById("faqs")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [pathname]);

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
      answer: (
        <p className="mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-600 text-sm tracking-[0] leading-[22.8px] relative w-fit">
          Prepare the following documents in a single PDF File:
          <br />
          1. Updated Resume/CV
          <br />
          2. Proof of Enrollment
          <br />
          3. (Draft) Endorsement Letter - Address to Chief Flora R. Ralar
          <br />
          4. Vaccine Card or Medical Certificate
          <br />
          5. (Draft) Memorandum of Agreement
          <br />
          <br />
          <i>
            Draft means that the document does not require a signature.
            Incomplete requirements will not be entertained.
          </i>
        </p>
      ),
      leftIcon: HelpCircle,
      leftIconClassName: "relative w-[18px] h-4 text-[#0047ab]",
      rightIcon: ChevronDown,
      expanded: false,
    },
    {
      id: "qualified-programs",
      question: "What courses/programs are qualified for OJT?",
      answer: (
        <p className="mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-600 text-sm tracking-[0] leading-[22.8px] relative w-fit">
          We accept OJT applicants from any course or program, as long as your
          skills and interests align with the needs of our agency. Whether
          you're from IT, Business, Engineering, Communications, or other
          fields, we encourage you to apply!
          <br />
          <br />
          <i>
            Please note that internship slots are limited, so we encourage early
            applications.
          </i>
        </p>
      ),
      leftIcon: GraduationCap,
      leftIconClassName: "relative w-[18px] h-[14px] text-[#0047ab]",
      rightIcon: ChevronDown,
      expanded: false,
    },
    {
      id: "application-process-time",
      question: "How long does the application process take?",
      answer: (
        <p className="mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-600 text-sm tracking-[0] leading-[22.8px] relative w-fit">
          The application process typically follows this timeline:
          <br />
          <br />• Initial Review: 1-3 working days
          <br />• Assessment: 1-3 working days
          <br />• Final Decision: up to 2 weeks from application
          <br />
          <br />
          You can track your application status on this website. We'll also send
          email notifications at each stage of the process.
        </p>
      ),
      leftIcon: Timer,
      leftIconClassName: "relative w-3.5 h-3.5 text-[#0047ab]",
      rightIcon: ChevronDown,
      expanded: false,
    },
    {
      id: "application-status",
      question: "How can I check my application status?",
      answer: (
        <p className="mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-600 text-sm tracking-[0] leading-[22.8px] relative w-fit">
          You can check your application status by: 
          <br />
          <br />1. Check your application status by visiting the 'Track Application' page 
          <br />2. Checking email notifications from no-reply@ntcapplication.com 
          <br />3. Calling our HR hotline at 8-924-3775 during office hours 
          <br />
          <br />Status updates are typically provided after each stage of the application process through your email.
        </p>
      ),
      leftIcon: Search,
      leftIconClassName: "relative w-3.5 h-[14px] text-[#0047ab]",
      rightIcon: ChevronDown,
      expanded: false,
    },
  ];

  return (
    <section
      id="faqs"
      aria-labelledby={`${accordionId}-heading`}
      className="w-full flex-1 min-h-[calc(100vh-96px)] scroll-mt-[96px] gap-8 px-4 py-14 flex relative flex-col items-center bg-white"
      style={{ backgroundAttachment: "fixed" }}
    >
      <div className="flex items-center self-stretch w-full flex-col relative flex-[0_0_auto]">
        <h2
          id={`${accordionId}-heading`}
          className="flex items-center justify-center mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#0047ab] text-3xl text-center tracking-[0] leading-9 whitespace-nowrap relative w-fit"
        >
          Frequently Asked Questions
        </h2>
      </div>
      <div className="flex flex-col items-start gap-4 relative w-full max-w-[900px] flex-[0_0_auto]">
        {faqItems.map((item) => {
          const isOpen = openItemId === item.id;
          const panelId = `${accordionId}-${item.id}-panel`;
          const buttonId = `${accordionId}-${item.id}-button`;
          const iconClassName = isOpen ? "relative w-7 h-7 text-white transition-transform duration-300 ease-in-out rotate-180" : "relative w-7 h-7 text-[#0047ab] transition-transform duration-300 ease-in-out rotate-0";

          return (
            <div
              key={item.id}
              className="self-stretch w-full flex-[0_0_auto] bg-[#ffffff01] rounded-[24px] overflow-hidden border border-solid border-slate-200 shadow-[0px_8px_24px_rgba(15,23,42,0.06)] flex relative flex-col items-start"
            >
              <h3 className="relative self-stretch w-full flex-[0_0_auto]">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenItemId(isOpen ? "" : item.id)}
                  className={`flex w-full items-center justify-between px-5 py-5 relative self-stretch flex-[0_0_auto] text-left transition-colors duration-300 ease-in-out ${
                    isOpen
                      ? "bg-[#0047ab]"
                      : "bg-white border-b [border-bottom-style:solid] border-transparent hover:bg-slate-50"
                  }`}
                >
                  <span className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                    <span className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                      {item.leftIcon && (
                        <item.leftIcon
                          className={iconClassName}
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <span className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                      <span
                        className={`flex items-center mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-base tracking-[0] leading-6 whitespace-nowrap relative w-fit ${
                          isOpen ? "text-white" : "text-black"
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
                        className={`relative w-8 h-8 transition-transform duration-200 ${isOpen ? "rotate-180 text-white" : "text-[#0047ab]"}`}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`overflow-hidden transition-all duration-300 ease-in-out self-stretch w-full flex-[0_0_auto] bg-white ${
                  isOpen
                    ? "max-h-[520px] opacity-100 pt-[20px] pb-[20px] px-5"
                    : "max-h-0 opacity-0 py-0 px-5"
                }`}
              >
                <div className={`transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0"}`}>
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
