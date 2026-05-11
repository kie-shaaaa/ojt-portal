import { JSX, useId, useState, useEffect } from "react";
import { X, Save, ChevronDown } from "lucide-react";

interface ChangeInternDetailsProps {
  intern?: {
    id?: string;
    name?: string;
    ojtYear?: string;
    ojtNumber?: string;
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
  const internNameId = useId();
  const ojtIdFieldId = useId();
  const genderFieldId = useId();
  const deploymentDateId = useId();
  const endDateId = useId();

  const [ojtYear, setOjtYear] = useState(intern?.ojtYear ?? "2026");
  const [ojtNumber, setOjtNumber] = useState(intern?.ojtNumber ?? "001");
  const [gender, setGender] = useState(intern?.gender ?? "Female");
  const [deploymentDate, setDeploymentDate] = useState(
    intern?.deploymentDate ?? "05/11/2026",
  );
  const [endDate, setEndDate] = useState(intern?.endDate ?? "05/12/2026");

  useEffect(() => {
    setOjtYear(intern?.ojtYear ?? "2026");
    setOjtNumber(intern?.ojtNumber ?? "001");
    setGender(intern?.gender ?? "Female");
    setDeploymentDate(intern?.deploymentDate ?? "05/11/2026");
    setEndDate(intern?.endDate ?? "05/12/2026");
  }, [intern]);

  const formFields = [
    {
      id: deploymentDateId,
      label: "Deployment Date (Start Date)",
      helperText: "Date when the internship starts",
      value: deploymentDate,
      onChange: setDeploymentDate,
    },
    {
      id: endDateId,
      label: "End Date",
      labelSuffix: "(OJT Completion)",
      helperText: "Date when the internship period ends",
      value: endDate,
      onChange: setEndDate,
    },
  ];

  const handleOjtNumberChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 3);
    setOjtNumber(numericValue);
  };

  const handleOjtNumberBlur = () => {
    if (!ojtNumber) setOjtNumber("001");
    else setOjtNumber(ojtNumber.padStart(3, "0"));
  };

  const handleSave = () => {
    const payload = {
      id: intern?.id,
      ojtYear,
      ojtNumber,
      gender,
      deploymentDate,
      endDate,
    };
    if (onSave) onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
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
          <dl className="flex w-full justify-between border-b border-gray-50 py-4">
            <dt className="text-base font-bold text-gray-700">Intern Name:</dt>
            <dd className="text-base text-gray-600">{intern?.name ?? "—"}</dd>
          </dl>

          {/* Form */}
          <form className="grid gap-6 md:grid-cols-2 md:grid-rows-[102px_86px]">
            {/* OJT ID */}
            <div className="flex flex-col gap-1.5 pt-0 pb-4">
              <label
                htmlFor={ojtIdFieldId}
                className="text-sm font-bold text-gray-700"
              >
                OJT ID Number
              </label>
              <div className="flex w-full">
                <div className="flex items-center rounded-l-md border border-gray-300 bg-gray-50 px-4 py-2 text-blue-700">
                  {ojtYear}
                </div>
                <input
                  id={ojtIdFieldId}
                  aria-describedby={`${ojtIdFieldId}-hint`}
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  value={ojtNumber}
                  onChange={(e) => handleOjtNumberChange(e.target.value)}
                  onBlur={handleOjtNumberBlur}
                  className="flex-1 rounded-r-md border border-gray-300 px-3 py-2 text-sm text-black"
                />
              </div>
              <p id={`${ojtIdFieldId}-hint`} className="text-xs text-gray-500">
                Auto-formats to 3 digits (e.g., 1 → 001)
              </p>
            </div>

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

            {/* Dates */}
            {formFields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-1.5">
                <label
                  htmlFor={field.id}
                  className="text-sm font-bold text-gray-700"
                >
                  {field.label}{" "}
                  {field.labelSuffix && (
                    <span className="font-normal text-gray-400">
                      {field.labelSuffix}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  id={field.id}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-describedby={`${field.id}-hint`}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                />
                <p id={`${field.id}-hint`} className="text-xs text-gray-500">
                  {field.helperText}
                </p>
              </div>
            ))}
          </form>
        </div>

        {/* Footer */}
        <footer className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-8 py-6">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm text-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-6 py-2 text-sm text-white hover:bg-blue-800"
          >
            <Save size={16} />
            Save Changes
          </button>
        </footer>
      </section>
    </div>
  );
};

export default ChangeInterDetailsModal;
