"use client;"
import { JSX, useId, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

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

  return (
    <section
      aria-labelledby={sectionTitleId}
      className="flex relative self-stretch w-full flex-[0_0_auto] flex-col items-start gap-6 rounded-lg border border-solid border-slate-200 bg-white p-6 shadow-[0px_1px_2px_#0000000d]"
    >
      <div className="relative flex w-full flex-[0_0_auto] flex-col items-start self-stretch">
        <h2
          id={sectionTitleId}
          className="relative mt-[-1.00px] flex items-center self-stretch font-inter-bold text-lg font-bold leading-7 tracking-[0] text-slate-700"
        >
          Filter Accounts
        </h2>
      </div>
      <div className="grid h-fit w-full grid-cols-1 gap-8 sm:grid-cols-2 sm:grid-rows-[70px]">
        {/* Account Type Filter */}
        <div className="relative flex h-fit w-full flex-col items-start gap-2">
          <div className="relative flex w-full flex-[0_0_auto] flex-col items-start self-stretch">
            <label
              htmlFor="account-type"
              className="relative mt-[-1.00px] flex items-center self-stretch font-inter-bold text-sm font-bold leading-5 tracking-[0] text-slate-600"
            >
              Account Type
            </label>
          </div>
          <div
            className="relative flex w-full items-center self-stretch"
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
        <div className="relative flex h-fit w-full flex-col items-start gap-2">
          <div className="relative flex w-full flex-[0_0_auto] flex-col items-start self-stretch">
            <label
              htmlFor="sort-by-date"
              className="relative mt-[-1.00px] flex items-center self-stretch font-inter-bold text-sm font-bold leading-5 tracking-[0] text-slate-600"
            >
              Sort by Date
            </label>
          </div>
          <div
            className="relative flex w-full items-center self-stretch"
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
    </section>
  );
};