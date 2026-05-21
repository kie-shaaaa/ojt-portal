import { JSX, useEffect, useId, useState } from "react";
import { X, Save, ChevronDown } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import DatePicker from "@/components/layout/DatePicker";

interface ChangeInternDetailsProps {
  intern?: {
    id?: string;
    name?: string;
    ojtYear?: string;
    adminNote?: string;
    gender?: string;
    deploymentDate?: string;
    endDate?: string;
  } | null;
  onClose: () => void;
  onSave?: (data: any) => void;
}

export const ChangeInterDetailsModal = ({
  intern,
  onClose,
  onSave,
}: ChangeInternDetailsProps): JSX.Element => {
  const titleId = useId();
  const descriptionId = useId();
  const adminNotesId = useId();
  const genderFieldId = useId();
  const deploymentDateId = useId();
  const endDateId = useId();

  const [ojtYear, setOjtYear] = useState(intern?.ojtYear ?? "2026");
  const [adminNote, setAdminNote] = useState(intern?.adminNote ?? "");
  const [gender, setGender] = useState(intern?.gender ?? "Female");
  const [deploymentDate, setDeploymentDate] = useState(
    intern?.deploymentDate ?? "",
  );
  const [endDate, setEndDate] = useState(intern?.endDate ?? "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setOjtYear(intern?.ojtYear ?? "2026");
    setGender(intern?.gender ?? "Female");

    // Normalize incoming date strings to YYYY-MM-DD which DatePicker expects
    const normalizeToYMD = (d?: string) => {
      if (!d) return "";
      try {
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return "";
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, "0");
        const day = String(dt.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
      } catch {
        return "";
      }
    };

    setDeploymentDate(normalizeToYMD(intern?.deploymentDate));
    setEndDate(normalizeToYMD(intern?.endDate));
  }, [intern]);

  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      id: intern?.id,
      ojtYear,
      adminNote,
      gender,
      // ensure dates are sent as YYYY-MM-DD (or empty string)
      deploymentDate: deploymentDate || null,
      endDate: endDate || null,
    };
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      if (onSave) onSave(payload);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative flex w-full max-w-2xl flex-col max-h-[90vh] overflow-auto rounded-xl bg-white shadow-2xl"
      >
        {/* Header */}
        <header className="flex w-full items-center justify-between border-b border-gray-100 px-8 pt-8 pb-6">
          <div className="flex flex-col">
            <h1 id={titleId} className="text-xl font-bold text-blue-700">
              Edit Intern Details
            </h1>
            <p id={descriptionId} className="sr-only">
              Update intern information including OJT ID number, gender, and
              internship dates.
            </p>
          </div>
          <button
            aria-label="Close dialog"
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        {/* Content */}
        <div className="flex flex-col gap-6 px-8 pt-6 pb-10">
          {/* Intern Name */}
          <dl className="grid w-full gap-1 border-b border-gray-50 py-4">
            <dt className="text-base font-bold text-gray-700">Intern Name:</dt>
            <dd className="text-base text-gray-600">{intern?.name ?? "—"}</dd>
          </dl>

          {/* Form */}
          <form className="grid gap-6 md:grid-cols-2 md:grid-rows-[102px_86px]">
            {/* Gender */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={genderFieldId}
                className="text-sm font-bold text-gray-700"
              >
                Gender
              </label>
              <div className="relative">
                <select
                  id={genderFieldId}
                  aria-describedby={`${genderFieldId}-hint`}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black appearance-none"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  {["Female", "Male"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown size={18} className="text-gray-400" />
                </div>
              </div>
              <p id={`${genderFieldId}-hint`} className="text-xs text-gray-500">
                Used for certificate generation (Mr./Ms., he/she, his/her)
              </p>
            </div>

            <div className="flex flex-col gap-1.5 pt-0 pb-4">
              <label
                htmlFor={adminNotesId}
                className="text-sm font-bold text-gray-700"
              >
                Note
              </label>
              <div className="flex w-full">
                <input
                  id={adminNotesId}
                  aria-describedby={`${adminNotesId}-hint`}
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                />
              </div>
              <p id={`${adminNotesId}-hint`} className="text-xs text-gray-500">
                Notes for the intern.
              </p>
            </div>

            {/* Dates */}
            <div className="flex flex-col gap-1.5">
              <DatePicker
                id={deploymentDateId}
                label="Deployment Date"
                labelClassName="text-gray-700"
                value={deploymentDate}
                onChange={setDeploymentDate}
                placeholder="yyyy/mm/dd"
              />
              <p className="text-xs text-gray-500">
                Date when the internship starts
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <DatePicker
                id={endDateId}
                label="End Date"
                labelClassName="text-gray-700"
                value={endDate}
                onChange={setEndDate}
                placeholder="yyyy/mm/dd"
              />
              <p className="text-xs text-gray-500">
                Date when the internship period ends
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <footer className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-8 py-6">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm text-gray-700"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-6 py-2 text-sm text-white hover:bg-blue-800 disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </footer>
      </section>

      {isSaving && (
        <div className="fixed inset-0 z-60 flex items-center justify-center backdrop-blur-sm">
          <div className="flex aspect-square w-64 flex-col items-center justify-center gap-4 rounded-2xl bg-blue-50/95 p-7 shadow-2xl ring-1 ring-blue-100 sm:w-72">
            <div className="flex h-24 w-24 items-center justify-center">
              <DotLottieReact
                src="https://lottie.host/199225e8-1f26-4f62-950a-41cfed998703/4esdI4dLN5.lottie"
                loop
                autoplay
                style={{ height: "100%", width: "100%" }}
              />
            </div>

            <p className="text-xl font-bold tracking-wide text-slate-800">
              Saving
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeInterDetailsModal;
