"use client";

import { Eye, Search, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { JSX, useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import useDebouncedValue from "@/hooks/useDebouncedValue";

import { apiCall } from "@/lib/api";
import type { LogFilters } from "./AdminLogsFilteringSection";
import { useVirtualizedRows } from "@/hooks/useVirtualizedRows";

type LogRow = {
  id: string;
  userId: string;
  action: string;
  details: string;
  ipAddress: string;
  createdAt: string;
  timestamp: string;
};

type Log = {
  id: number;
  user_id: number;
  action: string;
  details: string;
  ip_address: string;
  created_at: string;
};

type Props = {
  isLoading?: boolean;
  filters?: LogFilters;
};

const columns = [
  "ID",
  "USER ID",
  "ACTION",
  "DETAILS",
  "IP ADDRESS",
  "CREATED AT",
  "ACTIONS",
];

const ITEMS_PER_PAGE = 10;

const mapLogs = (logs: Log[]): LogRow[] => {
  return logs.map((log) => {
    const date = new Date(log.created_at);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return {
      id: String(log.id),
      userId: String(log.user_id),
      action: log.action,
      details: log.details || "N/A",
      ipAddress: log.ip_address || "N/A",
      createdAt: formattedDate,
      timestamp: formattedTime,
    };
  });
};

const getActionStyles = (action: string) => {
  const a = action.toLowerCase();

  if (a.includes("logged in")) {
    return "bg-green-50 text-green-700 border-green-100";
  }

  if (a.includes("password") || a.includes("reset")) {
    return "bg-amber-50 text-amber-700 border-amber-100";
  }

  if (a.includes("user") && a.includes("created")) {
    return "bg-blue-50 text-blue-700 border-blue-100";
  }

  if (a.includes("user") && a.includes("deleted")) {
    return "bg-red-50 text-red-700 border-red-100";
  }

  if (a.includes("application")) {
    return "bg-purple-50 text-purple-700 border-purple-100";
  }

  if (a.includes("status")) {
    return "bg-sky-50 text-sky-700 border-sky-100";
  }

  return "bg-slate-50 text-slate-700 border-slate-100";
};

export const AdminLogsTable = ({
  isLoading: initialLoading,
  filters,
}: Props): JSX.Element => {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(initialLoading ?? false);
  const [totalLogs, setTotalLogs] = useState(0);
  const [selectedLog, setSelectedLog] = useState<LogRow | null>(null);
  const searchInputId = "admin-logs-search";

  useEffect(() => {
    let cancelled = false;

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          setIsLoading(true);

          const response = await apiCall(
            `/logs/fetch-all?limit=${ITEMS_PER_PAGE}&page=${currentPage}`,
            {
              method: "GET",
            },
          );

          if (cancelled) return;

          const data = Array.isArray(response) ? response : [];
          const mappedLogs = mapLogs(data);

          setLogs(mappedLogs);
          setTotalLogs(data.length);
        } catch (error) {
          if (!cancelled) {
            const errorMessage =
              error instanceof Error ? error.message : "Failed to fetch logs";
            console.error(errorMessage, error);
            toast.error(errorMessage);
            setLogs([]);
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      })();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [currentPage]);

  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const activeSearchQuery = searchQuery.trim() ? debouncedSearch : "";

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search query filter
      if (activeSearchQuery) {
        const query = activeSearchQuery.toLowerCase();
        const matchesSearch =
          log.id.toLowerCase().includes(query) ||
          log.userId.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query) ||
          log.details.toLowerCase().includes(query) ||
          log.ipAddress.toLowerCase().includes(query);

        if (!matchesSearch) return false;
      }

      // Action filter
      if (filters?.action && !log.action.includes(filters.action)) {
        return false;
      }

      // User ID filter
      if (filters?.userId && log.userId !== filters.userId) {
        return false;
      }

      // Date range filters
      if (filters?.dateFrom || filters?.dateTo) {
        const logDate = new Date(log.createdAt);
        const year = logDate.getFullYear();
        const month = String(logDate.getMonth() + 1).padStart(2, "0");
        const day = String(logDate.getDate()).padStart(2, "0");
        const logDateString = `${year}-${month}-${day}`;

        if (filters.dateFrom && logDateString < filters.dateFrom) {
          return false;
        }

        if (filters.dateTo && logDateString > filters.dateTo) {
          return false;
        }
      }

      return true;
    });
  }, [logs, activeSearchQuery, filters]);

  const shouldVirtualize = filteredLogs.length >= 10;
  const { scrollRef, windowedRange } = useVirtualizedRows({
    itemCount: filteredLogs.length,
    rowHeight: 88,
    overscan: 5,
    enabled: shouldVirtualize,
    resetKey: `${currentPage}-${filteredLogs.map((log) => log.id).join("|")}`,
  });

  const visibleLogs = shouldVirtualize
    ? filteredLogs.slice(windowedRange.startIndex, windowedRange.endIndex)
    : filteredLogs;

  const totalPages = Math.ceil(totalLogs / ITEMS_PER_PAGE);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSearchQuery("");
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSearchQuery("");
    }
  };

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col border-b border-slate-100">
        <div className="flex items-center justify-between gap-4 px-6 py-5 max-[767px]:flex-col max-[767px]:items-start">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">
              Admin Logs
            </h2>

            <p className="text-sm font-medium text-slate-500">
              {isLoading
                ? "Loading logs from database..."
                : `Total: ${totalLogs} • Page: ${currentPage} of ${totalPages || 1}`}
            </p>
          </div>

          <div className="ml-auto flex w-full max-w-fit items-center gap-4 max-[767px]:ml-0 max-[767px]:w-full max-[767px]:max-w-none max-[767px]:flex-col max-[767px]:items-stretch">
            <div className="relative w-full sm:w-[28rem] lg:w-[34rem]">
              <Search
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <label htmlFor={searchInputId} className="sr-only">
                Search logs
              </label>

              <input
                id={searchInputId}
                type="search"
                value={searchQuery}
                placeholder="Search by ID, action, details, or IP..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-10 text-sm text-gray-700 outline-none transition focus:border-slate-300 focus:ring-0"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 self-end max-[767px]:self-stretch max-[767px]:justify-end">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1 || isLoading}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-700 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-300 hover:bg-slate-50 active:scale-95"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="px-3 py-2 text-sm font-semibold text-slate-600">
                {currentPage} / {totalPages }
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages || isLoading}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-700 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-300 hover:bg-slate-50 active:scale-95"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        ref={scrollRef}
        className={`relative min-h-100 overflow-x-auto ${
          shouldVirtualize ? "max-h-[calc(100vh-20rem)] overflow-auto" : ""
        }`}
      >
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-lg" />

            <p className="mt-4 animate-pulse text-sm font-bold text-slate-600">
              Fetching logs...
            </p>
          </div>
        )}

        {!isLoading && filteredLogs.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Search size={32} />
            </div>

            <h3 className="text-lg font-bold text-slate-800">No logs found</h3>

            <p className="max-w-xs text-sm text-slate-500">
              We couldn&apos;t find any logs matching your search criteria.
            </p>

            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-sm font-bold text-blue-600 hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        <table className="w-full min-w-300 border-collapse">
          <thead>
            <tr className="bg-slate-50/80">
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-4 text-left text-xs font-bold tracking-widest text-slate-500 uppercase"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {shouldVirtualize && windowedRange.topSpacerHeight > 0 && (
              <tr aria-hidden="true">
                <td
                  colSpan={columns.length}
                  className="h-0 border-0 p-0"
                  style={{ height: windowedRange.topSpacerHeight }}
                />
              </tr>
            )}

            {visibleLogs.map((log, index) => (
              <tr
                key={`${log.id}-${shouldVirtualize ? windowedRange.startIndex + index : index}`}
                className="transition-all duration-200 hover:bg-slate-50/50"
              >
                {/* ID */}
                <td className="px-6 py-6 align-top">
                  <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 shadow-sm">
                    {log.id}
                  </span>
                </td>

                {/* User ID */}
                <td className="px-6 py-6 align-top">
                  <span className="text-sm font-bold text-slate-700">
                    #{log.userId}
                  </span>
                </td>

                {/* Action */}
                <td className="px-6 py-6 align-top">
                  <span
                    className={`inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-bold ring-1 ring-inset shadow-sm ${getActionStyles(
                      log.action,
                    )}`}
                  >
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />
                    {log.action}
                  </span>
                </td>

                {/* Details */}
                <td className="px-6 py-6 align-top">
                  <div className="max-w-xs">
                    <p className="line-clamp-2 text-sm font-medium text-slate-700">
                      {log.details}
                    </p>
                  </div>
                </td>

                {/* IP Address */}
                <td className="px-6 py-6 align-top">
                  <code className="text-xs font-mono font-bold text-slate-600 bg-slate-100 rounded px-2 py-1">
                    {log.ipAddress}
                  </code>
                </td>

                {/* Created At */}
                <td className="px-6 py-6 align-top">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">
                        {log.createdAt}
                      </span>

                      <span className="text-xs font-medium text-slate-500">
                        {log.timestamp}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-6 align-top">
                  <button
                    title="View Details"
                    onClick={() => setSelectedLog(log)}
                    className="rounded-xl border border-slate-200 bg-white p-2.5 text-blue-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 active:scale-90"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {shouldVirtualize && windowedRange.bottomSpacerHeight > 0 && (
              <tr aria-hidden="true">
                <td
                  colSpan={columns.length}
                  className="h-0 border-0 p-0"
                  style={{ height: windowedRange.bottomSpacerHeight }}
                />
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-8 py-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Log Details
                </h2>
                <p className="text-sm text-slate-500">ID: {selectedLog.id}</p>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            {/* Content */}
            <div className="px-8 py-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Log ID
                  </label>
                  <p className="mt-1 font-mono text-sm font-bold text-slate-900">
                    {selectedLog.id}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    User ID
                  </label>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    #{selectedLog.userId}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Action
                  </label>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {selectedLog.action}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    IP Address
                  </label>
                  <code className="mt-1 inline-block font-mono text-xs font-bold text-slate-900 bg-slate-100 rounded px-2 py-1">
                    {selectedLog.ipAddress}
                  </code>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Date
                  </label>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {selectedLog.createdAt}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Time
                  </label>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {selectedLog.timestamp}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Details
                  </label>
                  <p className="mt-1 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 font-mono">
                    {selectedLog.details}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50 px-8 py-4">
              <button
                onClick={() => setSelectedLog(null)}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
