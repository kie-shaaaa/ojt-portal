"use client";

import { JSX, ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  FileText,
  Clock3,
  Search,
  Users,
  XCircle,
  CheckCircle2,
} from "lucide-react";

import { apiCall } from "@/lib/api";

type StatCard = {
  value: string;
  label: string[];
  iconBgClass: string;
  filter?: string | null;
  icon: ReactNode;
  description: string;
  countKey: keyof DashboardStats;
};

type DashboardStats = {
  totalApplications: number;
  pendingApplications: number;
  underReviewApplications: number;
  forInterviewApplications: number;
  rejectedApplications: number;
  acceptedApplications: number;
};

const statDefs: Omit<StatCard, "value">[] = [
  {
    label: ["Total", "Applications"],
    iconBgClass: "bg-blue-50",
    filter: null,
    icon: <FileText className="h-6 w-6 text-blue-600" />,
    description: "All submitted applications across every status.",
    countKey: "totalApplications",
  },
  {
    label: ["Pending", "Review"],
    iconBgClass: "bg-orange-50",
    filter: "Pending",
    icon: <Clock3 className="h-6 w-6 text-orange-500" />,
    description: "Applications waiting for the first review pass.",
    countKey: "pendingApplications",
  },
  {
    label: ["Under", "Review"],
    iconBgClass: "bg-sky-50",
    filter: "Under Review",
    icon: <Search className="h-6 w-6 text-sky-600" />,
    description: "Files currently being checked and validated.",
    countKey: "underReviewApplications",
  },
  {
    label: ["For Interview"],
    iconBgClass: "bg-purple-50",
    filter: "For interview",
    icon: <Users className="h-6 w-6 text-purple-600" />,
    description: "Candidates queued for interview scheduling.",
    countKey: "forInterviewApplications",
  },
  {
    label: ["Rejected"],
    iconBgClass: "bg-red-50",
    filter: "Rejected",
    icon: <XCircle className="h-6 w-6 text-red-500" />,
    description: "Applications that did not meet the required criteria.",
    countKey: "rejectedApplications",
  },
  {
    label: ["Accepted"],
    iconBgClass: "bg-green-50",
    filter: "Accepted",
    icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
    description: "Approved applications ready for the next step.",
    countKey: "acceptedApplications",
  },
];

export const ApplicationStatsSection = (): JSX.Element => {
  const router = useRouter();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingApplications: 0,
    underReviewApplications: 0,
    forInterviewApplications: 0,
    rejectedApplications: 0,
    acceptedApplications: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<
    string | null | undefined
  >(undefined);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);

        const response = await apiCall("/dashboard");
        const stats = response?.data ?? response;

        setDashboardStats({
          totalApplications: Number(stats?.totalApplications ?? 0),
          pendingApplications: Number(stats?.pendingApplications ?? 0),
          underReviewApplications: Number(stats?.underReviewApplications ?? 0),
          forInterviewApplications: Number(
            stats?.forInterviewApplications ?? 0,
          ),
          rejectedApplications: Number(stats?.rejectedApplications ?? 0),
          acceptedApplications: Number(stats?.acceptedApplications ?? 0),
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard stats";
        console.error(errorMessage, error);
        toast.error(errorMessage);
        setDashboardStats({
          totalApplications: 0,
          pendingApplications: 0,
          underReviewApplications: 0,
          forInterviewApplications: 0,
          rejectedApplications: 0,
          acceptedApplications: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const stats: StatCard[] = statDefs.map((s, i) => ({
    value: isLoading
      ? "..."
      : i === 0
        ? String(dashboardStats.totalApplications)
        : i === 1
          ? String(dashboardStats.pendingApplications)
          : i === 2
            ? String(dashboardStats.underReviewApplications)
            : i === 3
              ? String(dashboardStats.forInterviewApplications)
              : i === 4
                ? String(dashboardStats.rejectedApplications)
                : String(dashboardStats.acceptedApplications),
    label: s.label,
    iconBgClass: s.iconBgClass,
    filter: s.filter,
    icon: s.icon,
    description: s.description,
    countKey: s.countKey,
  }));

  const totalApplications = dashboardStats.totalApplications;

  const getStatCount = (stat: StatCard) => {
    if (isLoading) {
      return 0;
    }

    return dashboardStats[stat.countKey];
  };

  const getShare = (stat: StatCard) => {
    if (isLoading || totalApplications === 0) {
      return 0;
    }

    if (stat.countKey === "totalApplications") {
      return 100;
    }

    return Math.min(
      100,
      Math.round((getStatCount(stat) / totalApplications) * 100),
    );
  };

  return (
    <section
      aria-label="Application statistics"
      className="flex h-full w-full flex-col"
    >
      <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
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
            className={`relative flex min-h-40 h-full cursor-pointer flex-col justify-between rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md overflow-hidden ${
              selectedFilter === stat.filter
                ? "border-blue-600 border-2"
                : "border-slate-100"
            }`}
          >
            <span className="absolute right-3 top-3 rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
              {getShare(stat)}%
            </span>

            <div className="flex w-full flex-col items-center gap-3 text-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.iconBgClass}`}
                aria-hidden="true"
              >
                {stat.icon}
              </div>

              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {stat.label.join(" ")}
              </div>

              <div className="text-3xl font-bold leading-none text-slate-800">
                {stat.value}
              </div>

              <p className="mt-1 line-clamp-2 px-1 text-sm leading-5 text-slate-500">
                {stat.description}
              </p>
            </div>

            <div className="mt-5">
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all ${
                    stat.countKey === "rejectedApplications"
                      ? "bg-red-500"
                      : stat.countKey === "acceptedApplications"
                        ? "bg-green-500"
                        : stat.countKey === "pendingApplications"
                          ? "bg-orange-500"
                          : stat.countKey === "underReviewApplications"
                            ? "bg-sky-500"
                            : stat.countKey === "forInterviewApplications"
                              ? "bg-purple-500"
                              : "bg-blue-600"
                  }`}
                  style={{ width: `${getShare(stat)}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between gap-3 text-[11px] font-medium text-slate-400">
                <span className="truncate">
                  {stat.filter
                    ? `Tap to filter ${stat.filter.toLowerCase()}`
                    : "Overview summary"}
                </span>
                <span>{getStatCount(stat)} records</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
