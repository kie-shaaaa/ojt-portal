"use client";

import { JSX, useState, useEffect, useRef } from "react";

import {
  Activity,
  CheckCircle,
  Inbox,
  Save,
  Settings,
  Lock,
  LockOpen,
} from "lucide-react";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import DatePicker from "@/components/layout/DatePicker";
import { apiCall } from "@/lib/api";

function getUserIdFromToken(): number | undefined {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  if (!token) return undefined;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id ?? payload.sub ?? payload.userId;
  } catch {
    return undefined;
  }
}

export const ApplicationDetailsSection = (): JSX.Element => {
  const lastSavedDate = useRef<string>("");
  const [isOpen, setIsOpen] = useState(true);
  const [scheduledDate, setScheduledDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<{
    isOpen: boolean;
    scheduledDate: string;
  } | null>(null);
  const hasChanges =
    originalSettings === null ||
    isOpen !== originalSettings.isOpen ||
    scheduledDate !== originalSettings.scheduledDate;

  // Load saved settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await apiCall("/applications/settings", { method: "GET" });
        const settings = data.data ?? data;
        const fetchedDate = settings.opening_date
          ? settings.opening_date.split("T")[0]
          : "";

        setIsOpen(settings.portal_status);
        setScheduledDate(fetchedDate);
        setOriginalSettings({
          isOpen: settings.portal_status,
          scheduledDate: fetchedDate,
        });
        lastSavedDate.current = fetchedDate;
      } catch (error) {
        console.error("Raw fetch error:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const userId = getUserIdFromToken();

      const response = await apiCall("/applications/settings", {
        method: "POST",
        body: JSON.stringify({
          portal_status: isOpen,
          opening_date: scheduledDate || null,
          ...(userId !== undefined && { created_by: userId }),
        }),
      });

      const saved = response.data;
      const savedDate = saved.opening_date
        ? saved.opening_date.split("T")[0] // ✅ keep as YYYY-MM-DD
        : "";

      setIsOpen(saved.portal_status);
      setScheduledDate(savedDate);
      setOriginalSettings({
        isOpen: saved.portal_status,
        scheduledDate: savedDate,
      });
      lastSavedDate.current = savedDate;

      localStorage.setItem(
        "portalSettings",
        JSON.stringify({
          isOpen: saved.portal_status,
          scheduledDate: savedDate,
        }),
      );
    } catch (error) {
      console.error("Failed to save portal settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section
      aria-label="Application details"
      className="grid grid-cols-1 gap-6 xl:grid-cols-3"
    >
      <div className="grid gap-6 xl:col-span-2 xl:grid-cols-2">
        <section
          aria-labelledby="application-control-heading"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
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
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 ${
                isOpen ? "bg-green-100" : "bg-red-100"
              }`}
              aria-label={`Portal status ${isOpen ? "OPEN" : "CLOSED"}`}
            >
              {isOpen ? (
                <LockOpen
                  className="h-5 w-5 animate-pulse text-green-600"
                  aria-hidden="true"
                />
              ) : (
                <Lock
                  className="h-5 w-5 animate-pulse text-red-600"
                  aria-hidden="true"
                />
              )}

              <span
                className={`text-xs font-bold ${
                  isOpen ? "text-green-600" : "text-red-600"
                }`}
              >
                {isOpen ? "OPEN" : "CLOSED"}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-6">
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
                  onClick={() => {
                    const next = !isOpen;
                    setIsOpen(next);
                    if (!next) {
                      setScheduledDate(""); 
                    } else {
                      setScheduledDate(lastSavedDate.current); 
                    }
                  }}
                  className={`relative flex h-6 w-12 items-center rounded-full transition-colors ${
                    isOpen ? "bg-green-500" : "bg-red-500"
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
                    isOpen ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isOpen ? "OPEN" : "CLOSED"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <DatePicker
                id="scheduled-opening-date"
                label="Scheduled Opening Date (Optional)"
                value={scheduledDate}
                disabled={!isOpen}
                onChange={setScheduledDate}
                placeholder="yyyy/mm/dd"
              />

              <p className="text-[10px] italic text-slate-400">
                Leave empty for manual control only. Portal will auto-open on
                this date.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSaving || !hasChanges}
                aria-label="Update portal settings"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0038a8] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition disabled:opacity-50 hover:bg-[#002f8c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038a8]"
              >
                <Save className="h-4 w-4" />

                <span>{isSaving ? "Saving..." : "Update Portal Settings"}</span>
              </button>
            </div>
          </div>
        </section>

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

      <section
        aria-labelledby="applicant-schools-heading"
        className="rounded-xl border border-slate-200 bg-white shadow-sm xl:col-start-3 xl:self-start"
      >
        <div className="border-b border-slate-100 p-6">
          <h2
            id="applicant-schools-heading"
            className="text-sm font-semibold text-slate-700"
          >
            Applicant&apos;s Schools
          </h2>
        </div>

        <div className="min-h-[240px] xl:min-h-[260px]" />
      </section>

      {/* Saving Modal */}
      {isSaving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="flex aspect-square w-64 flex-col items-center justify-center gap-4 rounded-2xl bg-blue-50/95 p-7 shadow-2xl ring-1 ring-blue-100 sm:w-72">
            <div className="flex h-24 w-24 items-center justify-center">
              <DotLottieReact
                src="https://lottie.host/199225e8-1f26-4f62-950a-41cfed998703/4esdI4dLN5.lottie"
                loop
                autoplay
                style={{ height: "100%", width: "100%" }}
              />
            </div>

            <p className="text-xl font-bold tracking-wide text-slate-800">
              Saving
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
