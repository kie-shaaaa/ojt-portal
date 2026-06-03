"use client;"
import { JSX, useId, useState, useRef } from "react";
import { ChevronDown, Filter, X } from "lucide-react";

import { useOutsidePointerDown } from "@/hooks/useDismissableEvents";

interface FilterValues {
  accountType: string;
  sortByDate: string;
}

interface AccountsFilterSectionProps {
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
}

export const AccountsFilterSection = ({ 
  filters, 
  onFilterChange 
}: AccountsFilterSectionProps): JSX.Element => {
  const sectionTitleId = useId();
  const accountTypeDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const [isAccountTypeOpen, setIsAccountTypeOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const accountTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "admin", label: "Admin" },
    { value: "employee", label: "Employee" },
  ];

  const sortDateOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
  ];

  useOutsidePointerDown(
    accountTypeDropdownRef,
    () => setIsAccountTypeOpen(false),
    isAccountTypeOpen,
  );

  useOutsidePointerDown(
    sortDropdownRef,
    () => setIsSortOpen(false),
    isSortOpen,
  );

  const hasActiveFilters = filters.accountType !== "all" || filters.sortByDate !== "newest";

  const handleReset = () => {
    onFilterChange({
      accountType: "all",
      sortByDate: "newest",
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
            <h3 className="text-lg font-bold text-slate-800">Filter Accounts</h3>
            <p className="text-xs text-slate-500">
              {hasActiveFilters
                ? `${[filters.accountType !== "all", filters.sortByDate !== "newest"].filter(Boolean).length} filter(s) active`
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
        {/* Account Type Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Account Type
          </label>
          <div
            className="relative w-full"
            ref={accountTypeDropdownRef}
          >
            <input
              type="text"
              id="account-type"
              name="account-type"
              aria-label="Account Type"
              value={
                accountTypeOptions.find((option) => option.value === filters.accountType)
                  ?.label ?? "All Types"
              }
              placeholder="All Types"
              readOnly
              onClick={() => {
                setIsAccountTypeOpen(true);
                setIsSortOpen(false);
              }}
              onFocus={() => {
                setIsAccountTypeOpen(true);
                setIsSortOpen(false);
              }}
              className="relative flex w-full appearance-none cursor-pointer items-center justify-center rounded-lg border border-solid border-slate-200 bg-white py-2.5 pl-3 pr-10 font-inter-regular text-sm font-normal leading-5 tracking-[0] text-slate-600 outline-none transition-colors focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            />
            {isAccountTypeOpen && (
              <div className="absolute z-50 top-full mt-1 max-h-60 w-full overflow-auto rounded-lg border border-solid border-slate-200 bg-white py-1 shadow-lg outline-none">
                {accountTypeOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      onFilterChange({ ...filters, accountType: option.value });
                      setIsAccountTypeOpen(false);
                    }}
                    className={`cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-slate-100 ${
                      filters.accountType === option.value
                        ? "bg-slate-50 text-slate-700 hover:bg-slate-100"
                        : "text-slate-600"
                    }`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex h-full w-[42px] items-center justify-center">
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
              id="sort-by-date"
              name="sort-by-date"
              aria-label="Sort by Date"
              value={
                sortDateOptions.find((option) => option.value === filters.sortByDate)
                  ?.label ?? "Newest First"
              }
              placeholder="Newest First"
              readOnly
              onClick={() => {
                setIsSortOpen(true);
                setIsAccountTypeOpen(false);
              }}
              onFocus={() => {
                setIsSortOpen(true);
                setIsAccountTypeOpen(false);
              }}
              className="relative flex w-full appearance-none cursor-pointer items-center justify-center rounded-lg border border-solid border-slate-200 bg-white py-2.5 pl-3 pr-10 font-inter-regular text-sm font-normal leading-5 tracking-[0] text-slate-600 outline-none transition-colors focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            />
            {isSortOpen && (
              <div className="absolute z-50 top-full mt-1 max-h-60 w-full overflow-auto rounded-lg border border-solid border-slate-200 bg-white py-1 shadow-lg outline-none">
                {sortDateOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      onFilterChange({ ...filters, sortByDate: option.value });
                      setIsSortOpen(false);
                    }}
                    className={`cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-slate-100 ${
                      filters.sortByDate === option.value
                        ? "bg-slate-50 text-slate-700 hover:bg-slate-100"
                        : "text-slate-600"
                    }`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex h-full w-[42px] items-center justify-center">
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
          {filters.accountType !== "all" && (
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5">
              <span className="text-xs font-semibold text-blue-700">
                Type: {accountTypeOptions.find((o) => o.value === filters.accountType)?.label}
              </span>
              <button
                onClick={() => onFilterChange({ ...filters, accountType: "all" })}
                className="text-blue-700 transition hover:text-blue-900"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {filters.sortByDate !== "newest" && (
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5">
              <span className="text-xs font-semibold text-blue-700">
                Sort: {sortDateOptions.find((o) => o.value === filters.sortByDate)?.label}
              </span>
              <button
                onClick={() => onFilterChange({ ...filters, sortByDate: "newest" })}
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