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
import { apiCall } from "@/lib/api";
import { toast } from "sonner";
import { ProcessingLoaderOverlay } from "@/components/shared/ProcessingLoaderOverlay";

type StatusOption = {
  id: string;
  label: string;
  iconBgClass: string;
  iconColorClass: string;
  icon: JSX.Element;
};

interface ChangeStatusModalProps {
  open: boolean;
  mode?: "status" | "appointment-date";
  bulkMode?: boolean;
  bulkCount?: number;
  application?: {
    id?: string;
    applicationId?: string;
    applicantName?: string;
    status?: string;
    appointmentDate?: string;
    appointmentTime?: string;
  } | null;
  onClose: () => void;
  onConfirm: (
    newStatus: string,
    id: string,
    scheduleDate?: string,
    scheduleTime?: string,
  ) => void;
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
  if (s.includes("accept")) return "pending-accept";
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

const idToBackendStatus = (id: string): string => {
  switch (id) {
    case "pending-review":
      return "pending";
    case "for-interview":
      return "for_interview";
    case "under-review":
      return "under_review";
    case "rejected":
      return "rejected";
    case "accepted":
      return "pending accept";
    default:
      return id;
  }
};

const ChangeStatusModal = ({
  open,
  mode = "status",
  bulkMode = false,
  bulkCount = 0,
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
  const [isUpdating, setIsUpdating] = useState(false);

  // For interview and accepted schedules
  const [interviewDate, setInterviewDate] = useState<string>("");
  const [interviewTime, setInterviewTime] = useState<string>("09:00");
  const [acceptedDate, setAcceptedDate] = useState<string>("");
  const [acceptedTime, setAcceptedTime] = useState<string>("09:00");

  // For appointment date mode
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("09:00");

  useEffect(() => {
    requestAnimationFrame(() => setSelectedStatus(statusToId(application?.status)));

    // If in appointment-date mode, initialize from existing appointment date
    if (mode === "appointment-date" && application?.appointmentDate) {
      const date = new Date(application.appointmentDate);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const timeStr = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      requestAnimationFrame(() => setAppointmentDate(dateStr));
      requestAnimationFrame(() => setAppointmentTime(timeStr));
    }
  }, [application, mode]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      requestAnimationFrame(() => setIsVisible(false));
    }
  }, [open]);

  // Auto-scroll to show the schedule section when selected
  useEffect(() => {
    if (
      selectedStatus === "for-interview" &&
      interviewSectionRef.current &&
      bodyRef.current
    ) {
      setTimeout(() => {
        interviewSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    } else if (
      selectedStatus === "accepted" &&
      acceptedSectionRef.current &&
      bodyRef.current
    ) {
      setTimeout(() => {
        acceptedSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    }
  }, [selectedStatus]);

  if (!open) return null;

  const getAppointmentType = (status: string): string | undefined => {
    switch (status) {
      case "for_interview":
        return "interview";
      case "accepted":
        return "orientation";
      default:
        return undefined;
    }
  };

  const handleConfirmAppointmentDateMode = async () => {
    if (!appointmentDate || !appointmentTime) {
      toast.error("Please set the appointment date and time.");
      return;
    }

    try {
      setIsUpdating(true);

      const applicationId = application?.applicationId
        ? Number(application.applicationId)
        : application?.id
          ? Number(application.id.replace("NTC-", ""))
          : undefined;

      if (!applicationId) throw new Error("Invalid application ID");

      const appointmentDateISO = new Date(
        `${appointmentDate}T${appointmentTime}`,
      ).toISOString();

      await apiCall("/appointments/update", {
        method: "PATCH",
        body: JSON.stringify({
          applicationId,
          appointmentDate: appointmentDateISO,
        }),
      });

      toast.success("Appointment date updated successfully!");
      onConfirm("", application?.id ?? "", appointmentDate, appointmentTime);
      onClose();
    } catch (error) {
      console.error("Failed to update appointment date:", error);
      toast.error(
        "We could not update the appointment date. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmStatusMode = async () => {
    if (bulkMode) {
      const mappedStatus = idToStatus(selectedStatus);
      onConfirm(mappedStatus, application?.id ?? "");
      onClose();
      return;
    }

    // Validate required schedule fields when setting interview or accepted
    if (selectedStatus === "for-interview") {
      if (!interviewDate || !interviewTime) {
        toast.error(
          "Please set interview date and time before updating status.",
        );
        return;
      }
    }

    if (selectedStatus === "accepted") {
      if (!acceptedDate || !acceptedTime) {
        toast.error(
          "Please set orientation date and time before updating status.",
        );
        return;
      }
    }

    try {
      setIsUpdating(true);

      const backendStatus = idToBackendStatus(selectedStatus);

      const applicationId = application?.id
        ? Number(application.id.replace("NTC-", ""))
        : undefined;

      if (!applicationId) throw new Error("Invalid application ID");
      const appointmentType = getAppointmentType(backendStatus);

      // 1. Update application status first
      await apiCall("/applications/update", {
        method: "PATCH",
        body: JSON.stringify({
          id: applicationId,
          status: backendStatus,
          interviewDate:
            selectedStatus === "for-interview" ? interviewDate : undefined,
          interviewTime:
            selectedStatus === "for-interview" ? interviewTime : undefined,
          acceptedDate:
            selectedStatus === "accepted" ? acceptedDate : undefined,
          acceptedTime:
            selectedStatus === "accepted" ? acceptedTime : undefined,
        }),
      });

      // 2. Determine if we need to create appointment
      let appointmentDateISO: string | undefined;

      if (selectedStatus === "for-interview" && interviewDate) {
        appointmentDateISO = new Date(
          `${interviewDate}T${interviewTime}`,
        ).toISOString();
      }

      if (selectedStatus === "accepted" && acceptedDate) {
        appointmentDateISO = new Date(
          `${acceptedDate}T${acceptedTime}`,
        ).toISOString();
      }

      // 3. Create appointment ONLY if needed
      if (appointmentDateISO) {
        await apiCall("/appointments/create", {
          method: "POST",
          body: JSON.stringify({
            type: appointmentType, // or map to interview/orientation if needed
            appointmentDate: appointmentDateISO,
            applicationId: applicationId,
          }),
        });
      }

      // 4. UI update
      const mappedStatus = idToStatus(selectedStatus);

      onConfirm(mappedStatus, application?.id ?? "", appointmentDateISO);

      onClose();
    } catch (error) {
      console.error("Failed to update:", error);
      toast.error(
        "We could not update the application status. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirm =
    mode === "appointment-date"
      ? handleConfirmAppointmentDateMode
      : handleConfirmStatusMode;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 transition-opacity duration-200 ease-out ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => onClose()}
    >
      <section
        className={`flex flex-col max-w-lg w-[512px] max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl transition-opacity duration-200 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
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
            {bulkMode
              ? `Change Status for ${bulkCount} Applications`
              : mode === "appointment-date"
                ? "Change Appointment Date"
                : "Change Application Status"}
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
          {mode === "appointment-date" ? (
            // Appointment Date Mode
            <>
              <p id={descriptionId} className="text-sm text-gray-600 mb-6">
                Update the appointment date and time for{" "}
                {application?.applicantName ?? "this applicant"}
              </p>

              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">
                    New Appointment Schedule
                  </h3>
                  <DatePicker
                    value={appointmentDate}
                    onChange={setAppointmentDate}
                    label="Appointment Date"
                    labelClassName="text-gray-700"
                  />
                  <div className="mt-4">
                    <TimePicker
                      value={appointmentTime}
                      onChange={setAppointmentTime}
                      label="Appointment Time"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Status Mode (existing code)
            <>
              <p id={descriptionId} className="text-sm text-gray-600 mb-4">
                {bulkMode
                  ? `Select a new status for ${bulkCount} selected applications:`
                  : `Select new status for ${application?.applicantName ?? "application"}:`}
              </p>

              <fieldset className="flex flex-col gap-3 mb-6">
                <legend className="sr-only">Application status options</legend>

                {statusOptions.map((option) => {
                  const isSelected = selectedStatus === option.id;
                  const isCurrent =
                    statusToId(application?.status) === option.id;

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
              {!bulkMode && selectedStatus === "for-interview" && (
                <div
                  ref={interviewSectionRef}
                  className="p-4 bg-purple-50 rounded-lg border border-purple-100 space-y-4"
                >
                  <h3 className="text-sm font-semibold text-gray-800">
                    Set Interview Schedule
                  </h3>
                  <p className="text-xs text-gray-600">
                    This date will be included in the interview invitation email
                    sent to the applicant.
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

              {!bulkMode && selectedStatus === "accepted" && (
                <div
                  ref={acceptedSectionRef}
                  className="p-4 bg-green-50 rounded-lg border border-green-100 space-y-4"
                >
                  <h3 className="text-sm font-semibold text-gray-800">
                    Set Orientation Schedule
                  </h3>
                  <p className="text-xs text-gray-600">
                    This date will be included in the acceptance and orientation
                    invitation email sent to the applicant.
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
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            className="px-6 py-2.5 text-base font-bold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancel
          </button>

          <button
            type="button"
            className="px-6 py-2.5 text-base font-bold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleConfirm}
            disabled={isUpdating}
          >
            {isUpdating && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            )}
            {isUpdating
              ? mode === "appointment-date"
                ? "Updating Date..."
                : "Updating..."
              : mode === "appointment-date"
                ? "Update Date"
                : "Update Status"}
          </button>
        </div>
      </section>

      <ProcessingLoaderOverlay
        open={isUpdating}
        title="Updating"
        description="Please wait while the application status is being saved."
        className="fixed inset-0 z-[100000] flex items-center justify-center backdrop-blur-sm"
      />
    </div>
  );
};

export default ChangeStatusModal;
