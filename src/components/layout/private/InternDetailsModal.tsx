"use client";

import {
  X,
  Eye,
  Download,
  FileText,
} from "lucide-react";
import { JSX, useEffect, useState } from "react";

export type ModalInternData = {
  ojtId: string;
  portalId?: string;
  name: string;
  gender?: string;
  email?: string;
  phone?: string;
  school?: string;
  course?: string;
  hoursNeeded?: string;
  deploymentDate?: string;
  endDate?: string;
  requirementFiles?: Array<{
    id?: string;
    title: string;
    subtitle?: string;
    fileType?: "PDF" | "JPG/PNG" | string;
  }>;
};

type DetailRow = {
  label: string;
  value: string;
  bold?: boolean;
};

const FileCard = ({ file }: { file: { id?: string; title: string; subtitle?: string; fileType?: string } }): JSX.Element => {
  const { title, fileType } = file;

  const handleView = () => {
    const content = `Preview of ${title}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const handleDownload = () => {
    const content = `Downloaded file: ${title}`;
    const ext = (fileType || "txt").toLowerCase().includes("pdf") ? "pdf" : (fileType || "txt");
    const blob = new Blob([content], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_").toLowerCase()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  return (
    <div className="grid w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white ring-1 ring-gray-100">
        <FileText className="h-5 w-5 text-red-500" />
      </div>

      <div className="min-w-0">
        <span className="block break-words text-sm font-medium uppercase leading-5 text-gray-900">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-2 justify-self-end">
        <button
          type="button"
          onClick={handleView}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-white px-3 text-xs font-medium text-blue-700 ring-1 ring-blue-200 transition hover:bg-blue-50"
        >
          <Eye size={14} />
          <span className="sr-only">View</span>
          <span className="ml-2 text-xs">View</span>
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#0038a8] px-3 text-xs font-medium text-white transition hover:bg-[#002f8c]"
        >
          <Download size={14} />
          <span className="sr-only">Download</span>
          <span className="ml-2 text-xs">Download</span>
        </button>
      </div>
    </div>
  );
};

type InternDetailsModalProps = {
  onClose?: () => void;
  intern?: ModalInternData | null;
};

export default function InternDetailsModal({ onClose, intern }: InternDetailsModalProps): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose && onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  const detailRows: DetailRow[] = [
    { label: "Portal ID:", value: intern?.portalId ?? "OJT-000001" },
    { label: "OJT ID:", value: intern?.ojtId ?? "2026-001", bold: true },
    { label: "Name:", value: intern?.name ?? "Kie Villanueva" },
    { label: "Gender:", value: intern?.gender ?? "Female" },
    { label: "Email:", value: intern?.email ?? "kkkk@gmail.com" },
    { label: "Phone:", value: intern?.phone ?? "9627067133" },
    { label: "School:", value: intern?.school ?? "Adamson University" },
    { label: "Course:", value: intern?.course ?? "BA in Anthropology" },
    { label: "Hours Needed:", value: intern?.hoursNeeded ?? "21 hours" },
    { label: "Deployment Date:", value: intern?.deploymentDate ?? "May 11, 2026" },
    { label: "End Date:", value: intern?.endDate ?? "May 12, 2026" },
  ];

  const requirementFiles = intern?.requirementFiles ?? [
    { id: "resume-or-cv", title: "RESUME OR CV", fileType: "PDF" },
    { id: "proof-of-enrollment", title: "PROOF OF ENROLLMENT", fileType: "PDF" },
    { id: "draft-endorsement-letter", title: "DRAFT ENDORSEMENT LETTER", fileType: "PDF" },
    { id: "vaccine-card-or-medical-cert", title: "VACCINE CARD OR MEDICAL CERT", fileType: "PDF" },
    { id: "draft-memorandum-of-agreement", title: "DRAFT MEMORANDUM OF AGREEMENT", fileType: "PDF" },
    { id: "1x1-picture", title: "1X1 PICTURE", fileType: "JPG/PNG" },
  ];
  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 transition-opacity duration-200 ease-out ${
        isVisible ? "opacity-100 backdrop-blur-sm" : "opacity-0 backdrop-blur-0"
      }`}
      onClick={() => onClose && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="intern-details-title"
        onClick={(e) => e.stopPropagation()}
        className={`flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-200 ease-out ${
          isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-2 opacity-0"
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h1
            id="intern-details-title"
            className="text-lg font-bold text-blue-800"
          >
            Intern Details
          </h1>

          <button
            type="button"
            aria-label="Close modal"
            className="text-gray-400 transition hover:text-gray-600"
            onClick={() => onClose && onClose()}
          >
            <X size={20} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-4">
          {/* Details */}
          {detailRows.map((row) => (
            <div
              key={row.label}
              className="flex border-b border-gray-100 py-3"
            >
              <div className="w-1/3">
                <dt className="text-sm text-gray-700">
                  {row.label}
                </dt>
              </div>

              <div className="w-2/3">
                <dd
                  className={`text-sm ${
                    row.bold
                      ? "font-bold text-gray-900"
                      : "text-gray-600"
                  }`}
                >
                  {row.value}
                </dd>
              </div>
            </div>
          ))}

          {/* Requirement Files */}
          <div className="flex py-4">
            <div className="w-1/3">
              <span className="text-sm text-gray-700">
                Requirement File/s:
              </span>
            </div>

            <div className="flex w-2/3 flex-col gap-4">
              {requirementFiles.map((file) => (
                <FileCard
                  key={file.id ?? file.title}
                  file={file}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}