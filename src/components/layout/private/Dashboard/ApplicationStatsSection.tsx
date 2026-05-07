import { JSX, ReactNode } from "react";

import {
  FileText,
  Clock3,
  Search,
  Users,
  XCircle,
  CheckCircle2,
} from "lucide-react";

type StatCard = {
  value: string;
  label: string[];
  iconBgClass: string;
  icon: ReactNode;
};

const stats: StatCard[] = [
  {
    value: "10",
    label: ["Total", "Applications"],
    iconBgClass: "bg-blue-50",
    icon: <FileText className="h-6 w-6 text-blue-600" />,
  },
  {
    value: "1",
    label: ["Pending", "Review"],
    iconBgClass: "bg-orange-50",
    icon: <Clock3 className="h-6 w-6 text-orange-500" />,
  },
  {
    value: "0",
    label: ["Under", "Review"],
    iconBgClass: "bg-sky-50",
    icon: <Search className="h-6 w-6 text-sky-600" />,
  },
  {
    value: "2",
    label: ["For Interview"],
    iconBgClass: "bg-purple-50",
    icon: <Users className="h-6 w-6 text-purple-600" />,
  },
  {
    value: "0",
    label: ["Rejected"],
    iconBgClass: "bg-red-50",
    icon: <XCircle className="h-6 w-6 text-red-500" />,
  },
  {
    value: "0",
    label: ["Accepted"],
    iconBgClass: "bg-green-50",
    icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
  },
];

export const ApplicationStatsSection = (): JSX.Element => {
  return (
    <section aria-label="Application statistics" className="w-full pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <article
            key={`${stat.value}-${stat.label.join("-")}`}
            className="flex items-center rounded-xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.iconBgClass}`}
              aria-hidden="true"
            >
              {stat.icon}
            </div>

            <div className="ml-4">
              <div className="text-2xl font-bold leading-8 text-slate-800">
                {stat.value}
              </div>

              <div className="text-xs font-medium leading-4 text-slate-400">
                {stat.label.map((line, index) => (
                  <span key={`${line}-${index}`}>
                    {line}
                    {index < stat.label.length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
