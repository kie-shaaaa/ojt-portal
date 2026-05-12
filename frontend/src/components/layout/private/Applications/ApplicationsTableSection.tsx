"use client";

import {
  Download,
  Eye,
  Pencil,
  Trash2,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { JSX, useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import ApplicationDetails from "../ApplicationDetailsModal";
import ChangeStatusModal from "../ChangeStatusModal";
import { apiCall } from "@/lib/api";

type ApplicationRow = {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicationType: string[];
  details: string[];
  submissionDate: string[];
  status: string;
};

// Re-using the same icons/colors mapping logic based on standard statuses
const formatStatus = (status: string) => {
  const s = status.toLowerCase();
  if (s === "pending") return "Pending";
  if (s === "under_review") return "Under Review";
  if (s === "for_interview") return "For interview";
  if (s === "accepted") return "Accepted";
  if (s === "rejected") return "Rejected";
  return status;
};

const getStatusStyles = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes("pending"))
    return "bg-amber-50 text-amber-700 border-amber-100";
  if (s.includes("review")) return "bg-sky-50 text-sky-700 border-sky-100";
  if (s.includes("interview"))
    return "bg-purple-50 text-purple-700 border-purple-100";
  if (s.includes("accept"))
    return "bg-green-50 text-green-700 border-green-100";
  if (s.includes("reject")) return "bg-red-50 text-red-700 border-red-100";
  return "bg-slate-50 text-slate-700 border-slate-100";
};

const columns = [
  "",
  "ID",
  "APPLICANT",
  "APPLICATION TYPE",
  "DETAILS",
  "SUBMISSION DATE",
  "STATUS",
  "ACTIONS",
];

export const ApplicationsTableSection = (): JSX.Element => {
  // State to track selected rows by application ID
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationRow | null>(null);
  const [applicationsState, setApplicationsState] = useState<ApplicationRow[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [applicationToDelete, setApplicationToDelete] =
    useState<ApplicationRow | null>(null);
  const [changeStatusApplication, setChangeStatusApplication] =
    useState<ApplicationRow | null>(null);

  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status")?.toLowerCase() ?? null;
  const [searchResults, setSearchResults] = useState<ApplicationRow[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search using the /fetch endpoint
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const performSearch = async () => {
      try {
        setIsSearching(true);
        let endpoint = "/applications/fetch?";

        // Determine if searching by email or ID
        if (searchQuery.includes("@")) {
          endpoint += `email=${encodeURIComponent(searchQuery)}`;
        } else if (/^\d+$/.test(searchQuery)) {
          endpoint += `id=${searchQuery}`;
        } else {
          // For name search, filter client-side
          setSearchResults(
            applicationsState.filter(
              (a) =>
                a.applicantName
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                a.applicantEmail
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()),
            ),
          );
          setIsSearching(false);
          return;
        }

        const data = await apiCall(endpoint);
        if (Array.isArray(data) && data.length > 0) {
          // Map backend Application objects to ApplicationRow format
          const mapped: ApplicationRow[] = data.map((app: any) => ({
            id: `NTC-${String(app.id).padStart(6, "0")}`,
            applicantName: `${app.first_name} ${app.last_name}`,
            applicantEmail: app.email,
            applicantPhone: app.phone,
            applicationType: [app.application_type, "Application"],
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
          setSearchResults(mapped);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Search failed:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [searchQuery, applicationsState]);

  // Filter applications based on `status` query param and search results
  const filteredApplications = useMemo(() => {
    const baseApplications =
      searchQuery && searchResults.length > 0
        ? searchResults
        : applicationsState;
    return baseApplications.filter((a) => {
      const matchesStatus = statusParam
        ? a.status.toLowerCase().includes(statusParam)
        : true;
      return matchesStatus;
    });
  }, [applicationsState, statusParam, searchQuery, searchResults]);

  // Load applications from API on mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const data = await apiCall("/applications/fetch-all?count=100");

        if (Array.isArray(data)) {
          const mapped: ApplicationRow[] = data.map((app: any) => ({
            id: `NTC-${String(app.id).padStart(6, "0")}`,
            applicantName: `${app.first_name} ${app.last_name}`,
            applicantEmail: app.email,
            applicantPhone: app.phone,
            applicationType: [app.application_type, "Application"],
            details: [
              app.school_name || "N/A",
              app.course || "N/A",
              app.hours_needed ? `${app.hours_needed} hours` : "N/A",
              `Deploy: ${app.deployment_date ? new Date(app.deployment_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}`,
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
          setApplicationsState(mapped);
          localStorage.setItem("ojt_applications", JSON.stringify(mapped));
          window.dispatchEvent(new Event("applications:update"));
        }
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Check if all visible rows are selected
  const allSelected =
    filteredApplications.length > 0 &&
    filteredApplications.every((a) => selectedRows.has(a.id));

  // Handle header checkbox click (select/deselect all visible)
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredApplications.map((a) => a.id)));
    }
  };

  // Handle individual row checkbox click (by id)
  const handleRowSelect = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  return (
    <section className="w-full overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">
      {/* Header */}
      <div className="flex flex-col border-b border-slate-100">
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Applications
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              {isLoading
                ? "Synchronizing with database..."
                : `Total: ${applicationsState.length} • Showing: ${filteredApplications.length}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 shadow-sm active:scale-95">
              <Download size={18} className="text-slate-500" />
              Export
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 px-6 py-4 bg-slate-50/50 border-t border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isSearching && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[400px] relative">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-lg"></div>
            <p className="mt-4 text-sm font-bold text-slate-600 animate-pulse">
              Fetching valid applications...
            </p>
          </div>
        )}

        {!isLoading && filteredApplications.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              No applications found
            </h3>
            <p className="text-sm text-slate-500 max-w-xs">
              We couldn't find any applications matching your current search or
              filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
              }}
              className="mt-4 text-sm font-bold text-blue-600 hover:underline"
            >
              Clear all filters
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
                        className="h-5 w-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition cursor-pointer"
                        checked={allSelected}
                        onChange={handleSelectAll}
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
            {filteredApplications.map((application, index) => (
              <tr
                key={`${application.id}-${index}`}
                className={`group transition-all duration-200 hover:bg-blue-50/30 ${selectedRows.has(application.id) ? "bg-blue-50/50" : ""}`}
              >
                {/* Checkbox */}
                <td className="px-6 py-6 align-top">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition cursor-pointer"
                      checked={selectedRows.has(application.id)}
                      onChange={() => handleRowSelect(application.id)}
                    />
                  </div>
                </td>

                {/* ID */}
                <td className="px-6 py-6 align-top">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-600 border border-slate-200 shadow-sm">
                    {application.id.replace("\n", "")}
                  </span>
                </td>

                {/* Applicant */}
                <td className="px-6 py-6 align-top">
                  <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {application.applicantName}
                  </div>

                  <div className="text-sm text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    {application.applicantEmail}
                  </div>

                  <div className="text-sm text-slate-400 mt-0.5 flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                    {application.applicantPhone}
                  </div>
                </td>

                {/* Type */}
                <td className="px-6 py-6 align-top">
                  <div className="inline-flex flex-col">
                    <span className="text-sm font-bold text-slate-700">
                      {application.applicationType[0]}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                      {application.applicationType[1]}
                    </span>
                  </div>
                </td>

                {/* Details */}
                <td className="px-6 py-6 align-top">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-slate-700 leading-tight line-clamp-1">
                      {application.details[0]}
                    </p>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-medium text-slate-500">
                        {application.details[1]}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-tighter border border-slate-200">
                          {application.details[2]}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-[10px] font-bold text-blue-600 uppercase tracking-tighter border border-blue-100">
                          {application.details[3].replace("Deploy: ", "🚀 ")}
                        </span>
                      </div>
                    </div>
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
                <td className="px-6 py-6 align-top min-w-[160px]">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold ring-1 ring-inset shadow-sm ${getStatusStyles(application.status)}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse"></span>
                    {application.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-6 align-top">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="rounded-xl bg-white border border-slate-200 p-2.5 text-blue-600 shadow-sm transition hover:bg-blue-50 hover:border-blue-200 active:scale-90"
                      onClick={() => setSelectedApplication(application)}
                      title="View Profile"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      className="rounded-xl bg-white border border-slate-200 p-2.5 text-amber-600 shadow-sm transition hover:bg-amber-50 hover:border-amber-200 active:scale-90"
                      onClick={() => setChangeStatusApplication(application)}
                      title="Update Status"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      className="rounded-xl bg-white border border-slate-200 p-2.5 text-red-600 shadow-sm transition hover:bg-red-50 hover:border-red-200 active:scale-90"
                      onClick={() => setApplicationToDelete(application)}
                      title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
          onConfirm={() => {
            setApplicationsState((prev) =>
              prev.filter((a) => a.id !== applicationToDelete.id),
            );
            setSelectedRows(new Set());
            setApplicationToDelete(null);
          }}
        />
      )}

      {changeStatusApplication && (
        <ChangeStatusModal
          open={!!changeStatusApplication}
          application={changeStatusApplication}
          onClose={() => setChangeStatusApplication(null)}
          onConfirm={(
            newStatus: string,
            id: string,
            scheduleDate?: string,
            scheduleTime?: string,
          ) => {
            setApplicationsState((prev) => {
              const next = prev.map((a) => {
                if (a.id === id) {
                  const updated = { ...a, status: newStatus };
                  if (scheduleDate && scheduleTime) {
                    console.log(
                      `Schedule set for ${newStatus}: ${scheduleDate} at ${scheduleTime}`,
                    );
                  }
                  return updated;
                }
                return a;
              });

              setSelectedApplication((prevSelected) =>
                prevSelected && prevSelected.id === id
                  ? (next.find((a) => a.id === id) ?? null)
                  : prevSelected,
              );

              return next;
            });

            setChangeStatusApplication(null);
          }}
        />
      )}
    </section>
  );
};
