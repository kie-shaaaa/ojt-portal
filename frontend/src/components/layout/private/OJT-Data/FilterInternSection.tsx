import { JSX, useId, useState, useRef, useMemo } from "react";
import { ChevronDown, Filter, X } from "lucide-react";

import { useOutsidePointerDown } from "@/hooks/useDismissableEvents";

interface FilterOptions {
  school: string;
  sortByDate: "Newest First" | "Oldest First";
  status?: string;
}

interface FilterInternsSectionProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  schoolOptions: string[];
}

export const FilterInternsSection = ({
  filters,
  onFilterChange,
  schoolOptions,
}: FilterInternsSectionProps): JSX.Element => {
  const sectionTitleId = useId();
  const schoolDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");

  useOutsidePointerDown(
    schoolDropdownRef,
    () => setIsSchoolDropdownOpen(false),
    isSchoolDropdownOpen,
  );

  useOutsidePointerDown(
    sortDropdownRef,
    () => setIsSortDropdownOpen(false),
    isSortDropdownOpen,
  );

  const sortDateOptions = ["Newest First", "Oldest First"] as const;

  const filteredSchoolOptions = useMemo(
    () =>
      schoolOptions
        .filter((option) => option !== "All Schools")
        .filter((option) =>
          option.toLowerCase().includes(schoolSearchQuery.toLowerCase()),
        ),
    [schoolOptions, schoolSearchQuery],
  );

  const hasActiveFilters = filters.school !== "All Schools" || filters.sortByDate !== "Newest First";

  const handleReset = () => {
    onFilterChange({
      school: "All Schools",
      sortByDate: "Newest First",
      status: undefined,
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
            <h3 className="text-lg font-bold text-slate-800">Filter Interns</h3>
            <p className="text-xs text-slate-500">
              {hasActiveFilters
                ? `${[filters.school !== "All Schools", filters.sortByDate !== "Newest First"].filter(Boolean).length} filter(s) active`
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
        {/* School Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            School
          </label>
          <div
            className="relative w-full"
            ref={schoolDropdownRef}
          >
            <input
              type="text"
              id="school"
              name="school"
              aria-label="School"
              value={
                isSchoolDropdownOpen
                  ? schoolSearchQuery
                  : filters.school === "All Schools"
                    ? ""
                    : filters.school
              }
              placeholder="All Schools"
              onChange={(e) => {
                const val = e.target.value;
                setSchoolSearchQuery(val);
                setIsSchoolDropdownOpen(true);
                if (val.trim() === "") {
                  onFilterChange({ ...filters, school: "All Schools" });
                }
              }}
              onFocus={() => {
                setIsSchoolDropdownOpen(true);
                setIsSortDropdownOpen(false);
                if (filters.school !== "All Schools") {
                  setSchoolSearchQuery(filters.school);
                } else {
                  setSchoolSearchQuery("");
                }
              }}
              autoComplete="off"
              className="relative flex w-full appearance-none items-center justify-center rounded-lg border border-solid border-slate-200 bg-white py-2.5 pl-3 pr-10 font-inter-regular text-sm font-normal leading-5 tracking-normal text-slate-600 outline-none transition-colors focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            />
            {isSchoolDropdownOpen && (
              <div className="absolute z-50 top-full mt-1 max-h-60 w-full overflow-auto rounded-lg border border-solid border-slate-200 bg-white py-1 shadow-lg outline-none">
                {filteredSchoolOptions.length > 0 ? (
                  filteredSchoolOptions.map((option) => {
                    const isSelected = filters.school === option;
                    return (
                      <div
                        key={option}
                        onClick={() => {
                          onFilterChange({ ...filters, school: option });
                          setIsSchoolDropdownOpen(false);
                          setSchoolSearchQuery("");
                        }}
                        className={`cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-slate-100 ${
                          isSelected
                            ? "bg-slate-50 font-semibold text-slate-700 hover:bg-slate-100"
                            : "text-slate-600"
                        }`}
                      >
                        {option}
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-500">
                    No schools found
                  </div>
                )}
              </div>
            )}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex h-full w-10.5 items-center justify-center">
              <ChevronDown
                size={18}
                className="text-slate-500"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Sort by Date Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Sort by Date
          </label>
          <div
            className="relative w-full"
            ref={sortDropdownRef}
          >
            <input
              type="text"
              id="sortByDate"
              name="sortByDate"
              aria-label="Sort by Date"
              value={filters.sortByDate}
              placeholder="Newest First"
              readOnly
              onFocus={() => {
                setIsSortDropdownOpen(true);
                setIsSchoolDropdownOpen(false);
              }}
              onClick={() => {
                setIsSortDropdownOpen(true);
                setIsSchoolDropdownOpen(false);
              }}
              className="relative flex w-full appearance-none cursor-pointer items-center justify-center rounded-lg border border-solid border-slate-200 bg-white py-2.5 pl-3 pr-10 font-inter-regular text-sm font-normal leading-5 tracking-normal text-slate-600 outline-none transition-colors focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            />
            {isSortDropdownOpen && (
              <div className="absolute z-50 top-full mt-1 max-h-60 w-full overflow-auto rounded-lg border border-solid border-slate-200 bg-white py-1 shadow-lg outline-none">
                {sortDateOptions.map((option) => {
                  const isSelected = filters.sortByDate === option;
                  return (
                    <div
                      key={option}
                      onClick={() => {
                        onFilterChange({ ...filters, sortByDate: option });
                        setIsSortDropdownOpen(false);
                      }}
                      className={`cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-slate-100 ${
                        isSelected
                          ? "bg-slate-50 text-slate-700 hover:bg-slate-100"
                          : "text-slate-600"
                      }`}
                    >
                      {option}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex h-full w-10.5 items-center justify-center">
              <ChevronDown
                size={18}
                className="text-slate-500"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-3">
          {filters.school !== "All Schools" && (
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5">
              <span className="text-xs font-semibold text-blue-700">
                School: {filters.school}
              </span>
              <button
                onClick={() => onFilterChange({ ...filters, school: "All Schools" })}
                className="text-blue-700 transition hover:text-blue-900"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {filters.sortByDate !== "Newest First" && (
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5">
              <span className="text-xs font-semibold text-blue-700">
                Sort: {filters.sortByDate}
              </span>
              <button
                onClick={() => onFilterChange({ ...filters, sortByDate: "Newest First" })}
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
