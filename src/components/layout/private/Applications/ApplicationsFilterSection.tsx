"use client";

import { JSX, useId, useState } from "react";
import { ChevronDown } from "lucide-react";

type FilterOption = {
  value: string;
  label: string;
};

type FilterField = {
  key: "school" | "campus" | "timePeriod";
  label: string;
  defaultValue: string;
  options: FilterOption[];
};

const filterFields: FilterField[] = [
  {
    key: "school",
    label: "School",
    defaultValue: "all-schools",
    options: [{ value: "all-schools", label: "All Schools" }],
  },
  {
    key: "campus",
    label: "Campus",
    defaultValue: "all-campuses",
    options: [{ value: "all-campuses", label: "All Campuses" }],
  },
  {
    key: "timePeriod",
    label: "Time Period",
    defaultValue: "all-time",
    options: [{ value: "all-time", label: "All Time" }],
  },
];

export const ApplicationsFilterSection = (): JSX.Element => {
  const sectionTitleId = useId();

  const [filters, setFilters] = useState({
    school: filterFields[0].defaultValue,
    campus: filterFields[1].defaultValue,
    timePeriod: filterFields[2].defaultValue,
  });

  return (
    <section
      aria-labelledby={sectionTitleId}
      className="relative flex w-full flex-col gap-4 rounded-xl bg-white px-6 pt-8 pb-6 shadow-[0px_1px_2px_#0000000d]"
    >
      <div className="flex w-full flex-col">
        <h2
          id={sectionTitleId}
          className="text-lg font-semibold leading-7 text-slate-700"
        >
          Filter Applications
        </h2>
      </div>

      <div className="grid w-full grid-cols-3 gap-6 max-[767px]:grid-cols-1">
        {filterFields.map((field) => (
          <div
            key={field.key}
            className="flex w-full flex-col gap-2"
          >
            <label
              htmlFor={field.key}
              className="text-sm font-medium leading-5 text-slate-600"
            >
              {field.label}
            </label>

            <div className="relative w-full">
              <select
                id={field.key}
                name={field.key}
                value={filters[field.key]}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    [field.key]: event.target.value,
                  }))
                }
                className="h-[42px] w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 pr-10 text-sm text-black outline-none transition-colors focus:border-slate-300"
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-700"
                aria-hidden="true"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};