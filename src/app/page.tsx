import { ContactSection } from "../components/layout/landing/ContactSection";
import { FaqSection } from "../components/layout/landing/FaqSection";
import { Footer } from "../components/layout/Footer";
import { HeroSection } from "../components/layout/landing/HeroSection";
import { NavBar } from "../components/layout/landing/NavBar";
import { JSX } from "react";

export const NtcOjtApplication = (): JSX.Element => {
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

export default NtcOjtApplication;