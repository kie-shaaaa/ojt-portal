"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { apiCall } from "@/lib/api";

type ChartPoint = {
  label: string;
  value: number;
};

type DashboardCharts = {
  dailyApplications: ChartPoint[];
  monthlyApplications: ChartPoint[];
  statusDistribution: ChartPoint[];
};

type StatusColor = {
  fill: string;
  ring: string;
};

const statusColors: Record<string, StatusColor> = {
  Pending: { fill: "bg-orange-500", ring: "#f97316" },
  "Under Review": { fill: "bg-sky-500", ring: "#0ea5e9" },
  "For Interview": { fill: "bg-violet-500", ring: "#8b5cf6" },
  Accepted: { fill: "bg-emerald-500", ring: "#10b981" },
  Rejected: { fill: "bg-rose-500", ring: "#f43f5e" },
  "Pending Accept": { fill: "bg-amber-500", ring: "#f59e0b" },
};

const defaultCharts: DashboardCharts = {
  dailyApplications: [],
  monthlyApplications: [],
  statusDistribution: [],
};

function getMaxValue(points: ChartPoint[]): number {
  return Math.max(1, ...points.map((point) => point.value));
}

function buildLinePoints(points: ChartPoint[], width: number, height: number) {
  const maxValue = getMaxValue(points);
  const step = points.length > 1 ? width / (points.length - 1) : width;

  return points
    .map((point, index) => {
      const x = points.length > 1 ? index * step : width / 2;
      const y = height - (point.value / maxValue) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

function formatDateLabel(label: string): string {
  return label.replace(/^(\w{3})\s(\d{2})$/, "$1\n$2");
}

export const ApplicationChartsSection = (): JSX.Element => {
  const [charts, setCharts] = useState<DashboardCharts>(defaultCharts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCharts = async () => {
      try {
        setIsLoading(true);
        const response = await apiCall("/dashboard");
        const data = response?.data ?? response;

        setCharts({
          dailyApplications: Array.isArray(data?.dailyApplications)
            ? data.dailyApplications
            : [],
          monthlyApplications: Array.isArray(data?.monthlyApplications)
            ? data.monthlyApplications
            : [],
          statusDistribution: Array.isArray(data?.statusDistribution)
            ? data.statusDistribution
            : [],
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard charts";
        console.error(errorMessage, error);
        toast.error(errorMessage);
        setCharts(defaultCharts);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharts();
  }, []);

  const statusTotal = useMemo(
    () =>
      charts.statusDistribution.reduce((sum, point) => sum + point.value, 0),
    [charts.statusDistribution],
  );

  const dailyPath = useMemo(
    () => buildLinePoints(charts.dailyApplications, 640, 180),
    [charts.dailyApplications],
  );

  const dailyMax = getMaxValue(charts.dailyApplications);
  const monthlyMax = getMaxValue(charts.monthlyApplications);

  const donutSegments = useMemo(() => {
    if (statusTotal === 0) {
      return [] as Array<{ color: string; percent: number; label: string }>;
    }

      // normalize status labels to match the keys in `statusColors`
      const normalize = (label: string) =>
        label
          .toString()
          .toLowerCase()
          .replace(/[_-]/g, " ")
          .trim();

      const canonical = (label: string) => {
        const n = normalize(label);
        switch (n) {
          case "pending":
            return "Pending";
          case "under review":
            return "Under Review";
          case "for interview":
            return "For Interview";
          case "accepted":
            return "Accepted";
          case "rejected":
            return "Rejected";
          case "pending accept":
            return "Pending Accept";
          default:
            // fallback to original label (preserve casing)
            return label;
        }
      };

      return charts.statusDistribution.map((point) => {
        const key = canonical(point.label);
        return {
          label: point.label,
          color: statusColors[key]?.ring ?? "#94a3b8",
          percent: (point.value / statusTotal) * 100,
        };
      });
  }, [charts.statusDistribution, statusTotal]);

  const donutBackground =
    donutSegments.length > 0
      ? `conic-gradient(${donutSegments
          .reduce<Array<string>>((acc, segment, index) => {
            const start = acc.reduce((sum, value) => {
              const match = value.match(/([\d.]+)%$/);
              return sum + (match ? Number(match[1]) : 0);
            }, 0);
            const end = start + segment.percent;
            acc.push(`${segment.color} ${start}% ${end}%`);
            return acc;
          }, [])
          .join(", ")})`
      : "conic-gradient(#e2e8f0 0% 100%)";

  return (
    <section aria-label="Application charts" className="w-full pb-6">
      <div className="grid grid-cols-1 gap-6 w-full xl:grid-cols-2 2xl:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-sm font-semibold text-slate-700">
              Daily Applications (Last 30 Days)
            </h2>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="h-45 animate-pulse rounded-lg bg-slate-100" />
            ) : charts.dailyApplications.length === 0 ? (
              <div className="flex h-45 items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-400">
                No application activity yet.
              </div>
            ) : (
              <div className="space-y-4">
                <svg
                  viewBox="0 0 640 220"
                  role="img"
                  aria-label="Daily applications line chart"
                  className="h-55 w-full"
                >
                  {[0, 1, 2, 3].map((tick) => {
                    const y = 180 - (tick / 3) * 180;
                    return (
                      <g key={tick}>
                        <line
                          x1="0"
                          x2="640"
                          y1={y}
                          y2={y}
                          stroke="#e2e8f0"
                          strokeDasharray="4 4"
                        />
                        <text x="0" y={y - 6} fill="#94a3b8" fontSize="10">
                          {Math.round((dailyMax / 3) * tick)}
                        </text>
                      </g>
                    );
                  })}

                  <polyline
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    points={dailyPath}
                  />

                  {charts.dailyApplications.map((point, index) => {
                    const x =
                      charts.dailyApplications.length > 1
                        ? (index * 640) / (charts.dailyApplications.length - 1)
                        : 320;
                    const y = 180 - (point.value / dailyMax) * 180;

                    return (
                      <g key={`${point.label}-${index}`}>
                        <circle cx={x} cy={y} r="4.5" fill="#2563eb" />
                        {index % 5 === 0 ||
                        index === charts.dailyApplications.length - 1 ? (
                          <text
                            x={x}
                            y="204"
                            fill="#64748b"
                            fontSize="9"
                            textAnchor="middle"
                          >
                            {formatDateLabel(point.label)}
                          </text>
                        ) : null}
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-sm font-semibold text-slate-700">
              Monthly Applications (Last 6 Months)
            </h2>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="h-45 animate-pulse rounded-lg bg-slate-100" />
            ) : charts.monthlyApplications.length === 0 ? (
              <div className="flex h-45 items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-400">
                No monthly data available.
              </div>
            ) : (
              <div className="flex h-45 items-end gap-3">
                {charts.monthlyApplications.map((point) => {
                  const height = (point.value / monthlyMax) * 100;

                  return (
                    <div
                      key={point.label}
                      className="flex min-w-0 flex-1 flex-col items-center gap-2"
                    >
                      <div className="flex h-35 w-full items-end justify-center rounded-lg bg-slate-50 px-2 pb-1">
                        <div
                          className="w-full max-w-11 rounded-t-lg bg-linear-to-t from-sky-500 to-blue-600 transition-all"
                          style={{ height: `${Math.max(height, 6)}%` }}
                        />
                      </div>
                      <div className="text-center text-[11px] font-medium text-slate-500">
                        <div>{point.label.split(" ")[0]}</div>
                        <div>{point.label.split(" ").slice(1).join(" ")}</div>
                      </div>
                      <div className="text-xs font-semibold text-slate-700">
                        {point.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2 2xl:col-span-1">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-sm font-semibold text-slate-700">
              Application Status Distribution
            </h2>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-[180px,1fr] md:items-center">
            <div className="flex items-center justify-center">
              {isLoading ? (
                <div className="h-45 w-45 animate-pulse rounded-full bg-slate-100" />
              ) : (
                <div
                  className="relative flex h-45 w-45 items-center justify-center rounded-full"
                  style={{ background: donutBackground }}
                >
                  <div className="flex h-27 w-27 flex-col items-center justify-center rounded-full bg-white text-center shadow-sm">
                    <div className="text-2xl font-bold text-slate-800">
                      {statusTotal}
                    </div>
                    <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                      Total
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="h-40 animate-pulse rounded-lg bg-slate-100" />
              ) : charts.statusDistribution.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-400">
                  No status distribution yet.
                </div>
              ) : (
                charts.statusDistribution.map((point) => {
                  const normalize = (label: string) =>
                    label
                      .toString()
                      .toLowerCase()
                      .replace(/[_-]/g, " ")
                      .trim();

                  const canonical = (label: string) => {
                    const n = normalize(label);
                    switch (n) {
                      case "pending":
                        return "Pending";
                      case "under review":
                        return "Under Review";
                      case "for interview":
                        return "For Interview";
                      case "accepted":
                        return "Accepted";
                      case "rejected":
                        return "Rejected";
                      case "pending accept":
                        return "Pending Accept";
                      default:
                        return label;
                    }
                  };

                  const key = canonical(point.label);
                  const color = statusColors[key] ?? {
                    fill: "bg-slate-400",
                    ring: "#94a3b8",
                  };

                  const share =
                    statusTotal > 0 ? (point.value / statusTotal) * 100 : 0;

                  return (
                    <div key={point.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 font-medium text-slate-600">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${color.fill}`}
                          />
                          {point.label}
                        </div>
                        <div className="text-slate-500">
                          {point.value} ({share.toFixed(0)}%)
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className={`h-2 rounded-full ${color.fill}`}
                          style={{ width: `${share}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
