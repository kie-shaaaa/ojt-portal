import React from "react";
import { Header } from "@/components/layout/landing3/Header";
import { Hero } from "@/components/layout/landing3/Hero";
import { JourneyTimeline } from "@/components/layout/landing3/JourneyTimeline";
import { SubmitSection } from "@/components/layout/landing3/SubmitSection";
import { Footer } from "@/components/layout/landing3/Footer";

export default function Landing3Page() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-cyan-400/30">
      <Header />
      <main>
        <Hero />
        <JourneyTimeline />
        <SubmitSection />
      </main>
      <Footer />
    </div>
  );
}
