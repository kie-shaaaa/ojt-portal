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

    </header>
  );
};