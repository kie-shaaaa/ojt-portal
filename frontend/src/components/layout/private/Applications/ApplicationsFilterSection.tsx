"use client";

import { JSX, useId, useState, useRef } from "react";
import { ChevronDown, Filter, X } from "lucide-react";

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
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <Filter size={20} className="text-blue-600" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800">Filter Applications</h3>
            <p className="text-xs text-slate-500">
              {hasActiveFilters
                ? `${[filters.school !== "all-schools", filters.timePeriod !== "all-time"].filter(Boolean).length} filter(s) active`
                : "No filters applied"}
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            <X size={16} />
            Clear All
          </button>
        )}
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        {filterFields.map((field) => {
          return (
            <div key={field.key} className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {field.label}
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
                      className="relative flex w-full appearance-none items-center justify-center rounded-lg border border-solid border-slate-200 bg-white py-2.5 pl-3 pr-10 font-inter-regular text-sm font-normal leading-5 tracking-normal text-slate-600 outline-none transition-colors focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                    />
                    {(isSchoolDropdownOpen && field.key === "school") ||
                    (isTimePeriodDropdownOpen && field.key === "timePeriod") ? (
                      <div className="absolute z-50 top-full mt-1 max-h-60 w-full overflow-auto rounded-lg border border-solid border-slate-200 bg-white py-1 shadow-lg outline-none">
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
                                    ? "bg-slate-50 font-semibold text-slate-700 hover:bg-slate-100"
                                    : "text-slate-600"
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

                  <div className="pointer-events-none absolute inset-y-0 right-0 flex h-full w-10.5 items-center justify-center">
                    <ChevronDown
                      size={18}
                      className="text-slate-500"
                      aria-hidden="true"
                    />
                  </div>
                </div>
            </div>
          );
        })}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-3">
          {filters.school !== "all-schools" && (
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5">
              <span className="text-xs font-semibold text-blue-700">
                School: {filterFields[0].options.find((o) => o.value === filters.school)?.label}
              </span>
              <button
                onClick={() => handleFilterChange("school", "all-schools")}
                className="text-blue-700 transition hover:text-blue-900"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {filters.timePeriod !== "all-time" && (
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5">
              <span className="text-xs font-semibold text-blue-700">
                Time: {filterFields[1].options.find((o) => o.value === filters.timePeriod)?.label}
              </span>
              <button
                onClick={() => handleFilterChange("timePeriod", "all-time")}
                className="text-blue-700 transition hover:text-blue-900"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
