"use client";

import { FileText, Upload, Clock } from "lucide-react";
import { JSX } from "react";
const steps = [
  {
    id: 1,
    title: "Submit Your Application",
    description: "Fill out the online application form with your personal and academic details.",
    icon: FileText,
    color: "bg-blue-600",
  },
  {
    id: 2,
    title: "Prepare Requirements",
    description: "Upload your CV, Endorsement Letter, and Transcript of Records in PDF format.",
    icon: Upload,
    color: "bg-blue-500",
  },
  {
    id: 3,
    title: "Wait for Updates",
    description: "Track your status through the portal or wait for our email notification.",
    icon: Clock,
    color: "bg-blue-400",
  },
];

export const ApplicationSection = (): JSX.Element => {
  return (
    <section className="w-full py-20 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            How to Apply
          </h2>
          <p className="text-gray-600 text-lg">
            Complete your application in three simple steps.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="absolute -top-4 left-6 w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center text-blue-900 font-bold text-lg">
                  {step.id}
                </div>
                <div className="mt-6 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};