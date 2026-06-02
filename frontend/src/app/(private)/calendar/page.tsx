"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { CalendarHeaderSection } from "@/components/layout/private/Calendar/CalendarHeaderSection";
import CalendarAppointmentModal from "@/components/layout/private/Calendar/CalendarAppointmentModal";
import { CalendarDatesGridSection } from "@/components/layout/private/Calendar/CalendarDatesGridSection";
import { CalendarNavigationToolbarSection } from "@/components/layout/private/Calendar/CalendarNavigationToolbarSection";
import { CalendarWeekdayHeaderSection } from "@/components/layout/private/Calendar/CalendarWeekdayHeaderSection";
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
    : row.application_status === "for_interview"
      ? "For interview"
      : row.application_status === "accepted"
        ? "Accepted"
        : "Pending Accept";
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
  const lastAppointmentsSnapshotRef = useRef("");
  const hasLoadedAppointmentsRef = useRef(false);

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

  const syncAppointments = async (notifyOnChange = false) => {
    try {
      const response = (await apiCall(
        `/appointments/fetch-calendar?month=${month + 1}&year=${year}`,
        {
          method: "GET",
        },
      )) as CalendarAppointmentsResponse;

      const nextAppointments = await hydrateAppointments(response);
      const nextSnapshot = JSON.stringify(
        nextAppointments.map((appointment) => [
          appointment.id,
          appointment.appointmentDate,
          appointment.status,
        ]),
      );

      if (
        notifyOnChange &&
        hasLoadedAppointmentsRef.current &&
        nextSnapshot !== lastAppointmentsSnapshotRef.current
      ) {
        toast.info('Calendar updated with a new appointment change.');
      }

      lastAppointmentsSnapshotRef.current = nextSnapshot;
      hasLoadedAppointmentsRef.current = true;
      setAppointments(nextAppointments);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
      setAppointments([]);
    }
  };

  useEffect(() => {
    let isActive = true;

    void syncAppointments(false);

    const intervalId = window.setInterval(() => {
      void syncAppointments(true);
    }, 45000);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [month, year]);

  const events = useMemo(() => {
    return appointments.reduce<Record<string, CalendarAppointment[]>>(
      (acc, appointment) => {
        if (
          appointment.status !== "Accepted" &&
          appointment.status !== "Pending Accept" &&
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

      await syncAppointments(true);
      window.dispatchEvent(new Event("applications:refresh"));
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

      await syncAppointments(true);
      window.dispatchEvent(new Event("applications:refresh"));
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

  return (
    <>
      <main
        className="relative flex w-full min-w-0 flex-col items-start gap-6 p-4 sm:p-6 lg:p-8"
        aria-label="Calendar main content"
      >
        <CalendarHeaderSection />

        <section
          className="relative flex w-full flex-1 self-stretch flex-col items-start justify-center overflow-auto p-3 sm:p-4 lg:p-6"
          aria-label="Calendar content"
        >
          <div className="flex min-h-0 flex-1 flex-col items-start max-h-275 self-stretch w-full rounded-2xl border border-gray-100 bg-white p-3 shadow-[0px_1px_2px_#0000000d] sm:p-4 lg:p-6">
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
        onClearAppointment={handleClearAppointment}
        onComplete={handleCompleteAppointment}
      />
    </>
  );
}
