"use client";
import InternDetailsModal, {
  ModalInternData,
} from "../modals/InternDetailsModal";
import ChangeInterDetailsModal from "../modals/ChangeInterDetailsModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import CertificateModal from "../modals/CertificateModal";
import { JSX, useMemo, useState } from "react";
import { toast } from "sonner";
import { apiCall, apiCallRaw } from "@/lib/api";
import { PDFDocument } from "pdf-lib";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Search,
  SquarePen,
  Trash2,
} from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { useVirtualizedRows } from "@/hooks/useVirtualizedRows";

interface Intern {
  id: number;
  ojt_id: string;
  application_id?: number | null;
  application_type: string;
  first_name: string;
  last_name: string;
  gender: "Male" | "Female" | null;
  email: string;
  phone: string;
  school_name: string | null;
  hours_needed: number | null;
  course: string | null;
  deployment_date: string | null;
  end_date: string | null;
  certificate_issuance_date: string | null;
  orientation_date: string | null;
  confirmed_at: string | null;
  confirmation_ip: string | null;
  second_chance: number;
  submission_date: string;
  original_status: string | null;
  moved_to_ojt_at: string;
  admin_notes: string | null;
}

interface ApplicationFile {
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
}

const sanitizeApplicantName = (name: string) => {
  return (
    name
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^A-Za-z0-9_]/g, "")
      .replace(/^_+|_+$/g, "")
      .replace(/__+/g, "_") || "intern"
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

const normalizeNumericId = (
  value: number | string | undefined | null,
): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^\d+$/.test(trimmed)) {
    const parsed = Number(trimmed);
    return parsed > 0 ? parsed : undefined;
  }

  return undefined;
};

const resolveApplicationId = async (
  intern: Intern,
): Promise<number | undefined> => {
  const directId = normalizeNumericId(intern.application_id);
  if (directId) return directId;

  const email = intern.email?.trim();
  if (!email) return undefined;

  try {
    const lookupResponse = await apiCall(
      `/applications/fetch?email=${encodeURIComponent(email)}`,
    );

    const lookupData = Array.isArray(lookupResponse)
      ? lookupResponse
      : Array.isArray((lookupResponse as any)?.data)
        ? (lookupResponse as any).data
        : [];

    const ids = (lookupData as Array<{ id?: number }>)
      .filter((item) => typeof item?.id === "number" && item.id > 0)
      .map((item) => item.id as number)
      .sort((a, b) => b - a);

    return ids.length > 0 ? ids[0] : undefined;
  } catch (error) {
    console.warn("Failed to resolve application ID by email:", error);
    return undefined;
  }
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

interface VerifiedInternsTableSectionProps {
  interns: Intern[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onViewDetails?: (intern: ModalInternData) => void;
}

export const VerifiedInternsTableSection = ({
  interns,
  searchTerm,
  onSearchChange,
  onClearFilters,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  onViewDetails,
}: VerifiedInternsTableSectionProps): JSX.Element => {
  const [selectedInterns, setSelectedInterns] = useState<number[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isDownloadingInternId, setIsDownloadingInternId] = useState<
    number | null
  >(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [viewingIntern, setViewingIntern] = useState<ModalInternData | null>(
    null,
  );
  const [editingIntern, setEditingIntern] = useState<Intern | null>(null);
  const [internToDelete, setInternToDelete] = useState<Intern | null>(null);
  const [deletedInternIds, setDeletedInternIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [editedInterns, setEditedInterns] = useState<
    Record<number, Partial<Intern>>
  >({});
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // Google OAuth connection state
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);

  const rows = useMemo(
    () =>
      interns
        .filter((intern) => !deletedInternIds.has(intern.id))
        .map((intern) => ({
          ...intern,
          ...(editedInterns[intern.id] ?? {}),
        })),
    [deletedInternIds, editedInterns, interns],
  );

  const selectAll = rows.length > 0 && selectedInterns.length === rows.length;

  const shouldVirtualize = rows.length >= 10;
  const { scrollRef, windowedRange } = useVirtualizedRows({
    itemCount: rows.length,
    rowHeight: 72,
    overscan: 5,
    enabled: shouldVirtualize,
    resetKey: rows.map((intern) => intern.id).join("|"),
  });

  const visibleRows = shouldVirtualize
    ? rows.slice(windowedRange.startIndex, windowedRange.endIndex)
    : rows;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Not set";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInternName = (intern: Intern) => {
    return `${intern.first_name} ${intern.last_name}`.trim();
  };

  const getOjtId = (intern: Intern) => {
    if (intern.ojt_id) return intern.ojt_id;
    return `OJT-${new Date(intern.moved_to_ojt_at).getFullYear()}-${String(intern.id).padStart(4, "0")}`;
  };

  const handleSelectAll = () => {
    setSelectedInterns(selectAll ? [] : rows.map((intern) => intern.id));
  };

  const handleSelectIntern = (id: number) => {
    if (selectedInterns.includes(id)) {
      setSelectedInterns(selectedInterns.filter((internId) => internId !== id));
    } else {
      setSelectedInterns([...selectedInterns, id]);
    }
  };

  // ─── Google OAuth Connect ──────────────────────────────────────────────────
  const handleConnectGoogle = async () => {
    if (isConnectingGoogle) return;

    setIsConnectingGoogle(true);

    try {
      const response = await apiCall("/google/connect");
      const { url } = response as { url: string };

      if (!url) {
        toast.error("Failed to get Google authorization URL.");
        return;
      }

      const popup = window.open(url, "google-oauth", "width=500,height=650");

      if (!popup) {
        window.location.href = url;
        return;
      }

      // Wait for OAuth to complete in backend
      const pollInterval = setInterval(async () => {
        try {
          // If popup is still open, just wait
          if (!popup.closed) return;

          clearInterval(pollInterval);

          // IMPORTANT: verify real backend state
          const res = await apiCall("/google/status");
          const { connected } = res as { connected: boolean };

          setIsGoogleConnected(connected);

          if (connected) {
            toast.success("Google account connected successfully.");
          } else {
            toast.error("Google connection failed. Please try again.");
          }
        } catch (err) {
          clearInterval(pollInterval);
          toast.error("Failed to verify Google connection.");
        } finally {
          setIsConnectingGoogle(false);
        }
      }, 1000);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to connect Google.";

      toast.error(msg);
      setIsConnectingGoogle(false);
    }
  };

  // ─── Bulk Certificate Generation ──────────────────────────────────────────
  const handleGenerateCertificates = async () => {
    if (!isGoogleConnected) {
      toast.error("Please connect your Google account first.");
      return;
    }
    if (selectedInterns.length === 0) {
      toast.error("No interns selected.");
      return;
    }
    if (isGeneratingCertificate) return;
    setIsGeneratingCertificate(true);

    try {
      // Send raw numeric IDs, not the formatted "OJT-2026-0001" strings
      const internIds = selectedInterns; // already number[]
      const response = await apiCallRaw("/certificates/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ojtIds: selectedInterns }),
      });

      if (response.status === 403) {
        const body = await response.json().catch(() => ({}));
        const message = (body as any)?.message || "";
        if (message.toLowerCase().includes("google account not connected")) {
          setIsGoogleConnected(false);
          toast.error("Google account disconnected. Please reconnect.");
        } else {
          toast.error("Unauthorized. Please log in again.");
        }
        return;
      }

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const message =
          (body as any)?.message || "Failed to generate certificates.";
        toast.error(message);
        return;
      }

      const blob = await response.blob();
      saveAs(blob, "certificates.zip");
      toast.success(
        `${selectedInterns.length} certificate${selectedInterns.length !== 1 ? "s" : ""} generated and downloaded.`,
      );
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Failed to generate certificates.";
      toast.error(msg);
    } finally {
      setIsGeneratingCertificate(false);
    }
  };

  const exportToExcel = async (dataToExport: Intern[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Verified Interns");

    worksheet.columns = [
      { header: "OJT ID", key: "ojtId", width: 15 },
      { header: "Intern Name", key: "name", width: 28 },
      { header: "Gender", key: "gender", width: 12 },
      { header: "School", key: "school", width: 35 },
      { header: "Course", key: "details", width: 25 },
      { header: "Deployment Date", key: "start", width: 18 },
      { header: "End Date", key: "end", width: 18 },
      { header: "Email", key: "email", width: 35 },
      { header: "Status", key: "status", width: 15 },
    ];

    worksheet.mergeCells("A1:I1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "VERIFIED INTERNS";
    titleCell.font = { bold: true, size: 18, color: { argb: "FFFFFFFF" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
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
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
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

    dataToExport.forEach((intern, index) => {
      const row = worksheet.addRow({
        ojtId: getOjtId(intern),
        name: getInternName(intern),
        gender: intern.gender || "Not set",
        school: intern.school_name || "Not set",
        details: intern.course || "—",
        start: formatDate(intern.deployment_date),
        end: formatDate(intern.end_date),
        email: intern.email,
        status: intern.original_status || "accepted",
        verified: formatDate(intern.confirmed_at),
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
          fgColor: { argb: index % 2 === 0 ? "F8FAFC" : "EAF2F8" },
        };
        cell.font = { size: 10, color: { argb: "1F2937" } };
      });

      const statusCell = row.getCell(9);
      if (String(intern.original_status).toLowerCase() === "verified") {
        statusCell.font = { bold: true, color: { argb: "008000" } };
      }
      if (String(intern.original_status).toLowerCase() === "completed") {
        statusCell.font = { bold: true, color: { argb: "1D4ED8" } };
      }
    });

    const totalRow = worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "TOTAL",
      dataToExport.length,
    ]);
    totalRow.height = 24;
    totalRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
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

    worksheet.views = [{ state: "frozen", ySplit: 3 }];

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(
      blob,
      `verified_interns_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  const handleExportExcel = async () => {
    try {
      if (selectedInterns.length > 0) {
        const selectedData = rows.filter((intern) =>
          selectedInterns.includes(intern.id),
        );
        await exportToExcel(selectedData);
      } else {
        await exportToExcel(rows);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to export Excel:", err);
    }
  };

  const handleViewDetails = (intern: Intern) => {
    const internName = getInternName(intern);
    const modalData: ModalInternData = {
      applicationId: intern.application_id ?? undefined,
      ojtId: getOjtId(intern),
      portalId: getOjtId(intern).replace("OJT-", "OJT-"),
      name: internName,
      gender: intern.gender || "Not specified",
      email: intern.email,
      phone: intern.phone || "N/A",
      school: intern.school_name || "Not specified",
      course: intern.course || "Not specified",
      hoursNeeded: intern.hours_needed?.toString() || "N/A",
      deploymentDate: intern.deployment_date || undefined,
      endDate: intern.end_date || undefined,
    };

    if (onViewDetails) {
      onViewDetails(modalData);
    } else {
      setViewingIntern(modalData);
    }
  };

  const handleEdit = (intern: Intern) => {
    // eslint-disable-next-line no-console
    console.log("[UI] handleEdit - editingIntern source:", intern);
    setEditingIntern(intern);
  };

  const handleDownloadInternFiles = async (intern: Intern) => {
    if (isDownloadingInternId !== null) return;

    const normalizedApplicationId =
      intern.application_id && Number.isFinite(intern.application_id)
        ? intern.application_id
        : undefined;

    const getApplicationIdsFromEmail = async () => {
      if (!intern.email) return [] as number[];
      const lookupResponse = await apiCall(
        `/applications/fetch?email=${encodeURIComponent(intern.email)}`,
      );
      const lookupData = Array.isArray(lookupResponse)
        ? lookupResponse
        : Array.isArray((lookupResponse as any)?.data)
          ? (lookupResponse as any).data
          : [];
      if (!Array.isArray(lookupData)) return [] as number[];
      return lookupData
        .filter(
          (item): item is { id: number } =>
            item && typeof item.id === "number" && item.id > 0,
        )
        .map((item) => item.id)
        .sort((a, b) => b - a);
    };

    const candidateApplicationIds = new Set<number>();
    if (normalizedApplicationId)
      candidateApplicationIds.add(normalizedApplicationId);
    const emailApplicationIds = await getApplicationIdsFromEmail();
    emailApplicationIds.forEach((id) => candidateApplicationIds.add(id));

    if (candidateApplicationIds.size === 0) {
      toast.info(
        "No application ID or matching applicant email available for download.",
      );
      return;
    }

    const applicationIds = [...candidateApplicationIds].sort((a, b) => b - a);
    const applicantName = getInternName(intern);
    setIsDownloadingInternId(intern.id);

    try {
      let files: ApplicationFile[] = [];
      for (const applicationId of applicationIds) {
        const response = await apiCall(`/applications/${applicationId}/files`);
        const fileData = Array.isArray(response)
          ? response
          : Array.isArray((response as any)?.data)
            ? (response as any).data
            : [];
        if (Array.isArray(fileData) && fileData.length > 0) {
          files = fileData;
          break;
        }
      }

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
      saveAs(pdfBlob, `${sanitizeApplicantName(applicantName)}.pdf`);

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
      setIsDownloadingInternId(null);
    }
  };

  const handleDelete = (intern: Intern) => {
    setInternToDelete(intern);
  };

  const handleDeleteSelectedInterns = async () => {
    if (selectedInterns.length === 0 || isBulkDeleting) return;
    try {
      setIsBulkDeleting(true);
      setDeletedInternIds((prev) => {
        const next = new Set(prev);
        selectedInterns.forEach((internId) => next.add(internId));
        return next;
      });
      setSelectedInterns([]);
      setShowBulkDeleteConfirm(false);
      toast.success("Selected interns deleted successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete selected interns";
      console.error(errorMessage, error);
      toast.error(errorMessage);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const renderedRows = useMemo(
    () =>
      visibleRows.map((intern, idx) => {
        const isSelected = selectedInterns.includes(intern.id);
        const key = `intern-${
          shouldVirtualize ? windowedRange.startIndex + idx : intern.id
        }`;

        return (
          <tr
            key={key}
            className={`border-b border-slate-100 transition-all ${
              isSelected
                ? "bg-blue-50"
                : idx % 2 === 0
                  ? "bg-white hover:bg-slate-50"
                  : "bg-slate-50 hover:bg-slate-100"
            }`}
          >
            <td className="px-6 py-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectIntern(intern.id)}
                  className="w-4 h-4 rounded border-2 border-slate-300 bg-white accent-blue-600 focus:ring-blue-500 cursor-pointer"
                  aria-label={`Select intern ${getInternName(intern)}`}
                />
              </label>
            </td>
            <td className="px-6 py-4 font-mono font-semibold text-blue-600">
              {getOjtId(intern)}
            </td>
            <td className="px-6 py-4 font-semibold text-slate-900">
              {getInternName(intern)}
            </td>
            <td className="px-6 py-4 text-slate-700">
              <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                {intern.gender || "Not set"}
              </span>
            </td>
            <td className="px-6 py-4 text-slate-700 text-sm">
              {intern.school_name}
            </td>
            <td className="px-6 py-4 text-slate-600 text-sm max-w-xs truncate">
              {intern.course || (
                <span className="text-slate-400 italic">—</span>
              )}
            </td>
            <td className="px-6 py-4 text-slate-700 text-sm whitespace-nowrap font-medium">
              {formatDate(intern.deployment_date)}
            </td>
            <td className="px-6 py-4 text-slate-700 text-sm whitespace-nowrap font-medium">
              {formatDate(intern.end_date)}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleViewDetails(intern)}
                  title="View details"
                  className="rounded-lg bg-blue-50 p-2 text-blue-600 transition-all hover:bg-blue-100 hover:scale-105 active:scale-95"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleEdit(intern)}
                  title="Edit intern"
                  className="rounded-lg bg-amber-50 p-2 text-amber-600 transition-all hover:bg-amber-100 hover:scale-105 active:scale-95"
                >
                  <SquarePen size={16} />
                </button>
                <button
                  type="button"
                  title="Download files"
                  onClick={() => handleDownloadInternFiles(intern)}
                  disabled={isDownloadingInternId === intern.id}
                  className="rounded-lg bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-busy={isDownloadingInternId === intern.id}
                >
                  <Download
                    size={16}
                    className={
                      isDownloadingInternId === intern.id
                        ? "animate-spin text-slate-700"
                        : "text-slate-600"
                    }
                  />
                </button>
                <button
                  onClick={() => handleDelete(intern)}
                  title="Delete intern"
                  className="rounded-lg bg-red-50 p-2 text-red-600 transition-all hover:bg-red-100 hover:scale-105 active:scale-95"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        );
      }),
    [visibleRows, selectedInterns, shouldVirtualize, windowedRange.startIndex],
  );

  return (
    <>
      <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 max-[1023px]:flex-col max-[1023px]:items-start">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">
              Verified Interns
            </h2>
            <p className="text-sm font-medium text-slate-500">
              {`Page: ${currentPage} of ${totalPages} • ${rows.length} record${rows.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <div className="flex items-center gap-2 max-[1023px]:w-full max-[1023px]:flex-col max-[1023px]:items-stretch max-[1023px]:justify-end">
            <div className="relative w-full max-w-full sm:max-w-[30rem] lg:max-w-[34rem] max-[1280px]:max-w-[20rem] flex-1 min-w-0 max-[1280px]:mx-auto max-[1023px]:mx-auto max-[1023px]:w-full">
              <Search
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <label htmlFor="ojt-intern-search" className="sr-only">
                Search interns
              </label>
              <input
                id="ojt-intern-search"
                type="search"
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search by OJT ID or name..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-slate-300 focus:ring-0"
              />
            </div>

            <div className="w-auto max-[1280px]:w-auto max-[1280px]:flex max-[1280px]:justify-center max-[1023px]:w-full">
              <button
                className="flex justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-800 active:scale-95 max-[1280px]:max-w-[20rem] sm:max-w-[28rem] lg:max-w-[34rem] max-[1023px]:w-full max-[1023px]:px-3 max-[1023px]:py-2 max-[767px]:text-xs"
                onClick={handleExportExcel}
                type="button"
              >
                <Download size={18} className="text-white" />
                Export
              </button>
            </div>

            <div className="flex items-center gap-2 max-[1023px]:w-full max-[1023px]:flex-wrap max-[1023px]:justify-between max-[1023px]:gap-2 max-[1023px]:px-1">
              <button
                onClick={onPreviousPage}
                type="button"
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 max-[1280px]:h-9 max-[1280px]:w-9 max-[1023px]:h-8 max-[1023px]:w-8 max-[767px]:h-7 max-[767px]:w-7"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="px-3 py-2 text-sm font-semibold text-slate-600 max-[1023px]:px-2 max-[1023px]:py-1 max-[767px]:text-xs">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={onNextPage}
                type="button"
                disabled={currentPage >= totalPages}
                aria-label="Next page"
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 max-[1280px]:h-9 max-[1280px]:w-9 max-[1023px]:h-8 max-[1023px]:w-8 max-[767px]:h-7 max-[767px]:w-7"
              >
                <ChevronRight size={18} />
              </button>
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
          <table className="w-full min-w-[1000px] border-collapse">
            <thead className="bg-slate-100 border-b border-slate-200 sticky top-0">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 font-bold text-slate-800 w-12"
                >
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-2 border-slate-300 bg-white accent-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wide"
                >
                  OJT ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wide"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wide"
                >
                  Gender
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wide"
                >
                  School
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wide whitespace-nowrap"
                >
                  Details
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wide whitespace-nowrap"
                >
                  Start Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wide whitespace-nowrap"
                >
                  End Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wide"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shouldVirtualize && windowedRange.topSpacerHeight > 0 && (
                <tr aria-hidden="true">
                  <td
                    colSpan={9}
                    className="h-0 border-0 p-0"
                    style={{ height: windowedRange.topSpacerHeight }}
                  />
                </tr>
              )}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-14 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <Search size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">
                        No interns found
                      </h3>
                      <p className="max-w-xs text-sm text-slate-500">
                        We couldn&apos;t find any interns matching your current
                        search or filter criteria.
                      </p>
                      <button
                        onClick={onClearFilters}
                        className="mt-4 text-sm font-bold text-blue-600 hover:underline"
                        type="button"
                      >
                        Clear search
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {renderedRows}

              {shouldVirtualize && windowedRange.bottomSpacerHeight > 0 && (
                <tr aria-hidden="true">
                  <td
                    colSpan={9}
                    className="h-0 border-0 p-0"
                    style={{ height: windowedRange.bottomSpacerHeight }}
                  />
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with selection info */}
        {selectedInterns.length > 0 && (
          <div className="px-6 py-4 bg-linear-to-r from-blue-50 to-blue-100 border-t border-blue-200 flex items-center justify-between w-full max-[767px]:flex-col max-[767px]:items-stretch max-[767px]:gap-3">
            <p className="text-sm font-semibold text-blue-900">
              ✓ {selectedInterns.length} intern
              {selectedInterns.length !== 1 ? "s" : ""} selected
            </p>
            <div className="flex items-center gap-2 max-[767px]:flex-col max-[767px]:items-stretch max-[767px]:w-full">
              <button
                onClick={handleExportExcel}
                className="px-4 py-2 text-sm font-semibold text-blue-700 bg-white rounded-lg hover:bg-blue-50 border border-blue-300 transition-all shadow-sm hover:shadow-md max-[767px]:w-full"
                type="button"
              >
                Export Selected
              </button>

              <button
                onClick={() => setShowBulkDeleteConfirm(true)}
                disabled={isBulkDeleting}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 border border-red-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed max-[767px]:w-full"
                type="button"
              >
                Delete Selected
              </button>

              {/* ── Google Connect button ───────────────────────────────── */}
              <button
                onClick={handleConnectGoogle}
                disabled={isGoogleConnected || isConnectingGoogle}
                type="button"
                title={
                  isGoogleConnected
                    ? "Google account connected"
                    : "Connect your Google account to enable certificate generation"
                }
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-all shadow-sm hover:shadow-md max-[767px]:w-full
                  ${
                    isGoogleConnected
                      ? "bg-green-50 text-green-700 border-green-300 cursor-default"
                      : isConnectingGoogle
                        ? "bg-white text-slate-500 border-slate-300 cursor-wait opacity-70"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                  }
                `}
              >
                {/* Google "G" SVG icon */}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {isGoogleConnected
                  ? "Google Connected"
                  : isConnectingGoogle
                    ? "Connecting…"
                    : "Connect Google"}
              </button>

              {/* ── Generate Certificate button ─────────────────────────── */}
              <button
                onClick={handleGenerateCertificates}
                disabled={!isGoogleConnected || isGeneratingCertificate}
                type="button"
                title={
                  !isGoogleConnected
                    ? "Connect your Google account first"
                    : "Generate certificates for selected interns"
                }
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-all shadow-sm max-[767px]:w-full
                  ${
                    !isGoogleConnected
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                      : isGeneratingCertificate
                        ? "bg-blue-600 text-white border-blue-700 cursor-wait opacity-70"
                        : "bg-blue-600 text-white border-blue-700 hover:bg-blue-700 hover:shadow-md active:scale-95"
                  }
                `}
              >
                {/* Certificate / document icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="9" y1="13" x2="15" y2="13" />
                  <line x1="9" y1="17" x2="13" y2="17" />
                </svg>
                {isGeneratingCertificate
                  ? "Generating…"
                  : "Generate Certificate"}
              </button>
            </div>
          </div>
        )}
      </section>

      {viewingIntern && (
        <InternDetailsModal
          intern={viewingIntern}
          onClose={() => {
            ("Closing inline modal");
            setViewingIntern(null);
          }}
        />
      )}

      {internToDelete && (
        <ConfirmDeleteModal
          open={!!internToDelete}
          title="Delete intern"
          message={`Are you sure you want to delete ${getInternName(internToDelete)}? This action cannot be undone.`}
          onCancel={() => setInternToDelete(null)}
          onConfirm={() => {
            setDeletedInternIds((prev) => {
              const next = new Set(prev);
              next.add(internToDelete.id);
              return next;
            });
            setSelectedInterns((prev) =>
              prev.filter((id) => id !== internToDelete.id),
            );
            setInternToDelete(null);
          }}
        />
      )}

      {showBulkDeleteConfirm && (
        <ConfirmDeleteModal
          open={showBulkDeleteConfirm}
          title={`Delete ${selectedInterns.length} interns`}
          message={`Are you sure you want to delete ${selectedInterns.length} selected intern${selectedInterns.length === 1 ? "" : "s"}? This action cannot be undone.`}
          onCancel={() => setShowBulkDeleteConfirm(false)}
          onConfirm={handleDeleteSelectedInterns}
        />
      )}

      {editingIntern && (
        <ChangeInterDetailsModal
          intern={{
            id: editingIntern.id.toString(),
            name: getInternName(editingIntern),
            ojtYear: (() => {
              if (editingIntern.ojt_id) {
                const parts = editingIntern.ojt_id.split("-").filter(Boolean);
                const yearPart = parts.length >= 2 ? parts[1] : parts[0];
                if (/^\d{4}$/.test(yearPart)) return yearPart;
              }
              if (editingIntern.deployment_date) {
                return new Date(editingIntern.deployment_date)
                  .getFullYear()
                  .toString();
              }
              return "2026";
            })(),
            adminNote: editingIntern.admin_notes ?? "",
            gender: editingIntern.gender || "Female",
            deploymentDate: editingIntern.deployment_date || undefined,
            endDate: editingIntern.end_date || undefined,
          }}
          onClose={() => setEditingIntern(null)}
          onSave={async (payload) => {
            const body = {
              id: Number(payload.id),
              ojtYear: payload.ojtYear,
              adminNote: payload.adminNote,
              gender: payload.gender,
              deploymentDate: payload.deploymentDate,
              endDate: payload.endDate,
            };

            try {
              const res = await apiCall("/ojt/edit-Ojt", {
                method: "PUT",
                body: JSON.stringify(body),
              });

              if ((res as Response)?.ok === false) {
                let msg = "Failed to update intern";
                try {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  msg = (await (res as Response).json())?.message || msg;
                } catch {}
                toast.error(msg);
                return;
              }

              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              const updated = (res as any)?.data ?? (res as any);

              if (!updated) {
                toast.success("Intern updated");
                setEditingIntern(null);
                return;
              }

              setEditedInterns((prev) => ({
                ...prev,
                [updated.id]: {
                  gender: updated.gender ?? editingIntern?.gender,
                  deployment_date:
                    updated.deployment_date ?? editingIntern?.deployment_date,
                  end_date: updated.end_date ?? editingIntern?.end_date,
                  ojt_id:
                    updated.ojt_id ??
                    editingIntern?.ojt_id ??
                    getOjtId(editingIntern!),
                  admin_notes:
                    updated.admin_notes ?? editingIntern?.admin_notes,
                },
              }));

              toast.success("Intern updated successfully");
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error("Failed to update intern:", error);
              const msg =
                error instanceof Error
                  ? error.message
                  : "Failed to update intern";
              toast.error(msg);
            } finally {
              setEditingIntern(null);
            }
          }}
        />
      )}

      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        interns={selectedInterns.map((id) => {
          const intern = rows.find((r) => r.id === id) || null;
          return {
            id: String(id),
            name: intern ? getInternName(intern) : "Unknown",
            ojtNumber: intern ? getOjtId(intern) : "",
          };
        })}
      />
    </>
  );
};
