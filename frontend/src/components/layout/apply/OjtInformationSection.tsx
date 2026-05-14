import { Info, AlertCircle, ChevronDown } from "lucide-react";
import {
  JSX,
  ChangeEvent,
  KeyboardEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DatePicker from "@/components/layout/DatePicker";
import { apiCall } from "@/lib/api";

interface OjtInformationData {
  school: string;
  course: string;
  hours: string;
  deploymentDate: string;
}

interface OjtInformationSectionProps {
  data: OjtInformationData;
  onDataChange: Dispatch<SetStateAction<OjtInformationData>>;
  errors: Record<string, string>;
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
  error?: string;
  helperText: string;
  onChange: (value: string) => void;
}

const SearchableField = ({
  id,
  label,
  value,
  options,
  error,
  helperText,
  onChange,
}: SearchableFieldProps): JSX.Element => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const mergedOptions = useMemo(() => Array.from(new Set(options)), [options]);
  const query = value;

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return mergedOptions.slice(0, 6);
    }

    return mergedOptions
      .filter((option) => option.toLowerCase().includes(normalizedQuery))
      .slice(0, 6);
  }, [mergedOptions, query]);

  const exactMatch = mergedOptions.some(
    (option) => option.toLowerCase() === query.trim().toLowerCase(),
  );
  const hasUnlistedValue = query.trim().length > 0 && !exactMatch;

  const normalizeWhitespace = (value: string) =>
    value.replace(/\s+/g, " ").trim();

  const normalizeForCompare = (value: string) =>
    normalizeWhitespace(value).toLowerCase();

  const resolveCanonicalValue = (rawValue: string) => {
    const normalizedValue = normalizeWhitespace(rawValue);
    if (!normalizedValue) return "";

    const matchedOption = mergedOptions.find(
      (option) =>
        normalizeForCompare(option) === normalizeForCompare(normalizedValue),
    );

    return matchedOption ?? normalizedValue;
  };

  const commitNormalizedValue = (rawValue: string) => {
    const resolvedValue = resolveCanonicalValue(rawValue);
    onChange(resolvedValue);
  };

  const handleSelect = (nextValue: string) => {
    commitNormalizedValue(nextValue);
    setIsOpen(false);
  };

  const handleSelectOthers = () => {
    // Keep the user-typed value in the field; this confirms it is not in the list.
    commitNormalizedValue(query);
    setIsOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (exactMatch) {
        handleSelect(query.trim());
      } else {
        commitNormalizedValue(query);
        setIsOpen(false);
      }
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative flex flex-col items-start gap-2 self-stretch w-full"
    >
      <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
        <label
          htmlFor={id}
          className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-transparent text-sm tracking-[0] leading-5"
        >
          <span className="text-[#0047ab]">{label} </span>
          <span className="text-red-500">*</span>
        </label>
      </div>

      <div
        className={`relative self-stretch w-full rounded-lg border shadow-[0px_1px_2px_#0000000d] bg-white ${
          error ? "border-red-500 border-2" : "border-gray-300 border"
        }`}
      >
        <input
          id={id}
          name={id}
          type="text"
          role="combobox"
          aria-required="true"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          placeholder={label}
          value={query}
          onChange={(event) => {
            const nextValue = event.target.value;
            onChange(nextValue);
            setIsOpen(true);
          }}
          onBlur={() => {
            // Keep typed value intact; only close suggestions on blur.
            setIsOpen(false);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-expanded={isOpen}
          aria-controls={`${id}-listbox`}
          autoComplete="off"
          className="relative flex items-center w-full border-0 bg-transparent px-4 py-3 pr-10 [font-family:'Inter-Regular',Helvetica] font-normal text-gray-700 text-base tracking-[0] leading-6 outline-none placeholder:text-gray-400"
        />

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400"
          aria-label={`Toggle ${label} suggestions`}
        >
          <ChevronDown size={18} />
        </button>
      </div>

      {isOpen ? (
        <div
          id={`${id}-listbox`}
          role="listbox"
          className="absolute top-[calc(100%+4px)] left-0 z-20 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white p-1 shadow-[0px_12px_24px_-8px_#00000026]"
        >
          {filteredOptions.length > 0
            ? filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={option === value}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    handleSelect(option);
                  }}
                  className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-900"
                >
                  {option}
                </button>
              ))
            : null}

          {hasUnlistedValue ? (
            <button
              type="button"
              role="option"
              aria-selected={false}
              onMouseDown={(event) => {
                event.preventDefault();
                handleSelectOthers();
              }}
              className="mt-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-amber-700 transition-colors hover:bg-amber-50"
            >
              <span>Others</span>
              <span className="text-xs text-amber-600">not on list</span>
            </button>
          ) : null}
        </div>
      ) : null}

      <p className="text-xs text-gray-400">{helperText}</p>

      {error ? (
        <div
          id={`${id}-error`}
          className="flex items-center gap-1 text-red-500 text-xs"
        >
          <AlertCircle size={14} />
          {error}
        </div>
      ) : null}
    </div>
  );
};

const textFields = [
  {
    id: "hours",
    label: "Hours to Render",
  },
  {
    id: "deploymentDate",
    label: "Preferred Deployment Date",
  },
];

export const OjtInformationSection = ({
  data,
  onDataChange,
  errors,
}: OjtInformationSectionProps): JSX.Element => {
  const [schoolOptions, setSchoolOptions] = useState(defaultSchoolOptions);
  const [courseOptions, setCourseOptions] = useState(defaultCourseOptions);

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
          .map((school) => {
            if (typeof school === "string") {
              return school;
            }

            if (school && typeof school === "object") {
              const payload = school as {
                name?: string;
                school_name?: string;
              };

              return payload.name || payload.school_name || "";
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
        console.error("Error fetching schools:", error);
        setSchoolOptions(defaultSchoolOptions);
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
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
          .map((course) => {
            if (typeof course === "string") {
              return course;
            }

            if (course && typeof course === "object") {
              const payload = course as {
                name?: string;
                course?: string;
                course_name?: string;
              };

              return (
                payload.name || payload.course || payload.course_name || ""
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
        console.error("Error fetching courses:", error);
        setCourseOptions(defaultCourseOptions);
      }
    };

    fetchCourses();
  }, []);

  const handleSelectChange =
    (field: keyof OjtInformationData) => (value: string) => {
      onDataChange((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleTextChange =
    (field: keyof OjtInformationData) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;
      // Restrict hours field to numbers only
      if (field === "hours") {
        value = value.replace(/[^0-9]/g, "");
      }
      onDataChange((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  return (
    <section
      aria-labelledby="ojt-information-heading"
      className="flex flex-col items-start gap-6 pt-10 pb-14 px-6 md:px-12 relative self-stretch w-full flex-[0_0_auto]"
    >
      <div className="flex items-center gap-2 pt-0 pb-2 px-0 relative self-stretch w-full flex-[0_0_auto]">
        <div
          className="relative w-6 h-6 shrink-0 text-[#0047ab]"
          aria-hidden="true"
        >
          <Info className="absolute inset-0 w-full h-full" />
        </div>
        <div className="items-start inline-flex flex-col relative flex-[0_0_auto]">
          <h2
            id="ojt-information-heading"
            className="mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#0047ab] text-lg tracking-[0.90px] leading-7 relative flex items-center w-fit whitespace-nowrap"
          >
            OJT INFORMATION
          </h2>
        </div>
      </div>
      <div className="relative self-stretch w-full h-px border-t [border-top-style:solid] border" />
      <div className="flex flex-col items-start gap-6 relative self-stretch w-full flex-[0_0_auto]">
        <SearchableField
          id="school"
          label="Name of School"
          value={data.school}
          options={schoolOptions}
          error={errors.school}
          helperText="Select your school from the list. If it is not listed, choose Others and type your school."
          onChange={handleSelectChange("school")}
        />

        <SearchableField
          id="course"
          label="Course / Program"
          value={data.course}
          options={courseOptions}
          error={errors.course}
          helperText="Select your course from the list. If it is not listed, choose Others and type your course/program."
          onChange={handleSelectChange("course")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-[78px] h-fit gap-6 self-stretch w-full">
          {textFields.map((field, index) => (
            <div
              key={field.id}
              className="relative w-full h-fit flex flex-col items-start gap-2"
            >
              {field.id === "deploymentDate" ? (
                <DatePicker
                  id={field.id}
                  label={field.label}
                  value={data.deploymentDate}
                  onChange={(value: string) =>
                    onDataChange((prev) => ({ ...prev, deploymentDate: value }))
                  }
                  error={errors[field.id]}
                  required
                  placeholder="dd/mm/yyyy"
                />
              ) : (
                <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                    <label
                      htmlFor={field.id}
                      className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-transparent text-sm tracking-[0] leading-5"
                    >
                      <span className="text-[#0047ab]">{field.label} </span>
                      <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div
                    className={`flex items-start justify-center px-4 py-3 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg overflow-hidden border shadow-[0px_1px_2px_#0000000d] ${
                      errors[field.id]
                        ? "border-red-500 border-2"
                        : "border-gray-300 border"
                    }`}
                  >
                    <input
                      id={field.id}
                      name={field.id}
                      type="text"
                      aria-required="true"
                      placeholder={field.label}
                      value={data[field.id as keyof OjtInformationData] || ""}
                      onChange={handleTextChange(
                        field.id as keyof OjtInformationData,
                      )}
                      aria-invalid={!!errors[field.id]}
                      aria-describedby={
                        errors[field.id] ? `${field.id}-error` : undefined
                      }
                      className="relative flex items-center w-full border-0 bg-transparent [font-family:'Inter-Regular',Helvetica] font-normal text-gray-700 text-base tracking-[0] leading-6 outline-none placeholder:text-gray-400"
                    />
                  </div>
                  {errors[field.id] && (
                    <div
                      id={`${field.id}-error`}
                      className="flex items-center gap-1 text-red-500 text-xs"
                    >
                      <AlertCircle size={14} />
                      {errors[field.id]}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OjtInformationSection;
