"use client";

import Image from "next/image";
import { JSX } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  PersonalDetailsData,
  OjtInformationData,
  DocumentUploadData,
} from "../layout/apply/formTypes";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  personalDetails: PersonalDetailsData;
  ojtInformation: OjtInformationData;
  uploadedDocuments: DocumentUploadData;
  dataPrivacyAgreed: boolean;
}

const documentLabels: Record<string, string> = {
  "resume-cv": "Resume / CV",
  "picture-1x1": "1x1 Picture",
  "proof-of-enrollment": "Proof of Enrollment",
  "draft-endorsement": "Draft Endorsement Letter",
  "vaccine-card": "Vaccine Card / Medical Cert.",
  "draft-moa": "Draft Memorandum of Agreement",
};

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  personalDetails,
  ojtInformation,
  uploadedDocuments,
  dataPrivacyAgreed,
}: ConfirmationModalProps): JSX.Element | null => {
  if (!isOpen) return null;

  const submittedDocuments = Object.entries(uploadedDocuments)
    .filter(([, file]) => Boolean(file))
    .map(([documentId, file]) => ({
      id: documentId,
      label: documentLabels[documentId] ?? documentId,
      fileName: file?.name ?? "",
    }));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6">
      <div className="relative flex w-full max-w-3xl max-h-[calc(100vh-1.5rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)] sm:rounded-3xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-slate-700"
          aria-label="Close confirmation modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="bg-gradient-to-r from-[#002b80] via-[#0038A8] to-[#1d4ed8] px-4 py-5 text-white sm:px-8 sm:py-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 sm:h-14 sm:w-14">
              <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-100 sm:text-xs">
                Final Review
              </p>
              <h2 className="mt-1 text-xl font-bold sm:text-2xl lg:text-3xl">
                Confirm your application details
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-50/90 sm:text-base">
                Review the information below before we send your application.
                You can still go back and edit if something needs to change.
              </p>
            </div>
          </div>
        </div>

        <div className="grid flex-1 gap-4 overflow-y-auto bg-slate-50/60 p-3 sm:p-6 lg:grid-cols-2 lg:p-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0038A8] ring-1 ring-blue-100">
                <Image
                  src="/ntc-logo.png"
                  alt="National Telecommunications Commission logo"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Personal Details
                </h3>
                <p className="text-sm text-slate-500">Applicant identity</p>
              </div>
            </div>

            <dl className="space-y-3 text-sm">
              <Row label="First Name" value={personalDetails.firstName} />
              <Row label="Last Name" value={personalDetails.lastName} />
              <Row label="Email" value={personalDetails.email} />
              <Row label="Phone" value={personalDetails.phone} />
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0038A8] ring-1 ring-blue-100">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  OJT Information
                </h3>
                <p className="text-sm text-slate-500">School and placement</p>
              </div>
            </div>

            <dl className="space-y-3 text-sm">
              <Row label="School" value={ojtInformation.school} />
              <Row label="Course" value={ojtInformation.course} />
              <Row label="Hours to Render" value={ojtInformation.hours} />
              <Row
                label="Deployment Date"
                value={ojtInformation.deploymentDate}
              />
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Uploaded Documents
                </h3>
                <p className="text-sm text-slate-500">
                  Files that will be sent with this application
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {submittedDocuments.map((document) => (
                <div
                  key={document.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {document.label}
                  </p>
                  <p className="mt-1 break-all text-sm font-medium text-slate-900">
                    {document.fileName}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Data Privacy
              </div>
              <p className="mt-2 leading-6">
                {dataPrivacyAgreed
                  ? "You have agreed to the data privacy terms and consent statements."
                  : "Data privacy consent has not been confirmed."}
              </p>
            </div>
          </section>
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-end sm:px-8 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back and edit
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0038A8] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:bg-[#002d87] sm:w-auto"
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirm submission
          </button>
        </div>
      </div>
    </div>
  );
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-medium text-slate-900">
        {value || "—"}
      </dd>
    </div>
  );
}

export default ConfirmationModal;
