"use client";
import { FormEvent, useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { JSX } from "react";
import { Phone, Mail, Clock, Send, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { apiCall } from "@/lib/api";

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
      {
        label: "David Zaldua:",
        value: "david.zaldua@ntc.gov.ph",
      },
    ],
  },
  {
    title: "Office Hours",
    icon: Clock,
    iconClassName: "relative w-4 h-4 text-white",
    lines: [
      {
        label: "Mon - Thurs:",
        value: "7:00 AM - 7:00 PM",
      },
      {
        label: "Closed:",
        value: "Fri - Sun & Holidays",
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

const MAX_MESSAGE_LENGTH = 500;

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const ContactSection = (): JSX.Element => {
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
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = formData.email.trim();
    const trimmedSubject = formData.subject.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedEmail || !trimmedSubject || !trimmedMessage) {
      toast.error("Please complete all required contact fields");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      toast.error(`Message must be ${MAX_MESSAGE_LENGTH} characters or less`);
      return;
    }

    setIsSubmitting(true);

    try {
      await apiCall("/mailer/contact", {
        method: "POST",
        body: JSON.stringify({
          email: trimmedEmail,
          subject: trimmedSubject,
          message: trimmedMessage,
        }),
      });

      toast.success("Your message has been received");
      setFormData({
        email: "",
        subject: "",
        message: "",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unable to send your message";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="flex-1 w-full px-3 md:px-8 lg:px-16 py-8 md:py-16 bg-[#002b7f] flex relative flex-col items-center scroll-mt-[72px]"
      aria-labelledby="contact-section-heading"
    >
      <div className="flex max-w-6xl flex-col lg:flex-row items-start gap-8 lg:gap-12 relative w-full flex-[0_0_auto]">
        {/* Left Column - Contact Info */}
        <div className="flex flex-col w-full lg:w-[45%] items-start gap-4 relative">
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            <h2
              id="contact-section-heading"
              className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-2xl md:text-3xl tracking-[0] leading-8 md:leading-9"
            >
              We&#39;re Here to Help
            </h2>
          </div>
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            <p className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-300 text-sm md:text-base tracking-[0] leading-6 md:leading-[26px]">
              Have questions about the application process or need assistance? Our HR team is ready to support you. Reach out through any of the channels below or send us a message directly.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 pt-6 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto]">
            {contactCards.map((card) => (
              <div
                key={card.title}
                className="flex items-start gap-4 md:gap-5 p-4 md:p-6 lg:p-7 min-h-[96px] md:min-h-[112px] relative self-stretch w-full flex-[0_0_auto] bg-[#1e4197] rounded-xl border border-solid border-[#ffffff1a] shadow-[0px_10px_24px_-18px_rgba(0,0,0,0.55)]"
              >
                <div className="inline-flex flex-col items-center justify-center p-3 md:p-4 relative flex-[0_0_auto] bg-[#3b82f633] rounded-xl min-w-12 min-h-12 md:min-w-14 md:min-h-14">
                  {card.icon && (
                    <card.icon className="relative w-5 h-5 md:w-6 md:h-6 text-white" aria-hidden="true" />
                  )}
                </div>
                <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                  <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                    <h3 className="flex items-center mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-base md:text-lg tracking-[0] leading-6 md:leading-7 relative w-fit">
                      {card.title}
                    </h3>
                  </div>
                  {card.lines.map((line) => (
                    <div
                      key={`${card.title}-${line.label}`}
                      className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]"
                    >
                      <p className="flex items-center mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-normal text-transparent text-sm md:text-base tracking-[0] leading-5 md:leading-6 relative w-fit">
                        <span className="font-semibold text-white">
                          {line.label}
                        </span>
                        <span className="[font-family:'Inter-Regular',Helvetica] text-slate-200">
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
        
        {/* Right Column - Contact Form */}
        <div className="flex flex-col w-full lg:w-[55%] items-start relative">
          <div className="gap-2 pt-8 md:pt-12 pb-8 md:pb-12 px-3 md:px-8 lg:px-12 rounded-2xl flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white">
            <div className="absolute w-full h-full top-0 left-0 bg-[#ffffff01] rounded-2xl shadow-[0px_25px_50px_-12px_#00000040]" />
            <div className="flex items-start self-stretch w-full flex-col relative flex-[0_0_auto]">
              <h2 className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#0047ab] text-xl md:text-2xl tracking-[0] leading-7 md:leading-8">
                Send Us a Message
              </h2>
            </div>
            <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
              <p className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-500 text-xs md:text-sm tracking-[0] leading-5">
                Fill out the form below and we&#39;ll get back to you within 24-48 hours.
              </p>
            </div>
            <form
              className="flex flex-col items-start gap-4 md:gap-6 pt-6 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto] z-[1]"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <label
                    className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-blue-700 text-[10px] tracking-[0.50px] leading-[15px]"
                    htmlFor={emailId}
                  >
                    EMAIL ADDRESS *
                  </label>
                </div>
                <div className="group relative self-stretch w-full overflow-hidden rounded-xl border border-slate-300 bg-gradient-to-b from-white to-slate-50 shadow-sm transition-colors duration-200 focus-within:border-[#3b66f5] focus-within:ring-4 focus-within:ring-[#3b66f51a] hover:border-slate-400">
                  <input
                    className="relative w-full border-0 bg-transparent px-4 py-3.5 font-['Inter-Regular',Helvetica] text-sm md:text-base leading-6 outline-none transition-colors duration-200 placeholder:text-slate-400 text-slate-900"
                    id={emailId}
                    name="email"
                    placeholder="Enter your email address"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
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
                    className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-blue-700 text-[10px] tracking-[0.50px] leading-[15px]"
                  >
                    SUBJECT *
                  </label>
                </div>
                <div className="group relative self-stretch w-full overflow-hidden rounded-xl border border-slate-300 bg-gradient-to-b from-white to-slate-50 shadow-sm transition-colors duration-200 focus-within:border-[#3b66f5] focus-within:ring-4 focus-within:ring-[#3b66f51a] hover:border-slate-400">
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-[#3b66f5]">
                    <ChevronDown className="relative h-4 w-4" aria-hidden="true" />
                  </div>
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
                    className={`relative w-full appearance-none border-0 bg-transparent px-4 py-3.5 pr-12 font-['Inter-Regular',Helvetica] text-sm md:text-base leading-6 outline-none transition-colors duration-200 ${
                      formData.subject ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    <option value="" disabled className="text-slate-400">
                      Select a subject
                    </option>
                    {subjectOptions.map((option) => (
                      <option key={option} value={option} className="text-slate-900">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <label
                    htmlFor={messageId}
                    className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-blue-700 text-[10px] tracking-[0.50px] leading-[15px]"
                  >
                    MESSAGE *
                  </label>
                </div>
                <div className="group relative self-stretch w-full overflow-hidden rounded-xl border border-slate-300 bg-gradient-to-b from-white to-slate-50 shadow-sm transition-colors duration-200 focus-within:border-[#3b66f5] focus-within:ring-4 focus-within:ring-[#3b66f51a] hover:border-slate-400">
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
                      className="relative flex min-h-[96px] w-full resize-none border-0 bg-transparent px-4 py-3.5 font-['Inter-Regular',Helvetica] text-sm md:text-base leading-6 text-slate-900 outline-none transition-colors duration-200 placeholder:text-slate-400"
                      maxLength={MAX_MESSAGE_LENGTH}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="all-[unset] box-border flex justify-center gap-2 px-0 py-3.5 md:py-4 self-stretch w-full rounded-xl items-center relative flex-[0_0_auto] cursor-pointer bg-gradient-to-r from-[#214abf] to-[#3b66f5] shadow-[0px_12px_24px_-10px_rgba(59,102,245,0.75)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0px_16px_30px_-12px_rgba(59,102,245,0.85)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                <div className="absolute inset-0 rounded-xl bg-white/5" />
                <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                  <Send className="relative w-3.5 md:w-[14.01px] h-3.5 md:h-[14.01px] text-white" aria-hidden="true" />
                </div>
                <span className="flex items-center justify-center mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-sm md:text-base text-center tracking-[0] leading-5 md:leading-6 relative w-fit">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};