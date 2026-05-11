"use client";

import { Download, Eye, Trash2 } from "lucide-react";
import { JSX, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import ApplicationDetails from "../ApplicationDetailsModal";
import ChangeStatusModal from "../ChangeStatusModal";

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

const applications: ApplicationRow[] = [
  {
    id: "NTC-\n000005",
    applicantName: "Jude Yecla",
    applicantEmail: "fab@gmail.com",
    applicantPhone: "9562278589",
    applicationType: ["OJT", "Application"],
    details: [
      "Aklan State University - Kalibo",
      "BS in Micro Economics",
      "123 hours",
      "Deploy: May 26, 2026",
    ],
    submissionDate: ["May 5,", "2026"],
    status: "Pending",
  },
  {
    id: "NTC-\n000003",
    applicantName: "Mark Henry",
    applicantEmail: "fabrosadrian02@gmail.com",
    applicantPhone: "9562278589",
    applicationType: ["OJT", "Application"],
    details: [
      "Bulacan State University - Hagonoy",
      "BS in Computer Engineering",
      "125 hours",
      "Deploy: May 19, 2026",
    ],
    submissionDate: ["May 5,", "2026"],
    status: "For interview",
  },
  {
    id: "NTC-\n000001",
    applicantName: "Adrian Fabros",
    applicantEmail: "fabrosadrian0@gmail.com",
    applicantPhone: "9562278589",
    applicationType: ["OJT", "Application"],
    details: [
      "Adamson University",
      "BA in Anthropology",
      "1231 hours",
      "Deploy: Apr 29, 2026",
    ],
    submissionDate: ["May 4,", "2026"],
    status: "For interview",
  },
];

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
    () => {
      try {
        const raw = localStorage.getItem("ojt_applications");
        return raw ? (JSON.parse(raw) as ApplicationRow[]) : applications;
      } catch (err) {
        return applications;
      }
    },
  );
  const mountedRef = useRef(false);
  const [applicationToDelete, setApplicationToDelete] =
    useState<ApplicationRow | null>(null);
  const [changeStatusApplication, setChangeStatusApplication] =
    useState<ApplicationRow | null>(null);

  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status")?.toLowerCase() ?? null;

  // Filter applications based on `status` query param
  const filteredApplications = applicationsState.filter((a) =>
    statusParam ? a.status.toLowerCase().includes(statusParam) : true,
  );

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

  // Persist applications to localStorage and notify listeners
  useEffect(() => {
    // avoid dispatch on first mount when loading from localStorage
    if (!mountedRef.current) {
      mountedRef.current = true;
      // ensure localStorage has initial data (if empty)
      try {
        const raw = localStorage.getItem("ojt_applications");
        if (!raw)
          localStorage.setItem(
            "ojt_applications",
            JSON.stringify(applicationsState),
          );
      } catch (err) {
        // ignore
      }
      return;
    }

    try {
      localStorage.setItem(
        "ojt_applications",
        JSON.stringify(applicationsState),
      );
      window.dispatchEvent(new Event("applications:update"));
    } catch (err) {
      // ignore write errors
    }
  }, [applicationsState]);

  return (
    <section className="w-full overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Applications</h2>
          <p className="text-sm text-slate-400">
            Showing {filteredApplications.length} of {applicationsState.length}{" "}
            applications
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          <Download size={16} />
          Export to Excel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column}
                  className={`px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase ${
                    index === 0 ? "w-14" : ""
                  }`}
                >
                  {index === 0 ? (
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300"
                      checked={allSelected}
                      onChange={handleSelectAll}
                    />
                  ) : (
                    column
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredApplications.map((application, index) => (
              <tr
                key={`${application.id}-${index}`}
                className="border-t border-slate-100 hover:bg-slate-50/40"
              >
                {/* Checkbox */}
                <td className="px-6 py-6 align-top">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={selectedRows.has(application.id)}
                    onChange={() => handleRowSelect(application.id)}
                  />
                </td>

                {/* ID */}
                <td className="px-6 py-6 align-top whitespace-pre-line text-sm text-slate-600">
                  {application.id}
                </td>

                {/* Applicant */}
                <td className="px-6 py-6 align-top">
                  <div className="font-semibold text-slate-800">
                    {application.applicantName}
                  </div>

                  <div className="text-sm text-slate-500">
                    {application.applicantEmail}
                  </div>

                  <div className="text-sm text-slate-500">
                    {application.applicantPhone}
                  </div>
                </td>

                {/* Type */}
                <td className="px-6 py-6 align-top text-sm font-medium text-slate-700">
                  {application.applicationType[0]}
                  <br />
                  {application.applicationType[1]}
                </td>

                {/* Details */}
                <td className="px-6 py-6 align-top">
                  <div className="space-y-1 text-sm text-slate-500">
                    {application.details.map((detail, idx) => (
                      <p key={idx}>{detail}</p>
                    ))}
                  </div>
                </td>

                {/* Submission Date */}
                <td className="px-6 py-6 align-top text-sm text-slate-600">
                  {application.submissionDate[0]}
                  <br />
                  {application.submissionDate[1]}
                </td>

                {/* Status */}
                <td className="px-6 py-6 align-top">
                  {String(application.status)
                    .toLowerCase()
                    .includes("pending") ? (
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      {application.status}
                    </span>
                  ) : String(application.status)
                      .toLowerCase()
                      .includes("interview") ? (
                    <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600">
                      {application.status}
                    </span>
                  ) : String(application.status)
                      .toLowerCase()
                      .includes("accept") ? (
                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                      {application.status}
                    </span>
                  ) : String(application.status)
                      .toLowerCase()
                      .includes("reject") ? (
                    <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                      {application.status}
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {application.status}
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-6 align-top">
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-md bg-blue-50 p-2 text-blue-500 transition hover:bg-blue-100"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      className="rounded-md bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                      onClick={() => setApplicationToDelete(application)}
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
      {selectedApplication && (
        <ApplicationDetails
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onChangeStatus={() => {
            // Keep the details modal open and open the change-status modal on top
            setChangeStatusApplication(selectedApplication);
          }}
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
          onConfirm={(newStatus: string, id: string) => {
            setApplicationsState((prev) => {
              const next = prev.map((a) =>
                a.id === id ? { ...a, status: newStatus } : a,
              );

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
