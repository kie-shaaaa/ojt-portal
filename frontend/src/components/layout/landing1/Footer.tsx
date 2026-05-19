"use client";

import Link from "next/link";
import { JSX } from "react";

const portalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
];

const externalLinks = [
  { label: "NTC Official Website", href: "https://ntc.gov.ph" },
  { label: "DICT Philippines", href: "https://dict.gov.ph" },
  { label: "GOV.PH", href: "https://gov.ph" },
];

export const FooterLinksSection = (): JSX.Element => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">NTC OJT Portal</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering Filipino students through high-quality
              internship experiences in the telecommunications sector.
            </p>
            <p className="text-gray-500 text-xs mt-6">
              © 2024 National Telecommunications Commission. All rights reserved.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Portal</h3>
            <ul className="space-y-2">
              {portalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">External</h3>
            <ul className="space-y-2">
              {externalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};