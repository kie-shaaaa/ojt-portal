"use client";

import {
  type ChangeEvent,
  type JSX,
  useId,
  useState,
} from "react";

import {
  FileText,
  CheckCircle,
  UploadCloud,
  Image as LucideImage,
  Download,
  Info,
  Clipboard,
} from "lucide-react";

type DocumentCard = {
  id: string;
  title: string;
  optional?: boolean;
  required?: boolean;
  helperText: string;
  icon: JSX.Element;
  fileIcon: JSX.Element;
  defaultFileName: string;
  accept: string;
  maxSizeInBytes: number;
  status: "verified" | "empty" | "rejected";
  borderClassName: string;
  iconWrapperClassName: string;
  badgeIcon?: JSX.Element;
  errorMessage?: string;
};

const initialDocuments: DocumentCard[] = [
  {
    id: "resume-cv",
    title: "1. Resume / CV",
    required: true,
    helperText: "PDF only • Max 5 MB",
    icon: <FileText className="w-5 h-5 text-gray-600" />,
    fileIcon: <UploadCloud className="w-4 h-4 text-blue-600" />,
    defaultFileName: "Resume_Final.pdf",
    accept: ".pdf,application/pdf",
    maxSizeInBytes: 5 * 1024 * 1024,
    status: "verified",
    borderClassName: "border-green-500",
    iconWrapperClassName:
      "flex w-10 h-10 items-center justify-center bg-gray-50 rounded-lg shadow-sm",
    badgeIcon: <CheckCircle className="w-4 h-4 text-green-500" />,
  },
  {
    id: "proof-of-enrollment",
    title: "2. Proof of Enrollment",
    optional: true,
    helperText: "PDF only • Max 5 MB",
    icon: <FileText className="w-5 h-5 text-gray-600" />,
    fileIcon: <UploadCloud className="w-4 h-4 text-blue-600" />,
    defaultFileName: "Registration_Form.pdf",
    accept: ".pdf,application/pdf",
    maxSizeInBytes: 5 * 1024 * 1024,
    status: "verified",
    borderClassName: "border-green-500",
    iconWrapperClassName:
      "flex w-10 h-10 items-center justify-center bg-gray-50 rounded-lg shadow-sm",
    badgeIcon: <CheckCircle className="w-4 h-4 text-green-500" />,
  },
  {
    id: "draft-endorsement-letter",
    title: "3. Draft Endorsement Letter",
    optional: true,
    helperText: "Addressed to CHIEF, FLORA R. RALAR • PDF • Max 5 MB",
    icon: <FileText className="w-5 h-5 text-gray-600" />,
    fileIcon: <UploadCloud className="w-4 h-4 text-blue-600" />,
    defaultFileName: "Draft_Endorsement.pdf",
    accept: ".pdf,application/pdf",
    maxSizeInBytes: 5 * 1024 * 1024,
    status: "verified",
    borderClassName: "border-green-500",
    iconWrapperClassName:
      "flex w-10 h-10 items-center justify-center bg-gray-50 rounded-lg shadow-sm",
    badgeIcon: <CheckCircle className="w-4 h-4 text-green-500" />,
  },
  {
    id: "vaccine-card",
    title: "4. Vaccine Card / Medical Cert.",
    optional: true,
    helperText: "Xerox copy • PDF • Max 5 MB",
    icon: <FileText className="w-5 h-5 text-gray-600" />,
    fileIcon: <UploadCloud className="w-4 h-4 text-blue-600" />,
    defaultFileName: "No file chosen",
    accept: ".pdf,application/pdf",
    maxSizeInBytes: 5 * 1024 * 1024,
    status: "empty",
    borderClassName: "border-blue-200",
    iconWrapperClassName:
      "flex w-10 h-10 items-center justify-center bg-gray-50 rounded-lg border border-blue-100 shadow-sm",
  },
  {
    id: "draft-moa",
    title: "5. Draft Memorandum of Agreement",
    optional: true,
    helperText: "PDF only • Max 5 MB",
    icon: <FileText className="w-5 h-5 text-gray-600" />,
    fileIcon: <UploadCloud className="w-4 h-4 text-blue-600" />,
    defaultFileName: "No file chosen",
    accept: ".pdf,application/pdf",
    maxSizeInBytes: 5 * 1024 * 1024,
    status: "empty",
    borderClassName: "border-blue-200",
    iconWrapperClassName:
      "flex w-10 h-10 items-center justify-center bg-gray-50 rounded-lg border border-blue-100 shadow-sm",
  },
  {
    id: "picture-1x1",
    title: "6. 1x1 Picture",
    required: true,
    helperText: "JPG / PNG only • Square (1:1) • Max 2 MB",
    icon: <LucideImage className="w-5 h-5 text-gray-600" />,
    fileIcon: <UploadCloud className="w-4 h-4 text-blue-600" />,
    defaultFileName: "No file chosen",
    accept: ".jpg,.jpeg,.png,image/jpeg,image/png",
    maxSizeInBytes: 2 * 1024 * 1024,
    status: "rejected",
    borderClassName: "border-red-200",
    iconWrapperClassName:
      "flex w-10 h-10 items-center justify-center bg-white rounded-lg border border-red-100 shadow-sm",
    errorMessage: "This document was rejected. Please upload a clear copy.",
  },
];

type FileState = {
  fileName: string;
  status: DocumentCard["status"];
  errorMessage?: string;
};

const getFileValidationError = (
  file: File,
  accept: string,
  maxSizeInBytes: number,
) => {
  const acceptedTypes = accept
    .split(",")
    .map((item) => item.trim().toLowerCase());

  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  const matchesAccept = acceptedTypes.some((type) => {
    if (type.startsWith(".")) {
      return fileName.endsWith(type);
    }

    if (type.endsWith("/*")) {
      const prefix = type.replace("/*", "/");
      return mimeType.startsWith(prefix);
    }

    return mimeType === type;
  });

  if (!matchesAccept) {
    return "Invalid file type selected.";
  }

  if (file.size > maxSizeInBytes) {
    return "File exceeds the maximum allowed size.";
  }

  return "";
};

export const RequiredDocumentsUploadSection = (): JSX.Element => {
  const sectionTitleId = useId();

  const [files, setFiles] = useState<Record<string, FileState>>(
    Object.fromEntries(
      initialDocuments.map((document) => [
        document.id,
        {
          fileName: document.defaultFileName,
          status: document.status,
          errorMessage: document.errorMessage,
        },
      ]),
    ),
  );

  const handleFileChange =
    (document: DocumentCard) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];

      if (!selectedFile) {
        return;
      }

      const validationError = getFileValidationError(
        selectedFile,
        document.accept,
        document.maxSizeInBytes,
      );

      if (validationError) {
        setFiles((current) => ({
          ...current,
          [document.id]: {
            fileName: selectedFile.name,
            status: "rejected",
            errorMessage: validationError,
          },
        }));

        return;
      }

      setFiles((current) => ({
        ...current,
        [document.id]: {
          fileName: selectedFile.name,
          status: "verified",
          errorMessage: undefined,
        },
      }));
    };

  return (
    <section
      aria-labelledby={sectionTitleId}
      className="w-full max-w-5xl mx-auto flex flex-col gap-6 px-4 sm:px-6 py-10"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Info className="w-5 h-5 text-blue-600" />

        <h2
          id={sectionTitleId}
          className="text-lg sm:text-xl font-bold tracking-wide text-[#0038a8]"
        >
          REQUIRED DOCUMENTS FOR RESUBMISSION
        </h2>
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
        <Clipboard className="w-5 h-5 text-gray-600 mt-1 shrink-0" />

        <div className="flex-1">
          <p className="text-sm leading-6 text-gray-700">
            Upload all required documents below. Each PDF must be under{" "}
            <span className="font-bold">5 MB</span>; the 1x1 picture must be{" "}
            <span className="font-bold">JPG/PNG, square, and under 2 MB.</span>
          </p>

          <a
            href="#"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Requirements Guide
          </a>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {initialDocuments.map((document) => {
          const fileState = files[document.id];

          const isRejected = fileState.status === "rejected";
          const isVerified = fileState.status === "verified";

          return (
            <div
              key={document.id}
              className={`relative w-full min-h-[220px] flex flex-col gap-3 p-5 bg-white rounded-2xl border-2 border-dashed transition-all duration-200 shadow-sm hover:shadow-md ${
                isRejected
                  ? "border-red-200"
                  : isVerified
                  ? "border-green-500"
                  : document.borderClassName
              }`}
            >
              {/* Verified Badge */}
              {isVerified && document.badgeIcon && (
                <div className="absolute top-4 right-4">
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 rounded-full">
                    {document.badgeIcon}

                    <span className="text-xs font-medium text-emerald-800">
                      Verified
                    </span>
                  </div>
                </div>
              )}

              {/* Icon */}
              <div
                className={
                  isRejected
                    ? "flex w-10 h-10 items-center justify-center bg-white rounded-lg border border-red-100 shadow-sm"
                    : document.iconWrapperClassName
                }
              >
                {document.icon}
              </div>

              {/* Title */}
              <div>
                <p className="text-sm leading-5">
                  <span className="font-bold text-gray-800">
                    {document.title}
                  </span>

                  {document.required ? (
                    <span className="text-red-500 ml-1">*</span>
                  ) : (
                    <span className="text-gray-400 ml-1">(optional)</span>
                  )}
                </p>
              </div>

              {/* Helper */}
              <p className="text-xs text-gray-400 leading-5">
                {document.helperText}
              </p>

              {/* File Upload */}
              <div className="mt-auto flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {document.fileIcon}

                  <label
                    htmlFor={document.id}
                    className="text-sm font-semibold text-blue-600 cursor-pointer hover:text-blue-700 break-all"
                  >
                    {fileState.fileName}
                  </label>
                </div>

                {isRejected && fileState.errorMessage && (
                  <p
                    id={`${document.id}-error`}
                    className="text-xs font-medium text-red-500"
                  >
                    {fileState.errorMessage}
                  </p>
                )}
              </div>

              {/* Hidden Input */}
              <input
                id={document.id}
                name={document.id}
                type="file"
                accept={document.accept}
                onChange={handleFileChange(document)}
                className="sr-only"
                aria-label={document.title}
                aria-invalid={isRejected}
                aria-describedby={
                  isRejected ? `${document.id}-error` : undefined
                }
              />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-3 px-8 py-3 bg-[#0038a8] hover:bg-[#002d87] text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span className="font-semibold text-sm">Submit</span>

          <UploadCloud className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};