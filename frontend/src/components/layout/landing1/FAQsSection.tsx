"use client";

import { JSX, useState } from "react";
import { ChevronDown, Users, FileText, ClipboardCheck, Clock, Mail } from "lucide-react";

const faqItems = [
  {
    id: "who-can-apply",
    question: "How do I submit an application on this website?",
    answer: "Click the \"Submit Application\" button on our homepage to access the online application form. Fill out all required information, upload necessary documents (resume, proof of enrollment, endorsement, MOA, and other documents), and submit your application. You'll receive a confirmation email with your application reference number.",
    icon: Users,
  },
  {
    id: "requirements",
    question: "What documents are required for OJT/Internship applications?",
    answer:  <>
      Prepare the following documents:
      <br />
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
      "Draft" means that the document does not require a signature. Incomplete requirements will not be entertained.
    </>,
    icon: FileText,
  },
  {
    id: "track-application",
    question: "What courses/programs are qualified for OJT?",
    answer: <> We accept OJT applicants from any course or program, as long as your skills and interests align with the needs of our agency. Whether you're from IT, Business, Engineering, Communications, or other fields, we encourage you to apply! 
    "Please note that internship slots are limited, so we encourage early applications.
    </>,
    icon: ClipboardCheck,
  },
  {
    id: "application-process-time",
    question: "How long does the application process take?",
    answer: <> The application process typically follows this timeline:
<br/>
<br/>
• Initial Review: 1-3 working days
<br/>
• Assessment: 1-3 working days
<br/>
• Final Decision: up to 2 weeks from application
<br/>
<br/>
You can track your application status on this website. We'll also send email notifications at each stage of the process.</>,
    icon: Clock,
  },
  {
    id: "email-updates",
    question: "How can I check my application status?",
    answer: <>You can check your application status by:
<br/>
<br/>
1. Check your application status by visiting the 'Track Application' page
<br/>
2. Checking email notifications from no-reply@ntcapplication.com
<br/>
3. Calling our HR hotline at 8-924-3775 during office hours
<br/>
<br/>
Status updates are typically provided after each stage of the application process through your email.</>,
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