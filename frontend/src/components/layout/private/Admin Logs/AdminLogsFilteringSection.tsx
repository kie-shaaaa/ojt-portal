"use client";

import { Filter, X } from "lucide-react";
import { JSX } from "react";

export type LogFilters = {
  action: string;
  userId: string;
  dateFrom: string;
  dateTo: string;
};

type Props = {
  filters: LogFilters;
  onFiltersChange: (filters: LogFilters) => void;
};

const actions = [
  "All Actions",
  "Logged In",
  "Password Reset",
  "User Created",
  "User Updated",
  "User Deleted",
  "User Status Update",
  "Application Reviewed",
  "Application Status Change",
  "Admin Notes Added",
  "Account Locked",
  "Account Unlocked",
  "Settings Updated",
  "File Uploaded",
  "File Deleted",
];

export const AdminLogsFilteringSection = ({
  filters,
  onFiltersChange,
}: Props): JSX.Element => {
  const handleActionChange = (action: string) => {
    onFiltersChange({
      ...filters,
      action: action === "All Actions" ? "" : action,
    });
  };

  const handleUserIdChange = (userId: string) => {
    onFiltersChange({
      ...filters,
      userId,
    });
  };

  const handleDateFromChange = (dateFrom: string) => {
    onFiltersChange({
      ...filters,
      dateFrom,
    });
  };

  const handleDateToChange = (dateTo: string) => {
    onFiltersChange({
      ...filters,
      dateTo,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      action: "",
      userId: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const hasActiveFilters =
    filters.action || filters.userId || filters.dateFrom || filters.dateTo;

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <Filter size={20} className="text-blue-600" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800">Filter Logs</h3>
            <p className="text-xs text-slate-500">
              {hasActiveFilters
                ? `${[filters.action, filters.userId, filters.dateFrom, filters.dateTo].filter(Boolean).length} filter(s) active`
                : "No filters applied"}
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            <X size={16} />
            Clear All
          </button>
        )}
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Action Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Action Type
          </label>
          <select
            value={filters.action || "All Actions"}
            onChange={(e) => handleActionChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            {actions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>

        {/* User ID Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            User ID
          </label>
          <input
            type="number"
            min="1"
            value={filters.userId}
            onChange={(e) => handleUserIdChange(e.target.value)}
            placeholder="Enter user ID..."
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          />
        </div>

        {/* Date From Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            From Date
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleDateFromChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          />
        </div>

        {/* Date To Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            To Date
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleDateToChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-3">
          {filters.action && (
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5">
              <span className="text-xs font-semibold text-blue-700">
                Action: {filters.action}
              </span>
              <button
                onClick={() => handleActionChange("All Actions")}
                className="text-blue-700 transition hover:text-blue-900"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {filters.userId && (
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1.5">
              <span className="text-xs font-semibold text-purple-700">
                User ID: {filters.userId}
              </span>
              <button
                onClick={() => handleUserIdChange("")}
                className="text-purple-700 transition hover:text-purple-900"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {filters.dateFrom && (
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5">
              <span className="text-xs font-semibold text-amber-700">
                From: {filters.dateFrom}
              </span>
              <button
                onClick={() => handleDateFromChange("")}
                className="text-amber-700 transition hover:text-amber-900"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {filters.dateTo && (
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5">
              <span className="text-xs font-semibold text-green-700">
                To: {filters.dateTo}
              </span>
              <button
                onClick={() => handleDateToChange("")}
                className="text-green-700 transition hover:text-green-900"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
