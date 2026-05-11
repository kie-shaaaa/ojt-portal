"use client";

import { Download, Eye, Trash2 } from "lucide-react";
import { JSX, useState } from "react";
import ApplicationDetails from "../ApplicationDetailsModal";

type ApplicationRow = {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicationType: string[];
  details: string[];
  submissionDate: string[];
  status: "Pending" | "For interview";
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
  // State to track selected rows
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationRow | null>(null);

  // Check if all rows are selected
  const allSelected = selectedRows.size === applications.length;

  // Handle header checkbox click
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(applications.map((_, index) => index)));
    }
  };

  // Handle individual row checkbox click
  const handleRowSelect = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  return (
    <section className="w-full overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Applications</h2>
          <p className="text-sm text-slate-400">
            Showing {applications.length} of {applications.length} applications
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
            {applications.map((application, index) => (
              <tr
                key={`${application.id}-${index}`}
                className="border-t border-slate-100 hover:bg-slate-50/40"
              >
                {/* Checkbox */}
                <td className="px-6 py-6 align-top">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={selectedRows.has(index)}
                    onChange={() => handleRowSelect(index)}
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
                  {application.status === "Pending" ? (
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      Pending
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600">
                      For interview
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

                    <button className="rounded-md bg-red-50 p-2 text-red-500 transition hover:bg-red-100">
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
        />
      )}
    </section>
  );
};
