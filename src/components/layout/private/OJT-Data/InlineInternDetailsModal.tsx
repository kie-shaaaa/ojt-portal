"use client";
import React from "react";
import { X, FileText, Eye, Download } from "lucide-react";

export type ModalInternData = {
  ojtId: string;
  portalId: string;
  name: string;
  gender: string;
  email: string;
  phone: string;
  school: string;
  course: string;
  hoursNeeded: string;
  deploymentDate: string;
  endDate: string;
  requirementFiles?: Array<{ id: string; title: string; subtitle?: string; fileType: "PDF" | "JPG/PNG" }>;
};

type Props = {
  intern: ModalInternData;
  onClose: () => void;
};

export const InlineInternDetailsModal = ({ intern, onClose }: Props) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-[100000] w-[672px] max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-lg">
        <header className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-bold text-blue-800">Intern Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-sm hover:bg-gray-100"
            aria-label="Close intern details"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </header>

        <main className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 88px)" }}>
          <dl className="grid grid-cols-[200px_1fr] gap-y-3 gap-x-6 items-start">
            <dt className="text-sm text-gray-700">Portal ID:</dt>
            <dd className="text-sm text-gray-600">{intern.portalId}</dd>

            <dt className="text-sm text-gray-700">OJT ID:</dt>
            <dd className="text-sm font-bold text-gray-900">{intern.ojtId}</dd>

            <dt className="text-sm text-gray-700">Name:</dt>
            <dd className="text-sm text-gray-600">{intern.name}</dd>

            <dt className="text-sm text-gray-700">Gender:</dt>
            <dd className="text-sm text-gray-600">{intern.gender}</dd>

            <dt className="text-sm text-gray-700">Email:</dt>
            <dd className="text-sm text-gray-600"><a className="text-blue-600 hover:underline" href={`mailto:${intern.email}`}>{intern.email}</a></dd>

            <dt className="text-sm text-gray-700">Phone:</dt>
            <dd className="text-sm text-gray-600">{intern.phone}</dd>

            <dt className="text-sm text-gray-700">School:</dt>
            <dd className="text-sm text-gray-600">{intern.school}</dd>

            <dt className="text-sm text-gray-700">Course:</dt>
            <dd className="text-sm text-gray-600">{intern.course}</dd>

            <dt className="text-sm text-gray-700">Hours Needed:</dt>
            <dd className="text-sm text-gray-600">{intern.hoursNeeded}</dd>

            <dt className="text-sm text-gray-700">Deployment Date:</dt>
            <dd className="text-sm text-gray-600">{formatDate(intern.deploymentDate)}</dd>

            <dt className="text-sm text-gray-700">End Date:</dt>
            <dd className="text-sm text-gray-600">{formatDate(intern.endDate)}</dd>

            <dt className="text-sm text-gray-700">Requirement File/s:</dt>
            <dd className="space-y-4">
              {(intern.requirementFiles || []).map((file) => (
                <div key={file.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-white rounded">
                      <FileText size={20} className={file.fileType === "PDF" ? "text-red-500" : "text-blue-500"} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{file.title}</div>
                      {file.subtitle && <div className="text-xs text-gray-500">{file.subtitle}</div>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700">
                      <Eye size={14} />
                      <span className="text-xs">View File</span>
                    </button>
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border rounded hover:bg-gray-50">
                      <Download size={14} />
                      <span className="text-xs">Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </dd>
          </dl>
        </main>
      </div>
    </div>
  );
};

export default InlineInternDetailsModal;
