"use client";

import Link from "next/link";
import { JSX, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";


const navItems = [
  { label: "Home", href: "#hero-section", active: false },
  { label: "FAQs", href:  "#faqs-section", active: false },
  { label: "How to Apply", href: "#how-to-apply", active: false },
  { label: "Contact", href: "#contact-section", active: false },
  { label: "Login", href: "/login", active: false },
];

export const NavBar = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [activeSection, setActiveSection] = useState("hero-section");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Track which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems
        .filter(item => item.href.startsWith("#"))
        .map(item => item.href.substring(1));

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setActiveSection(href.substring(1));
        setIsMenuOpen(false);
      }
    }
  };

  const isItemActive = (item: typeof navItems[0]) => {
    if (item.href.startsWith("#")) {
      return activeSection === item.href.substring(1);
    }
    return item.active;
  };


  return (
    <header className="bg-blue-50 w-full py-4 px-4 md:px-8 lg:px-16 shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/landing_1" aria-label="NTC OJT Portal home" className="text-2xl font-bold text-blue-600">
          NTC OJT APPLICATION
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`text-base font-medium transition-colors ${
                item.active
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {item.label}
              
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-blue-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden mt-4 pt-4 border-t border-blue-100">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`block py-2 text-base font-medium transition-colors ${
                item.active
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};