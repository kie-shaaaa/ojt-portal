"use client";

import { JSX, useState } from "react";
import { MapPin, Mail, Phone, Clock, Send } from "lucide-react";

type FormData = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

const contactDetails = [
  { title: "Address", content: "NTC Building, BIR Road, East Triangle, Diliman, Quezon City", icon: MapPin },
  { title: "Email", content: "human.resource@ntc.gov.ph", icon: Mail },
  { title: "Phone", content: "8-924-3775", icon: Phone },
  { title: "Office Hours", content: "Mon-Thurs: 8:00 AM - 5:00 PM", icon: Clock },
];

const subjectOptions = [
  "Application Inquiry",
  "Internship Inquiry",
  "Technical Support",
  "General Inquiry",
  "Other",
];

export const ContactFormSection = (): JSX.Element => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    subject: "Application Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ fullName: "", email: "", subject: "Application Inquiry", message: "" });
  };

  return (
    <section id="contact-section" className="w-full py-20 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Have questions about the application or requirements? Reach out to our HR department.
            </p>
            <div className="space-y-6">
              {contactDetails.map((detail) => {
                const Icon = detail.icon;
                return (
                  <div key={detail.title} className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{detail.title}</h3>
                      <p className="text-gray-600 text-sm">{detail.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 h-64 bg-gray-200 rounded-2xl overflow-hidden">
              <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                <p className="text-gray-500">Map Placeholder</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Juan Dela Cruz"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="juan@university.edu"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {subjectOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};