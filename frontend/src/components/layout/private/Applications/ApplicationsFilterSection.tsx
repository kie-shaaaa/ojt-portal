"use client";

import { JSX, useId, useState, useRef } from "react";
import { ChevronDown, Filter, RotateCcw } from "lucide-react";

import { useOutsidePointerDown } from "@/hooks/useDismissableEvents";

type FilterOption = {
  value: string;
  label: string;
};

type FilterField = {
  key: "school" | "timePeriod";
  label: string;
  defaultValue: string;
  options: FilterOption[];
};

type Props = {
  filters: {
    school: string;
    timePeriod: string;
  };

  setFilters: React.Dispatch<
    React.SetStateAction<{
      school: string;
      timePeriod: string;
    }>
  >;

  schoolOptions: FilterOption[];
};

export const ApplicationsFilterSection = ({
  filters,
  setFilters,
  schoolOptions,
}: Props): JSX.Element => {
  const sectionTitleId = useId();
  const schoolDropdownRef = useRef<HTMLDivElement>(null);
  const timePeriodDropdownRef = useRef<HTMLDivElement>(null);
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
  const [isTimePeriodDropdownOpen, setIsTimePeriodDropdownOpen] = useState(false);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");

  useOutsidePointerDown(
    schoolDropdownRef,
    () => setIsSchoolDropdownOpen(false),
    isSchoolDropdownOpen,
  );

  useOutsidePointerDown(
    timePeriodDropdownRef,
    () => setIsTimePeriodDropdownOpen(false),
    isTimePeriodDropdownOpen,
  );

  const filteredSchoolOptions = schoolOptions
    .filter((option) => option.value !== "all-schools")
    .filter((option) =>
      option.label.toLowerCase().includes(schoolSearchQuery.toLowerCase()),
    );

  const filterFields: FilterField[] = [
    {
      key: "school",
      label: "School",
      defaultValue: "all-schools",
      options: schoolOptions,
    },

    {
      key: "timePeriod",
      label: "Time Period",
      defaultValue: "all-time",
      options: [
        { value: "all-time", label: "All Time" },
        { value: "last-30", label: "Last 30 Days" },
        { value: "last-90", label: "Last 90 Days" },
        { value: "this-year", label: "This Year" },
      ],
    },
  ];

  const hasActiveFilters =
    filters.school !== "all-schools" || filters.timePeriod !== "all-time";

  const handleFilterChange = (key: "school" | "timePeriod", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setFilters({
      school: "all-schools",
      timePeriod: "all-time",
    });
  };

  return (
    <section
      aria-labelledby={sectionTitleId}
      className="relative w-full rounded-2xl border border-slate-200/60 bg-linear-to-br from-slate-50 to-slate-100/50 px-8 py-8 shadow-sm"
    >
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-100/30 opacity-40 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-slate-200/20 opacity-30 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-slate-200/50 bg-white/50 p-2 backdrop-blur-sm">
              <Filter size={20} className="text-slate-700" />
            </div>

            <div className="flex flex-col gap-1">
              <h2
                id={sectionTitleId}
                className="text-xl font-semibold leading-7 text-slate-900"
              >
                Filter Applications
              </h2>

            </div>
          </div>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="group flex items-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm active:scale-95"
              aria-label="Reset filters"
            >
              <RotateCcw
                size={16}
                className="transition-transform group-hover:rotate-180"
              />
              Reset
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="grid w-full grid-cols-2 gap-6 max-[640px]:grid-cols-1">
          {filterFields.map((field) => {
            const isActive = filters[field.key] !== field.defaultValue;

            return (
              <div key={field.key} className="group/field flex flex-col gap-3">
                <label
                  htmlFor={field.key}
                  className="text-sm font-semibold leading-5 text-slate-700 transition-colors group-focus-within/field:text-slate-900"
                >
                  {field.label}

                  {isActive && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-blue-100/80 px-2 py-0.5 text-xs font-medium text-blue-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      Active
                    </span>
                  )}
                </label>

                <div
                  className="relative w-full"
                  ref={
                    field.key === "school"
                      ? schoolDropdownRef
                      : field.key === "timePeriod"
                      ? timePeriodDropdownRef
                      : undefined
                  }
                >
                  <>
                    <input
                      type="text"
                      id={field.key}
                      name={field.key}
                      value={
                        field.key === "school"
                          ? isSchoolDropdownOpen
                            ? schoolSearchQuery
                            : filters.school === "all-schools"
                            ? ""
                            : field.options.find(
                                (o) => o.value === filters.school,
                              )?.label || ""
                          : field.options.find(
                              (o) => o.value === filters.timePeriod,
                            )?.label || ""
                      }
                      placeholder={
                        field.key === "school" ? "All Schools" : "All Time"
                      }
                      readOnly={field.key === "timePeriod"}
                      onChange={(e) => {
                        if (field.key !== "school") {
                          return;
                        }

                        const val = e.target.value;
                        setSchoolSearchQuery(val);
                        setIsSchoolDropdownOpen(true);
                        setIsTimePeriodDropdownOpen(false);
                        if (val.trim() === "") {
                          handleFilterChange("school", "all-schools");
                        }
                      }}
                      onFocus={() => {
                        if (field.key === "school") {
                          setIsSchoolDropdownOpen(true);
                          setIsTimePeriodDropdownOpen(false);
                          if (filters.school !== "all-schools") {
                            setSchoolSearchQuery(
                              field.options.find(
                                (o) => o.value === filters.school,
                              )?.label || "",
                            );
                          } else {
                            setSchoolSearchQuery("");
                          }
                        } else {
                          setIsTimePeriodDropdownOpen(true);
                          setIsSchoolDropdownOpen(false);
                        }
                      }}
                      onClick={() => {
                        if (field.key === "timePeriod") {
                          setIsTimePeriodDropdownOpen(true);
                          setIsSchoolDropdownOpen(false);
                        }
                      }}
                      autoComplete="off"
                      className="h-11 w-full cursor-text appearance-none rounded-xl border-2 border-slate-200 bg-white px-4 pr-11 text-sm font-medium text-slate-900 placeholder:text-slate-900 outline-none transition-all hover:border-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 group-hover/field:border-slate-300"
                    />
                    {(isSchoolDropdownOpen && field.key === "school") ||
                    (isTimePeriodDropdownOpen && field.key === "timePeriod") ? (
                      <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border-2 border-slate-200 bg-white py-1 shadow-lg outline-none">
                        {(field.key === "school"
                          ? filteredSchoolOptions
                          : field.options
                        ).length > 0 ? (
                          (field.key === "school"
                            ? filteredSchoolOptions
                            : field.options
                          ).map((option) => {
                            const isSelected =
                              filters[field.key] === option.value;
                            return (
                              <div
                                key={option.value}
                                onClick={() => {
                                  handleFilterChange(field.key, option.value);
                                  if (field.key === "school") {
                                    setIsSchoolDropdownOpen(false);
                                    setSchoolSearchQuery("");
                                  } else {
                                    setIsTimePeriodDropdownOpen(false);
                                  }
                                }}
                                className={`cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-slate-100 ${
                                  isSelected
                                    ? "bg-blue-50 font-semibold text-blue-700 hover:bg-blue-100"
                                    : "text-slate-900"
                                }`}
                              >
                                {option.label}
                              </div>
                            );
                          })
                        ) : (
                          <div className="px-4 py-3 text-sm text-slate-500">
                            No schools found
                          </div>
                        )}
                      </div>
                    ) : null}
                  </>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 transition-all group-hover/field:text-slate-600"
                    aria-hidden="true"
                  />

                  {/* Animated underline */}
                  <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-linear-to-r from-blue-400 to-blue-500 transition-transform duration-300 group-focus-within/field:scale-x-100" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter summary */}
        {hasActiveFilters && (
          <div className="border-t border-slate-200/50 pt-4">
            <p className="text-xs text-slate-600">
              <span className="font-semibold text-slate-700">
                Filters applied:
              </span>{" "}
              {filters.school !== "all-schools" &&
                filterFields[0].options.find((o) => o.value === filters.school)
                  ?.label}{" "}
              {filters.school !== "all-schools" &&
                filters.timePeriod !== "all-time" &&
                "•"}{" "}
              {filters.timePeriod !== "all-time" &&
                filterFields[1].options.find(
                  (o) => o.value === filters.timePeriod,
                )?.label}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
