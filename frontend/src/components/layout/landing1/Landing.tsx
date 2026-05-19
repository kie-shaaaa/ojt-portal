"use client";
import { JSX } from "react";
import { NavBar } from "./NavBar";
import { HeroSection } from "./HeroSection";
import { OverviewSection } from "./OverviewSection";
import { FAQsSection } from "./FAQsSection";
import { ApplicationSection } from "./ApplicationSection";
import { ContactFormSection} from "./ContactSection";
import { FooterLinksSection } from "./Footer";


export const Landing = (): JSX.Element => {
  return (
    <main className="bg-white w-full min-h-screen flex flex-col">
      <NavBar />
      <HeroSection />
        <OverviewSection />
        <FAQsSection />
        <ApplicationSection />
        <ContactFormSection />
        <FooterLinksSection />
    
    </main>
  );
};