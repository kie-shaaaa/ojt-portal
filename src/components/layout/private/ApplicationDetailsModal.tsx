import {
  X,
  Pencil,
} from "lucide-react";
import { JSX } from "react";

type DetailRow = {
  label: string;
  value: string;
  isParagraph?: boolean;
  borderClass?: string;
};

const detailRows: DetailRow[] = [
  { label: "Application ID:", value: "NTC-000017" },
  { label: "Applicant Name:", value: "Kie Villanueva" },
  { label: "Email:", value: "k@gmail.com" },
  { label: "Phone:", value: "9627067133" },
  { label: "Application Type:", value: "OJT Application" },
  {
    label: "Submission Date:",
    value: "May 5, 2026 at 04:26 PM",
    isParagraph: true,
  },
  {
    label: "School Name:",
    value: "Aklan State University - Kalibo",
    isParagraph: true,
  },
  { label: "Course/Program:", value: "BA in Broadcasting" },
  { label: "Hours Required:", value: "12 hours" },
  {
    label: "Deployment Date:",
    value: "May 12, 2026",
    borderClass: "border-transparent",
  },
];

const standardRowClass =
  "grid grid-cols-3 h-fit px-0 py-4 border-b border-gray-100";

export const ApplicationDetails = (): JSX.Element => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      {/* Overlay */}
      <div
        className="flex w-full items-center justify-center bg-black/50 p-4"
        aria-hidden="true"
      >
        {/* Modal */}
        <section
          className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl"
          aria-labelledby="application-details-title"
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-gray-100 px-8 py-6">
            <h1
              id="application-details-title"
              className="text-xl font-semibold text-blue-800"
            >
              Application Details
            </h1>

            <button
              type="button"
              aria-label="Close application details"
              className="text-gray-400 transition hover:text-gray-600"
            >
              <X size={22} strokeWidth={2.2} />
            </button>
          </header>

          {/* Content */}
          <div className="flex flex-col px-8 py-4">
            {/* First Rows */}
            {detailRows.slice(0, 6).map((row) => (
              <div
                key={row.label}
                className={`${standardRowClass} ${row.borderClass ?? ""}`}
              >
                <div className="flex items-start">
                  <dt className="text-sm font-medium text-gray-700">
                    {row.label}
                  </dt>
                </div>

                <div className="col-span-2 flex items-start">
                  {row.isParagraph ? (
                    <p className="text-sm text-gray-600">{row.value}</p>
                  ) : (
                    <dd className="text-sm text-gray-600">{row.value}</dd>
                  )}
                </div>
              </div>
            ))}

            {/* Current Status */}
            <div className="grid grid-cols-3 border-b border-gray-100 py-4">
              <div className="flex items-center">
                <dt className="text-sm font-medium text-gray-700">
                  Current Status:
                </dt>
              </div>

              <div className="col-span-2 flex items-center gap-3">
                <div
                  className="rounded-full bg-purple-100 px-3 py-1"
                  aria-label="Current application status"
                >
                  <span className="text-xs font-medium text-purple-600">
                    for interview
                  </span>
                </div>

                <button
                  type="button"
                  aria-label="Change application status"
                  className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-blue-800"
                >
                  <Pencil size={14} strokeWidth={2.2} />
                  Change Status
                </button>
              </div>
            </div>

            {/* Remaining Rows */}
            {detailRows.slice(6).map((row) => (
              <div
                key={row.label}
                className={`${standardRowClass} ${row.borderClass ?? ""}`}
              >
                <div className="flex items-start">
                  <dt className="text-sm font-medium text-gray-700">
                    {row.label}
                  </dt>
                </div>

                <div className="col-span-2 flex items-start">
                  {row.isParagraph ? (
                    <p className="text-sm text-gray-600">{row.value}</p>
                  ) : (
                    <dd className="text-sm text-gray-600">{row.value}</dd>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ApplicationDetails;