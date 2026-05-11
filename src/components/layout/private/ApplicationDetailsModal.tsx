import { X, Pencil } from "lucide-react";
import { JSX } from "react";

type DetailRow = {
  label: string;
  value: string;
  isParagraph?: boolean;
  borderClass?: string;
};

const standardRowClass =
  "grid grid-cols-3 h-fit px-0 py-4 border-b border-gray-100";

interface ApplicationDetailsProps {
  application?: {
    id?: string;
    applicantName?: string;
    applicantEmail?: string;
    applicantPhone?: string;
    applicationType?: string[];
    details?: string[];
    submissionDate?: string[];
    status?: string;
  } | null;
  onClose: () => void;
  onChangeStatus?: () => void;
}

export const ApplicationDetails = ({
  application,
  onClose,
  onChangeStatus,
}: ApplicationDetailsProps): JSX.Element => {
  const rows: DetailRow[] = [
    { label: "Application ID:", value: application?.id ?? "—" },
    { label: "Applicant Name:", value: application?.applicantName ?? "—" },
    { label: "Email:", value: application?.applicantEmail ?? "—" },
    { label: "Phone:", value: application?.applicantPhone ?? "—" },
    {
      label: "Application Type:",
      value: application?.applicationType?.join(" ") ?? "—",
    },
    {
      label: "Submission Date:",
      value: application?.submissionDate?.join(" ") ?? "—",
      isParagraph: true,
    },
    {
      label: "School Name:",
      value: application?.details?.[0] ?? "—",
      isParagraph: true,
    },
    { label: "Course/Program:", value: application?.details?.[1] ?? "—" },
    { label: "Hours Required:", value: application?.details?.[2] ?? "—" },
    {
      label: "Deployment Date:",
      value: application?.details?.[3] ?? "—",
      borderClass: "border-transparent",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Modal */}
      <section
        className="relative w-full max-w-2xl max-h-[90vh] overflow-auto rounded-xl bg-white shadow-2xl"
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
            onClick={onClose}
          >
            <X size={22} strokeWidth={2.2} />
          </button>
        </header>

        {/* Content */}
        <div className="flex flex-col px-8 py-4">
          {/* First Rows */}
          {rows.slice(0, 6).map((row) => (
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
                  {application?.status ?? "—"}
                </span>
              </div>

              <button
                type="button"
                aria-label="Change application status"
                className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-blue-800"
                onClick={() => onChangeStatus?.()}
              >
                <Pencil size={14} strokeWidth={2.2} />
                Change Status
              </button>
            </div>
          </div>

          {/* Remaining Rows */}
          {rows.slice(6).map((row) => (
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
  );
};

export default ApplicationDetails;
