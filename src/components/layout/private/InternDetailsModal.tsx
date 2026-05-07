import {
  X,
  Eye,
  Download,
  FileText,
} from "lucide-react";
import { JSX } from "react";

type DetailRow = {
  label: string;
  value: string;
  bold?: boolean;
};

type RequirementFile = {
  title: string;
};

const detailRows: DetailRow[] = [
  { label: "Portal ID:", value: "OJT-000001" },
  { label: "OJT ID:", value: "2026-001", bold: true },
  { label: "Name:", value: "Kie Villanueva" },
  { label: "Gender:", value: "Female" },
  { label: "Email:", value: "kkkk@gmail.com" },
  { label: "Phone:", value: "9627067133" },
  { label: "School:", value: "Adamson University" },
  { label: "Course:", value: "BA in Anthropology" },
  { label: "Hours Needed:", value: "21 hours" },
  { label: "Deployment Date:", value: "May 11, 2026" },
  { label: "End Date:", value: "May 12, 2026" },
];

const requirementFiles: RequirementFile[] = [
  { title: "RESUME OR CV" },
  { title: "PROOF OF ENROLLMENT" },
  { title: "DRAFT ENDORSEMENT LETTER" },
  { title: "VACCINE CARD OR MEDICAL CERT" },
  { title: "DRAFT MEMORANDUM OF AGREEMENT" },
  { title: "1X1 PICTURE" },
];

const FileCard = ({ title }: { title: string }): JSX.Element => {
  return (
    <div className="flex w-full flex-col gap-2">
      {/* File Box */}
      <div className="flex items-center rounded-lg border border-gray-100 bg-gray-50 p-3">
        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-md bg-red-100">
          <FileText className="h-5 w-5 text-red-600" />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900">
            {title}
          </span>

          <span className="text-[10px] font-semibold uppercase text-gray-500">
            PDF
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded bg-blue-700 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-800"
        >
          <Eye size={14} />
          View File
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <Download size={14} />
          Download
        </button>
      </div>
    </div>
  );
};

export const ModalBackdrop = (): JSX.Element => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="intern-details-title"
        className="flex h-[920px] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h1
            id="intern-details-title"
            className="text-lg font-bold text-blue-800"
          >
            Intern Details
          </h1>

          <button
            type="button"
            aria-label="Close modal"
            className="text-gray-400 transition hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-4">
          {/* Details */}
          {detailRows.map((row) => (
            <div
              key={row.label}
              className="flex border-b border-gray-100 py-3"
            >
              <div className="w-1/3">
                <dt className="text-sm text-gray-700">
                  {row.label}
                </dt>
              </div>

              <div className="w-2/3">
                <dd
                  className={`text-sm ${
                    row.bold
                      ? "font-bold text-gray-900"
                      : "text-gray-600"
                  }`}
                >
                  {row.value}
                </dd>
              </div>
            </div>
          ))}

          {/* Requirement Files */}
          <div className="flex py-4">
            <div className="w-1/3">
              <span className="text-sm text-gray-700">
                Requirement File/s:
              </span>
            </div>

            <div className="flex w-2/3 flex-col gap-6">
              {requirementFiles.map((file) => (
                <FileCard
                  key={file.title}
                  title={file.title}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModalBackdrop;