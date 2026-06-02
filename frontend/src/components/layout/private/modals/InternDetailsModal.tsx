"use client";

import { X, Eye, Download, FileText } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { useApplicationFiles } from "@/hooks/useApplicationFiles";

import { useEscapeKey } from "@/hooks/useDismissableEvents";

export type ModalInternData = {
  applicationId?: number | string;
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

const FileCard = ({
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

  const handleView = () => {
    window.open(signedUrl, "_blank");
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = signedUrl;
    link.download = file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
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
          onClick={handleView}
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
};

type InternDetailsModalProps = {
  onClose?: () => void;
  intern?: ModalInternData | null;
};

export default function InternDetailsModal({
  onClose,
  intern,
}: InternDetailsModalProps): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const preloadedFiles = intern?.fileUploads ?? [];
  const {
    files,
    loading: filesLoading,
    error: filesError,
  } = useApplicationFiles({
    applicationId: intern?.applicationId,
    applicantEmail: intern?.email,
  });

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(() => setIsVisible(true));

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEscapeKey(() => onClose?.());
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
    {
      label: "Deployment Date:",
      value: intern?.deploymentDate ?? "May 11, 2026",
    },
    { label: "End Date:", value: intern?.endDate ?? "May 12, 2026" },
  ];

  const fileUploads = preloadedFiles.length > 0 ? preloadedFiles : files;
  return (
    <div
      className={`fixed inset-0 z-99999 flex items-start justify-center bg-black/50 p-3 transition-opacity duration-200 ease-out sm:items-center sm:p-4 ${
        isVisible ? "opacity-100 backdrop-blur-sm" : "opacity-0 backdrop-blur-0"
      }`}
      onClick={() => onClose?.()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="intern-details-title"
        onClick={(e) => e.stopPropagation()}
        className={`flex w-full max-w-2xl max-h-[calc(100vh-1.5rem)] flex-col overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-200 ease-out sm:max-h-[90vh] ${
          isVisible
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-2 opacity-0"
        }`}
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:items-center sm:px-6 sm:py-4">
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
            onClick={() => onClose?.()}
          >
            <X size={20} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-8 sm:py-4">
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

          {/* Requirement Files */}
          <div className="flex flex-col gap-4 py-4 sm:flex-row">
            <div className="w-1/3">
              <span className="text-sm text-gray-700">File Uploads:</span>
            </div>

            <div className="flex w-full flex-col gap-4 sm:w-2/3">
              {preloadedFiles.length === 0 && filesLoading ? (
                <div className="text-sm text-gray-500">Loading files...</div>
              ) : preloadedFiles.length === 0 && filesError ? (
                <div className="text-sm text-red-600">
                  Failed to load files: {filesError}
                </div>
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
}
