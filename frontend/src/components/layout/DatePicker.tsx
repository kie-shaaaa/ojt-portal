"use client";

import { Calendar, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { JSX, useEffect, useRef, useState } from "react";

interface DatePickerProps {
  label?: string;
  labelClassName?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  minDate?: string;
}

export default function DatePicker({
  label = "Preferred Deployment Date",
  labelClassName = "text-[#0047ab]",
  value,
  onChange,
  error,
  id = "deployment-date",
  required = false,
  disabled = false,
  minDate,
  placeholder = "yyyy/mm/dd",
}: DatePickerProps): JSX.Element {
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth());
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Format date as YYYY-MM-DD for storage
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Format title for display
  const formatTitle = (year: number, month: number): string => {
    return new Date(year, month, 1).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Check if date is in the past
  const isPastDate = (dateStr: string): boolean => {
    const d = new Date(dateStr + "T00:00:00");
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  // Check if date is a weekend
  const isWeekend = (dateStr: string): boolean => {
    const d = new Date(dateStr + "T00:00:00");
    const dayOfWeek = d.getDay();
    return dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
  };

  const isDisabledDate = (dateStr: string): boolean => {
    if (minDate && dateStr <= minDate) return true; 
    return isPastDate(dateStr) || isWeekend(dateStr);
  };
  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calendar generation
  const firstDay = new Date(activeYear, activeMonth, 1).getDay();
  const daysInMonth = new Date(activeYear, activeMonth + 1, 0).getDate();
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handleDayClick = (day: number) => {
    const date = new Date(activeYear, activeMonth, day);
    const dateStr = formatDate(date);
    onChange(dateStr);
    setShowPicker(false);
  };

  return (
    <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
      {label ? (
        <label
          htmlFor={id}
          className={`relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-sm tracking-[0] leading-5 ${labelClassName}`}
        >
          {label} {required ? <span className="text-red-500">*</span> : null}
        </label>
      ) : null}

      <div className="relative self-stretch w-full">
        <div
          className={`flex items-center justify-between gap-3 px-4 py-3 relative self-stretch w-full flex-[0_0_auto] rounded-lg overflow-visible border shadow-[0px_1px_2px_#0000000d] ${
            disabled
              ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60" // ✅
              : "bg-white"
          } ${error ? "border-red-500 border-2" : "border-gray-300 border"}`}
        >
          <input
            ref={inputRef}
            id={id}
            name={id}
            type="text"
            readOnly
            autoComplete="off"
            onClick={() => {
              if (disabled) {
                setShowPicker(false);
                return;
              }
              setShowPicker(!showPicker);
            }}
            aria-required={required || undefined}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            placeholder={placeholder}
            value={(() => {
              // Show selected date only; date is chosen from the calendar.
              if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                return value.replace(/-/g, "/");
              }
              return "";
            })()}
            className="relative flex min-w-0 flex-1 items-center border-0 bg-transparent [font-family:'Inter-Regular',Helvetica] font-normal text-gray-700 text-base tracking-[0] leading-6 outline-none placeholder:text-gray-400"
          />

          <button
            type="button"
            onClick={() => {
              if (disabled) {
                setShowPicker(false);
                return;
              }
              setShowPicker(!showPicker);
            }}
            disabled={disabled}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-blue-50 hover:text-gray-600"
            aria-label="Open calendar picker"
          >
            <Calendar size={20} />
          </button>
        </div>

        {showPicker && (
          <div
            ref={pickerRef}
            className="absolute bottom-full left-0 z-50 mb-2 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (activeMonth === 0) {
                    setActiveMonth(11);
                    setActiveYear(activeYear - 1);
                  } else {
                    setActiveMonth(activeMonth - 1);
                  }
                }}
                className="rounded p-2 hover:bg-gray-100"
              >
                <ChevronLeft size={18} className="text-[#0047ab]" />
              </button>
              <div className="text-center font-bold text-[#0047ab]">
                {formatTitle(activeYear, activeMonth)}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (activeMonth === 11) {
                    setActiveMonth(0);
                    setActiveYear(activeYear + 1);
                  } else {
                    setActiveMonth(activeMonth + 1);
                  }
                }}
                className="rounded p-2 hover:bg-gray-100"
              >
                <ChevronRight size={18} className="text-[#0047ab]" />
              </button>
            </div>

            {/* Weekday row */}
            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-600">
              {dayNames.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDay }).map((_, index) => (
                <button
                  key={`empty-${index}`}
                  type="button"
                  disabled
                  className="h-8 cursor-default rounded text-sm"
                />
              ))}

              {/* Days of month */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const date = new Date(activeYear, activeMonth, day);
                const dateStr = formatDate(date);
                const disabled = isDisabledDate(dateStr);
                const isSelected = value === dateStr;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleDayClick(day)}
                    className={`h-8 rounded text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-[#0047ab] text-white"
                        : disabled
                          ? "cursor-not-allowed bg-gray-50 text-gray-300"
                          : "hover:bg-blue-100 text-gray-700"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {error ? (
        <div
          id={`${id}-error`}
          className="flex items-center gap-1 text-red-500 text-xs"
        >
          <AlertCircle size={14} />
          {error}
        </div>
      ) : null}
    </div>
  );
}
