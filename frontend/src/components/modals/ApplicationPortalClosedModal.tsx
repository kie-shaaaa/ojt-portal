"use client";

import Image from "next/image";
import { JSX } from "react";
import { Lock, X } from "lucide-react";

interface ApplicationPortalClosedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationPortalClosedModal = ({
  isOpen,
  onClose,
}: ApplicationPortalClosedModalProps): JSX.Element | null => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-4 backdrop-blur-md sm:items-center sm:py-6">
      <div className="relative w-full max-w-md max-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl bg-white shadow-lg">
        {/* Red Header Section */}
        <div className="flex flex-col items-center bg-gradient-to-r from-red-500 to-red-600 px-6 py-6 text-white sm:px-8 sm:py-8">
          <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-full">
            <Image
              src="/ntc-logo.png"
              alt="National Telecommunications Commission logo"
              fill
              className="object-cover"
            />
          </div>

          <h2 className="text-center text-2xl font-bold">
            Application Portal Closed
          </h2>

          <p className="mt-2 text-center text-sm text-red-100">
            Submissions are not being accepted at this time
          </p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white text-red-500 transition-colors hover:bg-gray-100"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* White Content Section */}
        <div className="px-6 py-6 text-center sm:px-8">
          <p className="text-sm leading-6 text-gray-700">
            We&apos;re currently not accepting new applications. The portal is
            temporarily closed for submissions. Please check back later for
            updates.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-lg bg-red-500 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
