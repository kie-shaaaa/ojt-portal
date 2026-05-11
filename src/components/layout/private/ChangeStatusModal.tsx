import { JSX, useId, useState, useEffect } from "react";
import {
  Clock3,
  Eye,
  CalendarDays,
  CircleX,
  CircleCheck,
  X,
} from "lucide-react";

type StatusOption = {
  id: string;
  label: string;
  iconBgClass: string;
  iconColorClass: string;
  current?: boolean;
  icon: JSX.Element;
};

interface ChangeStatusModalProps {
  open: boolean;
  application?: { id?: string; applicantName?: string; status?: string } | null;
  onClose: () => void;
  onConfirm: (newStatus: string, id: string) => void;
}

const statusOptions: StatusOption[] = [
  {
    id: "pending-review",
    label: "Pending Review",
    iconBgClass: "bg-orange-100",
    iconColorClass: "text-orange-500",
    current: true,
    icon: <Clock3 className="w-5 h-5" strokeWidth={2} />,
  },
  {
    id: "under-review",
    label: "Under Review",
    iconBgClass: "bg-blue-50",
    iconColorClass: "text-blue-500",
    icon: <Eye className="w-5 h-5" strokeWidth={2} />,
  },
  {
    id: "for-interview",
    label: "For Interview",
    iconBgClass: "bg-purple-100",
    iconColorClass: "text-purple-500",
    icon: <CalendarDays className="w-5 h-5" strokeWidth={2} />,
  },
  {
    id: "rejected",
    label: "Rejected",
    iconBgClass: "bg-red-100",
    iconColorClass: "text-red-500",
    icon: <CircleX className="w-5 h-5" strokeWidth={2} />,
  },
  {
    id: "accepted",
    label: "Accepted",
    iconBgClass: "bg-green-100",
    iconColorClass: "text-green-500",
    icon: <CircleCheck className="w-5 h-5" strokeWidth={2} />,
  },
];

const statusToId = (status?: string) => {
  if (!status) return "pending-review";
  const s = status.toLowerCase();
  if (s.includes("pending")) return "pending-review";
  if (s.includes("interview")) return "for-interview";
  if (s.includes("under")) return "under-review";
  if (s.includes("reject")) return "rejected";
  if (s.includes("accept")) return "accepted";
  return "pending-review";
};

const idToStatus = (id: string) => {
  switch (id) {
    case "pending-review":
      return "Pending";
    case "for-interview":
      return "For interview";
    case "under-review":
      return "Under Review";
    case "rejected":
      return "Rejected";
    case "accepted":
      return "Accepted";
    default:
      return id;
  }
};

const ChangeStatusModal = ({
  open,
  application,
  onClose,
  onConfirm,
}: ChangeStatusModalProps): JSX.Element | null => {
  const headingId = useId();
  const descriptionId = useId();

  const [selectedStatus, setSelectedStatus] = useState<string>(
    statusToId(application?.status),
  );

  useEffect(() => {
    setSelectedStatus(statusToId(application?.status));
  }, [application]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/20 p-4">
      <section
        className="flex flex-col max-w-lg w-[512px] bg-white rounded-xl overflow-hidden shadow-[0px_20px_40px_0px_rgba(0,0,0,0.12)] z-70"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descriptionId}
      >
        {/* Header */}
        <header className="flex items-start justify-between px-6 pt-6 pb-4">
          <h2 id={headingId} className="text-xl font-bold text-[#003eb3]">
            Change Application Status
          </h2>

          <button
            type="button"
            aria-label="Close modal"
            className="flex items-center justify-center w-6 h-6 text-gray-400 transition hover:text-gray-600"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Body */}
        <div className="flex flex-col gap-4 px-6 py-2 overflow-y-auto">
          <p id={descriptionId} className="text-sm text-gray-500">
            Select new status for {application?.applicantName ?? "application"}:
          </p>

          <fieldset className="flex flex-col gap-3">
            <legend className="sr-only">Application status options</legend>

            {statusOptions.map((option) => {
              const isSelected = selectedStatus === option.id;

              return (
                <label
                  key={option.id}
                  className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#eef4ff] border-2 border-blue-600"
                      : "bg-white border border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="application-status"
                    value={option.id}
                    checked={isSelected}
                    onChange={() => setSelectedStatus(option.id)}
                    className="sr-only"
                  />

                  {/* Icon */}
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${option.iconBgClass} ${option.iconColorClass}`}
                  >
                    {option.icon}
                  </div>

                  {/* Label */}
                  <div className="flex items-center justify-between flex-1">
                    <span
                      className={`text-base ${
                        isSelected
                          ? "font-bold text-gray-800"
                          : "font-normal text-gray-700"
                      }`}
                    >
                      {option.label}
                    </span>

                    {option.current && (
                      <span className="text-sm font-bold text-[#003eb3]">
                        (Current)
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </fieldset>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6">
          <button
            type="button"
            className="px-6 py-2.5 text-base font-bold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="px-6 py-2.5 text-base font-bold text-white bg-[#003eb3] rounded-lg shadow-sm hover:bg-[#003399] transition"
            onClick={() => {
              const mapped = idToStatus(selectedStatus);
              onConfirm(mapped, application?.id ?? "");
              onClose();
            }}
          >
            Update Status
          </button>
        </div>
      </section>
    </div>
  );
};

export default ChangeStatusModal;
