"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarHeaderSection } from "@/components/layout/private/Calendar/CalendarHeaderSection";
import CalendarAppointmentModal from "@/components/layout/private/Calendar/CalendarAppointmentModal";
import { CalendarDatesGridSection } from "@/components/layout/private/Calendar/CalendarDatesGridSection";
import { CalendarNavigationToolbarSection } from "@/components/layout/private/Calendar/CalendarNavigationToolbarSection";
import { CalendarWeekdayHeaderSection } from "@/components/layout/private/Calendar/CalendarWeekdayHeaderSection";
import ChangeStatusModal from "@/components/layout/private/ChangeStatusModal";
import { CalendarAppointment } from "@/components/layout/private/Calendar/calendarTypes";
import { apiCall } from "@/lib/api";

type AppointmentRow = {
  id: number | string;
  type: string;
  appointment_date: string;
  application_id?: number | null;
  is_done?: boolean;
  application_status?: string | null;
  application_first_name?: string | null;
  application_last_name?: string | null;
  application_email?: string | null;
  application_school_name?: string | null;
  application_course?: string | null;
  application_hours_needed?: number | null;
  application_deployment_date?: string | null;
};

type CalendarAppointmentsResponse = AppointmentRow[] | { data?: unknown };

const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const formatTime = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

const formatTypeLabel = (type: string) =>
  type
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const mapAppointmentRowToCalendarAppointment = (
  row: AppointmentRow,
): CalendarAppointment | null => {
  const appointmentDate = new Date(row.appointment_date);

  if (Number.isNaN(appointmentDate.getTime())) {
    return null;
  }

  if (row.type !== "interview" && row.type !== "orientation") {
    return null;
  }

  if (row.application_status === "under_review") {
    return null;
  }

  const appointmentType =
    row.type === "interview" ? "Interview" : "Orientation";
  const status = row.is_done
    ? "Completed"
    : row.type === "interview"
      ? "For interview"
      : "Accepted";
  const dateKey = formatDateKey(appointmentDate);
  const appointmentTime = formatTime(appointmentDate);
  const applicantName = [row.application_first_name, row.application_last_name]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(" ");
  const hoursNeeded =
    row.application_hours_needed !== null &&
    row.application_hours_needed !== undefined
      ? `${row.application_hours_needed} hours`
      : "Not available";

  return {
    id: String(row.id),
    applicationId: String(row.application_id ?? row.id),
    ojtId: `APPT-${String(row.id).padStart(4, "0")}`,
    appointmentDate: row.appointment_date,
    applicantName: applicantName || `${formatTypeLabel(row.type)} appointment`,
    applicantEmail: row.application_email ?? "Not available",
    school: row.application_school_name ?? "Not available",
    course: row.application_course ?? "Not available",
    hoursNeeded,
    dateKey,
    appointmentTime,
    appointmentType,
    status,
    title: `${appointmentType} - ${dateKey}`,
    tag: status === "For interview" ? "For Interview" : appointmentType,
    deploymentDate: row.application_deployment_date ?? dateKey,
    endDate: dateKey,
  };
};

const hydrateAppointments = async (response: CalendarAppointmentsResponse) => {
  const rows = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? (response.data as AppointmentRow[])
      : [];

  const appointments = rows
    .map((row) => mapAppointmentRowToCalendarAppointment(row))
    .filter(
      (appointment): appointment is CalendarAppointment => appointment !== null,
    );

  return appointments;
};

const parseAppointmentId = (appointmentId: string) => {
  const parsed = Number(appointmentId);

  if (!Number.isFinite(parsed)) {
    throw new Error("Invalid appointment ID");
  }

  return parsed;
};

export default function Page() {
  const [current, setCurrent] = useState<Date>(() => new Date());
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [selectedAppointments, setSelectedAppointments] = useState<
    CalendarAppointment[]
  >([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [changeStatusAppointment, setChangeStatusAppointment] =
    useState<CalendarAppointment | null>(null);

  const year = current.getFullYear();
  const month = current.getMonth();

  const monthLabel = useMemo(() => {
    return `${current.toLocaleString("default", { month: "long" })} ${current.getFullYear()}`;
  }, [current]);

  const goPrevMonth = () =>
    setCurrent((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

  const goNextMonth = () =>
    setCurrent((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const goToday = () => {
    const now = new Date();
    setCurrent(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  const refreshAppointments = async () => {
    try {
      const response = (await apiCall(
        `/appointments/fetch-calendar?month=${month + 1}&year=${year}`,
        {
          method: "GET",
        },
      )) as CalendarAppointmentsResponse;

      setAppointments(await hydrateAppointments(response));
    } catch (error) {
      console.error("Failed to fetch appointments", error);
      setAppointments([]);
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadAppointments = async () => {
      try {
        const response = (await apiCall(
          `/appointments/fetch-calendar?month=${month + 1}&year=${year}`,
          {
            method: "GET",
          },
        )) as CalendarAppointmentsResponse;

        if (!isActive) {
          return;
        }

        setAppointments(await hydrateAppointments(response));
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error("Failed to fetch appointments", error);
        setAppointments([]);
      }
    };

    void loadAppointments();

    return () => {
      isActive = false;
    };
  }, [month, year]);

  const events = useMemo(() => {
    return appointments.reduce<Record<string, CalendarAppointment[]>>(
      (acc, appointment) => {
        if (
          appointment.status !== "Accepted" &&
          appointment.status !== "For interview"
        ) {
          return acc;
        }

        if (!acc[appointment.dateKey]) {
          acc[appointment.dateKey] = [];
        }

        acc[appointment.dateKey].push(appointment);
        return acc;
      },
      {},
    );
  }, [appointments]);

  const openAppointmentModal = (
    appointment: CalendarAppointment,
    dayAppointments: CalendarAppointment[],
  ) => {
    setSelectedAppointments(dayAppointments);
    setSelectedAppointmentId(appointment.id);
    setShowAppointmentModal(true);
  };

  const openDayAppointments = (dayAppointments: CalendarAppointment[]) => {
    if (dayAppointments.length === 0) return;
    setSelectedAppointments(dayAppointments);
    setSelectedAppointmentId(dayAppointments[0].id);
    setShowAppointmentModal(true);
  };

  const handleClearAppointment = async (
    appointment: CalendarAppointment,
    reason?: string,
  ) => {
    try {
      const appointmentId = parseAppointmentId(appointment.id);

      const body: Record<string, unknown> = { appointmentId };
      if (reason) body.cancellationReason = reason;

      await apiCall("/appointments/cancel-appointment", {
        method: "PATCH",
        body: JSON.stringify(body),
      });

      setAppointments((prev) =>
        prev.filter((item) => item.id !== appointment.id),
      );
      setSelectedAppointments((prev) =>
        prev.filter((item) => item.id !== appointment.id),
      );

      setSelectedAppointmentId((currentSelectedId) =>
        currentSelectedId === appointment.id ? null : currentSelectedId,
      );

      await refreshAppointments();
      setShowAppointmentModal(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to cancel appointment";
      console.error(errorMessage, error);
      toast.error(errorMessage);
    }
  };

  const handleCompleteAppointment = async (
    appointment: CalendarAppointment,
  ) => {
    try {
      const appointmentId = parseAppointmentId(appointment.id);

      await apiCall("/appointments/completed-appointment", {
        method: "PATCH",
        body: JSON.stringify({ appointmentId }),
      });

      await refreshAppointments();
      setShowAppointmentModal(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to complete appointment";
      console.error(errorMessage, error);
      toast.error(errorMessage);
    }
  };

  const handleConfirmStatusChange = (
    newStatus: string,
    id: string,
    scheduleDate?: string,
    scheduleTime?: string,
  ) => {
    setAppointments((prev) =>
      prev.map((item) => {
        if (item.applicationId !== id) {
          return item;
        }

        const nextAppointmentType =
          newStatus === "Accepted"
            ? "Orientation"
            : newStatus === "For interview"
              ? "Interview"
              : item.appointmentType;

        const next: CalendarAppointment = {
          ...item,
          status: newStatus as CalendarAppointment["status"],
          appointmentType: nextAppointmentType,
          dateKey:
            newStatus === "Accepted" || newStatus === "For interview"
              ? (scheduleDate ?? item.dateKey)
              : "",
          appointmentTime:
            newStatus === "Accepted" || newStatus === "For interview"
              ? (scheduleTime ?? item.appointmentTime)
              : "",
          title:
            newStatus === "Accepted"
              ? `Orientation - ${item.applicantName}`
              : newStatus === "For interview"
                ? `Interview - ${item.applicantName}`
                : `${newStatus} - ${item.applicantName}`,
          tag:
            newStatus === "Accepted"
              ? "Orientation"
              : newStatus === "For interview"
                ? "For Interview"
                : newStatus,
        };

        return next;
      }),
    );

    setChangeStatusAppointment(null);
  };

  return (
    <>
      <main
        className="relative flex w-full flex-col items-start gap-6 p-8"
        aria-label="Calendar main content"
      >
        <CalendarHeaderSection />

        <section
          className="flex flex-col items-start justify-center p-6 relative flex-1 self-stretch w-full grow overflow-auto"
          aria-label="Calendar content"
        >
          <div className="flex flex-col max-h-275 items-start p-6 flex-1 min-h-0 grow bg-white rounded-2xl border border-gray-100 shadow-[0px_1px_2px_#0000000d] self-stretch w-full">
            <CalendarNavigationToolbarSection
              monthLabel={monthLabel}
              onPrev={goPrevMonth}
              onNext={goNextMonth}
              onToday={goToday}
            />

            <CalendarWeekdayHeaderSection />

            <CalendarDatesGridSection
              year={year}
              month={month}
              events={events}
              onAppointmentClick={openAppointmentModal}
              onMoreClick={openDayAppointments}
            />
          </div>
        </section>
      </main>

      <CalendarAppointmentModal
        open={showAppointmentModal}
        appointments={selectedAppointments}
        selectedAppointmentId={selectedAppointmentId}
        onClose={() => setShowAppointmentModal(false)}
        onChangeStatus={(appointment) =>
          setChangeStatusAppointment(appointment)
        }
        onClearAppointment={handleClearAppointment}
        onComplete={handleCompleteAppointment}
      />

      {changeStatusAppointment && (
        <ChangeStatusModal
          open={!!changeStatusAppointment}
          application={changeStatusAppointment}
          onClose={() => setChangeStatusAppointment(null)}
          onConfirm={handleConfirmStatusChange}
        />
      )}
    </>
  );
}
