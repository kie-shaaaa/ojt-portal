"use client";

import { X, Eye, FileText, Download } from "lucide-react";
import { JSX, memo, useEffect, useMemo, useState } from "react";
import { useApplicationFiles } from "@/hooks/useApplicationFiles";

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
    id: number;
    application_id: number;
    file_type: string;
    document_key: string | null;
    file_name: string;
    file_extension: string;
    file_path: string;
    file_size: number;
    uploaded_at: string;
    signedUrl: string;
  }>;
};

interface ApplicationDetailsProps {
  application?: ModalApplicationData | null;
  onClose: () => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const FileCard = memo(
  ({
    file,
  }: {
    file: {
      id: number;
      application_id: number;
      file_type: string;
      document_key: string | null;
      file_name: string;
      file_extension: string;
      file_path: string;
      file_size: number;
      uploaded_at: string;
      signedUrl: string;
    };
  }): JSX.Element => {
    const { file_name, file_size, file_extension, signedUrl, document_key } =
      file;
    const title = document_key?.toUpperCase() || file_name.toUpperCase();

    const handleDownload = () => {
      const link = document.createElement("a");
      link.href = signedUrl;
      link.download = file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const handlePreview = () => {
      window.open(signedUrl, "_blank");
    };

    return (
      <div className="grid w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white ring-1 ring-gray-100">
          <FileText className="h-5 w-5 text-red-500" />
        </div>

        <div className="min-w-0">
          <span className="block wrap-break-word text-sm font-medium uppercase leading-5 text-gray-900">
            {title}
          </span>
          <span className="text-xs text-gray-500">
            {formatFileSize(file_size)} • {file_extension.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2 justify-self-end">
          <button
            type="button"
            onClick={handlePreview}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-white px-3 text-xs font-medium text-blue-700 ring-1 ring-blue-200 transition hover:bg-blue-50"
            title="Preview file"
          >
            <Eye size={14} />
            <span className="sr-only">Preview</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-green-50 px-3 text-xs font-medium text-green-700 ring-1 ring-green-200 transition hover:bg-green-100"
            title="Download file"
          >
            <Download size={14} />
            <span className="sr-only">Download</span>
          </button>
        </div>
      </div>
    );
  },
);

FileCard.displayName = "FileCard";

export const ApplicationDetails = ({
  application,
  onClose,
}: ApplicationDetailsProps): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const applicationId = useMemo(() => {
    if (!application?.id) return undefined;
    const match = application.id.match(/(\d+)$/);
    if (!match) return undefined;

    const parsed = Number(match[1]);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
  }, [application?.id]);

  const { files, loading: filesLoading } = useApplicationFiles(applicationId);

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

  const detailRows: DetailRow[] = useMemo(
    () => [
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
    ],
    [
      application?.applicantEmail,
      application?.applicantName,
      application?.applicantPhone,
      application?.applicationType,
      application?.details,
      application?.id,
      application?.submissionDate,
    ],
  );

  const statusClasses = useMemo(
    () => getStatusClasses(application?.status),
    [application?.status],
  );

  const fileUploads = files.length > 0 ? files : [];

  return (
    <div
      className={`fixed inset-0 z-99999 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-150 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={() => onClose && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-details-title"
        onClick={(e) => e.stopPropagation()}
        className={`flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-xl bg-white shadow-xl transition-[transform,opacity] duration-200 ease-out ${
          isVisible
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-2 opacity-0"
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
            <div key={row.label} className="flex border-b border-gray-100 py-3">
              <div className="w-1/3">
                <dt className="text-sm text-gray-700">{row.label}</dt>
              </div>

              <div className="w-2/3">
                <dd
                  className={`text-sm ${
                    row.bold ? "font-bold text-gray-900" : "text-gray-600"
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
              <dt className="text-sm text-gray-700">Current Status:</dt>
            </div>

            <div className="w-2/3">
              <div
                className={`inline-flex items-center ${statusClasses.wrapper}`}
                aria-label="Current application status"
              >
                <span className={`text-xs font-medium ${statusClasses.text}`}>
                  {application?.status ?? "—"}
                </span>
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="flex py-4">
            <div className="w-1/3">
              <span className="text-sm text-gray-700">File Uploads:</span>
            </div>

            <div className="flex w-2/3 flex-col gap-4">
              {filesLoading ? (
                <div className="text-sm text-gray-500">Loading files...</div>
              ) : fileUploads.length > 0 ? (
                fileUploads.map((file) => (
                  <FileCard key={file.id} file={file} />
                ))
              ) : (
                <div className="text-sm text-gray-500">No files uploaded</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApplicationDetails;
