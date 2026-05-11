"use client";

import { useMemo, useState } from "react";
import { CalendarHeaderSection } from "@/components/layout/private/Calendar/CalendarHeaderSection";
import { CalendarDatesGridSection } from "@/components/layout/private/Calendar/CalendarDatesGridSection";
import { CalendarNavigationToolbarSection } from "@/components/layout/private/Calendar/CalendarNavigationToolbarSection";
import { CalendarWeekdayHeaderSection } from "@/components/layout/private/Calendar/CalendarWeekdayHeaderSection";

export default function Page() {
  const [current, setCurrent] = useState<Date>(() => new Date());

  const year = current.getFullYear();
  const month = current.getMonth();

  const monthLabel = useMemo(() => {
    return `${current.toLocaleString("default", { month: "long" })} ${current.getFullYear()}`;
  }, [current]);

  const goPrevMonth = () =>
    setCurrent((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

  const goNextMonth = () =>
    setCurrent((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const goToday = () => {
    const now = new Date();
    setCurrent(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  const events = useMemo(() => {
    return {
      21: [{ title: "Interview - Adrian ...", tag: "For Interview" }],
    } as Record<number, { title: string; tag?: string }[]>;
  }, [month, year]);

  return (
    <main
      className="flex flex-col items-start relative w-full"
      aria-label="Calendar main content"
    >
      <header className="flex flex-col h-20 items-start pt-4 pb-0 px-6 z-[1] relative self-stretch w-full">
        <CalendarHeaderSection />
      </header>

      <section
        className="flex flex-col items-start justify-center p-6 relative flex-1 self-stretch w-full grow overflow-auto"
        aria-label="Calendar content"
      >
        <div className="flex flex-col max-h-[1100px] items-start p-6 flex-1 min-h-0 grow bg-white rounded-2xl border border-gray-100 shadow-[0px_1px_2px_#0000000d] self-stretch w-full">
          
          <CalendarNavigationToolbarSection
            monthLabel={monthLabel}
            onPrev={goPrevMonth}
            onNext={goNextMonth}
            onToday={goToday}
          />

          <CalendarWeekdayHeaderSection />

          <CalendarDatesGridSection
            year={year}
            month={month}
            events={events}
          />
        </div>
      </section>
    </main>
  );
}