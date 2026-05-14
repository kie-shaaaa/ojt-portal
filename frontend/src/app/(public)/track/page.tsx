"use client";

import { JSX, useId, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  Clock3,
  FileText,
  Mail,
  Search,
  School,
  User,
} from "lucide-react";

import { apiCall } from "@/lib/api";

type ApplicationStatus =
  | "pending"
  | "under_review"
  | "for_interview"
  | "rejected"
  | "accepted";

type TimelineEntry = {
  date: string;
  title: string;
  description: string;
};

interface ApplicationRecord {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  applicationType: string;
  submissionDate: string;
  status: ApplicationStatus;
  positionApplied?: string;
  schoolName?: string;
  course?: string;
  hoursNeeded?: string;
  yearsExperience?: string;
  currentCompany?: string;
  availableDate?: string;
  salaryExpectation?: string;
  adminNotes?: string;
  reviewedDate?: string;
}

type ApiApplicationRecord = {
  id: number;
  application_type: string;
  other_application_type?: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  school_name: string | null;
  hours_needed: number | null;
  course: string | null;
  position_applied: string | null;
  years_experience: number | null;
  current_company: string | null;
  salary_expectation: number | null;
  available_date: string | null;
  submission_date: string;
  status: ApplicationStatus;
  admin_notes: string | null;
  reviewed_date: string | null;
};

function mapApplicationRecord(
  application: ApiApplicationRecord,
): ApplicationRecord {
  return {
    id: String(application.id).padStart(6, "0"),
    email: application.email,
    firstName: application.first_name,
    lastName: application.last_name,
    phone: application.phone,
    applicationType:
      application.other_application_type ?? application.application_type,
    submissionDate: application.submission_date,
    status: application.status,
    positionApplied: application.position_applied ?? undefined,
    schoolName: application.school_name ?? undefined,
    course: application.course ?? undefined,
    hoursNeeded: application.hours_needed?.toString(),
    yearsExperience: application.years_experience?.toString(),
    currentCompany: application.current_company ?? undefined,
    availableDate: application.available_date ?? undefined,
    salaryExpectation: application.salary_expectation?.toString(),
    adminNotes: application.admin_notes ?? undefined,
    reviewedDate: application.reviewed_date ?? undefined,
  };
}

async function fetchApplicationRecord(id: string, email: string) {
  const response = (await apiCall(
    `/applications/fetch?id=${encodeURIComponent(id)}&email=${encodeURIComponent(email)}`,
  )) as ApiApplicationRecord[];

  const normalizedEmail = email.toLowerCase();
  const numericId = Number(id);

  const matchedApplication =
    response.find(
      (application) =>
        application.id === numericId &&
        application.email.toLowerCase() === normalizedEmail,
    ) ??
    response.find((application) => application.id === numericId) ??
    response.find(
      (application) => application.email.toLowerCase() === normalizedEmail,
    ) ??
    null;

  return matchedApplication ? mapApplicationRecord(matchedApplication) : null;
}

const statusMeta: Record<
  ApplicationStatus,
  {
    label: string;
    badgeClassName: string;
    panelClassName: string;
    icon: typeof BadgeCheck;
    title: string;
    description: string;
  }
> = {
  pending: {
    label: "Pending",
    badgeClassName: "bg-amber-100 text-amber-800",
    panelClassName: "border-amber-200 bg-amber-50 text-amber-900",
    icon: Clock3,
    title: "What's Next?",
    description:
      "Your application is in the queue for review. Our team will assess it within 1-7 days.",
  },
  under_review: {
    label: "Under Review",
    badgeClassName: "bg-sky-100 text-sky-800",
    panelClassName: "border-sky-200 bg-sky-50 text-sky-900",
    icon: Search,
    title: "Currently Under Review",
    description:
      "Our team is actively reviewing your application. This process typically takes 1-7 days.",
  },
  for_interview: {
    label: "For Interview",
    badgeClassName: "bg-emerald-100 text-emerald-800",
    panelClassName: "border-emerald-200 bg-emerald-50 text-emerald-900",
    icon: CalendarClock,
    title: "For Interview",
    description:
      "Your application has been shortlisted for an interview. Please check your email for the schedule details.",
  },
  rejected: {
    label: "Rejected",
    badgeClassName: "bg-rose-100 text-rose-800",
    panelClassName: "border-rose-200 bg-rose-50 text-rose-900",
    icon: BadgeCheck,
    title: "Application Status",
    description:
      "Thank you for your interest in joining the National Telecommunications Commission. After careful consideration, your application was not selected.",
  },
  accepted: {
    label: "Accepted",
    badgeClassName: "bg-green-100 text-green-800",
    panelClassName: "border-green-200 bg-green-50 text-green-900",
    icon: BadgeCheck,
    title: "Congratulations!",
    description:
      "Your application has been accepted. Kindly check your email for the confirmation and next steps.",
  },
};

function normalizeApplicationId(value: string) {
  return value.replace(/\D/g, "");
}

function formatApplicationId(value: string) {
  return `NTC-APP-${value.padStart(6, "0")}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function statusLabel(value: ApplicationStatus) {
  return statusMeta[value].label;
}

function buildTimeline(application: ApplicationRecord): TimelineEntry[] {
  const timeline: TimelineEntry[] = [
    {
      date: formatDate(application.submissionDate),
      title: "Application Submitted",
      description: "Your application has been received and is awaiting review.",
    },
  ];

  if (application.reviewedDate) {
    timeline.push({
      date: formatDate(application.reviewedDate),
      title: "Application Reviewed",
      description:
        "Your application has been reviewed by our recruitment team.",
    });
  }

  timeline.push({
    date: formatDate(new Date().toISOString()),
    title: "Current Status",
    description: `Your application is currently ${statusLabel(application.status).toLowerCase()}.`,
  });

  return timeline;
}

function InfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof User;
}) {
  return (
    <div className="flex min-h-22 flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          {label}
        </div>
        <div className="text-sm font-semibold leading-5 text-slate-800 break-word">
          {value}
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ date, title, description }: TimelineEntry) {
  return (
    <div className="relative rounded-xl border border-slate-200 bg-white p-4 pl-8 sm:pl-10 shadow-sm">
      <div className="absolute left-3 top-5 h-2.5 w-2.5 rounded-full bg-blue-600 sm: left-4 sm:h-3 sm:w-3" />
      <div className="mb-1 text-sm font-semibold text-blue-700">{date}</div>
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function StatusPanel({ application }: { application: ApplicationRecord }) {
  const meta = statusMeta[application.status];
  const StatusIcon = meta.icon;

  return (
    <div className={`rounded-xl border px-5 py-4 ${meta.panelClassName}`}>
      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
        <StatusIcon className="h-5 w-5" aria-hidden="true" />
        {meta.title}
      </h3>
      <p className="text-sm leading-6">{meta.description}</p>
    </div>
  );
}

function ResultSection({ application }: { application: ApplicationRecord }) {
  const timeline = buildTimeline(application);
  const meta = statusMeta[application.status];

  return (
    <section className="mt-10 space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:p-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] bg-slate-100 text-slate-700">
            <FileText className="h-4 w-4 text-slate-700" aria-hidden="true" />
            Application Found
          </div>
          <div className="inline-flex max-w-full items-center justify-center rounded-full bg-linear-to-r from-blue-800 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(37,99,235,0.35)] wrap-break-word">
            {formatApplicationId(application.id)}
          </div>
        </div>

        <div
          className={`inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold uppercase ${meta.badgeClassName}`}
        >
          {meta.label}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <InfoCard
          label="Applicant Name"
          value={`${application.firstName} ${application.lastName}`}
          icon={User}
        />
        <InfoCard label="Email Address" value={application.email} icon={Mail} />
        <InfoCard label="Phone Number" value={application.phone} icon={Mail} />
        <InfoCard
          label="Application Type"
          value={application.applicationType}
          icon={FileText}
        />
        <InfoCard
          label="Submission Date"
          value={formatDate(application.submissionDate)}
          icon={CalendarClock}
        />
        {application.positionApplied ? (
          <InfoCard
            label="Position Applied"
            value={application.positionApplied}
            icon={School}
          />
        ) : null}
        {application.schoolName ? (
          <InfoCard
            label="School"
            value={application.schoolName}
            icon={School}
          />
        ) : null}
        {application.course ? (
          <InfoCard label="Course" value={application.course} icon={School} />
        ) : null}
        {application.hoursNeeded ? (
          <InfoCard
            label="Required Hours"
            value={`${application.hoursNeeded} hours`}
            icon={Clock3}
          />
        ) : null}
        {application.yearsExperience ? (
          <InfoCard
            label="Years of Experience"
            value={`${application.yearsExperience} years`}
            icon={Clock3}
          />
        ) : null}
        {application.currentCompany ? (
          <InfoCard
            label="Current Company"
            value={application.currentCompany}
            icon={FileText}
          />
        ) : null}
        {application.salaryExpectation ? (
          <InfoCard
            label="Salary Expectation"
            value={`₱${application.salaryExpectation}`}
            icon={FileText}
          />
        ) : null}
      </div>

      {application.adminNotes ? (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm leading-6 text-blue-950">
          <div className="mb-2 flex items-center gap-2 font-semibold text-blue-800">
            <FileText className="h-4 w-4" aria-hidden="true" />
            Admin Notes
          </div>
          <p className="whitespace-pre-line">{application.adminNotes}</p>
        </div>
      ) : null}

      <StatusPanel application={application} />

      <div className="space-y-4 border-t border-slate-200 pt-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Application Timeline
        </h3>
        <div className="space-y-4">
          {timeline.map((entry) => (
            <TimelineItem key={`${entry.title}-${entry.date}`} {...entry} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function TrackPage(): JSX.Element {
  const applicationIdInputId = useId();
  const emailInputId = useId();

  const [applicationId, setApplicationId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<ApplicationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApplicationIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    let nextValue = event.target.value.toUpperCase();

    if (/^\d+$/.test(nextValue) && nextValue.length > 0) {
      nextValue = `NTC-APP-${nextValue}`;
    }

    nextValue = nextValue.replace(/(NTC-APP-)+/g, "NTC-APP-");

    setApplicationId(nextValue);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedApplicationId = applicationId.trim();
    const trimmedEmail = email.trim();

    if (!trimmedApplicationId || !trimmedEmail) {
      setError("Please enter both Application ID and Email address.");
      setResult(null);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      setResult(null);
      return;
    }

    const numericId = normalizeApplicationId(trimmedApplicationId);

    if (!numericId) {
      setError("Please enter a valid Application ID (e.g., 8 or NTC-000008).");
      setResult(null);
      return;
    }

    setIsLoading(true);

    try {
      const matchedApplication = await fetchApplicationRecord(
        numericId,
        trimmedEmail,
      );

      if (!matchedApplication) {
        setError(
          "No application found with the provided Application ID and Email.",
        );
        setResult(null);
        return;
      }

      setError("");
      setResult(matchedApplication);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to fetch application.",
      );
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturn = () => {
    if (window.history.length > 1) {
      window.history.back();
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[radial-gradient(50%_50%_at_50%_24%,rgba(0,51,153,1)_0%,rgba(0,31,84,1)_70%)] px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <section className="flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0px_25px_50px_-12px_#00000040]">
        <header className="flex flex-col gap-3 bg-[linear-gradient(167deg,rgba(30,58,138,1)_0%,rgba(59,130,246,1)_100%)] px-6 py-12 text-center text-white sm:px-10">
          <h1 className="text-4xl font-bold tracking-[-0.9px] sm:text-4xl lg:text-5xl">
            Track Your Application
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-white/90 sm:text-base sm:leading-7">
            Enter your Application ID and Email to check your application
            status.
          </p>
        </header>

        <div className="flex flex-col gap-8 p-4 sm:gap-8 sm:p-8 lg:p-10">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
                <strong>Error:</strong> {error}
              </div>
            ) : null}

            <div className="space-y-2">
              <label
                htmlFor={applicationIdInputId}
                className="text-sm font-semibold text-slate-700"
              >
                Application ID
              </label>
              <div className="rounded-xl border border-slate-300 bg-white px-3 py-3 sm:px-4 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <input
                  id={applicationIdInputId}
                  name="applicationId"
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  aria-describedby={`${applicationIdInputId}-hint`}
                  className="w-full border-0 bg-transparent p-0 text-sm sm:text-base text-slate-800 outline-none placeholder:text-slate-400"
                  placeholder="Enter your application number"
                  value={applicationId}
                  onChange={handleApplicationIdChange}
                />
              </div>
              <p
                id={`${applicationIdInputId}-hint`}
                className="text-xs leading-5 text-slate-500"
              >
                You can enter with or without &quot;NTC-APP&quot; prefix (e.g.,
                NTC-APP-000008 or 8)
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor={emailInputId}
                className="text-sm font-semibold text-slate-700"
              >
                Used Email Address (For Verification)
              </label>
              <div className="rounded-xl border border-slate-300 bg-white px-3 py-3 sm:px-4 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <input
                  id={emailInputId}
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="w-full border-0 bg-transparent p-0 text-sm sm:text-base text-slate-800 outline-none placeholder:text-slate-400"
                  placeholder="Enter the email used in your application"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-linear-to-r from-blue-800 to-blue-500 px-6 py-4 text-base font-semibold text-white shadow-[0px_10px_20px_-8px_rgba(37,99,235,0.7)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              aria-label="Track Application Status"
              disabled={isLoading}
            >
              <Search className="h-5 w-5" aria-hidden="true" />
              <span>
                {isLoading ? "Tracking..." : "Track Application Status"}
              </span>
            </button>
          </form>

          {result ? <ResultSection application={result} /> : null}

          <div className="flex items-start">
            <button
              type="button"
              onClick={handleReturn}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-blue-800 px-5 py-2 text-base font-semibold text-blue-900 transition-colors hover:bg-blue-800 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Return
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
