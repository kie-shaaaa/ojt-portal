"use client";

import { useState } from "react";
import Link from "next/link";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
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
} from "lucide-react";

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
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              What We Collect
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            Personal and student details (name, email, school), and documents
            such as CV and endorsement letters.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-blue-600">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Why We Collect It
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            To evaluate your OJT application, communicate status updates, and
            maintain official intern records.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-blue-600">
            <XSquare className="h-5 w-5" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Your Rights
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            You have the right to be informed, track your application, and
            request corrections or data deletion.
          </p>
        </div>
      </div>

      <div className="mb-8 h-px bg-slate-100" />

      <div className="flex flex-col items-center gap-4">
        <p className="text-center text-sm text-slate-500">
          For complete details on our data handling practices, read the full
          policy below.
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
  );
}

export function PrivacyPolicyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">NTC OJT Portal</p>
            <h1 className="text-3xl font-bold text-slate-900">
              Privacy Policy
            </h1>
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

          <PrivacyPolicyModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </main>
  );
}

export default PrivacyPolicyPage;
