"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Map,
  Flag,
  CheckCircle2,
  FileText,
  User,
  MapPin,
  Calendar,
  HelpCircle,
} from "lucide-react";
import { AccordionItem } from "./AccordionItem";
interface TimelineItemProps {
  number: number;
  align: "left" | "right";
  children: React.ReactNode;
}
function TimelineItem({ number, align, children }: TimelineItemProps) {
  const isLeft = align === "left";
  return (
    <div className="relative flex w-full mb-24 last:mb-0 group">
      {/* Center Node */}
      <div className="absolute left-8 md:left-1/2 top-8 -translate-x-1/2 w-10 h-10 rounded-full bg-navy-900 border-[3px] border-cyan-400 shadow-[0_0_0_4px_#f8fafc] flex items-center justify-center text-white font-bold z-10 transition-transform group-hover:scale-110">
        {number}
      </div>

      {/* Content Wrapper */}
      <div
        className={`w-full md:w-1/2 ${isLeft ? "md:pr-16 md:pl-0" : "md:ml-auto md:pl-16"} pl-24`}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
            x: isLeft ? -20 : 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            x: 0,
          }}
          viewport={{
            once: true,
            margin: "-100px",
          }}
          transition={{
            duration: 0.5,
          }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
export function JourneyTimeline() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative">
        {/* Vertical Line */}
        <div className="absolute left-[56px] md:left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2" />

        {/* Checkpoint 1 */}
        <TimelineItem number={1} align="left">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-bl-full -mr-4 -mt-4"></div>

            <div className="flex items-center gap-2 text-cyan-500 font-bold text-xs tracking-wider uppercase mb-4 relative z-10">
              <Map className="w-4 h-4" />
              Checkpoint 01
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4 relative z-10">
              Welcome Aboard
            </h2>
            <p className="text-slate-600 mb-8 relative z-10 leading-relaxed">
              Welcome to the official NTC OJT Application Portal. This page is
              designed as a guided journey to help you prepare everything you
              need before submitting your application. Follow the path
              step-by-step to ensure a smooth and successful submission.
            </p>
            <div className="flex gap-3 relative z-10">
              <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
                <Map className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-500 flex items-center justify-center hover:bg-cyan-100 transition-colors">
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>
        </TimelineItem>

        {/* Checkpoint 2 */}
        <TimelineItem number={2} align="right">
          <div className="bg-navy-800 rounded-3xl p-8 shadow-xl shadow-navy-900/20 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs tracking-wider uppercase mb-4">
              <Map className="w-4 h-4" />
              Checkpoint 02
            </div>
            <h2 className="text-3xl font-extrabold mb-4">
              Start Here Before Taking the Journey
            </h2>
            <p className="text-slate-300 mb-8 leading-relaxed">
              Please read through the following checkpoints carefully. Knowing
              exactly what is required will save you time and prevent
              application delays.
            </p>

            <div className="bg-navy-900/50 rounded-2xl p-6 border border-white/5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Your Path Ahead
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Questions
                </div>
                <div className="w-8 h-px bg-white/10 my-auto hidden sm:block"></div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Requirements
                </div>
                <div className="w-8 h-px bg-white/10 my-auto hidden sm:block"></div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Submit
                </div>
              </div>
            </div>
          </div>
        </TimelineItem>

        {/* Checkpoint 3 */}
        <TimelineItem number={3} align="left">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs tracking-wider uppercase mb-4">
              <HelpCircle className="w-4 h-4" />
              Checkpoint 03
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
              Just Have Questions?
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Not ready to apply yet? If you only want clarification, guidance,
              or have specific inquiries about the internship program, you can
              reach out to us directly before proceeding through the application
              journey.
            </p>
            <button className="px-6 py-3 rounded-full bg-blue-900 text-white font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2">
              Ask Questions
              <span className="text-xl leading-none">→</span>
            </button>
          </div>
        </TimelineItem>

        {/* Checkpoint 4 */}
        <TimelineItem number={4} align="right">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-2 text-cyan-500 font-bold text-xs tracking-wider uppercase mb-4">
              <FileText className="w-4 h-4" />
              Checkpoint 04
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
              OJT Requirements
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Prepare these documents before submitting your application. Ensure
              all files are clear, valid, and in PDF format.
            </p>

            <div className="space-y-1">
              <AccordionItem
                title="Endorsement Letter"
                icon={<FileText className="w-5 h-5" />}
              >
                An official endorsement letter from your university or college
                coordinator, stating the required number of hours and your
                eligibility for the OJT program.
              </AccordionItem>
              <AccordionItem
                title="Resume / Curriculum Vitae"
                icon={<User className="w-5 h-5" />}
              >
                Your updated resume highlighting your skills, educational
                background, and any relevant projects or coursework.
              </AccordionItem>
              <AccordionItem
                title="Valid School ID"
                icon={<MapPin className="w-5 h-5" />}
              >
                A scanned copy of your current and valid school identification
                card (front and back).
              </AccordionItem>
              <AccordionItem
                title="Schedule of OJT Hours"
                icon={<Calendar className="w-5 h-5" />}
              >
                A proposed schedule of your available hours for the internship,
                aligned with your academic requirements.
              </AccordionItem>
            </div>
          </div>
        </TimelineItem>

        {/* Checkpoint 5 */}
        <TimelineItem number={5} align="left">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs tracking-wider uppercase mb-4">
              <HelpCircle className="w-4 h-4" />
              Checkpoint 05
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-1">
              <AccordionItem
                title="When can I apply for the OJT program?"
                usePlusMinus
              >
                Applications are accepted year-round, but placement depends on
                the availability of slots in the respective departments.
              </AccordionItem>
              <AccordionItem title="How long is the OJT duration?" usePlusMinus>
                The duration depends on your university's requirements,
                typically ranging from 200 to 600 hours.
              </AccordionItem>
              <AccordionItem title="What courses are accepted?" usePlusMinus>
                We accept students from IT, Computer Science, Engineering,
                Business Administration, Communications, and related fields.
              </AccordionItem>
              <AccordionItem
                title="Is there an allowance provided?"
                usePlusMinus
              >
                Currently, the OJT program is unpaid, but it provides valuable
                hands-on experience in a government setting.
              </AccordionItem>
              <AccordionItem
                title="How will I be notified of my application status?"
                usePlusMinus
              >
                You will receive an email notification regarding the status of
                your application within 1-2 weeks after submission.
              </AccordionItem>
            </div>
          </div>
        </TimelineItem>
      </div>
    </section>
  );
}
