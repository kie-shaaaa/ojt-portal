"use client";

import { JSX, useState } from "react";
import { ChevronDown, Users, FileText, ClipboardCheck, Clock, Mail } from "lucide-react";

const faqItems = [
  {
    id: "who-can-apply",
    question: "Who can apply for the OJT program?",
    answer: "The program is open to undergraduate students from recognized universities currently enrolled in relevant degrees such as Engineering, Information Technology, Computer Science, and Public Administration.",
    icon: Users,
  },
  {
    id: "requirements",
    question: "What requirements are needed?",
    answer: "Applicants typically need to submit the required internship forms, an updated resume, endorsement or recommendation from their school, and any additional documents requested during screening.",
    icon: FileText,
  },
  {
    id: "track-application",
    question: "How can I track my application?",
    answer: "You can track your application through the updates provided during the application process and by monitoring communications sent to your registered email address.",
    icon: ClipboardCheck,
  },
  {
    id: "application-process-time",
    question: "How long does the application process take?",
    answer: "The application timeline may vary depending on screening volume and department requirements, but applicants are usually informed once their application progresses to the next stage.",
    icon: Clock,
  },
  {
    id: "email-updates",
    question: "Will I receive email updates?",
    answer: "Yes, email updates may be sent regarding the status of your application, interview schedules, document requests, and final decisions.",
    icon: Mail,
  },
];

export const FAQsSection = (): JSX.Element => {
  const [openItem, setOpenItem] = useState<string>(faqItems[0].id);

  return (
    <section className="w-full min-h-screen py-20 px-4 md:px-8 lg:px-16 bg-blue-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg">
            Everything you need to know about the NTC Internship Program.
          </p>
        </div>
        <div className="space-y-4">
          {faqItems.map((item) => {
            const isOpen = openItem === item.id;
            const Icon = item.icon;
            
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenItem(isOpen ? "" : item.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};