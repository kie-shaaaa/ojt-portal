"use client";
import InternDetailsModal, { ModalInternData } from "../InternDetailsModal";
import ChangeInterDetailsModal from "../ChangeInterDetailsModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import { JSX, useState, useEffect } from "react";
import { Download, Eye, SquarePen, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import { apiCall } from "@/lib/api";

interface Intern {
  id: string;
  ojtId: string;
  name: string;
  email: string;
  school: string;
  startDate: string;
  endDate: string;
  status: "verified" | "completed";
  verifiedDate: string;
  gender?: string;
  ojtDetails?: string;
  deploymentDate?: string;
}

interface VerifiedInternsTableSectionProps {
  interns: Intern[];
  onViewDetails?: (intern: ModalInternData) => void;
}

export const VerifiedInternsTableSection = ({
  interns,
  onViewDetails,
}: VerifiedInternsTableSectionProps): JSX.Element => {
  const [selectedInterns, setSelectedInterns] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [viewingIntern, setViewingIntern] = useState<ModalInternData | null>(
    null,
  );
  const [editingIntern, setEditingIntern] = useState<Intern | null>(null);
  const [internToDelete, setInternToDelete] = useState<Intern | null>(null);
  const [rows, setRows] = useState<Intern[]>(interns);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch interns from backend on mount
  useEffect(() => {
    const fetchInterns = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiCall("/ojt/fetch-all?count=100", {
          method: "GET",
        });

        if (response && Array.isArray(response)) {
          setRows(response);
        } else if (response && typeof response === "object") {
          // Handle case where response is wrapped
          const data = response.data || response.interns || [];
          setRows(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch interns:", err);
        setError("Failed to load interns from server");
        // Fall back to provided interns prop
        setRows(interns);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterns();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedInterns([]);
    } else {
      setSelectedInterns(rows.map((intern) => intern.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectIntern = (id: string) => {
    if (selectedInterns.includes(id)) {
      setSelectedInterns(selectedInterns.filter((internId) => internId !== id));
      setSelectAll(false);
    } else {
      setSelectedInterns([...selectedInterns, id]);
      if (selectedInterns.length + 1 === interns.length) {
        setSelectAll(true);
      }
    }
  };

  const exportToExcel = (dataToExport: Intern[]) => {
    const excelData = dataToExport.map((intern) => ({
      "OJT ID": intern.ojtId,
      "Intern Name": intern.name,
      Gender: intern.gender || "Not set",
      School: intern.school,
      "OJT Details": intern.ojtDetails || "—",
      "Deployment Date": formatDate(intern.startDate),
      "End Date": formatDate(intern.endDate),
      Email: intern.email,
      Status: intern.status,
      "Verified Date": formatDate(intern.verifiedDate),
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
    const requirementFiles = [
      { id: "resume-or-cv", title: "RESUME OR CV", fileType: "PDF" as const },
      {
        id: "proof-of-enrollment",
        title: "PROOF OF ENROLLMENT",
        fileType: "PDF" as const,
      },
      {
        id: "draft-endorsement-letter",
        title: "DRAFT ENDORSEMENT LETTER",
        subtitle: "(ADDRESS TO CHIEF. FLORA R. RALAR)",
        fileType: "PDF" as const,
      },
      {
        id: "vaccine-card-or-medical-cert",
        title: "VACCINE CARD OR MEDICAL CERT.",
        subtitle: "(XEROX COPY)",
        fileType: "PDF" as const,
      },
      {
        id: "draft-memorandum-of-agreement",
        title: "DRAFT MEMORANDUM OF AGREEMENT",
        fileType: "PDF" as const,
      },
      { id: "1x1-picture", title: "1X1 PICTURE", fileType: "JPG/PNG" as const },
    ];

    const modalData: ModalInternData = {
      ojtId: intern.ojtId,
      portalId: intern.ojtId.replace("NTC-", "OJT-"),
      name: intern.name,
      gender: intern.gender || "Not specified",
      email: intern.email,
      phone: "N/A",
      school: intern.school,
      course: intern.ojtDetails || "Not specified",
      hoursNeeded: "N/A",
      deploymentDate: intern.startDate,
      endDate: intern.endDate,
      requirementFiles,
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 pb-4 w-full border-b border-slate-100 bg-gradient-to-r from-slate-50 to-transparent">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <h3 className="text-xl font-bold text-slate-900">
                Verified Interns
              </h3>
            </div>
            <p className="text-sm text-slate-500 ml-4">
              {isLoading
                ? "Loading..."
                : `${rows.length} record${rows.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <div className="flex gap-2">
            {/* Export to Excel Button */}
            <button
              onClick={handleExportExcel}
              disabled={isLoading || rows.length === 0}
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              {error && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">⚠️</span>
                      </div>
                      <p className="text-red-600 font-semibold">{error}</p>
                    </div>
                  </td>
                </tr>
              )}
              {isLoading && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-8 h-8">
                        <div className="absolute inset-0 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
                        <div className="absolute inset-1 border-2 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                      </div>
                      <p className="text-slate-600 font-medium">
                        Loading interns...
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {!isLoading && interns.length === 0 && rows.length === 0 && (
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
              {!isLoading &&
                rows.map((intern, idx) => (
                  <tr
                    key={intern.id}
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
                          aria-label={`Select intern ${intern.name}`}
                        />
                      </label>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-blue-600">
                      {intern.ojtId}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {intern.name}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                        {intern.gender || "Not set"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 text-sm">
                      {intern.school}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm max-w-xs truncate">
                      {intern.ojtDetails || (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-700 text-sm whitespace-nowrap font-medium">
                      {formatDate(intern.startDate)}
                    </td>
                    <td className="px-6 py-4 text-slate-700 text-sm whitespace-nowrap font-medium">
                      {formatDate(intern.endDate)}
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
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-blue-200 flex items-center justify-between w-full">
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
          message={`Are you sure you want to delete ${internToDelete.name}? This action cannot be undone.`}
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
            id: editingIntern.id,
            name: editingIntern.name,
            ojtYear:
              new Date(editingIntern.startDate).getFullYear().toString() ||
              "2026",
            ojtNumber: (() => {
              const parts = editingIntern.ojtId?.split("-") || [];
              const last = parts.length
                ? parts[parts.length - 1]
                : editingIntern.ojtId;
              return (last || "001").slice(-3).padStart(3, "0");
            })(),
            gender: editingIntern.gender || "Female",
            deploymentDate: editingIntern.startDate,
            endDate: editingIntern.endDate,
          }}
          onClose={() => setEditingIntern(null)}
          onSave={(payload) => {
            // Apply changes to the local rows state so the table reflects edits
            const computeNewOjtId = (oldId: string | undefined, p: any) => {
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
                      startDate: payload.deploymentDate ?? r.startDate,
                      endDate: payload.endDate ?? r.endDate,
                      ojtId: computeNewOjtId(r.ojtId, payload),
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
