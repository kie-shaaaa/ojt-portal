"use client";

import { ApplicationForm } from "../../../components/layout/apply/ApplicationForm";
import { useApplicationChecker } from "@/hooks/useApplicationChecker";
import { JSX, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";

export const ApplyPage = (): JSX.Element => {
  const router = useRouter();
  const { isAllowed, loading } = useApplicationChecker();

  useEffect(() => {
    if (!loading && !isAllowed) {
    }
  }, [loading, isAllowed, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-sky-600" />
          <p className="text-sm text-gray-500">
            Checking application portal...
          </p>
        </div>
      </div>
    );
  }

  // CLOSED MODAL (WHITE BG)
  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl p-6">
          <div className="flex items-center gap-2 text-red-600 mb-3">
            <XCircle className="w-6 h-6" />
            <h2 className="text-lg font-bold">Application Portal Closed</h2>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            The application portal is currently not accepting submissions.
            Please check back later when applications reopen.
          </p>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <ApplicationForm />;
};

export default ApplyPage;
