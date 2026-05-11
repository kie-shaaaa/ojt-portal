import { ChevronLeft, ChevronRight } from "lucide-react";
import { JSX } from "react";

type Props = {
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};

export const CalendarNavigationToolbarSection = ({
  monthLabel,
  onPrev,
  onNext,
  onToday,
}: Props): JSX.Element => {
  return (
    <section
      className="relative flex w-full self-stretch flex-col items-start pb-8"
      aria-label="Calendar navigation toolbar"
    >
      <div className="relative flex w-full items-center justify-between">
        {/* Left Controls */}
        <div className="flex items-center gap-3">
          {/* Month Navigation */}
          <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <button
              type="button"
              aria-label="Previous month"
              onClick={onPrev}
              className="flex items-center justify-center p-3 hover:bg-gray-50 transition"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>

            <div className="w-px h-6 bg-gray-200" />

            <button
              type="button"
              aria-label="Next month"
              onClick={onNext}
              className="flex items-center justify-center p-3 hover:bg-gray-50 transition"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Today Button */}
          <button
            type="button"
            onClick={onToday}
            className="inline-flex items-center justify-center rounded-full bg-slate-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-600 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0033a0]"
            aria-label="Go to today"
          >
            Today
          </button>
        </div>

        {/* Current Month */}
        <h2 className="text-2xl font-bold text-[#0033a0]">{monthLabel}</h2>
      </div>
    </section>
  );
};
