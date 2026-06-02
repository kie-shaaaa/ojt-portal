"use client";

import Image from "next/image";
import { JSX } from "react";
import { CheckCircle2, X } from "lucide-react";

interface ApplicationSubmittedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationSubmittedModal = ({
  isOpen,
  onClose,
}: ApplicationSubmittedModalProps): JSX.Element | null => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-6">
      <div className="relative w-full max-w-md max-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl bg-[#002b80] shadow-2xl">
        <div className="flex flex-col items-center bg-emerald-600 px-6 py-6 text-white sm:px-8 sm:py-8">
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
            <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
          </div>

          <h2 className="text-center text-2xl font-bold">
            Application Submitted
          </h2>

          <p className="mt-2 text-center text-sm text-white/90">
            Your submission was received successfully.
          </p>
        </div>

        <div className="px-6 py-6 text-center sm:px-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
            <Image
              src="/ntc-logo.png"
              alt="National Telecommunications Commission logo"
              width={56}
              height={56}
              className="object-cover"
            />
          </div>

          <p className="text-sm leading-6 text-blue-50/80">
            We have received your application and uploaded your documents. You
            can safely close this dialog now.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSubmittedModal;