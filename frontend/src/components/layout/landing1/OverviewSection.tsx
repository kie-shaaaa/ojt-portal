"use client";
import { JSX } from "react";
export const OverviewSection = (): JSX.Element => {
  const titleLines = ["What is National", "Telecommunications", "Commission?"];
  const description = "The National Telecommunications Commission (NTC) is the government agency in the Philippines responsible for supervising, regulating, and managing telecommunications services and communication facilities throughout the country. NTC plays an important role in ensuring reliable communication systems, internet services, broadcasting operations, and public connectivity.";

  return (
    <section
      aria-labelledby="commission-overview-title"
      className="w-full py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-blue-50 to-white"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h2
            id="commission-overview-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 leading-tight"
          >
            {titleLines.map((line, index) => (
              <span key={line}>
                {line}
                {index < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex-1">
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
            <div className="relative bg-gray-200 rounded-2xl shadow-xl overflow-hidden aspect-video flex items-center justify-center">
              <div className="text-center p-8">
                <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <p className="text-gray-600 font-medium">NTC Portal Preview</p>
                <p className="text-gray-400 text-sm mt-1">System Interface</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};