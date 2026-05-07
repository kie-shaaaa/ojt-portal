"use client";
import { ContactSection } from "./ContactSection";
import { FaqSection } from "./FaqSection";
import { HeroSection } from "./HeroSection";
import { NavBar } from "./NavBar";
import { Footer } from "../Footer";
import { JSX } from "react";

export const LandingPage = (): JSX.Element => {
  return (
    <main className="bg-white w-full min-h-[2652px] flex flex-col">
      <NavBar />
      <HeroSection />
      <FaqSection />
      <ContactSection />
      <Footer />
    </main>
  );
};
