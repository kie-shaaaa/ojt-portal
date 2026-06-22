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
import { useAuth } from "@/hooks/useAuth";

export const ApplicationDetailsSection = (): JSX.Element => {
  const { user } = useAuth();
  const lastSavedDate = useRef<string>("");
  const lastSavedClosingDate = useRef<string>("");
  const [closingDate, setClosingDate] = useState("");
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [officeHoursOpenTime, setOfficeHoursOpenTime] = useState("07:00");
  const [officeHoursCloseTime, setOfficeHoursCloseTime] = useState("19:00");
  const [officeHoursClosedDays, setOfficeHoursClosedDays] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<{
    isOpen: boolean;
    scheduledDate: string;
    closingDate: string;
    officeHoursOpenTime: string;
    officeHoursCloseTime: string;
    officeHoursClosedDays: string;
  } | null>(null);
  const isLoading = originalSettings === null;
  const hasChanges =
    originalSettings === null ||
    isOpen !== originalSettings.isOpen ||
    scheduledDate !== originalSettings.scheduledDate ||
    closingDate !== originalSettings.closingDate ||
    officeHoursOpenTime !== originalSettings.officeHoursOpenTime ||
    officeHoursCloseTime !== originalSettings.officeHoursCloseTime ||
    officeHoursClosedDays !== originalSettings.officeHoursClosedDays;
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
        setOfficeHoursOpenTime(settings.office_hours_open_time || '07:00');
        setOfficeHoursCloseTime(settings.office_hours_close_time || '19:00');
        setOfficeHoursClosedDays(settings.office_hours_closed_days || '');
        setOriginalSettings({
          isOpen: settings.portal_status,
          scheduledDate: fetchedDate,
          closingDate: fetchedClosingDate,
          officeHoursOpenTime: settings.office_hours_open_time || '07:00',
          officeHoursCloseTime: settings.office_hours_close_time || '19:00',
          officeHoursClosedDays: settings.office_hours_closed_days || 'Fri,Sat,Sun',
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
      const userId = user?.id;

      const response = await apiCall("/applications/settings", {
        method: "POST",
        body: JSON.stringify({
          portal_status: isOpen,
          opening_date: scheduledDate || null,
          closing_date: closingDate || null,
          office_hours_open_time: officeHoursOpenTime || '07:00',
          office_hours_close_time: officeHoursCloseTime || '19:00',
          office_hours_closed_days: officeHoursClosedDays || null,
          ...(userId !== undefined && { created_by: userId }),
        }),
      });

      const saved = response.data;
      const savedDate = saved.opening_date
        ? saved.opening_date.split("T")[0]
        : "";

      setIsOpen(saved.portal_status);
      setScheduledDate(savedDate);
      setOfficeHoursOpenTime(saved.office_hours_open_time || '07:00');
      setOfficeHoursCloseTime(saved.office_hours_close_time || '19:00');
      setOfficeHoursClosedDays(saved.office_hours_closed_days || '');
      setOriginalSettings({
        isOpen: saved.portal_status,
        scheduledDate: savedDate,
        closingDate: closingDate,
        officeHoursOpenTime: saved.office_hours_open_time || '07:00',
        officeHoursCloseTime: saved.office_hours_close_time || '19:00',
        officeHoursClosedDays: saved.office_hours_closed_days || '',
      });
      lastSavedDate.current = savedDate;

      localStorage.setItem(
        "portalSettings",
        JSON.stringify({
          isOpen: saved.portal_status,
          scheduledDate: savedDate,
        }),
      );

      toast.success('Office hours updated successfully');
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
    <section aria-label="Application details" className="w-full">
      <div className="grid gap-6">
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
                  <p className="text-[12px] italic text-slate-400">
                    Leave empty for manual control only. Portal will auto-close
                    on this date.
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-4 mt-4">
                  <h3 className="text-sm font-bold text-slate-700 mb-4">Office Hours</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="office-open-time" className="block text-xs font-semibold text-slate-600">
                        Opening Time
                      </label>
                      <div className="group relative self-stretch w-full overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition-colors duration-200 focus-within:border-[#3b66f5] focus-within:ring-4 focus-within:ring-[#3b66f51a] hover:border-slate-400">
                        <input
                          id="office-open-time"
                          type="time"
                          value={officeHoursOpenTime}
                          onChange={(e) => setOfficeHoursOpenTime(e.target.value)}
                          className="relative w-full border-0 bg-transparent px-4 py-3 text-sm font-['Inter-Regular',Helvetica] text-slate-900 outline-none transition-colors duration-200 placeholder:text-slate-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="office-close-time" className="block text-xs font-semibold text-slate-600">
                        Closing Time
                      </label>
                      <div className="group relative self-stretch w-full overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition-colors duration-200 focus-within:border-[#3b66f5] focus-within:ring-4 focus-within:ring-[#3b66f51a] hover:border-slate-400">
                        <input
                          id="office-close-time"
                          type="time"
                          value={officeHoursCloseTime}
                          onChange={(e) => setOfficeHoursCloseTime(e.target.value)}
                          className="relative w-full border-0 bg-transparent px-4 py-3 text-sm font-['Inter-Regular',Helvetica] text-slate-900 outline-none transition-colors duration-200 placeholder:text-slate-100"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <label htmlFor="office-closed-days" className="block text-xs font-semibold text-slate-600">
                      Closed Days (comma-separated, e.g., &quot;Fri,Sat,Sun&quot;)
                    </label>
                    <input
                      id="office-closed-days"
                      type="text"
                      value={officeHoursClosedDays}
                      onChange={(e) => setOfficeHoursClosedDays(e.target.value)}
                      placeholder="e.g., Fri,Sat,Sun"
                      className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0038a8] placeholder:text-slate-600"
                    />
                    <p className="text-[12px] text-slate-400">
                      Specify the days when the office is closed
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSaving || !hasChanges}
                aria-label="Update portal settings"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0038a8] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition disabled:opacity-50 hover:bg-[#002f8c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038a8]"
              >
                <Save className="h-4 w-4" />

                <span>{isSaving ? "Saving..." : "Update Portal Settings"}</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Saving Modal */}
      <ProcessingLoaderOverlay open={isSaving} title="Saving" />
    </section>
  );
};
