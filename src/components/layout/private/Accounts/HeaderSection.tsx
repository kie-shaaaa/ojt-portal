"use client";
"use client";

import { ChangeEvent, JSX, useId, useState } from "react";
import { Search } from "lucide-react";

export const AccountsHeaderSection = (): JSX.Element => {
  const searchInputId = useId();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <header className="flex w-full items-center justify-between gap-4 max-md:flex-col max-md:items-start">
      <div>
        <h1 className="text-2xl font-bold text-[#003366]">Manage Account</h1>

      </div>

      <div className="relative w-72 max-md:w-full">
        <label htmlFor={searchInputId} className="sr-only">
          Search by username or email
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
          placeholder="Search by username or email..."
          className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-slate-300"
        />
      </div>
    </header>
  );
};