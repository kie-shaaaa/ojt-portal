"use client";

import { Download, Eye, Pencil, Trash2, Search } from "lucide-react";
import { JSX, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { apiCall } from "@/lib/api";

import ConfirmDeleteModal from "../ConfirmDeleteModal";
import ApplicationDetails from "../ApplicationDetailsModal";
import ChangeStatusModal from "../ChangeStatusModal";

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

type Props = {
  applications: Application[];
  isLoading: boolean;
  onDeleteApplication: (applicationId: number) => void;
  onStatusChange: (applicationId: number, status: string) => void;
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

const normalizeFilterText = (value: string) =>
  value.toLowerCase().replace(/[\_\s-]+/g, "");

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
}: Props): JSX.Element => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationRow | null>(null);

  const [applicationToDelete, setApplicationToDelete] =
    useState<ApplicationRow | null>(null);

  const [changeStatusApplication, setChangeStatusApplication] =
    useState<ApplicationRow | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const searchParams = useSearchParams();

  const statusParam = searchParams.get("status");
  const normalizedStatusParam = statusParam
    ? normalizeFilterText(statusParam)
    : null;

  const applicationsState = useMemo(
    () => mapApplications(applications),
    [applications],
  );

  const filteredApplications = useMemo(() => {
    return applicationsState.filter((application) => {
      const matchesStatus = normalizedStatusParam
        ? normalizeFilterText(application.status).includes(
            normalizedStatusParam,
          )
        : true;

      const matchesSearch = searchQuery
        ? [
            application.id,
            application.applicantName,
            application.applicantEmail,
            application.applicantPhone,
          ]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;

      return matchesStatus && matchesSearch;
    });
  }, [applicationsState, normalizedStatusParam, searchQuery]);

  const allSelected =
    filteredApplications.length > 0 &&
    filteredApplications.every((a) => selectedRows.has(a.id));

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

  useEffect(() => {
    setSelectedRows(new Set());
  }, [searchQuery, normalizedStatusParam]);

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
      console.error("Failed to delete application:", error);
      alert("Failed to delete application. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col border-b border-slate-100">
        <div className="flex items-center justify-between px-6 py-5">
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

          <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-95">
            <Download size={18} className="text-slate-500" />
            Export
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={searchQuery}
              placeholder="Search by name, email, phone, or ID..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-11 text-sm shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative min-h-[400px] overflow-x-auto">
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
              We couldn't find any applications matching your current search or
              filter criteria.
            </p>

            <button
              onClick={() => setSearchQuery("")}
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
            {filteredApplications.map((application, index) => (
              <tr
                key={`${application.id}-${index}`}
                className={`group transition-all duration-200 hover:bg-blue-50/30 ${
                  selectedRows.has(application.id) ? "bg-blue-50/50" : ""
                }`}
              >
                {/* Checkbox */}
                <td className="px-6 py-6 align-top">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(application.id)}
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
                  <div className="font-bold text-slate-900 transition-colors group-hover:text-blue-700">
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

                {/* Details */}
                <td className="px-6 py-6 align-top">
                  <div className="space-y-2">
                    <p className="line-clamp-1 text-sm font-bold leading-tight text-slate-700">
                      {application.details[0]}
                    </p>

                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-medium text-slate-500">
                        {application.details[1]}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold tracking-tighter text-slate-600 uppercase">
                          {application.details[2]}
                        </span>

                        <span className="rounded border border-blue-100 bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold tracking-tighter text-blue-600 uppercase">
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
                <td className="px-6 py-6 align-top">
                  <div className="flex items-center gap-2">
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
    </section>
  );
};
