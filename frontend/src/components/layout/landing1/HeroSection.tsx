"use client";
import { BadgeInfo, ArrowRight } from "lucide-react";
import {JSX} from "react";
import Image from "next/image";
const ctaButtons = [
  { label: "Submit Application", variant: "primary", type: "button" as const },
  { label: "Track Application", variant: "secondary", type: "button" as const, icon: ArrowRight },
];

export const HeroSection = (): JSX.Element => {
  return (
    <section id = "hero-section"
      aria-labelledby="hero-call-to-action-heading"
      className="relative bg-white w-full pt-32 pb-16 px-4 md:px-8 lg:px-16"
    >
        <Image
        src="/landing_1/hero-section-bg.jpg"
        alt="Background"
        fill
        className="object-cover z-0"
        priority
      />
      
      <div className="absolute inset-0 bg-black/80 z-10"></div>
      {/* Blue Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/70 to-blue-600/50 z-10"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-20">
        {/* Rest of your content remains the same */}
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
          <p className="mt-4 text-gray-200 text-lg leading-relaxed">
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
                    : "border-2 border-white text-white hover:bg-blue-500 hover:border-blue-500"
                }`}
              >
                {button.label}
                {button.icon && <button.icon className="h-5 w-5" />}
              </button>
            ))}
          </div>
        </div>
      <div className="flex-1 flex justify-center items-center">
  <div className="rounded-full overflow-hidden w-64 h-64 md:w-80 md:h-80 shadow-xl bg-white p-4">
    <Image
      src="/ntc-logo.png" 
      alt="NTC Logo"
      width={320}
      height={320}
      className="object-contain w-full h-full"
    />
  </div>
</div>
      </div>
    </section>
  );
};