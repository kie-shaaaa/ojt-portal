"use client";
import InternDetailsModal, { ModalInternData } from "../InternDetailsModal";
import ChangeInterDetailsModal from "../ChangeInterDetailsModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import { JSX, useState, useEffect } from "react";
import { Download, Eye, SquarePen, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";

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
  const [selectAll, setSelectAll] = useState(false);
  const [viewingIntern, setViewingIntern] = useState<ModalInternData | null>(
    null,
  );
  const [editingIntern, setEditingIntern] = useState<Intern | null>(null);
  const [internToDelete, setInternToDelete] = useState<Intern | null>(null);
  const [rows, setRows] = useState<Intern[]>(interns);

  // Keep local rows in sync with parent-provided filtered data.
  useEffect(() => {
    setRows(interns);
  }, [interns]);

  useEffect(() => {
    setSelectedInterns((prev) =>
      prev.filter((id) => rows.some((r) => r.id === id)),
    );
  }, [rows]);

  useEffect(() => {
    setSelectAll(rows.length > 0 && selectedInterns.length === rows.length);
  }, [rows, selectedInterns]);

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
    if (selectAll) {
      setSelectedInterns([]);
    } else {
      setSelectedInterns(rows.map((intern) => intern.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectIntern = (id: number) => {
    if (selectedInterns.includes(id)) {
      setSelectedInterns(selectedInterns.filter((internId) => internId !== id));
      setSelectAll(false);
    } else {
      setSelectedInterns([...selectedInterns, id]);
      if (selectedInterns.length + 1 === rows.length) {
        setSelectAll(true);
      }
    }
  };

  const exportToExcel = (dataToExport: Intern[]) => {
    const excelData = dataToExport.map((intern) => ({
      "OJT ID": getOjtId(intern),
      "Intern Name": getInternName(intern),
      Gender: intern.gender || "Not set",
      School: intern.school_name || "Not set",
      "OJT Details": intern.course || "—",
      "Deployment Date": formatDate(intern.deployment_date),
      "End Date": formatDate(intern.end_date),
      Email: intern.email,
      Status: intern.original_status || "Not set",
      "Verified Date": formatDate(intern.confirmed_at),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const colWidths = [
      { wch: 15 },
      { wch: 25 },
      { wch: 10 },
      { wch: 35 },
      { wch: 30 },
      { wch: 18 },
      { wch: 15 },
      { wch: 30 },
      { wch: 12 },
      { wch: 18 },
    ];
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Verified Interns");

    const fileName = `verified_interns_${new Date().toISOString().split("T")[0]}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  const handleExportExcel = () => {
    if (selectedInterns.length > 0) {
      const selectedData = rows.filter((intern) =>
        selectedInterns.includes(intern.id),
      );
      exportToExcel(selectedData);
    } else {
      exportToExcel(rows);
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

    console.log("Opening inline modal for:", modalData.name);
    if (onViewDetails) {
      onViewDetails(modalData);
    } else {
      setViewingIntern(modalData);
    }
  };

  const handleEdit = (intern: Intern) => {
    // Open the Change Intern Details modal with mock data derived from the intern
    setEditingIntern(intern);
  };

  const handleDelete = (intern: Intern) => {
    // open confirm modal instead of native confirm()
    setInternToDelete(intern);
  };

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
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full flex-1">
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
              {rows.map((intern, idx) => (
                <tr
                  key={`intern-${intern.id}`}
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
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 text-sm font-semibold text-blue-700 bg-white rounded-lg hover:bg-blue-50 border border-blue-300 transition-all shadow-sm hover:shadow-md"
            >
              Export Selected
            </button>
          </div>
        )}
      </section>

      {/* FIXED: Remove the !onViewDetails condition */}
      {viewingIntern && (
        <InternDetailsModal
          intern={viewingIntern}
          onClose={() => {
            console.log("Closing inline modal");
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
            setRows((prev) => prev.filter((r) => r.id !== internToDelete.id));
            setSelectedInterns((prev) =>
              prev.filter((id) => id !== internToDelete.id),
            );
            setInternToDelete(null);
          }}
        />
      )}

      {editingIntern && (
        <ChangeInterDetailsModal
          intern={{
            id: editingIntern.id.toString(),
            name: getInternName(editingIntern),
            ojtYear:
              (editingIntern.deployment_date
                ? new Date(editingIntern.deployment_date)
                    .getFullYear()
                    .toString()
                : null) || "2026",
            ojtNumber: (() => {
              const parts = getOjtId(editingIntern)?.split("-") || [];
              const last = parts.length
                ? parts[parts.length - 1]
                : getOjtId(editingIntern);
              return (last || "001").slice(-3).padStart(3, "0");
            })(),
            gender: editingIntern.gender || "Female",
            deploymentDate: editingIntern.deployment_date || undefined,
            endDate: editingIntern.end_date || undefined,
          }}
          onClose={() => setEditingIntern(null)}
          onSave={(payload) => {
            // Apply changes to the local rows state so the table reflects edits
            const computeNewOjtId = (oldId: string, p: any) => {
              const parts = (oldId || "").split("-").filter(Boolean);
              if (parts.length >= 2) {
                // replace last with number
                parts[parts.length - 1] =
                  p.ojtNumber ?? parts[parts.length - 1];
                // replace year if provided
                if (p.ojtYear) parts[parts.length - 2] = p.ojtYear;
                return parts.join("-");
              }
              return `${p.ojtYear ?? "2026"}-${p.ojtNumber ?? "001"}`;
            };

            setRows((prev) =>
              prev.map((r) =>
                r.id === payload.id
                  ? {
                      ...r,
                      gender: payload.gender ?? r.gender,
                      deployment_date:
                        payload.deploymentDate ?? r.deployment_date,
                      end_date: payload.endDate ?? r.end_date,
                      ojt_id: computeNewOjtId(getOjtId(r), payload),
                    }
                  : r,
              ),
            );
            console.log("Saved intern details:", payload);
            setEditingIntern(null);
          }}
        />
      )}
    </>
  );
};
