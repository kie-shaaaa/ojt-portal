"use client";

import { JSX } from "react";

export const ApplicationsHeaderSection = (): JSX.Element => {
  return (
    <header className="flex w-full flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold leading-8 text-[#003366]">
          Dashboard Analytics
        </h1>
      </div>

      <div className="w-full sm:w-72 hidden sm:block">
        <div className="h-[42px] invisible" />
      </div>
    </header>
  );
};