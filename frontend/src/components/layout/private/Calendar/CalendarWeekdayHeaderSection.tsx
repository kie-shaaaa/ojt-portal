import { JSX } from "react";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const CalendarWeekdayHeaderSection = (): JSX.Element => {
  return (
    <div
      className="w-full grid grid-cols-7 border-b border-gray-100 pb-4"
      role="row"
      aria-label="Days of the week"
    >
      {weekdays.map((day) => (
        <div
          key={day}
          role="columnheader"
          aria-label={day}
          className="flex items-center justify-center py-2"
        >
          <span className="text-base font-medium text-slate-500">{day}</span>
        </div>
      ))}
    </div>
  );
};
