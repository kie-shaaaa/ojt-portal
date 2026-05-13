"use client";

import { ChangeEvent, JSX, useId } from "react";
import { Search } from "lucide-react";

interface OjtDataHeaderSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const OjtDataHeaderSection = ({
  searchTerm,
  onSearchChange,
}: OjtDataHeaderSectionProps): JSX.Element => {
  const searchInputId = useId();

  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onSearchChange(event.target.value);
  };

  return (
    <header className="flex w-full items-center justify-between gap-4 max-md:flex-col max-md:items-start">
      <div>
        <h1 className="text-2xl font-bold text-[#003366]">
          OJT Data
        </h1>
        <h3>
          Manage and edit all interns.
        </h3>
      </div>

      <div className="relative w-72 max-md:w-full">
        <label htmlFor={searchInputId} className="sr-only">
          Search interns
        </label>

        <Search
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          id={searchInputId}
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by OJT ID or name..."
          className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-slate-300"
        />
      </div>
    </header>
  );
};