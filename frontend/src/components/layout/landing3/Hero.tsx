import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
export function Hero() {
  return (
    <section
      className="relative pt-32 pb-24 overflow-hidden min-h-[600px] flex items-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.68), rgba(0,0,0,0.88)), url('/landing/portal-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-hero-pattern opacity-15"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-6 text-center z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
          <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase">
            OJT / Internship Portal
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
          Ready to Begin Your <br className="hidden md:block" />
          OJT <span className="text-cyan-400">Journey?</span>
        </h1>

        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Guide applicants through every checkpoint before submitting
          requirements. Follow the roadmap to ensure a smooth application
          process.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button className="flex items-center gap-2 px-8 py-4 rounded-full bg-cyan-400 text-navy-900 font-bold hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            Start the Journey
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="px-8 py-4 rounded-full text-white font-semibold hover:bg-white/5 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
