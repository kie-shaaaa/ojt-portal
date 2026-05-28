"use client";

import { JSX, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Activity,
  CheckCircle,
  Inbox,
  Save,
  Settings,
  Lock,
  LockOpen,
} from "lucide-react";
import DatePicker from "@/components/layout/DatePicker";
import { apiCall } from "@/lib/api";
import { ProcessingLoaderOverlay } from "@/components/shared/ProcessingLoaderOverlay";

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
  const lastSavedClosingDate = useRef<string>("");
  const [closingDate, setClosingDate] = useState("");
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<{
    isOpen: boolean;
    scheduledDate: string;
    closingDate: string;
  } | null>(null);
  const isLoading = originalSettings === null;
  const hasChanges =
    originalSettings === null ||
    isOpen !== originalSettings.isOpen ||
    scheduledDate !== originalSettings.scheduledDate ||
    closingDate !== originalSettings.closingDate;
  // Load saved settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await apiCall("/applications/settings", { method: "GET" });
        const settings = data.data ?? data;
        const fetchedDate = settings.opening_date
          ? settings.opening_date.split("T")[0]
          : "";
        const fetchedClosingDate = settings.closing_date
          ? settings.closing_date.split("T")[0]
          : "";

        setClosingDate(fetchedClosingDate);
        setIsOpen(settings.portal_status);
        setScheduledDate(fetchedDate);
        setOriginalSettings({
          isOpen: settings.portal_status,
          scheduledDate: fetchedDate,
          closingDate: fetchedClosingDate,
        });
        lastSavedClosingDate.current = fetchedClosingDate;
        lastSavedDate.current = fetchedDate;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch application settings";
        console.error(errorMessage, error);
        toast.error(errorMessage);
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
          closing_date: closingDate || null,
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
        closingDate: closingDate,
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
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save portal settings";
      console.error(errorMessage, error);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section
      aria-label="Application details"
      className="grid grid-cols-1 gap-6 lg:grid-cols-3"
    >
      <div className="grid gap-6 lg:col-span-2 lg:grid-cols-2">
        <section
          aria-labelledby="application-control-heading"
          className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm"
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
                isLoading
                  ? "bg-slate-100"
                  : isOpen
                    ? "bg-green-100"
                    : "bg-red-100"
              }`}
              aria-label={`Portal status ${isLoading ? "Loading" : isOpen ? "OPEN" : "CLOSED"}`}
            >
              {isLoading ? (
                <div
                  className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"
                  aria-hidden="true"
                />
              ) : isOpen ? (
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
                  isLoading
                    ? "text-slate-600"
                    : isOpen
                      ? "text-green-600"
                      : "text-red-600"
                }`}
              >
                {isLoading ? "Loading" : isOpen ? "OPEN" : "CLOSED"}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {isLoading ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                <label className="w-full sm:w-16 text-sm font-semibold text-slate-600">
                  Status:
                </label>
                <div className="flex items-center gap-3 sm:pl-6">
                  <div className="h-6 w-12 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-5 w-16 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                <label
                  htmlFor="portal-status-toggle"
                  className="w-full sm:w-16 text-sm font-semibold text-slate-600"
                >
                  Status:
                </label>

                <div className="flex items-center gap-3 sm:pl-6">
                  <button
                    id="portal-status-toggle"
                    type="button"
                    role="switch"
                    aria-checked={isOpen ?? false}
                    aria-label={`Portal is currently ${
                      isOpen ? "open" : "closed"
                    }. Toggle portal status.`}
                    onClick={() => {
                      const next = !isOpen;
                      setIsOpen(next);
                      if (!next) {
                        setScheduledDate("");
                        setClosingDate("");
                      } else {
                        setScheduledDate(lastSavedDate.current);
                        setClosingDate(lastSavedClosingDate.current);
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
            )}

            {!isLoading && (
              <div className="space-y-2">
                <DatePicker
                  id="scheduled-opening-date"
                  label="Scheduled Opening Date (Optional)"
                  value={scheduledDate}
                  disabled={isLoading || !isOpen}
                  onChange={setScheduledDate}
                  placeholder="yyyy/mm/dd"
                />
                <div className="space-y-2">
                  <DatePicker
                    id="scheduled-closing-date"
                    label="Scheduled Closing Date (Optional)"
                    value={closingDate}
                    disabled={isLoading || !isOpen}
                    onChange={setClosingDate}
                    placeholder="yyyy/mm/dd"
                    minDate={scheduledDate || undefined}
                  />
                  <p className="text-[10px] italic text-slate-400">
                    Leave empty for manual control only. Portal will auto-close
                    on this date.
                  </p>
                </div>

                <p className="text-[10px] italic text-slate-400">
                  Leave empty for manual control only. Portal will auto-open on
                  this date.
                </p>
              </div>
            )}

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
          className="min-h-[300px] rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm"
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
        className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-start-3 lg:self-start"
      >
        <div className="border-b border-slate-100 p-4 sm:p-6">
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
      <ProcessingLoaderOverlay open={isSaving} title="Saving" />
    </section>
  );
};
