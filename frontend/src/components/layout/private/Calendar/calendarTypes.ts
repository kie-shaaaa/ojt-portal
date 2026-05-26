export type CalendarAppointmentStatus =
  | "For interview"
  | "Accepted"
  | "Pending Accept"
  | "Pending"
  | "Completed";

export type CalendarAppointmentType = "Interview" | "Orientation";

export interface CalendarAppointment {
  id: string;
  applicationId: string;
  ojtId: string;
  appointmentDate: string;
  applicantName: string;
  applicantEmail: string;
  gender?: string;
  school: string;
  course: string;
  hoursNeeded: string;
  dateKey: string;
  appointmentTime: string;
  appointmentType: CalendarAppointmentType;
  status: CalendarAppointmentStatus;
  title: string;
  tag: string;
  deploymentDate: string;
  endDate: string;
}
