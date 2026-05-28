"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { JSX, useMemo, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { useSearchParams } from "next/navigation";

import { apiCall } from "@/lib/api";

import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import ApplicationDetails from "../modals/ApplicationDetailsModal";
import ChangeStatusModal from "../modals/ChangeStatusModal";
import { useVirtualizedRows } from "@/hooks/useVirtualizedRows";

type ApplicationRow = {
  applicationId: string;
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicationType: string[];
  details: string[];
  submissionDate: string[];
  status: string;
};

type Application = {
  id: number;

  first_name: string;
  last_name: string;

  email: string;
  phone: string;

  application_type: string;

  school_name: string | null;
  course: string | null;
  hours_needed: number | null;

  deployment_date: string | null;
  submission_date: string;

  status: string;
};

type ApplicationFile = {
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

type Props = {
  applications: Application[];
  isLoading: boolean;
  onDeleteApplication: (applicationId: number) => void;
  onStatusChange: (applicationId: number, status: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
};

const columns = [
  "",
  "ID",
  "APPLICANT",
  "APPLICATION TYPE",
  "SUBMISSION DATE",
  "STATUS",
  "ACTIONS",
];

const formatStatus = (status: string) => {
  const s = status.toLowerCase();

  if (s === "pending") return "Pending";
  if (s === "under_review") return "Under Review";
  if (s === "for_interview") return "For Interview";
  if (s === "accepted") return "Accepted";
  if (s === "pending accept") return "Pending Accept";
  if (s === "rejected") return "Rejected";

  return status;
};

const getStatusStyles = (status: string) => {
  const s = status.toLowerCase();

  if (s.includes("pending")) {
    return "bg-amber-50 text-amber-700 border-amber-100";
  }

  if (s.includes("review")) {
    return "bg-sky-50 text-sky-700 border-sky-100";
  }

  if (s.includes("interview")) {
    return "bg-purple-50 text-purple-700 border-purple-100";
  }

  if (s.includes("accept")) {
    return "bg-green-50 text-green-700 border-green-100";
  }

  if (s.includes("reject")) {
    return "bg-red-50 text-red-700 border-red-100";
  }

  return "bg-slate-50 text-slate-700 border-slate-100";
};

const sanitizeApplicantName = (name: string) => {
  return (
    name
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^A-Za-z0-9_]/g, "")
      .replace(/^_+|_+$/g, "")
      .replace(/__+/g, "_") || "applicant"
  );
};

const isPdfMagic = (buffer: ArrayBuffer) => {
  const header = new Uint8Array(buffer.slice(0, 5));
  const text = String.fromCharCode(...header);
  return text === "%PDF-";
};

const convertImageBufferToPng = async (
  arrayBuffer: ArrayBuffer,
  mimeType: string,
): Promise<ArrayBuffer> => {
  const blob = new Blob([arrayBuffer], { type: mimeType });
  const imageBitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to create canvas context for image conversion.");
  }

  context.drawImage(imageBitmap, 0, 0);

  return await new Promise((resolve, reject) => {
    canvas.toBlob((output) => {
      if (!output) {
        reject(new Error("Failed to convert image to PNG."));
        return;
      }
      output.arrayBuffer().then(resolve).catch(reject);
    }, "image/png");
  });
};

const addFileToPdf = async (
  outputPdf: PDFDocument,
  file: ApplicationFile,
  arrayBuffer: ArrayBuffer,
  contentType: string | null,
) => {
  const mimeType = contentType?.split(";")[0].trim().toLowerCase() || "";
  const extension = file.file_extension?.toLowerCase().replace(/^\./, "") || "";

  const isPdf =
    mimeType === "application/pdf" ||
    extension === "pdf" ||
    isPdfMagic(arrayBuffer);

  if (isPdf) {
    const sourcePdf = await PDFDocument.load(arrayBuffer);
    const pages = await outputPdf.copyPages(
      sourcePdf,
      sourcePdf.getPageIndices(),
    );
    pages.forEach((page) => outputPdf.addPage(page));
    return;
  }

  const isPng = mimeType === "image/png" || extension === "png";
  const isJpeg =
    mimeType === "image/jpeg" ||
    mimeType === "image/jpg" ||
    extension === "jpg" ||
    extension === "jpeg";
  const isWebp = mimeType === "image/webp" || extension === "webp";

  if (isPng || isJpeg || isWebp) {
    let imageBuffer = arrayBuffer;
    let embeddedImage;

    if (isWebp) {
      imageBuffer = await convertImageBufferToPng(arrayBuffer, "image/webp");
      embeddedImage = await outputPdf.embedPng(imageBuffer);
    } else if (isPng) {
      embeddedImage = await outputPdf.embedPng(imageBuffer);
    } else {
      embeddedImage = await outputPdf.embedJpg(imageBuffer);
    }

    const pageWidth = 595;
    const pageHeight = 842;
    const maxWidth = 540;
    const maxHeight = 792;
    const scale = Math.min(
      maxWidth / embeddedImage.width,
      maxHeight / embeddedImage.height,
      1,
    );
    const displayWidth = embeddedImage.width * scale;
    const displayHeight = embeddedImage.height * scale;

    const page = outputPdf.addPage([pageWidth, pageHeight]);
    page.drawImage(embeddedImage, {
      x: (pageWidth - displayWidth) / 2,
      y: (pageHeight - displayHeight) / 2,
      width: displayWidth,
      height: displayHeight,
    });

    return;
  }

  throw new Error(
    `Unsupported file format for ${file.file_name || file.file_extension || "uploaded file"}`,
  );
};

const normalizeFilterText = (value: string) =>
  value.toLowerCase().replace(/[\_\s-]+/g, "");

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Not set";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "Not set";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const mapApplications = (applications: Application[]): ApplicationRow[] => {
  return applications.map((app) => ({
    applicationId: String(app.id),
    id: `NTC-${String(app.id).padStart(6, "0")}`,

    applicantName: `${app.first_name} ${app.last_name}`,

    applicantEmail: app.email,

    applicantPhone: app.phone,

    applicationType: [
      app.application_type === "ojt" ? "OJT" : app.application_type,
      "Application",
    ],

    details: [
      app.school_name || "N/A",
      app.course || "N/A",
      app.hours_needed ? `${app.hours_needed} hours` : "N/A",
      `Deploy: ${
        app.deployment_date
          ? new Date(app.deployment_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "N/A"
      }`,
    ],

    submissionDate: [
      new Date(app.submission_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      "",
    ],

    status: formatStatus(app.status),
  }));
};

export const ApplicationsTableSection = ({
  applications,
  isLoading,
  onDeleteApplication,
  onStatusChange,
  searchQuery,
  onSearchChange,
  onClearFilters,
}: Props): JSX.Element => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationRow | null>(null);

  const [applicationToDelete, setApplicationToDelete] =
    useState<ApplicationRow | null>(null);

  const [changeStatusApplication, setChangeStatusApplication] =
    useState<ApplicationRow | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isDownloadingApplicationId, setIsDownloadingApplicationId] = useState<
    string | null
  >(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [showBulkStatusModal, setShowBulkStatusModal] = useState(false);
  const searchInputId = "applications-table-search";
  const currentPage = 1;
  const totalPages = 1;

  const searchParams = useSearchParams();

  const statusParam = searchParams.get("status");
  const normalizedStatusParam = statusParam
    ? normalizeFilterText(statusParam)
    : null;

  // Sort applications by `id` descending on the client so the newest (highest id)
  // appear first in the table without changing backend behavior.
  const applicationsState = useMemo(() => {
    const sorted = [...applications].sort(
      (a, b) => Number(b.id) - Number(a.id),
    );
    return mapApplications(sorted);
  }, [applications]);

  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const activeSearchQuery = searchQuery.trim() ? debouncedSearch : "";

  const filteredApplications = useMemo(() => {
    return applicationsState.filter((application) => {
      const matchesStatus = normalizedStatusParam
        ? normalizeFilterText(application.status).includes(
            normalizedStatusParam,
          )
        : true;

      const matchesSearch = activeSearchQuery
        ? [
            application.id,
            application.applicantName,
            application.applicantEmail,
            application.applicantPhone,
          ]
            .join(" ")
            .toLowerCase()
            .includes(activeSearchQuery.toLowerCase())
        : true;

      return matchesStatus && matchesSearch;
    });
  }, [applicationsState, activeSearchQuery, normalizedStatusParam]);

  const visibleSelectedRows = useMemo(() => {
    const filteredIds = new Set(
      filteredApplications.map((application) => application.id),
    );
    return new Set([...selectedRows].filter((id) => filteredIds.has(id)));
  }, [filteredApplications, selectedRows]);

  const shouldVirtualize = filteredApplications.length >= 10;
  const { scrollRef, windowedRange } = useVirtualizedRows({
    itemCount: filteredApplications.length,
    rowHeight: 152,
    overscan: 4,
    enabled: shouldVirtualize,
    resetKey: filteredApplications
      .map((application) => application.id)
      .join("|"),
  });

  const visibleApplications = shouldVirtualize
    ? filteredApplications.slice(
        windowedRange.startIndex,
        windowedRange.endIndex,
      )
    : filteredApplications;

  const selectedApplicationIds = useMemo(() => {
    // Map selected rows (UI ids like 'NTC-000123') to numeric application IDs
    return filteredApplications
      .filter((app) => selectedRows.has(app.id))
      .map((app) => Number(app.applicationId));
  }, [filteredApplications, selectedRows]);

  const allSelected =
    filteredApplications.length > 0 &&
    filteredApplications.every((a) => visibleSelectedRows.has(a.id));

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows(new Set());
      return;
    }

    setSelectedRows(new Set(filteredApplications.map((a) => a.id)));
  };

  const handleRowSelect = (id: string) => {
    const updated = new Set(selectedRows);

    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }

    setSelectedRows(updated);
  };

  const handleDownloadApplicationFiles = async (
    applicationId: string,
    applicantName: string,
  ) => {
    if (isDownloadingApplicationId) {
      return;
    }

    setIsDownloadingApplicationId(applicationId);

    try {
      const files = await apiCall(`/applications/${applicationId}/files`);

      if (!Array.isArray(files) || files.length === 0) {
        toast.info("No submitted files available for download.");
        return;
      }

      const outputPdf = await PDFDocument.create();
      const skippedFiles: string[] = [];
      let mergedPages = 0;

      for (const file of files as ApplicationFile[]) {
        if (!file?.signedUrl) {
          skippedFiles.push(file.file_name || "Unnamed file");
          continue;
        }

        try {
          const response = await fetch(file.signedUrl);

          if (!response.ok) {
            skippedFiles.push(file.file_name || "Unnamed file");
            continue;
          }

          const buffer = await response.arrayBuffer();
          const contentType = response.headers
            .get("content-type")
            ?.split(";")[0]
            .trim();

          await addFileToPdf(outputPdf, file, buffer, contentType || null);
          mergedPages += 1;
        } catch (error) {
          console.warn("Skipping file due to merge issue:", error);
          skippedFiles.push(file.file_name || "Unnamed file");
        }
      }

      if (mergedPages === 0) {
        toast.error(
          "Unable to compile applicant files. No supported documents were available.",
        );
        return;
      }

      const finalPdfBytes = await outputPdf.save();
      const pdfBlob = new Blob([new Uint8Array(finalPdfBytes)], {
        type: "application/pdf",
      });
      const outputName = `${sanitizeApplicantName(applicantName)}.pdf`;

      saveAs(pdfBlob, outputName);

      if (skippedFiles.length > 0) {
        toast.success(
          `Compiled PDF created. ${skippedFiles.length} unsupported or unavailable file(s) were skipped.`,
        );
      } else {
        toast.success("Applicant files compiled and downloaded successfully.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to compile applicant files.";
      console.error(errorMessage, error);
      toast.error(errorMessage);
    } finally {
      setIsDownloadingApplicationId(null);
    }
  };

  const handleDeleteApplication = async () => {
    if (!applicationToDelete || isDeleting) return;

    try {
      setIsDeleting(true);

      await apiCall("/applications/delete", {
        method: "DELETE",
        body: JSON.stringify(Number(applicationToDelete.applicationId)),
      });

      onDeleteApplication(Number(applicationToDelete.applicationId));

      setSelectedRows((current) => {
        const next = new Set(current);
        next.delete(applicationToDelete.id);
        return next;
      });

      if (selectedApplication?.id === applicationToDelete.id) {
        setSelectedApplication(null);
      }

      if (changeStatusApplication?.id === applicationToDelete.id) {
        setChangeStatusApplication(null);
      }

      setApplicationToDelete(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete application";
      console.error(errorMessage, error);
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSelectedApplications = async () => {
    if (selectedApplicationIds.length === 0 || isBulkDeleting) return;

    try {
      setIsBulkDeleting(true);

      for (const applicationId of selectedApplicationIds) {
        await apiCall("/applications/delete", {
          method: "DELETE",
          body: JSON.stringify(applicationId),
        });

        onDeleteApplication(applicationId);
      }

      setSelectedRows(new Set());
      setShowBulkDeleteConfirm(false);
      toast.success("Selected applications deleted successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete selected applications";
      console.error(errorMessage, error);
      toast.error(errorMessage);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleExportApplications = async () => {
    try {
      const applicationLookup = new Map(
        applications.map((application) => [
          String(application.id),
          application,
        ]),
      );

      const exportRows =
        selectedRows.size > 0
          ? filteredApplications.filter((application) =>
              selectedRows.has(application.id),
            )
          : filteredApplications;

      const applicationsToExport = exportRows
        .map((row) => applicationLookup.get(row.applicationId))
        .filter((application): application is Application =>
          Boolean(application),
        );

      if (applicationsToExport.length === 0) {
        toast.info("No applications to export");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Applications");

      const statusCounts = applicationsToExport.reduce<Record<string, number>>(
        (counts, application) => {
          const status = formatStatus(application.status);
          counts[status] = (counts[status] ?? 0) + 1;
          return counts;
        },
        {},
      );

      worksheet.columns = [
        { header: "ID", key: "id", width: 16 },
        { header: "Applicant Name", key: "name", width: 28 },
        { header: "Email", key: "email", width: 34 },
        { header: "Phone", key: "phone", width: 18 },
        { header: "Application Type", key: "type", width: 22 },
        { header: "School", key: "school", width: 30 },
        { header: "Course", key: "course", width: 24 },
        { header: "Deployment Date", key: "deployment", width: 18 },
        { header: "Submission Date", key: "submission", width: 18 },
        { header: "Status", key: "status", width: 16 },
      ];

      worksheet.mergeCells("A1:J1");

      const titleCell = worksheet.getCell("A1");

      titleCell.value = "APPLICATIONS";
      titleCell.font = {
        bold: true,
        size: 18,
        color: { argb: "FFFFFFFF" },
      };
      titleCell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1F4E78" },
      };

      worksheet.getRow(1).height = 30;

      const headerRow = worksheet.getRow(3);

      worksheet.columns.forEach((col, index) => {
        headerRow.getCell(index + 1).value = String(col.header);
      });

      headerRow.height = 25;

      headerRow.eachCell((cell) => {
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" },
          size: 11,
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "1F4E78" },
        };
        cell.border = {
          top: { style: "thin", color: { argb: "D9E2F3" } },
          left: { style: "thin", color: { argb: "D9E2F3" } },
          bottom: { style: "thin", color: { argb: "D9E2F3" } },
          right: { style: "thin", color: { argb: "D9E2F3" } },
        };
      });

      applicationsToExport.forEach((application, index) => {
        const row = worksheet.addRow({
          id: `NTC-${String(application.id).padStart(6, "0")}`,
          name: `${application.first_name} ${application.last_name}`.trim(),
          email: application.email,
          phone: application.phone,
          type: application.application_type,
          school: application.school_name || "Not set",
          course: application.course || "Not set",
          deployment: formatDate(application.deployment_date),
          submission: formatDate(application.submission_date),
          status: formatStatus(application.status),
        });

        row.height = 22;

        row.eachCell((cell) => {
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          };

          cell.border = {
            top: { style: "thin", color: { argb: "D9D9D9" } },
            left: { style: "thin", color: { argb: "D9D9D9" } },
            bottom: { style: "thin", color: { argb: "D9D9D9" } },
            right: { style: "thin", color: { argb: "D9D9D9" } },
          };

          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
              argb: index % 2 === 0 ? "F8FAFC" : "EAF2F8",
            },
          };

          cell.font = {
            size: 10,
            color: { argb: "1F2937" },
          };
        });
      });

      const totalRow = worksheet.addRow([
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "TOTAL",
        applicationsToExport.length,
      ]);

      totalRow.height = 24;

      totalRow.eachCell((cell) => {
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" },
        };

        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "1F4E78" },
        };

        cell.border = {
          top: { style: "thin", color: { argb: "FFFFFF" } },
          left: { style: "thin", color: { argb: "FFFFFF" } },
          bottom: { style: "thin", color: { argb: "FFFFFF" } },
          right: { style: "thin", color: { argb: "FFFFFF" } },
        };
      });

      const summaryStartRow = worksheet.rowCount + 2;

      worksheet.mergeCells(`A${summaryStartRow}:B${summaryStartRow}`);

      const summaryTitleCell = worksheet.getCell(`A${summaryStartRow}`);

      summaryTitleCell.value = "STATUS SUMMARY";
      summaryTitleCell.font = {
        bold: true,
        size: 12,
        color: { argb: "FFFFFFFF" },
      };
      summaryTitleCell.alignment = {
        horizontal: "left",
        vertical: "middle",
      };
      summaryTitleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1F4E78" },
      };

      const summaryOrder = [
        "Pending",
        "Under Review",
        "For Interview",
        "Accepted",
        "Rejected",
      ];

      summaryOrder.forEach((status, index) => {
        const row = worksheet.addRow([status, statusCounts[status] ?? 0]);
        const statusTheme = (() => {
          switch (status) {
            case "Pending":
              return { fill: "FFF7ED", text: "C2410C" };
            case "Under Review":
              return { fill: "EFF6FF", text: "1D4ED8" };
            case "For Interview":
              return { fill: "F5F3FF", text: "7C3AED" };
            case "Accepted":
              return { fill: "ECFDF5", text: "047857" };
            case "Rejected":
              return { fill: "FEF2F2", text: "B91C1C" };
            default:
              return { fill: "FFFFFF", text: "1F2937" };
          }
        })();

        row.height = 20;

        row.eachCell((cell) => {
          cell.font = {
            size: 10,
            color: { argb: "1F2937" },
          };

          cell.border = {
            top: { style: "thin", color: { argb: "D9D9D9" } },
            left: { style: "thin", color: { argb: "D9D9D9" } },
            bottom: { style: "thin", color: { argb: "D9D9D9" } },
            right: { style: "thin", color: { argb: "D9D9D9" } },
          };
        });

        row.getCell(1).font = {
          bold: true,
          size: 10,
          color: { argb: statusTheme.text },
        };

        row.getCell(1).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: statusTheme.fill },
        };

        row.getCell(2).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFF" },
        };

        row.getCell(1).alignment = {
          horizontal: "left",
          vertical: "middle",
        };

        row.getCell(2).alignment = {
          horizontal: "center",
          vertical: "middle",
        };
      });

      worksheet.views = [
        {
          state: "frozen",
          ySplit: 3,
        },
      ];

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const fileName = `applications_${new Date().toISOString().split("T")[0]}.xlsx`;
      saveAs(blob, fileName);

      toast.success("Applications exported successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to export applications";
      console.error(errorMessage, error);
      toast.error(errorMessage);
    }
  };

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 max-[767px]:flex-col max-[767px]:items-start">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">
            Applications
          </h2>

          <p className="text-sm font-medium text-slate-500">
            {isLoading
              ? "Synchronizing with database..."
              : `Total: ${applicationsState.length} • Showing: ${filteredApplications.length}`}
          </p>
        </div>

        <div className="flex items-center gap-2 max-[767px]:w-full max-[767px]:flex-col max-[767px]:items-stretch">
          <div className="relative w-full sm:w-[28rem] lg:w-[34rem] max-[767px]:w-full">
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <label htmlFor={searchInputId} className="sr-only">
              Search applications
            </label>

            <input
              id={searchInputId}
              type="search"
              value={searchQuery}
              placeholder="Search by name, email, phone, or ID..."
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-slate-300 focus:ring-0"
            />
          </div>

          <div className="flex items-center gap-2 max-[767px]:justify-end">
            <button
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-800 active:scale-95"
              onClick={handleExportApplications}
              type="button"
            >
              <Download size={18} className="text-white" />
              Export
            </button>

            <div className="flex items-center gap-2 max-[767px]:justify-end">
              <button
                type="button"
                disabled
                aria-label="Previous page"
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="px-3 py-2 text-sm font-semibold text-slate-600">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled
                aria-label="Next page"
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        ref={scrollRef}
        className={`relative min-h-[400px] overflow-x-auto ${
          shouldVirtualize ? "max-h-[calc(100vh-20rem)] overflow-auto" : ""
        }`}
      >
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-lg" />

            <p className="mt-4 animate-pulse text-sm font-bold text-slate-600">
              Fetching valid applications...
            </p>
          </div>
        )}

        {!isLoading && filteredApplications.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Search size={32} />
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              No applications found
            </h3>

            <p className="max-w-xs text-sm text-slate-500">
              We couldn&apos;t find any applications matching your current
              search or filter criteria.
            </p>

            <button
              onClick={onClearFilters}
              className="mt-4 text-sm font-bold text-blue-600 hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        <table className="w-full min-w-[1000px] border-collapse">
          <thead>
            <tr className="bg-slate-50/80">
              {columns.map((column, index) => (
                <th
                  key={column}
                  className={`px-6 py-4 text-left text-xs font-bold tracking-widest text-slate-500 uppercase ${
                    index === 0 ? "w-14" : ""
                  }`}
                >
                  {index === 0 ? (
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                        className="h-5 w-5 cursor-pointer rounded-lg border-slate-300 text-blue-600 transition focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    column
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {shouldVirtualize && windowedRange.topSpacerHeight > 0 && (
              <tr aria-hidden="true">
                <td
                  colSpan={columns.length}
                  className="h-0 border-0 p-0"
                  style={{ height: windowedRange.topSpacerHeight }}
                />
              </tr>
            )}

            {visibleApplications.map((application, index) => (
              <tr
                key={`${application.id}-${
                  shouldVirtualize ? windowedRange.startIndex + index : index
                }`}
                className={`group transition-all duration-200 hover:bg-blue-50/30 ${
                  visibleSelectedRows.has(application.id) ? "bg-blue-50/50" : ""
                }`}
              >
                {/* Checkbox */}
                <td className="px-6 py-6 align-top">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={visibleSelectedRows.has(application.id)}
                      onChange={() => handleRowSelect(application.id)}
                      className="h-5 w-5 cursor-pointer rounded-lg border-slate-300 text-blue-600 transition focus:ring-blue-500"
                    />
                  </div>
                </td>

                {/* ID */}
                <td className="px-6 py-6 align-top">
                  <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 shadow-sm">
                    {application.id}
                  </span>
                </td>

                {/* Applicant */}
                <td className="px-6 py-6 align-top">
                  <div
                    className="max-w-[220px] truncate font-bold text-slate-900 transition-colors group-hover:text-blue-700"
                    title={application.applicantName}
                  >
                    {application.applicantName}
                  </div>

                  <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />

                    {application.applicantEmail}
                  </div>

                  <div className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />

                    {application.applicantPhone}
                  </div>
                </td>

                {/* Type */}
                <td className="px-6 py-6 align-top">
                  <div className="inline-flex flex-col">
                    <span className="text-sm font-bold text-slate-700">
                      {application.applicationType[0]}
                    </span>

                    <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      {application.applicationType[1]}
                    </span>
                  </div>
                </td>
                {/* Submission Date */}
                <td className="px-6 py-6 align-top">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">
                      {application.submissionDate[0]}
                    </span>

                    <span className="text-xs font-medium text-slate-400">
                      Received
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="min-w-[160px] px-6 py-6 align-top">
                  <span
                    className={`inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-bold ring-1 ring-inset shadow-sm ${getStatusStyles(
                      application.status,
                    )}`}
                  >
                    <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-current" />

                    {application.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-6 align-middle">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      title="View Profile"
                      onClick={() => setSelectedApplication(application)}
                      className="rounded-xl border border-slate-200 bg-white p-2.5 text-blue-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 active:scale-90"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      title="Update Status"
                      onClick={() => setChangeStatusApplication(application)}
                      className="rounded-xl border border-slate-200 bg-white p-2.5 text-amber-600 shadow-sm transition hover:border-amber-200 hover:bg-amber-50 active:scale-90"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      title="Download files"
                      onClick={() =>
                        handleDownloadApplicationFiles(
                          application.applicationId,
                          application.applicantName,
                        )
                      }
                      disabled={
                        isDownloadingApplicationId === application.applicationId
                      }
                      className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-90 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-busy={
                        isDownloadingApplicationId === application.applicationId
                      }
                    >
                      <Download
                        size={18}
                        className={
                          isDownloadingApplicationId ===
                          application.applicationId
                            ? "animate-spin"
                            : ""
                        }
                      />
                    </button>

                    <button
                      title="Remove"
                      onClick={() => setApplicationToDelete(application)}
                      className="rounded-xl border border-slate-200 bg-white p-2.5 text-red-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 active:scale-90"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {shouldVirtualize && windowedRange.bottomSpacerHeight > 0 && (
              <tr aria-hidden="true">
                <td
                  colSpan={columns.length}
                  className="h-0 border-0 p-0"
                  style={{ height: windowedRange.bottomSpacerHeight }}
                />
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedRows.size > 0 && (
        <div className="px-6 py-4 bg-linear-to-r from-blue-50 to-blue-100 border-t border-blue-200 flex items-center justify-between w-full">
          <p className="text-sm font-semibold text-blue-900">
            ✓ {selectedRows.size} application
            {selectedRows.size !== 1 ? "s" : ""} selected
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportApplications}
              className="px-4 py-2 text-sm font-semibold text-blue-700 bg-white rounded-lg hover:bg-blue-50 border border-blue-300 transition-all shadow-sm hover:shadow-md"
              type="button"
            >
              Export Selected
            </button>

            <button
              onClick={() => setShowBulkStatusModal(true)}
              className="px-4 py-2 text-sm font-semibold text-blue-700 bg-white rounded-lg hover:bg-blue-50 border border-blue-300 transition-all shadow-sm hover:shadow-md"
              title={`Change status for ${selectedRows.size} selected applications`}
              type="button"
            >
              Change Status
            </button>

            <button
              onClick={() => setShowBulkDeleteConfirm(true)}
              disabled={isBulkDeleting}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 border border-red-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedApplication && (
        <ApplicationDetails
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}

      {applicationToDelete && (
        <ConfirmDeleteModal
          open={!!applicationToDelete}
          title="Delete application"
          message={`Are you sure you want to delete application from ${applicationToDelete.applicantName}? This action cannot be undone.`}
          onCancel={() => setApplicationToDelete(null)}
          onConfirm={handleDeleteApplication}
        />
      )}

      {changeStatusApplication && (
        <ChangeStatusModal
          open={!!changeStatusApplication}
          application={changeStatusApplication}
          onClose={() => setChangeStatusApplication(null)}
          onConfirm={(newStatus) => {
            onStatusChange(
              Number(changeStatusApplication.applicationId),
              newStatus,
            );
            setChangeStatusApplication(null);
          }}
        />
      )}

      {showBulkStatusModal && (
        <ChangeStatusModal
          open={showBulkStatusModal}
          bulkMode
          bulkCount={selectedApplicationIds.length}
          application={
            filteredApplications.find((app) => selectedRows.has(app.id)) ?? null
          }
          onClose={() => setShowBulkStatusModal(false)}
          onConfirm={(newStatus) => {
            selectedApplicationIds.forEach((applicationId) => {
              onStatusChange(applicationId, newStatus);
            });
            setSelectedRows(new Set());
            setShowBulkStatusModal(false);
            toast.success("Selected applications updated successfully");
          }}
        />
      )}

      {showBulkDeleteConfirm && (
        <ConfirmDeleteModal
          open={showBulkDeleteConfirm}
          title={`Delete ${selectedApplicationIds.length} applications`}
          message={`Are you sure you want to delete ${selectedApplicationIds.length} selected application${selectedApplicationIds.length === 1 ? "" : "s"}? This action cannot be undone.`}
          onCancel={() => setShowBulkDeleteConfirm(false)}
          onConfirm={handleDeleteSelectedApplications}
        />
      )}
    </section>
  );
};
