"use client";
import { ContactSection } from "./ContactSection";
import { FaqSection } from "./FaqSection";
import { HeroSection } from "./HeroSection";
import { WhatWeOffer } from "./WhatWeOffer";
import {Process} from "./Process";
import {FinalCTA} from "./FinalCTA";
import {AnimatedBlobs} from "./AnimatedBlobs"
import { NavBar } from "../NavBar";
import { Footer } from "../Footer";
import { JSX } from "react";

export const LandingPage = (): JSX.Element => {
  return (
    <main className="bg-white w-full min-h-screen flex flex-col">
      <NavBar />
      <AnimatedBlobs />
      <HeroSection />
      <WhatWeOffer />
      <Process />
      <FaqSection />
      <ContactSection />
      <FinalCTA />
      <Footer />
    </main>
  );
};
