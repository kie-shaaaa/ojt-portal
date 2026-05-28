"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import { CalendarAppointment } from "./calendarTypes";
import { X } from "lucide-react";
import ChangeStatusModal from "../modals/ChangeStatusModal";
import { ProcessingLoaderOverlay } from "@/components/shared/ProcessingLoaderOverlay";

type Props = {
  open: boolean;
  appointments: CalendarAppointment[];
  selectedAppointmentId?: string | null;
  onClose: () => void;
  onChangeStatus: (appointment: CalendarAppointment) => void;
  onClearAppointment: (
    appointment: CalendarAppointment,
    reason?: string,
  ) => void | Promise<void>;
  onComplete: (appointment: CalendarAppointment) => void;
};

const formatDate = (dateKey: string) => {
  const date = new Date(`${dateKey}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatTime = (time: string) => {
  if (!time) return "TBA";

  const [hoursRaw, minutesRaw] = time.split(":");
  const hours = Number(hoursRaw);
  const minutes = minutesRaw ?? "00";
  const period = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${String(normalizedHours).padStart(2, "0")}:${minutes} ${period}`;
};

const getBadgeClasses = (label: string) => {
  const normalized = label.toLowerCase();

  if (normalized.includes("orientation")) {
    return "bg-green-100 text-green-700";
  }

  if (normalized.includes("interview")) {
    return "bg-purple-100 text-purple-700";
  }

  if (normalized.includes("completed")) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (normalized.includes("pending")) {
    return "bg-amber-100 text-amber-700";
  }

  if (normalized.includes("accepted")) {
    return "bg-green-100 text-green-700";
  }

  return "bg-slate-100 text-slate-700";
};

export default function CalendarAppointmentModal({
  open,
  appointments,
  selectedAppointmentId,
  onClose,
  onChangeStatus,
  onClearAppointment,
  onComplete,
}: Props): JSX.Element | null {
  const [isVisible, setIsVisible] = useState(false);
  const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>(
    null,
  );
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      requestAnimationFrame(() => setIsVisible(false));
    }
  }, [open]);

  useEffect(() => {
    if (open && appointments.length > 0) {
      requestAnimationFrame(() =>
        setActiveAppointmentId(selectedAppointmentId ?? appointments[0].id),
      );
    }
  }, [open, appointments, selectedAppointmentId]);

  const activeAppointment = useMemo(
    () =>
      appointments.find(
        (appointment) => appointment.id === activeAppointmentId,
      ) ?? appointments[0],
    [appointments, activeAppointmentId],
  );

  if (!open || appointments.length === 0 || !activeAppointment) return null;

  return (
    <div
      className={`fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4 transition-opacity duration-200 ease-out ${
        isVisible ? "opacity-100 backdrop-blur-sm" : "opacity-0 backdrop-blur-0"
      }`}
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-appointment-title"
        onClick={(event) => event.stopPropagation()}
        className={`flex w-full max-w-4xl max-h-[90vh] flex-col overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-200 ease-out ${
          isVisible
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-2 opacity-0"
        }`}
      >
        <header className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
          <div>
            <h1
              id="calendar-appointment-title"
              className="text-xl font-bold text-[#0038a8]"
            >
              {activeAppointment.appointmentType} -{" "}
              {activeAppointment.applicantName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {formatDate(activeAppointment.dateKey)} at{" "}
              {activeAppointment.appointmentTime}
            </p>
          </div>

          <button
            type="button"
            aria-label="Close modal"
            className="text-gray-400 transition hover:text-gray-600"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Applicant
                </p>
                <div className="mt-3 space-y-1">
                  <p className="text-base font-semibold text-gray-900">
                    {activeAppointment.applicantName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activeAppointment.applicantEmail}
                  </p>
                  <p className="text-sm text-gray-600">
                    OJT ID: {activeAppointment.ojtId}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Appointment
                </p>
                <div className="mt-3 space-y-1">
                  <p className="text-sm text-gray-600">
                    Appointment ID: {activeAppointment.ojtId}
                  </p>
                  <p className="text-sm text-gray-600">
                    Type: {activeAppointment.appointmentType}
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {formatDate(activeAppointment.dateKey)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatTime(activeAppointment.appointmentTime)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Scheduled:{" "}
                    {formatDateTime(activeAppointment.appointmentDate)}
                  </p>
                  <span
                    className={`inline-flex w-fit min-w-max whitespace-nowrap rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wide leading-none ${getBadgeClasses(activeAppointment.tag)}`}
                  >
                    {activeAppointment.tag}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  School
                </p>
                <div className="mt-3 space-y-1">
                  <p className="text-base font-semibold text-gray-900">
                    {activeAppointment.school}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activeAppointment.course}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activeAppointment.hoursNeeded}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </p>
                <div className="mt-3 space-y-2">
                  <span
                    className={`inline-flex w-fit min-w-max whitespace-nowrap rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wide leading-none ${getBadgeClasses(activeAppointment.status)}`}
                  >
                    {activeAppointment.status}
                  </span>
                  <p className="text-sm text-gray-600">
                    {activeAppointment.status === "Accepted"
                      ? "The applicant has confirmed and the orientation schedule is active."
                      : activeAppointment.status === "Pending Accept"
                      ? "Awaiting the applicant's confirmation email."
                      : activeAppointment.status === "For interview"
                        ? "Scheduled on the calendar for applicant review."
                        : activeAppointment.status === "Completed"
                          ? "The applicant has already been added to OJT data."
                          : "No active schedule is assigned."}
                  </p>
                </div>
              </div>
            </div>

            <aside className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-semibold text-gray-800">
                  Appointments on this day
                </p>
              </div>

              <div className="max-h-130 overflow-y-auto p-3">
                <div className="flex flex-col gap-3">
                  {appointments.map((appointment) => {
                    const isSelected = appointment.id === activeAppointment.id;

                    return (
                      <button
                        key={appointment.id}
                        type="button"
                        onClick={() => setActiveAppointmentId(appointment.id)}
                        className={`rounded-xl border p-4 text-left transition ${
                          isSelected
                            ? "border-blue-600 bg-blue-50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-800">
                              {appointment.applicantName}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {formatDate(appointment.dateKey)} •{" "}
                              {formatTime(appointment.appointmentTime)}
                            </p>
                          </div>
                          <span
                            className={`inline-flex w-fit min-w-max whitespace-nowrap rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wide leading-none ${getBadgeClasses(appointment.appointmentType)}`}
                          >
                            {appointment.tag}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 shrink-0">
          <button
            type="button"
            className="rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            onClick={() => setIsChangeStatusModalOpen(true)}
          >
            Change Date
          </button>

          <button
            type="button"
            className="rounded-lg border border-green-600 px-4 py-2.5 text-sm font-semibold text-green-600 transition hover:bg-green-50"
            onClick={() => onComplete(activeAppointment)}
          >
            Completed
          </button>

          <button
            type="button"
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            onClick={() => {
              setCancellationReason("");
              setIsClearModalOpen(true);
            }}
          >
            Clear appointment
          </button>

          <button
            type="button"
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            onClick={onClose}
          >
            Close
          </button>
        </footer>

      </section>

      <ChangeStatusModal
        open={isChangeStatusModalOpen}
        mode="appointment-date"
        application={{
          id: activeAppointment.applicationId,
          applicationId: activeAppointment.applicationId,
          applicantName: activeAppointment.applicantName,
          status: activeAppointment.status,
          appointmentDate: activeAppointment.appointmentDate,
          appointmentTime: activeAppointment.appointmentTime,
        }}
        onClose={() => setIsChangeStatusModalOpen(false)}
        onConfirm={() => {
          setIsChangeStatusModalOpen(false);
        }}
      />
      {/* Clear appointment modal with optional cancellation reason */}
      {isClearModalOpen && (
        <div
          className={`fixed inset-0 z-999999 flex items-center justify-center bg-black/40 p-4`}
          onClick={() => setIsClearModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-xl rounded-lg bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Clear appointment
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Optionally add a message to the applicant explaining why the
                appointment was cleared.
              </p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-slate-700">
                Message to applicant (optional)
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={5}
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                placeholder="Enter a brief reason (e.g. applicant unavailable, duplicate booking, admin cancelled)"
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
              <button
                type="button"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                onClick={() => setIsClearModalOpen(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                disabled={isClearing}
                onClick={async () => {
                  try {
                    setIsClearing(true);
                    await onClearAppointment(
                      activeAppointment,
                      cancellationReason || undefined,
                    );
                    setIsClearModalOpen(false);
                  } finally {
                    setIsClearing(false);
                  }
                }}
              >
                {isClearing ? "Clearing..." : "Confirm clear"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ProcessingLoaderOverlay
        open={isClearing}
        title="Clearing"
        description="Please wait while the appointment is cleared."
        className="fixed inset-0 z-[1000000] flex items-center justify-center backdrop-blur-sm"
      />
    </div>
  );
}
