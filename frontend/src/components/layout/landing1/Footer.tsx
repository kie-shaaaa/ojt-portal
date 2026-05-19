"use client";

import Link from "next/link";
import { JSX } from "react";
import { MapPin, Mail, Phone } from "lucide-react";

const portalLinks = [
  { label: "Home", href: "/" },
  { label: "How to Apply", href: "/how-to-apply" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact" },
];

const contactInfo = [
  { label: "Address", value: "NTC Central Office, BIR Road, Diliman, Quezon City", icon: <MapPin className="w-5 h-5 text-gray-400" /> },
  { label: "Email", value: "info@ntc.gov.ph", icon: <Mail className="w-5 h-5 text-gray-400" /> },
  { label: "Phone", value: "(02) 8-924-3775", icon: <Phone className="w-5 h-5 text-gray-400" /> },
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
              Official application portal for internship opportunities or on-the-job training 
              programs at the National Telecommunications Commission of the Philippines.
            </p>
            <p className="text-gray-500 text-xs mt-6">
              © 2026 National Telecommunications Commission - Philippines. All rights reserved.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">QuickLinks</h3>
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
            <h3 className="text-lg font-semibold mb-4">ContactInfo</h3>
            <ul className="space-y-2">
              {contactInfo.map((info) => (
                <li key={info.label} className="flex items-start">
                  <span className="mr-2">{info.icon}</span>
                  <span className="text-gray-400 text-sm">{info.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
