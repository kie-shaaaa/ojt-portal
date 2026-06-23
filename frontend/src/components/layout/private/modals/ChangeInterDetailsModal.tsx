import { JSX, useEffect, useId, useMemo, useState } from "react";
import { X, Save, ChevronDown } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import DatePicker from "@/components/layout/DatePicker";
import { apiCall } from "@/lib/api";

interface ChangeInternDetailsProps {
  intern?: {
    id?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    school?: string;
    course?: string;
    ojtYear?: string;
    adminNote?: string;
    gender?: string;
    deploymentDate?: string;
    endDate?: string;
  } | null;
  onClose: () => void;
  onSave?: (data: any) => void;
}

const defaultSchoolOptions = [
  "University of the Philippines",
  "Ateneo de Manila University",
  "De La Salle University",
  "Mapua University",
  "Polytechnic University of the Philippines",
  "University of Santo Tomas",
  "Technological University of the Philippines",
  "Far Eastern University",
];

const defaultCourseOptions = [
  "BS Information Technology",
  "BS Computer Science",
  "BS Computer Engineering",
  "BS Business Administration",
  "BS Accountancy",
  "BS Psychology",
  "BS Tourism Management",
  "Bachelor of Elementary Education",
];

interface SearchableFieldProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const SearchableField = ({
  id,
  label,
  value,
  options,
  onChange,
}: SearchableFieldProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const mergedOptions = useMemo(() => Array.from(new Set(options)), [options]);

  const normalizedQuery = value.trim().toLowerCase();
  const filteredOptions = useMemo(() => {
    if (!normalizedQuery) {
      return mergedOptions;
    }

    return [...mergedOptions]
      .filter((option) => option.toLowerCase().includes(normalizedQuery))
      .sort((left, right) => {
        const leftValue = left.toLowerCase();
        const rightValue = right.toLowerCase();
        const leftPrefix = leftValue.startsWith(normalizedQuery) ? 0 : 1;
        const rightPrefix = rightValue.startsWith(normalizedQuery) ? 0 : 1;

        if (leftPrefix !== rightPrefix) {
          return leftPrefix - rightPrefix;
        }

        return leftValue.localeCompare(rightValue);
      });
  }, [mergedOptions, normalizedQuery]);

  const exactMatch = mergedOptions.some(
    (option) => option.toLowerCase() === normalizedQuery,
  );

  const normalizeWhitespace = (input: string) =>
    input.replace(/\s+/g, " ").trim();

  const resolveCanonicalValue = (rawValue: string) => {
    const normalizedValue = normalizeWhitespace(rawValue);
    if (!normalizedValue) return "";

    const matched = mergedOptions.find(
      (option) =>
        option.toLowerCase() === normalizedValue.toLowerCase() ||
        option.toLowerCase().includes(normalizedValue.toLowerCase()),
    );

    return matched ?? normalizedValue;
  };

  const handleSelect = (nextValue: string) => {
    onChange(resolveCanonicalValue(nextValue));
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (exactMatch) {
        handleSelect(value.trim());
      } else {
        onChange(resolveCanonicalValue(value));
        setIsOpen(false);
      }
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm text-black"
        />
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400"
          aria-label={`Toggle ${label} options`}
        >
          <ChevronDown size={18} />
        </button>
      </div>
      {isOpen && (
        <div className="absolute z-20 mt-14 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSelect(option);
                }}
                className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ChangeInterDetailsModal = ({
  intern,
  onClose,
  onSave,
}: ChangeInternDetailsProps): JSX.Element => {
  const titleId = useId();
  const descriptionId = useId();
  const firstNameId = useId();
  const lastNameId = useId();
  const schoolId = useId();
  const courseId = useId();
  const adminNotesId = useId();
  const genderFieldId = useId();
  const deploymentDateId = useId();
  const endDateId = useId();

  const [firstName, setFirstName] = useState(intern?.firstName ?? "");
  const [lastName, setLastName] = useState(intern?.lastName ?? "");
  const [school, setSchool] = useState(intern?.school ?? "");
  const [course, setCourse] = useState(intern?.course ?? "");
  const [ojtYear, setOjtYear] = useState(intern?.ojtYear ?? "2026");
  const [adminNote, setAdminNote] = useState(intern?.adminNote ?? "");
  const [gender, setGender] = useState(intern?.gender ?? "Female");
  const genderOptions = ["Female", "Male", "Non-binary"];
  const [deploymentDate, setDeploymentDate] = useState(
    intern?.deploymentDate ?? "",
  );
  const [deploymentDateMode, setDeploymentDateMode] = useState<"month" | "day">(
    intern?.deploymentDate && /^\d{4}-\d{2}$/.test(intern.deploymentDate)
      ? "month"
      : "day",
  );
  const [endDate, setEndDate] = useState(intern?.endDate ?? "");
  const [endDateMode, setEndDateMode] = useState<"month" | "day">(
    intern?.endDate && /^\d{4}-\d{2}$/.test(intern.endDate) ? "month" : "day",
  );
  const [dateMode, setDateMode] = useState<"month" | "day">(
    intern?.deploymentDate && /^\d{4}-\d{2}$/.test(intern.deploymentDate)
      ? "month"
      : intern?.endDate && /^\d{4}-\d{2}$/.test(intern.endDate)
        ? "month"
        : "day",
  );
  const [schoolOptions, setSchoolOptions] = useState(defaultSchoolOptions);
  const [courseOptions, setCourseOptions] = useState(defaultCourseOptions);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await apiCall("/schools/fetch-all?count=1000");
        let schools: unknown[] = [];

        if (Array.isArray(response)) {
          schools = response;
        } else if (response && typeof response === "object") {
          const payload = response as {
            data?: unknown[];
            schools?: unknown[];
          };
          schools = payload.data || payload.schools || [];
        }

        const schoolNames = schools
          .map((schoolValue) => {
            if (typeof schoolValue === "string") return schoolValue;
            if (schoolValue && typeof schoolValue === "object") {
              const payload = schoolValue as {
                name?: string;
                schoolName?: string;
                school_name?: string;
              };
              return (
                payload.schoolName || payload.name || payload.school_name || ""
              );
            }
            return "";
          })
          .filter((name): name is string => Boolean(name.trim()));

        const uniqueSchoolNames = Array.from(
          new Map(
            schoolNames.map((name) => [name.trim().toLowerCase(), name.trim()]),
          ).values(),
        );

        setSchoolOptions(
          uniqueSchoolNames.length > 0
            ? uniqueSchoolNames
            : defaultSchoolOptions,
        );
      } catch (error) {
        setSchoolOptions(defaultSchoolOptions);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await apiCall("/courses/fetch-all?count=1000");
        let courses: unknown[] = [];

        if (Array.isArray(response)) {
          courses = response;
        } else if (response && typeof response === "object") {
          const payload = response as {
            data?: unknown[];
            courses?: unknown[];
          };
          courses = payload.data || payload.courses || [];
        }

        const courseNames = courses
          .map((courseValue) => {
            if (typeof courseValue === "string") return courseValue;
            if (courseValue && typeof courseValue === "object") {
              const payload = courseValue as {
                name?: string;
                courseName?: string;
                course?: string;
                course_name?: string;
              };
              return (
                payload.courseName ||
                payload.name ||
                payload.course ||
                payload.course_name ||
                ""
              );
            }
            return "";
          })
          .filter((name): name is string => Boolean(name.trim()));

        const uniqueCourseNames = Array.from(
          new Map(
            courseNames.map((name) => [name.trim().toLowerCase(), name.trim()]),
          ).values(),
        );

        setCourseOptions(
          uniqueCourseNames.length > 0
            ? uniqueCourseNames
            : defaultCourseOptions,
        );
      } catch (error) {
        setCourseOptions(defaultCourseOptions);
      }
    };

    void fetchSchools();
    void fetchCourses();
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => setFirstName(intern?.firstName ?? ""));
    requestAnimationFrame(() => setLastName(intern?.lastName ?? ""));
    requestAnimationFrame(() => setSchool(intern?.school ?? ""));
    requestAnimationFrame(() => setCourse(intern?.course ?? ""));
    requestAnimationFrame(() => setOjtYear(intern?.ojtYear ?? "2026"));
    requestAnimationFrame(() => setAdminNote(intern?.adminNote ?? ""));
    requestAnimationFrame(() => setGender(intern?.gender ?? "Female"));
    const normalizeToYMD = (d?: string) => {
      if (!d) return "";
      try {
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return "";
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, "0");
        const day = String(dt.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
      } catch {
        return "";
      }
    };

    const parseStoredEndDate = (d?: string) => {
      if (!d) return { value: "", type: "date" as const };
      if (/^\d{4}-\d{2}-\d{2}$/.test(d))
        return { value: d, type: "date" as const };
      if (/^\d{4}-\d{2}$/.test(d)) return { value: d, type: "month" as const };
      if (/^\d{4}$/.test(d)) return { value: d, type: "year" as const };
      // fallback: try parsing as Date and convert to YYYY-MM-DD
      const dt = new Date(d);
      if (!isNaN(dt.getTime()))
        return { value: normalizeToYMD(d), type: "date" as const };
      return { value: "", type: "date" as const };
    };

    const normalizeToYM = (d?: string) => {
      if (!d) return "";
      const trimmed = d.trim();
      if (/^\d{4}-\d{2}$/.test(trimmed)) return trimmed;
      const dt = new Date(trimmed);
      if (isNaN(dt.getTime())) return "";
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, "0");
      return `${y}-${m}`;
    };

    requestAnimationFrame(() => {
      const nextDeploymentDate = normalizeToYMD(intern?.deploymentDate);
      const nextDeploymentMonth = normalizeToYM(intern?.deploymentDate);
      setDeploymentDate(nextDeploymentDate || nextDeploymentMonth || "");
      setDeploymentDateMode(
        intern?.deploymentDate && /^\d{4}-\d{2}$/.test(intern.deploymentDate)
          ? "month"
          : "day",
      );
    });
    requestAnimationFrame(() => {
      const nextEndDate = normalizeToYMD(intern?.endDate);
      const nextEndMonth = normalizeToYM(intern?.endDate);
      setEndDate(nextEndDate || nextEndMonth || "");
      setEndDateMode(
        intern?.endDate && /^\d{4}-\d{2}$/.test(intern.endDate)
          ? "month"
          : "day",
      );
    });
  }, [intern]);

  const handleDateModeChange = (mode: "month" | "day") => {
    setDateMode(mode);
    setDeploymentDateMode(mode);
    setEndDateMode(mode);

    if (mode === "month") {
      setDeploymentDate((current) => {
        if (/^\d{4}-\d{2}$/.test(current)) return current;
        if (/^\d{4}-\d{2}-\d{2}$/.test(current)) {
          return current.slice(0, 7);
        }
        return current;
      });
      setEndDate((current) => {
        if (/^\d{4}-\d{2}$/.test(current)) return current;
        if (/^\d{4}-\d{2}-\d{2}$/.test(current)) {
          return current.slice(0, 7);
        }
        return current;
      });
      return;
    }

    setDeploymentDate((current) => {
      if (/^\d{4}-\d{2}$/.test(current)) {
        return `${current}-01`;
      }
      return current;
    });
    setEndDate((current) => {
      if (/^\d{4}-\d{2}$/.test(current)) {
        return `${current}-01`;
      }
      return current;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      id: intern?.id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      school: school.trim(),
      course: course.trim(),
      ojtYear,
      adminNote,
      gender,
      deploymentDate:
        deploymentDateMode === "month" && deploymentDate.length === 10
          ? deploymentDate.slice(0, 7)
          : deploymentDate || null,
      endDate:
        endDateMode === "month" && endDate.length === 10
          ? endDate.slice(0, 7)
          : endDate || null,
    };
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      if (onSave) onSave(payload);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-3 backdrop-blur-sm sm:items-center sm:p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative flex w-full max-w-2xl max-h-[calc(100vh-1.5rem)] flex-col overflow-auto rounded-xl bg-white shadow-2xl sm:max-h-[90vh]"
      >
        {/* Header */}
        <header className="flex w-full items-center justify-between border-b border-gray-100 px-4 pb-4 pt-4 sm:px-8 sm:pb-6 sm:pt-8">
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
        <div className="flex flex-col gap-4 px-4 pb-6 pt-4 sm:gap-6 sm:px-8 sm:pb-10 sm:pt-6">
          {/* Form */}
          <form className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={firstNameId}
                className="text-sm font-bold text-gray-700"
              >
                First Name
              </label>
              <input
                id={firstNameId}
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={lastNameId}
                className="text-sm font-bold text-gray-700"
              >
                Last Name
              </label>
              <input
                id={lastNameId}
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
              />
            </div>

            <div className="relative">
              <SearchableField
                id={schoolId}
                label="School"
                value={school}
                options={schoolOptions}
                onChange={setSchool}
              />
            </div>

            <div className="relative">
              <SearchableField
                id={courseId}
                label="Course"
                value={course}
                options={courseOptions}
                onChange={setCourse}
              />
            </div>

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
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-black appearance-none"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  {genderOptions.map((option) => (
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
                Used for certificate generation (Mr./Ms./Mx., he/she, his/her, they/them)
              </p>
            </div>

            <div className="flex flex-col gap-1.5 pt-0 pb-4">
              <label
                htmlFor={adminNotesId}
                className="text-sm font-bold text-gray-700"
              >
                Note
              </label>
              <div className="flex w-full">
                <input
                  id={adminNotesId}
                  aria-describedby={`${adminNotesId}-hint`}
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                />
              </div>
              <p id={`${adminNotesId}-hint`} className="text-xs text-gray-500">
                Notes for the intern.
              </p>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-gray-700">
                  Date Format
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleDateModeChange(dateMode === "month" ? "day" : "month")
                  }
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  {dateMode === "month" ? "Month only" : "Month + day"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={deploymentDateId}
                className="text-sm font-bold text-gray-700"
              >
                Deployment Date
              </label>
              <DatePicker
                id={deploymentDateId}
                label=""
                labelClassName="text-gray-700"
                value={deploymentDate}
                onChange={setDeploymentDate}
                pickerMode={deploymentDateMode === "month" ? "month" : "day"}
                placeholder={
                  deploymentDateMode === "month" ? "yyyy/mm" : "yyyy/mm/dd"
                }
              />
              <p className="text-xs text-gray-500">
                {deploymentDateMode === "month"
                  ? "Select the month only when the internship starts"
                  : "Select the exact month and day when the internship starts"}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={endDateId}
                className="text-sm font-bold text-gray-700"
              >
                End Date
              </label>
              <DatePicker
                id={endDateId}
                label=""
                labelClassName="text-gray-700"
                value={endDate}
                onChange={setEndDate}
                pickerMode={endDateMode === "month" ? "month" : "day"}
                placeholder={endDateMode === "month" ? "yyyy/mm" : "yyyy/mm/dd"}
              />
              <p className="text-xs text-gray-500">
                {endDateMode === "month"
                  ? "Select the month only when the internship period ends"
                  : "Select the exact month and day when the internship period ends"}
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <footer className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-4 py-4 sm:flex-row sm:justify-end sm:px-8 sm:py-6">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm text-gray-700"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-6 py-2 text-sm text-white hover:bg-blue-800 disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </footer>
      </section>

      {isSaving && (
        <div className="fixed inset-0 z-60 flex items-center justify-center backdrop-blur-sm">
          <div className="flex aspect-square w-64 flex-col items-center justify-center gap-4 rounded-2xl bg-blue-50/95 p-7 shadow-2xl ring-1 ring-blue-100 sm:w-72">
            <div className="flex h-24 w-24 items-center justify-center">
              <DotLottieReact
                src="https://lottie.host/199225e8-1f26-4f62-950a-41cfed998703/4esdI4dLN5.lottie"
                loop
                autoplay
                style={{ height: "100%", width: "100%" }}
              />
            </div>

            <p className="text-xl font-bold tracking-wide text-slate-800">
              Saving
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeInterDetailsModal;
