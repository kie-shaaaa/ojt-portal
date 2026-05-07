import { JSX } from "react";

const chartCards = [
  {
    id: "daily-applications",
    title: "Daily Applications (Last 30 Days)",
  },
  {
    id: "monthly-applications",
    title: "Monthly Applications (Last 6 Months)",
  },
  {
    id: "application-status-distribution",
    title: "Application Status Distribution",
  },
];

export const ApplicationChartsSection = (): JSX.Element => {
  return (
    <section aria-label="Application charts" className="w-full pb-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 w-full">
        {chartCards.map((card) => (
          <article
            key={card.id}
            aria-labelledby={`${card.id}-title`}
            className="h-[300px] rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="p-6 border-b border-slate-100">
              <h2
                id={`${card.id}-title`}
                className="text-sm font-semibold text-slate-700"
              >
                {card.title}
              </h2>
            </div>

            <div className="h-[236px]" aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  );
};
