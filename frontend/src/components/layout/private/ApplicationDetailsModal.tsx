"use client";

import {
  X,
  Eye,
  FileText,
} from "lucide-react";
import { JSX, useEffect, useState } from "react";

type DetailRow = {
  label: string;
  value: string;
  bold?: boolean;
};

export type ModalApplicationData = {
  id?: string;
  applicantName?: string;
  applicantEmail?: string;
  applicantPhone?: string;
  applicationType?: string[];
  details?: string[];
  submissionDate?: string[];
  status?: string;
  fileUploads?: Array<{
    id?: string;
    title: string;
    fileType?: "PDF" | "JPG/PNG" | string;
  }>;
};

interface ApplicationDetailsProps {
  application?: ModalApplicationData | null;
  onClose: () => void;
}

const FileCard = ({ file }: { file: { id?: string; title: string; fileType?: string } }): JSX.Element => {
  const { title } = file;

  const handleView = () => {
    const content = `Preview of ${title}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const handleReject = () => {
    alert(`Rejected file upload: ${title}`);
    // Rejection logic can be added here (e.g., update status, trigger callback)
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
          onClick={handleReject}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-red-50 px-3 text-xs font-medium text-red-700 ring-1 ring-red-200 transition hover:bg-red-100"
        >
          <X size={14} />
          <span className="sr-only">Reject</span>
          <span className="ml-2 text-xs">Reject</span>
        </button>
      </div>
    </div>
  );
};

export const ApplicationDetails = ({
  application,
  onClose,
}: ApplicationDetailsProps): JSX.Element => {
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

  const getStatusClasses = (status?: string) => {
    const s = status?.toLowerCase() ?? "";

    if (s.includes("pending")) {
      return {
        wrapper: "rounded-full bg-amber-100 px-3 py-1",
        text: "text-amber-700",
      };
    }

    if (
      s.includes("under review") ||
      (s.includes("review") && !s.includes("pending"))
    ) {
      return {
        wrapper: "rounded-full bg-sky-100 px-3 py-1",
        text: "text-sky-600",
      };
    }

    if (s.includes("interview")) {
      return {
        wrapper: "rounded-full bg-purple-100 px-3 py-1",
        text: "text-purple-600",
      };
    }

    if (s.includes("accept")) {
      return {
        wrapper: "rounded-full bg-green-100 px-3 py-1",
        text: "text-green-600",
      };
    }

    if (s.includes("reject")) {
      return {
        wrapper: "rounded-full bg-red-100 px-3 py-1",
        text: "text-red-600",
      };
    }

    return {
      wrapper: "rounded-full bg-slate-100 px-3 py-1",
      text: "text-slate-700",
    };
  };

  const detailRows: DetailRow[] = [
    { label: "Application ID:", value: application?.id ?? "—" },
    { label: "Applicant Name:", value: application?.applicantName ?? "—" },
    { label: "Email:", value: application?.applicantEmail ?? "—" },
    { label: "Phone:", value: application?.applicantPhone ?? "—" },
    {
      label: "Application Type:",
      value: application?.applicationType?.join(" ") ?? "—",
    },
    {
      label: "Submission Date:",
      value: application?.submissionDate?.join(" ") ?? "—",
    },
    {
      label: "School Name:",
      value: application?.details?.[0] ?? "—",
    },
    { label: "Course/Program:", value: application?.details?.[1] ?? "—" },
    { label: "Hours Required:", value: application?.details?.[2] ?? "—" },
    {
      label: "Deployment Date:",
      value: application?.details?.[3] ?? "—",
    },
  ];

  const fileUploads = application?.fileUploads ?? [
    { id: "resume-or-cv", title: "RESUME OR CV", fileType: "PDF" },
    { id: "proof-of-enrollment", title: "PROOF OF ENROLLMENT", fileType: "PDF" },
    { id: "endorsement-letter", title: "ENDORSEMENT LETTER", fileType: "PDF" },
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
        aria-labelledby="application-details-title"
        onClick={(e) => e.stopPropagation()}
        className={`flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-200 ease-out ${
          isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-2 opacity-0"
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h1
            id="application-details-title"
            className="text-lg font-bold text-blue-800"
          >
            Application Details
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

          {/* Current Status */}
          <div className="flex border-b border-gray-100 py-3">
            <div className="w-1/3">
              <dt className="text-sm text-gray-700">
                Current Status:
              </dt>
            </div>

            <div className="w-2/3">
              <div
                className={`inline-flex items-center ${getStatusClasses(application?.status).wrapper}`}
                aria-label="Current application status"
              >
                <span
                  className={`text-xs font-medium ${getStatusClasses(application?.status).text}`}
                >
                  {application?.status ?? "—"}
                </span>
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="flex py-4">
            <div className="w-1/3">
              <span className="text-sm text-gray-700">
                File Uploads:
              </span>
            </div>

            <div className="flex w-2/3 flex-col gap-4">
              {fileUploads.map((file) => (
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
};

export default ApplicationDetails;
