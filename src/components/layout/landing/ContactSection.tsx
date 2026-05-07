"use client";
import { FormEvent, useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { JSX } from "react";
import { Phone, Mail, Clock, Send, ChevronDown } from "lucide-react";

const contactCards = [
  {
    title: "Call Us",
    icon: Phone,
    iconClassName: "relative w-4 h-4 text-white",
    lines: [
      {
        label: "HR Department:",
        value: "8-924-3775",
      },
    ],
  },
  {
    title: "Email Us",
    icon: Mail,
    iconClassName: "relative w-4 h-3 text-white",
    lines: [
      {
        label: "HR:",
        value: "human.resource@ntc.gov.ph",
      },
    ],
  },
  {
    title: "Office Hours",
    icon: Clock,
    iconClassName: "relative w-4 h-4 text-white",
    lines: [
      {
        label: "Mon - Fri:",
        value: "8:00 AM - 5:00 PM",
      },
      {
        label: "Closed:",
        value: "Sat - Sun & Holidays",
      },
    ],
  },
];

const subjectOptions = [
  "Application Process",
  "Requirements",
  "Technical Support",
  "Scheduling",
  "Other",
];

export const ContactSection = (): JSX.Element => {
  const fullNameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/contact") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [pathname]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section
      id="contact"
      className="flex-1 max-h-[878px] w-full px-16 py-20 bg-[#002b7f] flex relative flex-col items-center scroll-mt-[96px]"
      aria-labelledby="contact-section-heading"
    >
      <div className="flex max-w-6xl items-start gap-12 relative w-full flex-[0_0_auto]">
        <div className="flex flex-col w-[441.61px] items-start gap-4 relative self-stretch">
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            <h2
              id="contact-section-heading"
              className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-3xl tracking-[0] leading-9"
            >
              We&#39;re Here to Help
            </h2>
          </div>
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            <p className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-300 text-base tracking-[0] leading-[26px]">
              Have questions about the application process or need
              <br />
              assistance? Our HR team is ready to support you. Reach
              <br />
              out through any of the channels below or send us a
              <br />
              message directly.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 pt-6 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto]">
            {contactCards.map((card) => (
              <div
                key={card.title}
                className="flex items-start gap-4 p-5 relative self-stretch w-full flex-[0_0_auto] bg-[#1e4197] rounded-lg border border-solid border-[#ffffff1a]"
              >
                <div className="inline-flex flex-col items-start p-3 relative flex-[0_0_auto] bg-[#3b82f633] rounded-md">
                  {card.icon && (
                    <card.icon className={card.iconClassName} aria-hidden="true" />
                  )}
                </div>
                <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                  <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                    <h3 className="flex items-center mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-sm tracking-[0] leading-5 whitespace-nowrap relative w-fit">
                      {card.title}
                    </h3>
                  </div>
                  {card.lines.map((line) => (
                    <div
                      key={`${card.title}-${line.label}`}
                      className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]"
                    >
                      <p className="flex items-center mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-normal text-transparent text-xs tracking-[0] leading-4 whitespace-nowrap relative w-fit">
                        <span className="font-semibold text-white">
                          {line.label}
                        </span>
                        <span className="[font-family:'Inter-Regular',Helvetica] text-slate-300">
                          {" "}
                          {line.value}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col w-[662.39px] items-start relative self-stretch">
          <div className="gap-2 pt-12 pb-16 px-12 rounded-2xl flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white">
            <div className="absolute w-full h-full top-0 left-0 bg-[#ffffff01] rounded-2xl shadow-[0px_25px_50px_-12px_#00000040]" />
            <div className="flex items-start self-stretch w-full flex-col relative flex-[0_0_auto]">
              <h2 className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#0047ab] text-2xl tracking-[0] leading-8">
                Send Us a Message
              </h2>
            </div>
            <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
              <p className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-500 text-sm tracking-[0] leading-5">
                Fill out the form below and we&#39;ll get back to you within
                24-48 hours.
              </p>
            </div>
            <form
              className="flex flex-col items-start gap-6 pt-6 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto] z-[1]"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <label
                    className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-slate-700 text-[10px] tracking-[0.50px] leading-[15px]"
                    htmlFor={fullNameId}
                  >
                    FULL NAME *
                  </label>
                </div>
                <div className="flex items-start justify-center px-4 py-3.5 relative self-stretch w-full flex-[0_0_auto] bg-slate-50 rounded-md overflow-hidden border border-solid border-slate-200">
                  <input
                    className="relative grow border-[none] [background:none] self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-base tracking-[0] leading-[normal] p-0 outline-none placeholder:text-gray-500"
                    id={fullNameId}
                    name="fullName"
                    placeholder="Enter your full name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullName: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <label
                    className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-slate-700 text-[10px] tracking-[0.50px] leading-[15px]"
                    htmlFor={emailId}
                  >
                    EMAIL ADDRESS *
                  </label>
                </div>
                <div className="flex items-start justify-center px-4 py-3.5 relative self-stretch w-full flex-[0_0_auto] bg-slate-50 rounded-md overflow-hidden border border-solid border-slate-200">
                  <input
                    className="relative grow border-[none] [background:none] self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-base tracking-[0] leading-[normal] p-0 outline-none placeholder:text-gray-500"
                    id={emailId}
                    name="email"
                    placeholder="Enter your email address"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <label
                    htmlFor={subjectId}
                    className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-slate-700 text-[10px] tracking-[0.50px] leading-[15px]"
                  >
                    SUBJECT *
                  </label>
                </div>
                <div className="flex items-center justify-center px-4 py-3 relative self-stretch w-full flex-[0_0_auto] bg-slate-50 rounded-md border border-solid border-slate-200">
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                    <ChevronDown className="relative w-4 h-4 text-slate-400" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col items-start relative flex-1 grow">
                    <select
                      id={subjectId}
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          subject: event.target.value,
                        }))
                      }
                      className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-800 text-base tracking-[0] leading-6 bg-transparent border-0 outline-none appearance-none pr-10"
                    >
                      <option value="" disabled className="text-slate-800">
                        Select a subject
                      </option>
                      {subjectOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <label
                    htmlFor={messageId}
                    className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-slate-700 text-[10px] tracking-[0.50px] leading-[15px]"
                  >
                    MESSAGE *
                  </label>
                </div>
                <div className="flex items-start justify-center pt-3 pb-6 px-4 relative self-stretch w-full flex-[0_0_auto] bg-slate-50 rounded-md overflow-hidden border border-solid border-slate-200">
                  <div className="flex flex-col items-start relative flex-1 grow">
                    <textarea
                      id={messageId}
                      name="message"
                      required
                      value={formData.message}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          message: event.target.value,
                        }))
                      }
                      placeholder="Type your message here..."
                      className="relative flex items-center self-stretch mt-[-1.00px] min-h-[24px] resize-none border-0 bg-transparent p-0 outline-none [font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-base tracking-[0] leading-6 placeholder:text-gray-500"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="all-[unset] box-border flex justify-center gap-2 px-0 py-4 self-stretch w-full bg-[#3b66f5] rounded-md items-center relative flex-[0_0_auto] cursor-pointer"
              >
                <div className="absolute w-full h-full top-0 left-0 bg-[#ffffff01] rounded-md shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a]" />
                <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                  <Send className="relative w-[14.01px] h-[14.01px] text-white" aria-hidden="true" />
                </div>
                <span className="flex items-center justify-center mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-base text-center tracking-[0] leading-6 whitespace-nowrap relative w-fit">
                  Send Message
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};