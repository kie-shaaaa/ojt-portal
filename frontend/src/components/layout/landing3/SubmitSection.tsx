"use client";

import React from "react";
import { CheckCircle2, Send, Search } from "lucide-react";
import { motion } from "framer-motion";
export function SubmitSection() {
  return (
    <section className="bg-slate-50 pb-24 relative">
      <div className="max-w-5xl mx-auto px-6 relative">
        {/* Final Line Segment */}
        <div className="absolute left-[56px] md:left-1/2 top-0 h-16 w-px bg-slate-200 -translate-x-1/2" />

        {/* Final Node (6) */}
        <div className="absolute left-8 md:left-1/2 top-16 -translate-x-1/2 w-10 h-10 rounded-full bg-navy-900 border-[3px] border-cyan-400 shadow-[0_0_0_4px_#f8fafc] flex items-center justify-center text-white font-bold z-10">
          6
        </div>

        <div className="pt-32">
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
            className="bg-navy-900 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl"
          >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <CheckCircle2 className="w-10 h-10 text-cyan-400" />
              </div>

              <div className="flex gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-cyan-400"
                  ></div>
                ))}
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                You're Ready to Submit
              </h2>

              <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
                You've reached the final destination of the preparation journey.
                If you have reviewed all requirements and have your documents
                ready, you may now proceed to submit your application.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-cyan-400 text-navy-900 font-bold hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                  <Send className="w-5 h-5" />
                  Submit Application
                </button>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors">
                  <Search className="w-5 h-5" />
                  Track Application
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
