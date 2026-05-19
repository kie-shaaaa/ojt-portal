"use client";
import { BadgeInfo, ArrowRight } from "lucide-react";
import {JSX} from "react";

const ctaButtons = [
  { label: "Submit Application", variant: "primary", type: "button" as const },
  { label: "Track Application", variant: "secondary", type: "button" as const, icon: ArrowRight },
];

export const HeroSection = (): JSX.Element => {
  return (
    <section
      aria-labelledby="hero-call-to-action-heading"
      className="relative bg-white w-full pt-32 pb-16 px-4 md:px-8 lg:px-16"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full">
            <BadgeInfo className="h-5 w-5" aria-hidden="true" />
            <p className="text-sm font-semibold">
              Open for qualified student interns nationwide
            </p>
          </div>
          <h1
            id="hero-call-to-action-heading"
            className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight"
          >
            Start Your Internship Journey with
            <span className="text-blue-600"> National Telecommunications Commission</span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            Gain valuable government-sector experience at the forefront of
            telecommunications regulation. We provide mentorship and
            professional growth for the next generation of tech leaders.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {ctaButtons.map((button) => (
              <button
                key={button.label}
                type={button.type}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  button.variant === "primary"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                }`}
              >
                {button.label}
                {button.icon && <button.icon className="h-5 w-5" />}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg flex items-center justify-center">
            <div className="text-center p-8">
              <svg className="w-24 h-24 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-blue-600 font-semibold">NTC Internship Portal</p>
              <p className="text-gray-500 text-sm mt-2">Application Management System</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};