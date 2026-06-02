"use client";

import { JSX } from "react";

export const OjtDataHeaderSection = (): JSX.Element => {
  return (
    <header className="flex w-full items-center justify-between gap-4 max-md:flex-col max-md:items-start">
      <div>
        <h1 className="text-2xl font-bold text-[#003366]">
          OJT Data
        </h1>
      </div>
    </header>
  );
};