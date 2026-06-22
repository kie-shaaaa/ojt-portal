"use client"

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  UserSearch,
  ShieldCheck,
  Shield,
  UserCog,
  Info,
  Target,
  FileEdit,
  XSquare,
  CheckCircle2,
  AlertCircle,
  FileText,
  GraduationCap,
  ChevronDown,
} from 'lucide-react'

function PrivacySummaryCard({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-lg bg-blue-900 p-2 text-white">
          <Info className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-blue-900">Privacy Summary</h2>
      </div>

      <div className="mb-8 grid gap-8 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-blue-600">
            <FileText className="h-5 w-5" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">What We Collect</h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            Personal and student details (name, email, school), and documents such as CV and endorsement letters.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-blue-600">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Why We Collect It</h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            To evaluate your OJT application, communicate status updates, and maintain official intern records.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-blue-600">
            <XSquare className="h-5 w-5" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Your Rights</h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            You have the right to be informed, track your application, and request corrections or data deletion.
          </p>
        </div>
      </div>

      <div className="mb-8 h-px bg-slate-100" />

      <div className="flex flex-col items-center gap-4">
        <p className="text-center text-sm text-slate-500">
          For complete details on our data handling practices, read the full policy below.
        </p>
        <button
          type="button"
          onClick={onOpenModal}
          className="flex items-center gap-2 rounded-lg bg-blue-900 px-6 py-2.5 font-medium text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
        >
          See Full Policy Details
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function PrivacyPolicyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">NTC OJT Portal</p>
            <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back to Home
          </Link>
        </div>

        <div className="space-y-8">
          <PrivacySummaryCard onOpenModal={() => setIsModalOpen(true)} />

          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
              >
                <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="privacy-modal-title"
                    initial={{ opacity: 0, scale: 0.95, y: 18 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 18 }}
                    transition={{ duration: 0.2 }}
                    className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                      <h2 id="privacy-modal-title" className="text-xl font-semibold text-slate-900">
                        Privacy Policy
                      </h2>
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Close privacy policy"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="max-h-[78vh] overflow-y-auto p-6 sm:p-8 bg-white">
                      <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                        <p className="mb-4 leading-relaxed text-slate-600">
                          The National Telecommunications Commission (NTC) is committed to protecting the privacy and security of all personal and sensitive information collected through the{' '}
                          <strong className="font-semibold text-slate-900">NTC OJT Application Website</strong>
                          . In accordance with Republic Act No. 10173, otherwise known as the{' '}
                          <strong className="font-semibold text-slate-900">Data Privacy Act of 2012</strong>
                          , NTC shall ensure that all personal and sensitive data collected are processed fairly, lawfully, and securely.
                        </p>
                        <p className="leading-relaxed text-slate-600">
                          NTC recognizes its responsibility to protect the fundamental human right to privacy while ensuring access of information for legitimate and lawful purposes.
                        </p>
                      </section>

                      <section className="mt-12">
                        <div className="mb-6 flex items-center gap-3">
                          <div className="rounded-lg bg-blue-50 p-2 text-blue-800">
                            <UserSearch className="h-6 w-6" />
                          </div>
                          <h3 className="text-2xl font-bold text-blue-900">Collection of Personal Information</h3>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                            <h4 className="mb-6 font-semibold text-slate-900">A. For OJT Applicants</h4>
                            <div className="space-y-6">
                              <div>
                                <h5 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Personal Information</h5>
                                <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-sm text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-blue-600" />Full Name</li>
                                  <li className="flex items-center gap-2 text-sm text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-blue-600" />Email Address</li>
                                  <li className="flex items-center gap-2 text-sm text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-blue-600" />Phone Number</li>
                                </ul>
                              </div>
                              <div className="h-px bg-slate-100" />
                              <div>
                                <h5 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Student Information</h5>
                                <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-sm text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-blue-600" />Name of School</li>
                                  <li className="flex items-center gap-2 text-sm text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-blue-600" />Course or Program</li>
                                  <li className="flex items-center gap-2 text-sm text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-blue-600" />Required OJT Hours</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                              <h5 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Submitted Documents</h5>
                              <ul className="space-y-3">
                                <li className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700"><FileText className="h-4 w-4 text-blue-600" />Resume or CV</li>
                                <li className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700"><GraduationCap className="h-4 w-4 text-blue-600" />Proof of Enrollment</li>
                                <li className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700"><FileText className="h-4 w-4 text-blue-600" />Endorsement Letter</li>
                              </ul>
                            </div>
                            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                              <h4 className="mb-3 font-semibold text-slate-900">B. For Inquiries</h4>
                              <p className="text-sm leading-relaxed text-slate-600">Email, phone number, and specific inquiry details are collected to facilitate communication.</p>
                            </div>
                          </div>
                        </div>
                      </section>

                      <div className="mt-12 h-px bg-slate-100" />

                      <section className="mt-12">
                        <div className="mb-6 flex items-center gap-3">
                          <div className="rounded-lg bg-blue-50 p-2 text-blue-800">
                            <ShieldCheck className="h-6 w-6" />
                          </div>
                          <h3 className="text-2xl font-bold text-blue-900">Purpose of Collection and Use</h3>
                        </div>
                        <div className="space-y-6 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                          <p className="text-slate-600">Personal information is used solely for processing and evaluating OJT applications and managing related administrative workflows.</p>
                          <ul className="space-y-4">
                            <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" /><span className="text-slate-700">Communicating with applicants regarding the status of their submissions.</span></li>
                            <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" /><span className="text-slate-700">Maintaining records required for the official NTC OJT program.</span></li>
                            <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" /><span className="text-slate-700">Responding to legitimate inquiries, concerns, and requests.</span></li>
                          </ul>
                          <div className="flex items-start gap-3 rounded-r-lg border-l-4 border-red-500 bg-red-50 p-4">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                            <p className="text-sm text-red-900">The information collected shall <strong className="font-bold">NOT</strong> be used for marketing, commercial, or unauthorized purposes.</p>
                          </div>
                        </div>
                      </section>

                      <section className="mt-12">
                        <div className="mb-6 flex items-center gap-3">
                          <div className="rounded-lg bg-blue-50 p-2 text-blue-800">
                            <Shield className="h-6 w-6" />
                          </div>
                          <h3 className="text-2xl font-bold text-blue-900">Protection Measures</h3>
                        </div>
                        <div className="space-y-6">
                          <p className="leading-relaxed text-slate-600">NTC implements robust organizational, physical, and technical security measures to safeguard data against unauthorized access or destruction.</p>
                          <p className="leading-relaxed text-slate-600">Access is restricted to authorized personnel and system administrators. All data is stored in secure, encrypted server environments following government cybersecurity standards.</p>
                          <div className="grid gap-6 pt-4 md:grid-cols-2">
                            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6"><h4 className="mb-3 font-semibold text-blue-900">Retention of Data</h4><p className="text-sm leading-relaxed text-blue-800/80">Personal information is retained only as long as necessary for the fulfillment of stated purposes and as mandated by government records management policies.</p></div>
                            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6"><h4 className="mb-3 font-semibold text-blue-900">Links to Other Websites</h4><p className="text-sm leading-relaxed text-blue-800/80">This policy applies only to the NTC OJT portal. We currently do not provide links to external websites that fall outside this jurisdiction.</p></div>
                          </div>
                        </div>
                      </section>

                      <div className="mt-12 h-px bg-slate-100" />

                      <section className="mt-12">
                        <div className="mb-6 flex items-center gap-3">
                          <div className="rounded-lg bg-blue-50 p-2 text-blue-800">
                            <UserCog className="h-6 w-6" />
                          </div>
                          <h3 className="text-2xl font-bold text-blue-900">Data Subject Rights</h3>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><Info className="h-5 w-5 text-blue-600" /><span className="text-sm font-medium text-slate-700">Right to be informed</span></div>
                          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><Target className="h-5 w-5 text-blue-600" /><span className="text-sm font-medium text-slate-700">Right to track application</span></div>
                          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><FileEdit className="h-5 w-5 text-blue-600" /><span className="text-sm font-medium text-slate-700">Right to resubmit corrections</span></div>
                          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><XSquare className="h-5 w-5 text-blue-600" /><span className="text-sm font-medium text-slate-700">Right to request deletion</span></div>
                        </div>
                      </section>

                      <div className="pt-8 text-center">
                        <p className="flex items-center justify-center gap-2 text-sm text-slate-400"><Info className="h-4 w-4" />Last updated: June 2026</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}

export default PrivacyPolicyPage
