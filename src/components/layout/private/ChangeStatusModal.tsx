"use client";

import { JSX, useId, useState, useEffect, useRef } from "react";
import {
  Clock3,
  Eye,
  CalendarDays,
  CircleX,
  CircleCheck,
  X,
} from "lucide-react";
import DatePicker from "../DatePicker";
import TimePicker from "../TimePicker";

type StatusOption = {
  id: string;
  label: string;
  iconBgClass: string;
  iconColorClass: string;
  icon: JSX.Element;
};

interface ChangeStatusModalProps {
  open: boolean;
  application?: { id?: string; applicantName?: string; status?: string } | null;
  onClose: () => void;
  onConfirm: (newStatus: string, id: string, scheduleDate?: string, scheduleTime?: string) => void;
}

const statusOptions: StatusOption[] = [
  {
    id: "pending-review",
    label: "Pending Review",
    iconBgClass: "bg-orange-100",
    iconColorClass: "text-orange-500",
    icon: <Clock3 className="w-6 h-6" strokeWidth={2} />,
  },
  {
    id: "under-review",
    label: "Under Review",
    iconBgClass: "bg-blue-50",
    iconColorClass: "text-blue-500",
    icon: <Eye className="w-6 h-6" strokeWidth={2} />,
  },
  {
    id: "for-interview",
    label: "For Interview",
    iconBgClass: "bg-purple-100",
    iconColorClass: "text-purple-500",
    icon: <CalendarDays className="w-6 h-6" strokeWidth={2} />,
  },
  {
    id: "rejected",
    label: "Rejected",
    iconBgClass: "bg-red-100",
    iconColorClass: "text-red-500",
    icon: <CircleX className="w-6 h-6" strokeWidth={2} />,
  },
  {
    id: "accepted",
    label: "Accepted",
    iconBgClass: "bg-green-100",
    iconColorClass: "text-green-500",
    icon: <CircleCheck className="w-6 h-6" strokeWidth={2} />,
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
  const bodyRef = useRef<HTMLDivElement>(null);
  const interviewSectionRef = useRef<HTMLDivElement>(null);
  const acceptedSectionRef = useRef<HTMLDivElement>(null);
  const currentStatusId = statusToId(application?.status);

  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatusId);
  const [isVisible, setIsVisible] = useState(false);
  
  // For interview and accepted schedules
  const [interviewDate, setInterviewDate] = useState<string>("");
  const [interviewTime, setInterviewTime] = useState<string>("09:00");
  const [acceptedDate, setAcceptedDate] = useState<string>("");
  const [acceptedTime, setAcceptedTime] = useState<string>("09:00");

  useEffect(() => {
    setSelectedStatus(statusToId(application?.status));
  }, [application]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [open]);

  // Auto-scroll to show the schedule section when selected
  useEffect(() => {
    if (selectedStatus === "for-interview" && interviewSectionRef.current && bodyRef.current) {
      setTimeout(() => {
        interviewSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } else if (selectedStatus === "accepted" && acceptedSectionRef.current && bodyRef.current) {
      setTimeout(() => {
        acceptedSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [selectedStatus]);

  if (!open) return null;

  const handleConfirm = () => {
    const mappedStatus = idToStatus(selectedStatus);
    let scheduleDate = undefined;
    let scheduleTime = undefined;

    if (selectedStatus === "for-interview" && interviewDate) {
      scheduleDate = interviewDate;
      scheduleTime = interviewTime;
    } else if (selectedStatus === "accepted" && acceptedDate) {
      scheduleDate = acceptedDate;
      scheduleTime = acceptedTime;
    }

    onConfirm(mappedStatus, application?.id ?? "", scheduleDate, scheduleTime);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 transition-opacity duration-200 ease-out ${
        isVisible ? "opacity-100 backdrop-blur-sm" : "opacity-0 backdrop-blur-0"
      }`}
      onClick={() => onClose()}
    >
      <section
        className={`flex flex-col max-w-lg w-[512px] max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-200 ease-out ${
          isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-2 opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descriptionId}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <h2 id={headingId} className="text-lg font-bold text-blue-800">
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
        <div className="flex-1 overflow-y-auto px-6 py-4" ref={bodyRef}>
          <p id={descriptionId} className="text-sm text-gray-600 mb-4">
            Select new status for {application?.applicantName ?? "application"}:
          </p>

          <fieldset className="flex flex-col gap-3 mb-6">
            <legend className="sr-only">Application status options</legend>

            {statusOptions.map((option) => {
              const isSelected = selectedStatus === option.id;
              const isCurrent = statusToId(application?.status) === option.id;

              return (
                <label
                  key={option.id}
                  className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-50 border-2 border-blue-600"
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
                    className={`flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 ${option.iconBgClass} ${option.iconColorClass}`}
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

                    {isCurrent && (
                      <span className="text-sm font-bold text-blue-600">
                        (Current)
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </fieldset>

          {/* Schedule Sections at Bottom */}
          {selectedStatus === "for-interview" && (
            <div ref={interviewSectionRef} className="p-4 bg-purple-50 rounded-lg border border-purple-100 space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Set Interview Schedule
              </h3>
              <p className="text-xs text-gray-600">
                This date will be included in the interview invitation email sent to the applicant.
              </p>
              <DatePicker
                value={interviewDate}
                onChange={setInterviewDate}
                label="Interview Date"
                labelClassName="text-gray-700"
              />
              <TimePicker
                value={interviewTime}
                onChange={setInterviewTime}
                label="Interview Time"
              />
            </div>
          )}

          {selectedStatus === "accepted" && (
            <div ref={acceptedSectionRef} className="p-4 bg-green-50 rounded-lg border border-green-100 space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Set Orientation Schedule
              </h3>
              <p className="text-xs text-gray-600">
                This date will be included in the acceptance and orientation invitation email sent to the applicant.
              </p>
              <DatePicker
                value={acceptedDate}
                onChange={setAcceptedDate}
                label="Orientation Date"
                labelClassName="text-gray-700"
              />
              <TimePicker
                value={acceptedTime}
                onChange={setAcceptedTime}
                label="Orientation Time"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            className="px-6 py-2.5 text-base font-bold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="px-6 py-2.5 text-base font-bold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition"
            onClick={handleConfirm}
          >
            Update Status
          </button>
        </div>
      </section>
    </div>
  );
};

export default ChangeStatusModal;
