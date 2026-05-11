"use client";

import { ChangeEvent, JSX, useId, useState } from "react";
import { Search } from "lucide-react";

export const ApplicationsHeaderSection = (): JSX.Element => {
  const searchInputId = useId();
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <header className="flex w-full items-center justify-between gap-4 max-[767px]:flex-col max-[767px]:items-start">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold leading-8 text-[#003366]">
          Manage Applications
        </h1>
      </div>

      <div className="relative w-72 max-[767px]:w-full">
        <label htmlFor={searchInputId} className="sr-only">
          Search applications by ID or name
        </label>

        <Search
          size={18}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
          aria-hidden="true"
        />

        <input
          id={searchInputId}
          type="search"
          placeholder="Search by ID, name..."
          value={searchValue}
          onChange={handleSearchChange}
          className="h-[42px] w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-500 focus:border-slate-300"
        />
      </div>
    </header>
  );
};