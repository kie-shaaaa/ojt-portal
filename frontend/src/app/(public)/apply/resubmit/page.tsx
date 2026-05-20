"use client";

import { apiCall } from "@/lib/api";
import {
  useApplicationFiles,
  type ApplicationFile,
} from "@/hooks/useApplicationFiles";
import { useRouter, useSearchParams } from "next/navigation";
import { JSX, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  Mail,
  Upload,
  User,
} from "lucide-react";
import { toast } from "sonner";

type ApplicationStatus =
  | "pending"
  | "under_review"
  | "for_interview"
  | "rejected"
  | "accepted"
  | "pending accept"
  | string;

type ApplicationRecord = {
  id: number;
  application_type: string;
  other_application_type?: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  school_name?: string | null;
  course?: string | null;
  hours_needed?: number | string | null;
  deployment_date?: string | null;
  status?: ApplicationStatus;
  submission_date?: string | null;
};

type PrefilledDocument = {
  id: string;
  label: string;
  description: string;
  accept: string;
  maxSizeMb: number;
};

type DocumentSelection = Record<string, File | null>;

type NormalizedApplication = {
  id: number;
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  school: string;
  course: string;
  hours: string;
  deploymentDate: string;
  applicationType: string;
  status: string;
  submissionDate: string;
};

const REQUIRED_DOCUMENTS: PrefilledDocument[] = [
  {
    id: "resume-cv",
    label: "Resume / CV",
    description: "PDF only, maximum 5 MB",
    accept: ".pdf,application/pdf",
    maxSizeMb: 5,
  },
  {
    id: "proof-of-enrollment",
    label: "Proof of Enrollment",
    description: "PDF only, maximum 5 MB",
    accept: ".pdf,application/pdf",
    maxSizeMb: 5,
  },
  {
    id: "draft-endorsement",
    label: "Draft Endorsement Letter",
    description: "PDF only, maximum 5 MB",
    accept: ".pdf,application/pdf",
    maxSizeMb: 5,
  },
  {
    id: "vaccine-card",
    label: "Vaccine Card / Medical Certificate",
    description: "PDF only, maximum 5 MB",
    accept: ".pdf,application/pdf",
    maxSizeMb: 5,
  },
  {
    id: "draft-moa",
    label: "Draft Memorandum of Agreement",
    description: "PDF only, maximum 5 MB",
    accept: ".pdf,application/pdf",
    maxSizeMb: 5,
  },
  {
    id: "picture-1x1",
    label: "1×1 Picture",
    description: "JPG or PNG only, square, maximum 2 MB",
    accept: ".jpg,.jpeg,.png,image/jpeg,image/png",
    maxSizeMb: 2,
  },
];

function refNumber(id: number) {
  return `NTC-APP-${String(id).padStart(6, "0")}`;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^63/, "").slice(0, 10);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;

  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

function normalizeLookupResponse(payload: unknown): ApplicationRecord | null {
  const candidate = Array.isArray(payload)
    ? payload[0]
    : payload && typeof payload === "object" && "data" in payload
      ? (payload as { data?: unknown }).data
      : payload;

  if (!candidate) return null;

  if (Array.isArray(candidate)) {
    return normalizeLookupResponse(candidate[0] ?? null);
  }

  if (!candidate || typeof candidate !== "object") return null;

  return candidate as ApplicationRecord;
}

function normalizeFileKey(file: ApplicationFile) {
  return (
    file.document_key?.trim().toLowerCase() ||
    file.file_type.trim().toLowerCase() ||
    file.file_name
      .trim()
      .toLowerCase()
      .replace(/\.[^.]+$/, "")
  );
}

function humanizeStatus(status?: string) {
  const value = status?.trim();
  if (!value) return "Pending";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/Pending Accept/i, "Pending Acceptance");
}

function ResubmissionPage(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationIdParam = searchParams.get("id") ?? "";
  const emailParam = searchParams.get("email") ?? "";

  const [loadingApplication, setLoadingApplication] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [application, setApplication] = useState<NormalizedApplication | null>(
    null,
  );
  const [selectedFiles, setSelectedFiles] = useState<DocumentSelection>({});

  const parsedApplicationId = useMemo(() => {
    const numeric = Number(applicationIdParam);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : undefined;
  }, [applicationIdParam]);

  const { files, loading: loadingFiles } = useApplicationFiles({
    applicationId: parsedApplicationId,
    applicantEmail: emailParam || undefined,
  });

  useEffect(() => {
    const loadApplication = async () => {
      if (!parsedApplicationId || !emailParam) {
        setError(
          "The resubmission link is missing the application ID or email.",
        );
        setLoadingApplication(false);
        return;
      }

      setLoadingApplication(true);
      setError(null);

      try {
        const response = await apiCall(
          `/applications/fetch?id=${encodeURIComponent(String(parsedApplicationId))}&email=${encodeURIComponent(emailParam)}`,
        );

        const record = normalizeLookupResponse(response);

        if (!record || Number(record.id) !== parsedApplicationId) {
          throw new Error(
            "We could not load your application. Please use the latest resubmission link from your email.",
          );
        }

        setApplication({
          id: record.id,
          reference: refNumber(record.id),
          firstName: record.first_name ?? "",
          lastName: record.last_name ?? "",
          email: record.email ?? emailParam,
          phone: record.phone ?? "",
          school: record.school_name ?? "",
          course: record.course ?? "",
          hours: String(record.hours_needed ?? ""),
          deploymentDate: record.deployment_date ?? "",
          applicationType:
            record.other_application_type?.trim() || record.application_type,
          status: humanizeStatus(record.status),
          submissionDate: formatDate(record.submission_date),
        });
      } catch (fetchError) {
        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load application data.";
        setError(message);
        toast.error(message);
      } finally {
        setLoadingApplication(false);
      }
    };

    void loadApplication();
  }, [emailParam, parsedApplicationId]);

  const filesByKey = useMemo(() => {
    return files.reduce<Record<string, ApplicationFile>>((acc, file) => {
      acc[normalizeFileKey(file)] = file;
      return acc;
    }, {});
  }, [files]);

  const missingDocuments = useMemo(
    () => REQUIRED_DOCUMENTS.filter((document) => !filesByKey[document.id]),
    [filesByKey],
  );

  const completedDocuments = useMemo(
    () => REQUIRED_DOCUMENTS.filter((document) => !!filesByKey[document.id]),
    [filesByKey],
  );

  const handleSelectFile = (documentId: string, file: File | null) => {
    setSelectedFiles((current) => ({
      ...current,
      [documentId]: file,
    }));
  };

  const canSubmit =
    !!application &&
    missingDocuments.every((document) => selectedFiles[document.id]);

  const handleSubmit = async () => {
    if (!application) return;

    if (!canSubmit) {
      toast.error("Please upload every missing document before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("application_id", String(application.id));
    formData.append("email", application.email);
    formData.append("first_name", application.firstName);
    formData.append("last_name", application.lastName);
    formData.append("phone", application.phone);
    formData.append("school_name", application.school);
    formData.append("course", application.course);
    formData.append("hours_needed", application.hours);
    formData.append("deployment_date", application.deploymentDate);

    missingDocuments.forEach((document) => {
      const file = selectedFiles[document.id];
      if (file) {
        formData.append(document.id, file, file.name);
      }
    });

    setLoadingSubmit(true);

    try {
      const response = await apiCall(
        `/applications/${application.id}/resubmit-files`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (response instanceof Response) {
        const payload = await response.json().catch(() => null);
        throw new Error(
          payload?.message ||
            "We could not submit your resubmission right now.",
        );
      }

      if (!response?.ok) {
        throw new Error(response?.message || "Resubmission failed.");
      }

      toast.success("Your resubmission was submitted successfully.");

      setTimeout(() => {
        router.push("/apply/resubmit-success");
      }, 1500);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Failed to submit resubmission.";
      toast.error(message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(0,56,168,0.18),transparent_38%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] px-4 py-8 text-slate-900 md:px-6 md:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <section className="overflow-hidden rounded-3xl border border-white/60 bg-white shadow-[0_28px_70px_-24px_rgba(15,23,42,0.35)]">
          <header className="relative overflow-hidden border-b border-slate-100 bg-[#0038A8] px-6 py-6 text-white md:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_40%)]" />
            <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
                  Document Resubmission
                </p>
                <h1 className="text-2xl font-bold md:text-3xl">
                  Review your prefilled application and upload the missing file
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-blue-50/90 md:text-base">
                  The link in your email loads your previous application
                  details. Only the rejected or missing document needs to be
                  uploaded again.
                </p>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.18em] text-blue-100">
                  Reference
                </p>
                <p className="text-lg font-semibold">
                  {application?.reference ??
                    (parsedApplicationId
                      ? refNumber(parsedApplicationId)
                      : "—")}
                </p>
              </div>
            </div>
          </header>

          <div className="grid gap-6 px-6 py-6 md:px-10 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-2 text-[#0038A8] shadow-sm ring-1 ring-slate-200">
                  <User size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Prefilled Details
                  </h2>
                  <p className="text-sm text-slate-500">
                    These values come from your original application.
                  </p>
                </div>
              </div>

              {loadingApplication ? (
                <div className="flex min-h-96 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading application data...
                  </div>
                </div>
              ) : error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-semibold">
                        Unable to load your application
                      </p>
                      <p className="mt-1 leading-6">{error}</p>
                    </div>
                  </div>
                </div>
              ) : application ? (
                <div className="space-y-4">
                  <ReadOnlyField
                    label="First Name"
                    value={application.firstName}
                  />
                  <ReadOnlyField
                    label="Last Name"
                    value={application.lastName}
                  />
                  <ReadOnlyField
                    label="Email Address"
                    value={application.email}
                    icon={<Mail size={16} />}
                  />
                  <ReadOnlyField
                    label="Phone Number"
                    value={formatPhone(application.phone)}
                  />
                  <ReadOnlyField label="School" value={application.school} />
                  <ReadOnlyField
                    label="Course / Program"
                    value={application.course}
                  />
                  <ReadOnlyField
                    label="Hours Required"
                    value={application.hours}
                  />
                  <ReadOnlyField
                    label="Deployment Date"
                    value={formatDate(application.deploymentDate)}
                  />
                  <ReadOnlyField
                    label="Application Type"
                    value={application.applicationType}
                  />
                  <ReadOnlyField
                    label="Current Status"
                    value={application.status}
                    icon={<Clock3 size={16} />}
                  />
                  <ReadOnlyField
                    label="Submission Date"
                    value={application.submissionDate}
                  />
                </div>
              ) : null}
            </section>

            <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-2 text-[#0038A8] ring-1 ring-blue-100">
                  <FileText size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Resubmit Missing Document
                  </h2>
                  <p className="text-sm text-slate-500">
                    Only the rejected or missing files need to be uploaded.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {loadingFiles ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                    Loading uploaded files...
                  </div>
                ) : (
                  <>
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <div className="flex items-start gap-3 text-emerald-800">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                        <div>
                          <p className="font-semibold">Already submitted</p>
                          <p className="text-sm leading-6 text-emerald-700">
                            {completedDocuments.length} document
                            {completedDocuments.length === 1
                              ? " is"
                              : "s are"}{" "}
                            already on record.
                          </p>
                        </div>
                      </div>
                    </div>

                    {missingDocuments.length > 0 ? (
                      <div className="space-y-4">
                        {missingDocuments.map((document) => (
                          <DocumentUploadCard
                            key={document.id}
                            document={document}
                            file={selectedFiles[document.id] ?? null}
                            onChange={handleSelectFile}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                        All required documents are already present. If an admin
                        requested a replacement, use the original email link and
                        upload the document that was rejected.
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">
                  What happens next
                </p>
                <ul className="mt-2 space-y-2 leading-6">
                  <li>1. Upload the missing file using the card above.</li>
                  <li>2. Review your details before submitting.</li>
                  <li>
                    3. The application is sent back to the admin for review.
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={
                  !application ||
                  loadingApplication ||
                  loadingSubmit ||
                  !canSubmit
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0038A8] px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:bg-[#002d87] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {loadingSubmit ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting resubmission...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Submit Resubmission
                  </>
                )}
              </button>
            </section>
          </div>
        </section>

        <div className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-sm text-slate-600 shadow-sm backdrop-blur">
          <p>
            If this page does not match your records, open the latest email from
            the NTC portal and use the resubmission link again.
          </p>
        </div>
      </div>
    </main>
  );
}

function ReadOnlyField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: JSX.Element;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <div className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-900">
        {icon ? <span className="text-[#0038A8]">{icon}</span> : null}
        <span className="wrap-break-word">{value || "—"}</span>
      </div>
    </div>
  );
}

function DocumentUploadCard({
  document,
  file,
  onChange,
}: {
  document: PrefilledDocument;
  file: File | null;
  onChange: (documentId: string, file: File | null) => void;
}) {
  const inputId = `resubmit-${document.id}`;
  const hasFile = !!file;

  return (
    <div
      className={`rounded-2xl border p-4 ${hasFile ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {document.label}
          </p>
          <p className="mt-1 text-xs text-slate-500">{document.description}</p>
        </div>

        <div
          className={`rounded-full px-3 py-1 text-xs font-semibold ${hasFile ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
        >
          {hasFile ? "Ready to submit" : "Missing file"}
        </div>
      </div>

      <label
        htmlFor={inputId}
        className="mt-4 flex cursor-pointer flex-col gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white px-4 py-4 transition hover:border-[#0038A8] hover:bg-blue-50/40"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2 text-[#0038A8] ring-1 ring-blue-100">
            <Upload size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              {hasFile ? file.name : `Upload ${document.label}`}
            </p>
            <p className="text-xs text-slate-500">
              {hasFile
                ? `${formatSize(file.size)} selected`
                : `Allowed: ${document.accept.replace(/\./g, "")}`}
            </p>
          </div>
        </div>

        <input
          id={inputId}
          type="file"
          accept={document.accept}
          className="sr-only"
          onChange={(event) =>
            onChange(document.id, event.target.files?.[0] ?? null)
          }
        />
      </label>
    </div>
  );
}

function formatSize(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  return `${Math.round((bytes / Math.pow(1024, index)) * 100) / 100} ${units[index]}`;
}

export default ResubmissionPage;
