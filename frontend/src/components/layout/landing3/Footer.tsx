import React from 'react'
import { MapPin, Phone, Mail, Download } from 'lucide-react'
export function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-300 py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0">
                <div className="w-6 h-6 bg-slate-200 rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-tight">
                  NTC OJT APPLICATION
                </span>
                <span className="text-cyan-400 text-xs font-medium">
                  HR Department
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Official application portal for internship opportunities or
              on-the-job training programs at the National Telecommunications
              Commission of the Philippines.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-cyan-400"></span>Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-cyan-400"></span>FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                  Submit Application
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  NTC Central Office, BIR Road, Diliman, Quezon City,
                  Philippines
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>8-924-3775</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-cyan-400 shrink-0" />
                <a
                  href="mailto:human.resource@ntc.gov.ph"
                  className="hover:text-cyan-400 transition-colors"
                >
                  human.resource@ntc.gov.ph
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold mb-6">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  OJT Requirements
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="text-center md:text-left">
            <p className="mb-1">
              © 2026 National Telecommunications Commission - Philippines. All
              rights reserved.
            </p>
            <p className="italic">
              This is an official OJT application portal of NTC. Unauthorized
              access is prohibited.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Developer
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
