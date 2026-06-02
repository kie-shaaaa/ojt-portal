"use client";
import { JSX } from "react";

interface ConfirmDeleteModalProps {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({
  open,
  title = "Confirm delete",
  message = "Are you sure you want to continue?",
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps): JSX.Element | null {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={onCancel}
        aria-hidden
      />

      <div className="z-10 w-full max-w-md max-h-[calc(100vh-1.5rem)] overflow-y-auto rounded-lg bg-white p-4 shadow-lg sm:p-6">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{message}</p>

        <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-100 text-slate-800 rounded-md hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
