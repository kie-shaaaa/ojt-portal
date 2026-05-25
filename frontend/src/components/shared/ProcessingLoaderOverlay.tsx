"use client";

import { JSX } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type ProcessingLoaderOverlayProps = {
  open: boolean;
  title: string;
  description?: string;
  className?: string;
  panelClassName?: string;
};

const lottieSrc =
  "https://lottie.host/199225e8-1f26-4f62-950a-41cfed998703/4esdI4dLN5.lottie";

export function ProcessingLoaderOverlay({
  open,
  title,
  description,
  className = "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm",
  panelClassName = "flex aspect-square w-64 flex-col items-center justify-center gap-4 rounded-2xl bg-blue-50/95 p-7 shadow-2xl ring-1 ring-blue-100 sm:w-72",
}: ProcessingLoaderOverlayProps): JSX.Element | null {
  if (!open) return null;

  return (
    <div className={className} aria-live="polite" aria-busy="true">
      <div className={panelClassName}>
        <div className="flex h-24 w-24 items-center justify-center">
          <DotLottieReact
            src={lottieSrc}
            loop
            autoplay
            style={{ height: "100%", width: "100%" }}
          />
        </div>

        <div className="text-center">
          <p className="text-xl font-bold tracking-wide text-slate-800">
            {title}
          </p>
          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProcessingLoaderOverlay;