"use client";

import { JSX } from "react";

export const CalendarHeaderSection = (): JSX.Element => {
  return (
    <header className="flex w-full items-center justify-between gap-4 max-[767px]:flex-col max-[767px]:items-start">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold leading-8 text-[#003366]">
          Calendar
        </h1>
        <h3>
          Appointments scheduled within the months.
        </h3>
      </div>

      <div className="w-72 max-[767px]:w-full">
        <div className="h-[42px] invisible" />
      </div>
    </header>
  );
};