import { JSX } from "react";
import { X, Info, ExternalLink } from "lucide-react";
import { saveAs } from "file-saver";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  interns: {
    id: string;
    name: string;
    ojtNumber: string;
  }[];
}

const CANVA_LINK = "https://www.canva.com/design/DAHDhiNZ6GQ/hPc2CXRvdOOxICTpmHzisA/edit";

export default function CertificateModal({
  isOpen,
  onClose,
  interns,
}: CertificateModalProps): JSX.Element | null {
  if (!isOpen) return null;

  const handleExportAndOpenCanva = () => {
    if (interns.length === 0) return;

    // 1. Export logic to CSV
    const headers = ["OJT Number", "Certificate Text"];
    const csvRows = interns.map((intern) => [intern.ojtNumber, intern.name]);
    
    // Combine headers and rows, mapping arrays to CSV string
    const csvContent = [headers, ...csvRows]
      .map((row) => row.map((item) => `"${item}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `certificates_${new Date().toISOString().split("T")[0]}.csv`);

    // 2. Open Canva
    window.open(CANVA_LINK, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-3 sm:items-center sm:p-4">
      <div className="max-h-[calc(100vh-1.5rem)] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b px-4 py-4 sm:items-center sm:px-6 sm:py-4">
          <h3 className="text-xl font-semibold text-slate-800">
            Generate Certificates
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          <p className="mb-4 text-sm text-slate-700">
            You have selected <strong>{interns.length}</strong> intern(s)
            for certificate generation.
          </p>

          {/* Selected Interns */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="mb-3 text-sm font-semibold text-blue-700">
              Selected Interns:
            </h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {interns.map((intern) => (
                <div
                  key={intern.id}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                >
                  <p className="text-sm font-medium text-slate-800">
                    {intern.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {intern.ojtNumber}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tutorial Section */}
          <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50 p-4 sm:p-5">
            <h4 className="mb-4 flex items-center gap-2 text-base font-semibold text-blue-700">
              <Info size={18} />
              How to Generate Certificates
            </h4>
            <div className="flex flex-col gap-4">
              {/* Step 1 */}
              <div className="flex gap-4 rounded-xl bg-white p-3 sm:p-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  1
                </div>
                <div>
                  <p className="font-semibold text-blue-700">
                    Click "Export & Open Canva"
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    This will download a CSV file containing two columns:
                    <strong> OJT Number </strong> and
                    <strong> Certificate Text</strong>.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 rounded-xl bg-white p-3 sm:p-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  2
                </div>
                <div>
                  <p className="font-semibold text-blue-700">
                    Canva will automatically open
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Use Canva Bulk Create to upload the exported CSV file.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 rounded-xl bg-white p-3 sm:p-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  3
                </div>
                <div>
                  <p className="font-semibold text-blue-700">
                    Generate certificates
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Map the <strong> Certificate Text </strong> column to
                    your Canva text field, then continue to generate
                    certificates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleExportAndOpenCanva}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <ExternalLink size={16} />
              Export & Open Canva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}