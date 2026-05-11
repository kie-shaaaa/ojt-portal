"use client";
import { UsersRound, CircleCheck } from "lucide-react";
import {useState, JSX} from "react";
interface StatsData {
  totalVerified: number;
  confirmedThisMonth: number;
  pendingVerification: number;
  completionRate: number;
}

interface InternStatsOverviewSectionProps {
  stats: StatsData;
}

export const InternStatsOverviewSection = ({
  stats,
}: InternStatsOverviewSectionProps): JSX.Element => {
  const statItems = [
    {
      value: stats.totalVerified,
      label: "TOTAL VERIFIED INTERNS",
      icon: UsersRound,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      value: stats.confirmedThisMonth,
      label: "CONFIRMED THIS MONTH",
      icon: CircleCheck,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  return (
    <section
      aria-label="Intern statistics overview"
      className="grid grid-cols-1 gap-6 md:grid-cols-2"
    >
      {statItems.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            key={stat.label}
            className="flex items-center gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full ${stat.iconBg}`}
            >
              <Icon
                size={30}
                strokeWidth={1.5}
                className={stat.iconColor}
              />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-800">
                {stat.value}
              </h2>

              <p className="text-sm font-medium tracking-wide text-slate-500">
                {stat.label}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
};