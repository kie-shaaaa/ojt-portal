"use client";

import { JSX, useId, useState } from "react";

import {
  Settings,
  CheckCircle,
  Calendar,
  CalendarDays,
  Save,
  Activity,
  Inbox,
} from "lucide-react";

export const ApplicationDetailsSection = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(true);
  const [scheduledDate, setScheduledDate] = useState("");

  const dateInputId = useId();

  return (
    <section
      aria-label="Application details"
      className="grid grid-cols-1 gap-6 xl:grid-cols-12"
    >
      {/* Left Panel */}
      <section className="xl:col-span-5 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-sm font-semibold text-slate-700">
            Applicant&apos;s Schools
          </h2>
        </div>

        <div className="min-h-[360px] xl:h-[570px]" />
      </section>

      {/* Right Side */}
      <div className="xl:col-span-7 grid gap-6">
        {/* Application Control */}
        <section
          aria-labelledby="application-control-heading"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-slate-600" />

              <h2
                id="application-control-heading"
                className="text-sm font-bold text-slate-700"
              >
                Application Control
              </h2>
            </div>

            <div
              className={`inline-flex items-center gap-1 rounded px-2 py-1 ${
                isOpen ? "bg-green-100" : "bg-slate-100"
              }`}
              aria-label={`Portal status ${isOpen ? "OPEN" : "CLOSED"}`}
            >
              <CheckCircle
                className={`h-3 w-3 ${
                  isOpen
                    ? "fill-green-600 text-green-600"
                    : "fill-slate-500 text-slate-500"
                }`}
              />

              <span
                className={`text-[10px] font-bold ${
                  isOpen ? "text-green-600" : "text-slate-500"
                }`}
              >
                {isOpen ? "OPEN" : "CLOSED"}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6 space-y-6">
            {/* Status Toggle */}
            <div className="flex items-center">
              <label
                htmlFor="portal-status-toggle"
                className="w-16 text-sm font-semibold text-slate-600"
              >
                Status:
              </label>

              <div className="flex items-center gap-3 pl-6">
                <button
                  id="portal-status-toggle"
                  type="button"
                  role="switch"
                  aria-checked={isOpen}
                  aria-label={`Portal is currently ${
                    isOpen ? "open" : "closed"
                  }. Toggle portal status.`}
                  onClick={() => setIsOpen((prev) => !prev)}
                  className={`relative flex h-6 w-12 items-center rounded-full transition-colors ${
                    isOpen ? "bg-green-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      isOpen ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>

                <span
                  className={`text-sm font-bold ${
                    isOpen ? "text-green-500" : "text-slate-500"
                  }`}
                >
                  {isOpen ? "OPEN" : "CLOSED"}
                </span>
              </div>
            </div>

            {/* Date Input */}
            <div className="space-y-2">
              <label
                htmlFor={dateInputId}
                className="flex cursor-text items-center gap-2 text-sm font-semibold text-slate-600"
              >
                <Calendar className="h-4 w-4 text-slate-500" />

                <span>Scheduled Opening Date (Optional)</span>
              </label>

              <div className="relative">
                <input
                  id={dateInputId}
                  type="date"
                  value={scheduledDate}
                  onChange={(event) => setScheduledDate(event.target.value)}
                  aria-describedby={`${dateInputId}-description`}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <CalendarDays
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
              </div>

              <p
                id={`${dateInputId}-description`}
                className="text-[10px] italic text-slate-400"
              >
                Leave empty for manual control only. Portal will auto-open on
                this date.
              </p>
            </div>

            {/* Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                aria-label="Update portal settings"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0038a8] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#002f8c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038a8]"
              >
                <Save className="h-4 w-4" />

                <span>Update Portal Settings</span>
              </button>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section
          aria-labelledby="recent-activity-heading"
          className="min-h-[300px] rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 border-b border-slate-100 pb-6">
            <Activity className="h-5 w-5 text-slate-600" />

            <h2
              id="recent-activity-heading"
              className="text-sm font-bold text-slate-700"
            >
              Recent Activity
            </h2>
          </div>

          <div className="flex flex-col items-center justify-center py-16 opacity-40">
            <Inbox className="h-16 w-16 text-slate-400" />

            <p className="mt-4 text-center text-sm font-medium text-slate-500">
              No recent activity
            </p>
          </div>
        </section>
      </div>
    </section>
  );
};
