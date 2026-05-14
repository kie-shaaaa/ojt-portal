"use client";
import { FileText, Eye, Download } from "lucide-react";
import { JSX } from "react";

type RequirementFileItem = {
  id: string;
  title: string;
  subtitle?: string;
  fileType: "PDF" | "JPG/PNG";
};

const requirementFiles: RequirementFileItem[] = [
  {
    id: "resume-or-cv",
    title: "RESUME OR CV",
    fileType: "PDF",
  },
  {
    id: "proof-of-enrollment",
    title: "PROOF OF ENROLLMENT",
    fileType: "PDF",
  },
  {
    id: "draft-endorsement-letter",
    title: "DRAFT ENDORSEMENT LETTER",
    subtitle: "(ADDRESS TO CHIEF. FLORA R. RALAR)",
    fileType: "PDF",
  },
  {
    id: "vaccine-card-or-medical-cert",
    title: "VACCINE CARD OR MEDICAL CERT.",
    subtitle: "(XEROX COPY)",
    fileType: "PDF",
  },
  {
    id: "draft-memorandum-of-agreement",
    title: "DRAFT MEMORANDUM OF AGREEMENT",
    fileType: "PDF",
  },
  {
    id: "1x1-picture",
    title: "1X1 PICTURE",
    fileType: "JPG/PNG",
  },
];

export const RequirementFilesSection = (): JSX.Element => {
  return (
    <section className="flex items-start px-0 py-4 relative self-stretch w-full flex-[0_0_auto]">
      {/* Label Column */}
      <div className="flex flex-col w-[202.66px] items-start relative self-stretch">
        <h2 className="relative flex items-center w-fit mt-[-1.00px] font-normal text-gray-700 text-sm tracking-[0] leading-5 whitespace-nowrap">
          Requirement File/s:
        </h2>
      </div>

      {/* Files Column */}
      <div className="flex flex-col w-[405.33px] items-start relative self-stretch">
        <div
          className="relative self-stretch w-full max-h-80 overflow-y-auto overflow-x-hidden"
          role="list"
          aria-label="Requirement files"
        >
          <div className="flex flex-col w-full items-start gap-3">
            {requirementFiles.map((file) => (
              <div
                key={file.id}
                className="flex flex-col items-start gap-2 relative self-stretch w-full"
                role="listitem"
              >
                {/* File Card */}
                <div className="flex items-center p-3 gap-3 relative self-stretch w-full bg-gray-50 rounded-lg border border-solid border-gray-100">
                  {/* File Icon */}
                  <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
                    {file.fileType === "PDF" ? (
                      <div className="relative w-8 h-8">
                        <FileText
                          size={26}
                          className="text-red-500 absolute"
                          fill="#fef2f2"
                        />
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] font-bold text-red-600 bg-white px-1 rounded">
                          PDF
                        </span>
                      </div>
                    ) : (
                      <div className="relative w-8 h-8 flex items-center justify-center bg-blue-50 rounded">
                        <FileText
                          size={22}
                          className="text-blue-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-bold text-gray-900 leading-[17.5px] whitespace-nowrap truncate">
                      {file.title}
                    </span>
                    {file.subtitle && (
                      <span className="text-[10px] font-bold text-gray-500 leading-[15px] whitespace-nowrap">
                        {file.subtitle}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-gray-400 leading-[15px]">
                      {file.fileType}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-4 py-[9px] bg-[#003da5] rounded hover:bg-[#002d7a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    aria-label={`View file ${file.title}`}
                  >
                    <Eye size={14} className="text-white" />
                    <span className="text-xs font-normal text-white leading-4 whitespace-nowrap">
                      View File
                    </span>
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded border border-solid border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    aria-label={`Download file ${file.title}`}
                  >
                    <Download size={14} className="text-gray-700" />
                    <span className="text-xs font-normal text-gray-700 leading-4 whitespace-nowrap">
                      Download
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};