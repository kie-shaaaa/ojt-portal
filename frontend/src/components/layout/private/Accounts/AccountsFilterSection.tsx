"use client;"
import { JSX, useId } from "react";
import { ChevronDown } from "lucide-react";

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
          <div className="relative flex w-full items-center self-stretch">
            <select
              id="account-type"
              name="account-type"
              aria-label="Account Type"
              value={filters.accountType}
              onChange={(event) =>
                onFilterChange({
                  ...filters,
                  accountType: event.target.value,
                })
              }
              className="relative flex w-full appearance-none items-center justify-center rounded-lg border border-solid border-slate-200 bg-white py-2.5 pl-3 pr-10 font-inter-regular text-sm font-normal leading-5 tracking-[0] text-slate-600 outline-none transition-colors focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            >
              <option value="all">All Types</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
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
          <div className="relative flex w-full items-center self-stretch">
            <select
              id="sort-by-date"
              name="sort-by-date"
              aria-label="Sort by Date"
              value={filters.sortByDate}
              onChange={(event) =>
                onFilterChange({
                  ...filters,
                  sortByDate: event.target.value,
                })
              }
              className="relative flex w-full appearance-none items-center justify-center rounded-lg border border-solid border-slate-200 bg-white py-2.5 pl-3 pr-10 font-inter-regular text-sm font-normal leading-5 tracking-[0] text-slate-600 outline-none transition-colors focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
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