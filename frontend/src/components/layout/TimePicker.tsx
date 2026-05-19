"use client";

import { JSX, useRef, useState } from "react";
import { Clock3 } from "lucide-react";

import { useOutsidePointerDown } from "@/hooks/useDismissableEvents";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
}

export default function TimePicker({
  value,
  onChange,
  label = "Time",
}: TimePickerProps): JSX.Element {
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  // Parse HH:MM format (24-hour)
  const [rawHours, rawMinutes] = value.split(":").map(Number);
  const hours24 = Number.isFinite(rawHours) ? rawHours : 9;
  const minutes = Number.isFinite(rawMinutes) ? rawMinutes : 0;

  useOutsidePointerDown(triggerRef, () => setShowPicker(false), showPicker);

  // Convert 24-hour to 12-hour format
  const isPM = hours24 >= 12;
  const hours12 = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;
  const period = isPM ? "PM" : "AM";

  const handleHourChange = (newHour: number) => {
    // Convert 12-hour back to 24-hour
    let hour24 = newHour;
    if (isPM && newHour !== 12) {
      hour24 = newHour + 12;
    } else if (!isPM && newHour === 12) {
      hour24 = 0;
    }
    const h = String(hour24).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    onChange(`${h}:${m}`);
  };

  const handleMinuteChange = (newMinute: number) => {
    const h = String(hours24).padStart(2, "0");
    const m = String(newMinute).padStart(2, "0");
    onChange(`${h}:${m}`);
  };

  const handlePeriodChange = (newPeriod: "AM" | "PM") => {
    let hour24 = hours12;
    if (newPeriod === "PM" && hours12 !== 12) {
      hour24 = hours12 + 12;
    } else if (newPeriod === "AM" && hours12 === 12) {
      hour24 = 0;
    }
    const h = String(hour24).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    onChange(`${h}:${m}`);
  };

  // Generate hours (1-12) and minutes arrays
  const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  // Format time display (12-hour format)
  const displayTime = `${String(hours12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative" ref={triggerRef}>
        {/* Display Time Button - matches DatePicker styling */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 relative w-full bg-white rounded-lg border border-gray-300 shadow-[0px_1px_2px_#0000000d]">
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className="flex-1 text-left text-gray-700 text-base leading-6 outline-none"
          >
            {displayTime}
          </button>
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-blue-50 hover:text-gray-600"
            aria-label="Open time picker"
          >
            <Clock3 size={20} />
          </button>
        </div>

        {/* Clock UI Picker */}
        {showPicker && (
          <div
            ref={pickerRef}
            className="absolute bottom-full left-0 z-50 mb-2 w-full rounded-lg border border-gray-300 bg-white p-4 shadow-lg"
          >
            <div className="flex items-center justify-center mb-4">
              <Clock3 className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-sm font-semibold text-gray-700">
                Select Time
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Hours (12-hour) */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Hour
                </label>
                <select
                  value={hours12}
                  onChange={(e) => handleHourChange(Number(e.target.value))}
                  size={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {hourOptions.map((h) => (
                    <option key={h} value={h}>
                      {String(h).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minutes */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Minute
                </label>
                <select
                  value={minutes}
                  onChange={(e) => handleMinuteChange(Number(e.target.value))}
                  size={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {minuteOptions.map((m) => (
                    <option key={m} value={m}>
                      {String(m).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>

              {/* AM/PM */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Period
                </label>
                <select
                  value={period}
                  onChange={(e) =>
                    handlePeriodChange(e.target.value as "AM" | "PM")
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowPicker(false)}
              className="mt-4 w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
