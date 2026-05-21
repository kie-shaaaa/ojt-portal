"use client";
import InternDetailsModal, { ModalInternData } from "../InternDetailsModal";
import ChangeInterDetailsModal from "../ChangeInterDetailsModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import { JSX, useMemo, useState } from "react";
import { toast } from "sonner";
import { apiCall } from "@/lib/api";
import { Download, Eye, SquarePen, Trash2 } from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { useVirtualizedRows } from "@/hooks/useVirtualizedRows";

interface Intern {
  id: number;
  ojt_id: string;
  application_id: number;
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

interface VerifiedInternsTableSectionProps {
  interns: Intern[];
  onViewDetails?: (intern: ModalInternData) => void;
}

export const VerifiedInternsTableSection = ({
  interns,
  onViewDetails,
}: VerifiedInternsTableSectionProps): JSX.Element => {
  const [selectedInterns, setSelectedInterns] = useState<number[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
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
    // Fallback: construct from ID if ojt_id is missing
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

  const exportToExcel = async (dataToExport: Intern[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Verified Interns");

    // =========================
    // COLUMN SETUP
    // =========================
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
      { header: "Verified Date", key: "verified", width: 18 },
    ];

    // =========================
    // TITLE ROW
    // =========================
    worksheet.mergeCells("A1:J1");

    const titleCell = worksheet.getCell("A1");

    titleCell.value = "VERIFIED INTERNS";

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

    // =========================
    // HEADER ROW
    // =========================
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

    // =========================
    // DATA ROWS
    // =========================
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
        status: intern.original_status || "Not set",
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

        // Alternating row colors
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

      // Status color styling
      const statusCell = row.getCell(9);

      if (String(intern.original_status).toLowerCase() === "verified") {
        statusCell.font = {
          bold: true,
          color: { argb: "008000" },
        };
      }

      if (String(intern.original_status).toLowerCase() === "completed") {
        statusCell.font = {
          bold: true,
          color: { argb: "1D4ED8" },
        };
      }
    });

    // =========================
    // TOTAL ROW
    // =========================
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
      dataToExport.length,
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

    // =========================
    // FREEZE HEADER
    // =========================
    worksheet.views = [
      {
        state: "frozen",
        ySplit: 3,
      },
    ];

    // =========================
    // EXPORT
    // =========================
    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `verified_interns_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    saveAs(blob, fileName);
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
      applicationId: intern.application_id,
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
    // Open the Change Intern Details modal with mock data derived from the intern
    // debug: log intern being edited
    // eslint-disable-next-line no-console
    console.log("[UI] handleEdit - editingIntern source:", intern);
    setEditingIntern(intern);
  };

  const handleDelete = (intern: Intern) => {
    // open confirm modal instead of native confirm()
    setInternToDelete(intern);
  };

  const handleDeleteSelectedInterns = async () => {
    if (selectedInterns.length === 0 || isBulkDeleting) return;

    try {
      setIsBulkDeleting(true);

      setDeletedInternIds((prev) => {
        const next = new Set(prev);

        selectedInterns.forEach((internId) => {
          next.add(internId);
        });

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
      <section className="flex relative self-stretch w-full flex-col items-start rounded-xl border border-solid border-slate-200 bg-white shadow-lg overflow-hidden">
        {/* Header with title and export button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 pb-4 w-full border-b border-slate-100 bg-linear-to-r from-slate-50 to-transparent">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <h3 className="text-xl font-bold text-slate-900">
                Verified Interns
              </h3>
            </div>
            <p className="text-sm text-slate-500 ml-4">
              {`${rows.length} record${rows.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <div className="flex gap-2">
            {/* Export to Excel Button */}
            <button
              onClick={handleExportExcel}
              disabled={rows.length === 0}
              className="px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Download size={16} />
              Export
            </button>

            {selectedInterns.length > 0 && (
              <button
                onClick={() => setShowBulkDeleteConfirm(true)}
                disabled={isBulkDeleting}
                className="flex items-center gap-2 rounded-lg bg-linear-to-r from-red-600 to-red-700 px-4 py-2 text-sm font-semibold text-white transition-all shadow-sm hover:from-red-700 hover:to-red-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                title={`Delete ${selectedInterns.length} selected interns`}
                type="button"
              >
                <Trash2 size={16} />
                Delete Selected ({selectedInterns.length})
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div
          ref={scrollRef}
          className={`w-full flex-1 overflow-x-auto ${
            shouldVirtualize ? "max-h-[calc(100vh-20rem)] overflow-auto" : ""
          }`}
        >
          <table className="w-full text-left text-sm">
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
            <tbody>
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
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">📋</span>
                      </div>
                      <p className="text-slate-600 font-semibold">
                        No interns found
                      </p>
                      <p className="text-slate-500 text-xs">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {visibleRows.map((intern, idx) => (
                <tr
                  key={`intern-${
                    shouldVirtualize
                      ? windowedRange.startIndex + idx
                      : intern.id
                  }`}
                  className={`border-b border-slate-100 transition-all ${
                    selectedInterns.includes(intern.id)
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
                        checked={selectedInterns.includes(intern.id)}
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
                        onClick={() => handleDelete(intern)}
                        title="Delete intern"
                        className="rounded-lg bg-red-50 p-2 text-red-600 transition-all hover:bg-red-100 hover:scale-105 active:scale-95"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

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
          <div className="px-6 py-4 bg-linear-to-r from-blue-50 to-blue-100 border-t border-blue-200 flex items-center justify-between w-full">
            <p className="text-sm font-semibold text-blue-900">
              ✓ {selectedInterns.length} intern
              {selectedInterns.length !== 1 ? "s" : ""} selected
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportExcel}
                className="px-4 py-2 text-sm font-semibold text-blue-700 bg-white rounded-lg hover:bg-blue-50 border border-blue-300 transition-all shadow-sm hover:shadow-md"
                type="button"
              >
                Export Selected
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
      </section>

      {/* FIXED: Remove the !onViewDetails condition */}
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
            // Prefer deriving year from ojt_id if available, else fallback to deployment_date year
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
            // Send update to backend and reflect changes locally
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

              // apiCall returns a Response when not ok
              if ((res as Response)?.ok === false) {
                // try to extract message
                let msg = "Failed to update intern";
                try {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  msg = (await (res as Response).json())?.message || msg;
                } catch {}
                toast.error(msg);
                return;
              }

              // res should be the success object { status, ok, message, data }
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              const updated = (res as any)?.data ?? (res as any);

              if (!updated) {
                toast.success("Intern updated");
                setEditingIntern(null);
                return;
              }

              // Update local editedInterns to reflect changed fields
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
    </>
  );
};
