"use client";

import { X, Eye, FileText, Download, Maximize2, Check } from "lucide-react";
import { JSX, memo, useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import { useApplicationFiles } from "@/hooks/useApplicationFiles";

import { useEscapeKey } from "@/hooks/useDismissableEvents";
import { apiCall } from "@/lib/api";
import { RejectionReasons } from "./RejectionReasonsModal";

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
    onPreview,
    onRejectToggle,
    isSelected,
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
    onPreview?: (url: string) => void;
    onRejectToggle?: (file: {
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
    }) => void;
    isSelected?: boolean;
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
      if (onPreview) return onPreview(signedUrl);
      const w = window.open(signedUrl, "_blank");
      if (w)
        try {
          w.opener = null;
        } catch {}
    };

    return (
      <div
        className={`grid w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-2 shadow-sm transition ${
          isSelected
            ? "border border-red-300 bg-red-50 ring-1 ring-red-200"
            : "border border-gray-100 bg-gray-50"
        }`}
      >
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
            onClick={() => onRejectToggle?.(file)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium ring-1 transition ${
              isSelected
                ? "bg-red-600 text-white ring-red-600 hover:bg-red-700"
                : "bg-red-50 text-red-700 ring-red-200 hover:bg-red-100"
            }`}
            title={
              isSelected
                ? "Remove from rejection selection"
                : "Select file for rejection"
            }
          >
            {isSelected ? <Check size={14} /> : <X size={14} />}
            <span className="sr-only">
              {isSelected
                ? "Remove from rejection selection"
                : "Select file for rejection"}
            </span>
          </button>
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

const CompiledFilesModal = memo(
  ({
    files,
    onClose,
    onRejectToggle,
    selectedRejectFileIds,
  }: {
    files: Array<{
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
    onClose: () => void;
    onRejectToggle: (file: {
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
    }) => void;
    selectedRejectFileIds: number[];
  }): JSX.Element => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const animationFrameId = requestAnimationFrame(() => setIsVisible(true));

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }, []);

    useEscapeKey(onClose);

    return (
      <div
        className={`fixed inset-0 z-100000 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-150 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => onClose()}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="compiled-files-title"
          onClick={(e) => e.stopPropagation()}
          className={`flex w-full max-w-4xl max-h-[90vh] flex-col overflow-hidden rounded-xl bg-white shadow-xl transition-[transform,opacity] duration-200 ease-out ${
            isVisible
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-95 translate-y-2 opacity-0"
          }`}
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h1
              id="compiled-files-title"
              className="text-lg font-bold text-blue-800"
            >
              All File Contents
            </h1>

            <button
              type="button"
              aria-label="Close modal"
              className="text-gray-400 transition hover:text-gray-600"
              onClick={() => onClose()}
            >
              <X size={20} />
            </button>
          </header>

          {/* Content - Scrollable container */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {files.length > 0 ? (
              <div className="space-y-6">
                {files.map((file, index) => {
                  const title =
                    file.document_key?.toUpperCase() ||
                    file.file_name.toUpperCase();

                  return (
                    <div
                      key={file.id}
                      className="border-b border-gray-200 pb-6"
                    >
                      {/* File Header */}
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {index + 1}. {title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.file_size)} •{" "}
                            {file.file_extension.toUpperCase()}
                          </p>
                        </div>
                        <div className="flex flex-row gap-3">
                          <button
                            type="button"
                            onClick={() => onRejectToggle(file)}
                            className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium ring-1 transition ${
                              selectedRejectFileIds.includes(file.id)
                                ? "bg-red-600 text-white ring-red-600 hover:bg-red-700"
                                : "bg-red-50 text-red-700 ring-red-200 hover:bg-red-100"
                            }`}
                            title={
                              selectedRejectFileIds.includes(file.id)
                                ? "Remove from rejection selection"
                                : "Select file for rejection"
                            }
                          >
                            {selectedRejectFileIds.includes(file.id) ? (
                              <Check size={14} />
                            ) : (
                              <X size={14} />
                            )}
                            {selectedRejectFileIds.includes(file.id)
                              ? "Selected"
                              : "Reject File"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = file.signedUrl;
                              link.download = file.file_name;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-green-50 px-3 text-xs font-medium text-green-700 ring-1 ring-green-200 transition hover:bg-green-100"
                            title="Download file"
                          >
                            <Download size={14} />
                            Download
                          </button>
                        </div>
                      </div>

                      {/* File Preview */}
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        {file.file_extension.toLowerCase() === "pdf" ? (
                          <div className="flex flex-col gap-3">
                            <embed
                              src={`${file.signedUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                              type="application/pdf"
                              className="h-screen w-full rounded border border-gray-300"
                              title={file.file_name}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                window.open(file.signedUrl, "_blank")
                              }
                              className="mx-auto rounded-md bg-gray-800 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-700"
                            >
                              Open PDF in New Tab
                            </button>
                          </div>
                        ) : ["jpg", "jpeg", "png", "gif", "webp"].includes(
                            file.file_extension.toLowerCase(),
                          ) ? (
                          <img
                            src={file.signedUrl}
                            alt={file.file_name}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="max-h-96 max-w-full rounded"
                          />
                        ) : ["txt", "csv", "json", "xml", "html"].includes(
                            file.file_extension.toLowerCase(),
                          ) ? (
                          <FileTextPreview url={file.signedUrl} />
                        ) : (
                          <div className="flex items-center justify-center py-8 text-center">
                            <div>
                              <FileText className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                              <p className="text-sm text-gray-600">
                                Preview not available for this file type
                              </p>
                              <p className="text-xs text-gray-500">
                                {file.file_extension.toUpperCase()} files cannot
                                be previewed inline
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">No files to display</p>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  },
);

CompiledFilesModal.displayName = "CompiledFilesModal";

const RejectFilesConfirmModal = memo(
  ({
    open,
    files,
    selectedRejectFileIds,
    onToggleFile,
    onClose,
    onConfirm,
    isSubmitting,
  }: {
    open: boolean;
    files: Array<{
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
    selectedRejectFileIds: number[];
    onToggleFile: (file: {
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
    }) => void;
    onClose: () => void;
    onConfirm: () => void;
    isSubmitting: boolean;
  }): JSX.Element | null => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (!open) {
        requestAnimationFrame(() => setIsVisible(false));
        return;
      }

      const animationFrameId = requestAnimationFrame(() => setIsVisible(true));

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }, [open]);

    useEscapeKey(onClose);

    if (!open) return null;

    const selectedFiles = files.filter((file) =>
      selectedRejectFileIds.includes(file.id),
    );

    return (
      <div
        className={`fixed inset-0 z-[100001] flex items-center justify-center bg-black/60 p-4 transition-opacity duration-150 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-files-title"
          onClick={(event) => event.stopPropagation()}
          className={`flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-xl bg-white shadow-xl transition-[transform,opacity] duration-200 ease-out ${
            isVisible
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-95 translate-y-2 opacity-0"
          }`}
        >
          <header className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h1
                id="reject-files-title"
                className="text-lg font-bold text-red-700"
              >
                Confirm File Rejection
              </h1>
              <p className="text-xs text-gray-500">
                The applicant will receive one email listing all selected files.
              </p>
            </div>

            <button
              type="button"
              aria-label="Close rejection confirmation"
              className="text-gray-400 transition hover:text-gray-600"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
              {selectedFiles.length} file
              {selectedFiles.length === 1 ? "" : "s"} selected for rejection.
            </div>

            <div className="space-y-3">
              {files.map((file) => {
                const title =
                  file.document_key?.toUpperCase() ||
                  file.file_name.toUpperCase();
                const selected = selectedRejectFileIds.includes(file.id);

                return (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => onToggleFile(file)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                      selected
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded border text-[11px] font-bold ${
                        selected
                          ? "border-red-600 bg-red-600 text-white"
                          : "border-gray-300 bg-white text-transparent"
                      }`}
                    >
                      <Check size={12} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-gray-900">
                        {title}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {formatFileSize(file.file_size)} •{" "}
                        {file.file_extension.toUpperCase()}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <footer className="flex flex-col gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={selectedFiles.length === 0 || isSubmitting}
              className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Rejecting..."
                : `Reject ${selectedFiles.length} File${selectedFiles.length === 1 ? "" : "s"}`}
            </button>
          </footer>
        </section>
      </div>
    );
  },
);

RejectFilesConfirmModal.displayName = "RejectFilesConfirmModal";

const FileTextPreview = memo(({ url }: { url: string }): JSX.Element => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch file");
        const text = await response.text();
        setContent(text.slice(0, 10000)); // Limit to 10KB for display
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [url]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading content...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">Error: {error}</div>;
  }

  return (
    <pre className="max-h-96 overflow-auto rounded bg-gray-900 p-4 text-xs text-gray-100">
      {content}
    </pre>
  );
});

FileTextPreview.displayName = "FileTextPreview";

export const ApplicationDetails = ({
  application,
  onClose,
}: ApplicationDetailsProps): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCompiledView, setShowCompiledView] = useState(false);
  const [selectedRejectFileIds, setSelectedRejectFileIds] = useState<number[]>(
    [],
  );
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [isRejectingFiles, setIsRejectingFiles] = useState(false);
  const [showRejectionReasons, setShowRejectionReasons] = useState(false);
  const applicationId = (() => {
    if (!application?.id) return undefined;
    const match = application.id.match(/(\d+)$/);
    if (!match) return undefined;

    const parsed = Number(match[1]);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
  })();

  const {
    files,
    loading: filesLoading,
    error: filesError,
  } = useApplicationFiles(applicationId);

  useEffect(() => {
    if (filesError) {
      toast.error(filesError);
    }
  }, [filesError]);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const handlePreviewOpen = useCallback((url: string) => {
    const w = window.open(url, "_blank");
    if (w)
      try {
        w.opener = null;
      } catch {}
    (window as any).__opened_preview_windows = [
      ...(Array.isArray((window as any).__opened_preview_windows)
        ? (window as any).__opened_preview_windows
        : []),
      w,
    ];
  }, []);

  // Close any preview windows opened from this modal when unmounting
  useEffect(() => {
    return () => {
      const arr = (window as any).__opened_preview_windows;
      if (Array.isArray(arr)) {
        arr.forEach((w: Window | null) => {
          try {
            w?.close();
          } catch {}
        });
        (window as any).__opened_preview_windows = [];
      }
    };
  }, []);

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

  const normalizeRequirementKey = (file: (typeof fileUploads)[number]) =>
    file.document_key?.trim().toLowerCase() ||
    file.file_type.trim().toLowerCase();

  const selectedRequirementIds = useMemo(
    () =>
      Array.from(
        new Set(
          selectedRejectFileIds
            .map((fileId) => {
              const file = fileUploads.find((item) => item.id === fileId);
              return file ? normalizeRequirementKey(file) : "";
            })
            .filter(Boolean),
        ),
      ),
    [fileUploads, selectedRejectFileIds],
  );

  const handleToggleRejectFile = useCallback(
    (file: (typeof fileUploads)[number]) => {
      setSelectedRejectFileIds((current) => {
        const isSelected = current.includes(file.id);
        const nextSelection = isSelected
          ? current.filter((id) => id !== file.id)
          : [...current, file.id];

        setShowRejectConfirm(nextSelection.length > 0);
        return nextSelection;
      });
    },
    [],
  );

  const handleConfirmRejectFiles = useCallback(async () => {
    // legacy direct reject (kept for backward compatibility)
    if (selectedRejectFileIds.length === 0) {
      toast.error("Please select at least one file to reject.");
      return;
    }

    try {
      setIsRejectingFiles(true);

      const result = await apiCall("/applications/reject-files", {
        method: "POST",
        body: JSON.stringify({ fileIds: selectedRejectFileIds }),
      });

      if (!result.ok) {
        throw new Error("Rejecting files has failed");
      }

      toast.success(
        selectedRejectFileIds.length === 1
          ? "File rejected successfully."
          : "Files rejected successfully.",
      );
      window.location.reload();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reject files";
      console.error(errorMessage, error);
      toast.error(errorMessage);
    } finally {
      setIsRejectingFiles(false);
    }
  }, [selectedRejectFileIds]);

  const handleOpenRejectionReasons = useCallback(() => {
    if (selectedRejectFileIds.length === 0) {
      toast.error("Please select at least one file to reject.");
      return;
    }

    setShowRejectConfirm(false);
    setShowRejectionReasons(true);
  }, [selectedRejectFileIds]);

  const handleSubmitRejectionReasons = useCallback(
    async (payload: {
      items: Array<{
        id: string;
        title: string;
        reasons: string[];
        comment: string;
      }>;
    }) => {
      if (selectedRejectFileIds.length === 0) {
        toast.error("Please select at least one file to reject.");
        return;
      }

      // Combine reasons/comments into a single string
      const parts: string[] = [];
      for (const item of payload.items) {
        const r = (item.reasons || []).slice();
        const c = (item.comment || "").trim();
        if (r.length > 0 || c) {
          parts.push(`- ${item.title}: ${r.join("; ")}${c ? ` — ${c}` : ""}`);
        }
      }

      const combinedReason = parts.join("\n") || "Rejected by admin";

      try {
        setIsRejectingFiles(true);

        const result = await apiCall("/applications/reject-files", {
          method: "POST",
          body: JSON.stringify({
            fileIds: selectedRejectFileIds,
            rejectionReason: combinedReason,
          }),
        });

        if (!result.ok) throw new Error("Rejecting files has failed");

        toast.success(
          selectedRejectFileIds.length === 1
            ? "File rejected successfully."
            : "Files rejected successfully.",
        );

        setShowRejectionReasons(false);
        setSelectedRejectFileIds([]);
        window.location.reload();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to reject files";
        console.error(message, error);
        toast.error(message);
      } finally {
        setIsRejectingFiles(false);
      }
    },
    [selectedRejectFileIds],
  );

  return (
    <div
      className={`fixed inset-0 z-99999 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-150 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={() => onClose?.()}
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
            onClick={() => onClose?.()}
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
              {fileUploads.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCompiledView(true)}
                  className="inline-flex h-9 w-fit items-center gap-2 rounded-md bg-blue-50 px-4 text-xs font-medium text-blue-700 ring-1 ring-blue-200 transition hover:bg-blue-100"
                  title="View all file contents compiled in one modal"
                >
                  <Maximize2 size={14} />
                  View All Contents
                </button>
              )}

              {filesLoading ? (
                <div className="text-sm text-gray-500">Loading files...</div>
              ) : fileUploads.length > 0 ? (
                fileUploads.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onPreview={handlePreviewOpen}
                    onRejectToggle={handleToggleRejectFile}
                    isSelected={selectedRejectFileIds.includes(file.id)}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500">No files uploaded</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Compiled Files Modal */}
      {showCompiledView && (
        <CompiledFilesModal
          files={fileUploads}
          onClose={() => setShowCompiledView(false)}
          onRejectToggle={handleToggleRejectFile}
          selectedRejectFileIds={selectedRejectFileIds}
        />
      )}

      <RejectFilesConfirmModal
        open={showRejectConfirm}
        files={fileUploads}
        selectedRejectFileIds={selectedRejectFileIds}
        onToggleFile={handleToggleRejectFile}
        onClose={() => {
          setShowRejectConfirm(false);
          setSelectedRejectFileIds([]);
        }}
        onConfirm={handleOpenRejectionReasons}
        isSubmitting={isRejectingFiles}
      />

      {showRejectionReasons && (
        <div
          className={`fixed inset-0 z-[100002] flex items-center justify-center bg-black/60 p-4`}
          onClick={() => setShowRejectionReasons(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <RejectionReasons
              selectedCount={selectedRequirementIds.length}
              selectedRequirementIds={selectedRequirementIds}
              onClose={() => setShowRejectionReasons(false)}
              onBack={() => {
                setShowRejectionReasons(false);
                setShowRejectConfirm(true);
              }}
              onSubmit={handleSubmitRejectionReasons}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetails;
