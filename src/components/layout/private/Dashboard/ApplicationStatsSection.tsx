"use client";

import { JSX, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  filter?: string | null;
  icon: ReactNode;
};

// default labels and icons — values are computed at runtime
const statDefs: Omit<StatCard, "value">[] = [
  {
    label: ["Total", "Applications"],
    iconBgClass: "bg-blue-50",
    filter: null,
    icon: <FileText className="h-6 w-6 text-blue-600" />,
  },
  {
    label: ["Pending", "Review"],
    iconBgClass: "bg-orange-50",
    filter: "Pending",
    icon: <Clock3 className="h-6 w-6 text-orange-500" />,
  },
  {
    label: ["Under", "Review"],
    iconBgClass: "bg-sky-50",
    filter: "Under Review",
    icon: <Search className="h-6 w-6 text-sky-600" />,
  },
  {
    label: ["For Interview"],
    iconBgClass: "bg-purple-50",
    filter: "For interview",
    icon: <Users className="h-6 w-6 text-purple-600" />,
  },
  {
    label: ["Rejected"],
    iconBgClass: "bg-red-50",
    filter: "Rejected",
    icon: <XCircle className="h-6 w-6 text-red-500" />,
  },
  {
    label: ["Accepted"],
    iconBgClass: "bg-green-50",
    filter: "Accepted",
    icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
  },
];

export const ApplicationStatsSection = (): JSX.Element => {
  const router = useRouter();
  const [applications, setApplications] = useState<Array<any>>([]);
  const [selectedFilter, setSelectedFilter] = useState<
    string | null | undefined
  >(undefined);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem("ojt_applications");
        const parsed = raw ? JSON.parse(raw) : [];
        setApplications(parsed ?? []);
      } catch (err) {
        setApplications([]);
      }
    };

    load();

    const onUpdate = () => load();
    window.addEventListener("applications:update", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("applications:update", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const counts = {
    total: applications.length,
    pending: applications.filter((a: any) =>
      String(a.status ?? "")
        .toLowerCase()
        .includes("pending"),
    ).length,
    underReview: applications.filter((a: any) =>
      String(a.status ?? "")
        .toLowerCase()
        .includes("under"),
    ).length,
    forInterview: applications.filter((a: any) =>
      String(a.status ?? "")
        .toLowerCase()
        .includes("interview"),
    ).length,
    rejected: applications.filter((a: any) =>
      String(a.status ?? "")
        .toLowerCase()
        .includes("reject"),
    ).length,
    accepted: applications.filter((a: any) =>
      String(a.status ?? "")
        .toLowerCase()
        .includes("accept"),
    ).length,
  };

  const stats: StatCard[] = statDefs.map((s, i) => ({
    value:
      i === 0
        ? String(counts.total)
        : i === 1
          ? String(counts.pending)
          : i === 2
            ? String(counts.underReview)
            : i === 3
              ? String(counts.forInterview)
              : i === 4
                ? String(counts.rejected)
                : String(counts.accepted),
    label: s.label,
    iconBgClass: s.iconBgClass,
    filter: s.filter,
    icon: s.icon,
  }));
  return (
    <section aria-label="Application statistics" className="w-full pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <article
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                const query = stat.filter
                  ? `?status=${encodeURIComponent(stat.filter)}`
                  : "";
                router.push(`/applications${query}`);
              }
            }}
            onClick={() => {
              setSelectedFilter(stat.filter);
              const query = stat.filter
                ? `?status=${encodeURIComponent(stat.filter)}`
                : "";
              router.push(`/applications${query}`);
            }}
            key={`${stat.value}-${stat.label.join("-")}`}
            className={`cursor-pointer flex items-center rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
              selectedFilter === stat.filter
                ? "border-blue-600 border-2"
                : "border-slate-100"
            }`}
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
