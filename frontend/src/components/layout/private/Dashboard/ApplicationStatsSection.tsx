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
};

type DashboardStats = {
  totalApplications: number;
  pendingApplications: number;
  underReviewApplications: number;
  forInterviewApplications: number;
  rejectedApplications: number;
  acceptedApplications: number;
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
  }));
  return (
    <section aria-label="Application statistics" className="w-full pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
