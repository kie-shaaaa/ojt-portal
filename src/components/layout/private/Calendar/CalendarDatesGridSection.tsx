import { MoreHorizontal } from "lucide-react";
import { JSX, useMemo } from "react";

type EventItem = {
  title: string;
  tag?: string;
};

type Props = {
  year: number;
  month: number; // 0-based month
  events?: Record<number, EventItem[]>;
};

type CalendarCell = {
  day: number;
  muted?: boolean;
  selected?: boolean;
  hasEvent?: boolean;
  date: Date;
  inCurrentMonth: boolean;
  disabled?: boolean;
};

export const CalendarDatesGridSection = ({
  year,
  month,
  events = {},
}: Props): JSX.Element => {
  const cells = useMemo(() => {
    const firstOfMonth = new Date(year, month, 1);
    const startDay = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const totalCells = 42; // 6 rows x 7 columns
    const arr: CalendarCell[] = [];

    for (let i = 0; i < totalCells; i++) {
      let cell: CalendarCell;

      if (i < startDay) {
        // previous month
        const day = prevMonthDays - (startDay - 1) + i;
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();
        const disabled = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
        cell = {
          day,
          muted: true,
          selected: false,
          hasEvent: false,
          date,
          inCurrentMonth: false,
          disabled,
        };
      } else if (i < startDay + daysInMonth) {
        // current month
        const day = i - startDay + 1;
        const date = new Date(year, month, day);
        const today = new Date();
        const dayOfWeek = date.getDay();
        const disabled = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
        const selected =
          !disabled && date.toDateString() === today.toDateString();
        const hasEvent = !!events[day];
        cell = {
          day,
          muted: false,
          selected,
          hasEvent,
          date,
          inCurrentMonth: true,
          disabled,
        };
      } else {
        // next month
        const day = i - (startDay + daysInMonth) + 1;
        const date = new Date(year, month + 1, day);
        const dayOfWeek = date.getDay();
        const disabled = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
        cell = {
          day,
          muted: true,
          selected: false,
          hasEvent: false,
          date,
          inCurrentMonth: false,
          disabled,
        };
      }

      arr.push(cell);
    }

    return arr;
  }, [year, month, events]);

  return (
    <section
      aria-label="Calendar dates grid"
      className="grid grid-cols-7 grid-rows-6 auto-rows-[minmax(0,1fr)] border-t border-gray-100 rounded-b-2xl overflow-hidden flex-1 min-h-0 w-full"
    >
      {cells.map((cell, idx) => {
        const isDisabled = !!cell.disabled;
        const textColor = cell.muted ? "text-slate-300" : "text-slate-800";
        const key = `cell-${idx}-${cell.date.toISOString()}`;
        return (
          <div
            key={key}
            aria-disabled={isDisabled}
            data-disabled={isDisabled}
            className={`relative flex flex-col border-r border-b border-gray-100 bg-white p-2 min-w-0 ${
              isDisabled ? "select-none" : ""
            }`}
          >
            {/* Day Number */}
            <div className="flex justify-end">
              {cell.selected && !isDisabled ? (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0033a0] text-white text-sm font-bold">
                  {cell.day}
                </div>
              ) : (
                <span className={`text-sm font-medium ${textColor}`}>
                  {cell.day}
                </span>
              )}
            </div>

            {/* Event Card */}
            {cell.inCurrentMonth &&
              !isDisabled &&
              events[cell.day] &&
              events[cell.day].length > 0 && (
                <div
                  className="mt-3 flex flex-col gap-2 overflow-hidden"
                  aria-hidden={isDisabled}
                >
                  {events[cell.day].slice(0, 1).map((ev, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm overflow-hidden"
                    >
                      <p className="text-[10px] text-slate-600 truncate">
                        {ev.title}
                      </p>

                      {ev.tag && (
                        <div className="mt-2 inline-flex items-center justify-center rounded-full bg-purple-100 px-3 py-1">
                          <span className="text-[10px] font-bold text-purple-700">
                            {ev.tag}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}

                  {events[cell.day].length > 1 && (
                    <button
                      disabled={isDisabled}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500 w-fit hover:bg-slate-200 transition"
                    >
                      <MoreHorizontal className="w-3 h-3" />+
                      {events[cell.day].length - 1} more
                    </button>
                  )}
                </div>
              )}

            {/* Hover-only prohibited icon overlay for disabled days */}
            {isDisabled && (
              <div
                className="absolute inset-0 group pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onMouseDown={(e) => e.preventDefault()}
                onDoubleClick={(e) => e.preventDefault()}
                onPointerDown={(e) => e.preventDefault()}
                role="presentation"
                aria-hidden="true"
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-slate-400"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="6.3"
                      y1="6.3"
                      x2="17.7"
                      y2="17.7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};
