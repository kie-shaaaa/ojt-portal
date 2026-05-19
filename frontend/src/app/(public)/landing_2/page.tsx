import { Footer } from "@/components/layout/Footer";
import { ContactSection } from "@/components/layout/landing/ContactSection";
import { FaqSection } from "@/components/layout/landing/FaqSection";
import { FinalCTA } from "@/components/layout/landing_2/FinalCTA";
import { Hero } from "@/components/layout/landing_2/Hero";
import { Process } from "@/components/layout/landing_2/Process";
import { WhatWeOffer } from "@/components/layout/landing_2/WhatWeOffer";
import { NavBar } from "@/components/layout/NavBar";
import { JSX } from "react";

export const Landing2Page = (): JSX.Element => {
  return (
    <main className="bg-white w-full min-h-screen flex flex-col">
      <NavBar />
      <Hero />
      <WhatWeOffer />
      <Process />
      <FaqSection />
      <ContactSection />
      <FinalCTA />
      <Footer />
    </main>
  );
};

export default Landing2Page;