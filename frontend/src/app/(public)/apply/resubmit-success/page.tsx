"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Home, Mail } from "lucide-react";
import { JSX } from "react";

function ResubmitSuccessPage(): JSX.Element {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(0,56,168,0.18),transparent_38%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] px-4 py-8 text-slate-900 md:px-6 md:py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <section className="overflow-hidden rounded-3xl border border-white/60 bg-white shadow-[0_28px_70px_-24px_rgba(15,23,42,0.35)]">
          <div className="flex flex-col items-center justify-center gap-6 px-6 py-16 text-center md:px-10 md:py-24">
            <div className="rounded-full bg-emerald-100 p-6 ring-1 ring-emerald-200">
              <CheckCircle className="h-12 w-12 text-emerald-600" />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Resubmission Successful
              </h1>
              <p className="max-w-md text-base leading-7 text-slate-600">
                Your application has been successfully resubmitted with the
                requested documents.
              </p>
            </div>

            <div className="w-full space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-blue-50 p-2 text-[#0038A8] ring-1 ring-blue-100">
                  <Mail size={18} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900">What's next?</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    <li>• The admin will review your resubmitted documents</li>
                    <li>• We'll notify you via email of any updates</li>
                    <li>• Check your application status in the portal</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0038A8] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:bg-[#002d87]"
              >
                <Home size={16} />
                Return Home
              </button>
              <button
                type="button"
                onClick={() => router.push("/applications")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                View Applications
              </button>
            </div>
          </div>
        </section>

        <div className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-sm text-slate-600 shadow-sm backdrop-blur">
          <p>
            If you have any questions about your application, please contact us
            through the portal or check your email for further instructions.
          </p>
        </div>
      </div>
    </main>
  );
}

export default ResubmitSuccessPage;
