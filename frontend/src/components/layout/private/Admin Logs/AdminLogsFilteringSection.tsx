"use client";

import { Filter, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { JSX, useId, useState, useRef, useMemo } from "react";

import { useOutsidePointerDown } from "@/hooks/useDismissableEvents";

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

type CalendarPickerProps = {
  value: string;
  onChange: (date: string) => void;
};

const CalendarPicker = ({ value, onChange }: CalendarPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      const date = new Date(value);
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });
  const calendarRef = useRef<HTMLDivElement>(null);

  useOutsidePointerDown(
    calendarRef,
    () => setIsOpen(false),
    isOpen,
  );

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getDaysArray = () => {
    const days: (number | null)[] = [];
    const first = firstDayOfMonth(currentMonth);
    const daysCount = daysInMonth(currentMonth);

    for (let i = 0; i < first; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysCount; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = newDate.toISOString().split('T')[0];
    onChange(dateString);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const selectedDate = value ? new Date(value) : null;
  const isCurrentMonth = selectedDate && 
    selectedDate.getFullYear() === currentMonth.getFullYear() && 
    selectedDate.getMonth() === currentMonth.getMonth();

  const days = getDaysArray();
  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="relative w-full" ref={calendarRef}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="yyyy-mm-dd"
        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none cursor-pointer"
        onFocus={() => setIsOpen(true)}
        readOnly
      />
      
      {isOpen && (
        <div className="absolute z-50 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-slate-100 rounded"
              type="button"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <h3 className="text-sm font-semibold text-slate-800">
              {monthName}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-slate-100 rounded"
              type="button"
            >
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayLabels.map((day) => (
              <div
                key={day}
                className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-slate-600"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div key={index} className="w-8 h-8">
                {day ? (
                  <button
                    onClick={() => handleDateClick(day)}
                    className={`w-full h-full flex items-center justify-center text-sm rounded ${
                      isCurrentMonth && selectedDate?.getDate() === day
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    type="button"
                  >
                    {day}
                  </button>
                ) : (
                  <div />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminLogsFilteringSection = ({
  filters,
  onFiltersChange,
}: Props): JSX.Element => {
  const actionDropdownRef = useRef<HTMLDivElement>(null);
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
  const [actionSearchQuery, setActionSearchQuery] = useState("");

  useOutsidePointerDown(
    actionDropdownRef,
    () => setIsActionDropdownOpen(false),
    isActionDropdownOpen,
  );

  const filteredActions = useMemo(
    () =>
      actions
        .filter((action) => action !== "All Actions")
        .filter((action) =>
          action.toLowerCase().includes(actionSearchQuery.toLowerCase()),
        ),
    [actionSearchQuery],
  );

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
          <div
            className="relative flex w-full items-center self-stretch"
            ref={actionDropdownRef}
          >
            <input
              type="text"
              id="action"
              name="action"
              aria-label="Action Type"
              value={
                isActionDropdownOpen
                  ? actionSearchQuery
                  : filters.action === "" || filters.action === "All Actions"
                    ? ""
                    : filters.action
              }
              placeholder="All Actions"
              onChange={(e) => {
                const val = e.target.value;
                setActionSearchQuery(val);
                setIsActionDropdownOpen(true);
                if (val.trim() === "") {
                  handleActionChange("All Actions");
                }
              }}
              onFocus={() => {
                setIsActionDropdownOpen(true);
                if (filters.action !== "" && filters.action !== "All Actions") {
                  setActionSearchQuery(filters.action);
                } else {
                  setActionSearchQuery("");
                }
              }}
              autoComplete="off"
              className="relative flex w-full appearance-none items-center justify-center rounded-lg border border-solid border-slate-200 bg-white py-2.5 pl-3 pr-10 font-inter-regular text-sm font-normal leading-5 tracking-normal text-slate-600 outline-none transition-colors focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            />
            {isActionDropdownOpen && (
              <div className="absolute z-50 top-full mt-1 max-h-60 w-full overflow-auto rounded-lg border border-solid border-slate-200 bg-white py-1 shadow-lg outline-none">
                {filteredActions.length > 0 ? (
                  filteredActions.map((action) => {
                    const isSelected = filters.action === action;
                    return (
                      <div
                        key={action}
                        onClick={() => {
                          handleActionChange(action);
                          setIsActionDropdownOpen(false);
                          setActionSearchQuery("");
                        }}
                        className={`cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-slate-100 ${
                          isSelected
                            ? "bg-slate-50 font-semibold text-slate-700 hover:bg-slate-100"
                            : "text-slate-600"
                        }`}
                      >
                        {action}
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-500">
                    No actions found
                  </div>
                )}
              </div>
            )}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex h-full w-10.5 items-center justify-center">
              <ChevronDown
                size={18}
                className="text-slate-500"
                aria-hidden="true"
              />
            </div>
          </div>
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
          <CalendarPicker
            value={filters.dateFrom}
            onChange={handleDateFromChange}
          />
        </div>

        {/* Date To Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            To Date
          </label>
          <CalendarPicker
            value={filters.dateTo}
            onChange={handleDateToChange}
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
