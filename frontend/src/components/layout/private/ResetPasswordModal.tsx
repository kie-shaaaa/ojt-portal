"use client";

import type { AccountRow } from "../../../app/(private)/accounts/page";
import type { FormEvent, JSX } from "react";
import { useId, useMemo, useState } from "react";
import { Check, X, ShieldCheck, Type, Hash, Lock } from "lucide-react";

interface ResetPasswordModalProps {
  account: AccountRow;
  onClose: () => void;
}

export const ResetPasswordModal = ({
  account,
  onClose,
}: ResetPasswordModalProps): JSX.Element => {
  const [password, setPassword] = useState("");
  const passwordId = useId();

  const requirements = useMemo(
    () => [
      {
        id: "length",
        label: "8+ characters",
        icon: Lock,
        isValid: password.length >= 8,
      },
      {
        id: "uppercase",
        label: "Uppercase (A-Z)",
        icon: Type,
        isValid: /[A-Z]/.test(password),
      },
      {
        id: "number",
        label: "Number (0-9)",
        icon: Hash,
        isValid: /[0-9]/.test(password),
      },
    ],
    [password],
  );

  const isPasswordValid = requirements.every(
    (requirement) => requirement.isValid,
  );

  const handleCancel = () => {
    setPassword("");
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onClose();
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-gray-100 px-4 py-12">
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={handleCancel}
        aria-hidden="true"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-password-title"
        className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-[620px] -translate-y-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-100 px-7 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <ShieldCheck className="h-6 w-6 text-[#0038a8]" />
            </div>

            <h1
              id="reset-password-title"
              className="text-2xl font-bold text-[#0038a8]"
            >
              Reset Password
            </h1>
          </div>

          <button
            type="button"
            aria-label="Close reset password dialog"
            className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          {/* Content */}
          <div className="flex flex-col gap-6 px-10 py-8">
            <p className="text-[17px] text-gray-700">
              Reset password for:{" "}
              <span className="font-bold text-gray-900">
                {account.username}
              </span>
            </p>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor={passwordId}
                className="text-[15px] font-bold text-gray-700"
              >
                New Password
              </label>

              <div className="relative">
                <input
                  id={passwordId}
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  aria-describedby={`${passwordId}-requirements`}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-14 w-full rounded-lg border border-gray-300 px-4 pr-12 text-[15px] text-gray-900 shadow-sm outline-none transition focus:border-[#0038a8] focus:ring-4 focus:ring-blue-100"
                />

                <Lock className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Requirements */}
            <section
              id={`${passwordId}-requirements`}
              aria-label="Password requirements"
              className="rounded-xl border border-gray-200 bg-neutral-50 px-6 py-5"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {requirements.map((requirement) => {
                  const Icon = requirement.icon;

                  return (
                    <div
                      key={requirement.id}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${
                          requirement.isValid
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {requirement.isValid ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Icon className="h-3.5 w-3.5" />
                        )}
                      </div>

                      <span
                        className={`text-[15px] ${
                          requirement.isValid
                            ? "font-medium text-green-700"
                            : "text-gray-500"
                        }`}
                      >
                        {requirement.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 border-t border-gray-100 px-8 py-6">
            <button
              type="button"
              onClick={handleCancel}
              className="min-w-[120px] rounded-lg border border-gray-300 px-8 py-3 text-base font-bold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isPasswordValid}
              className="min-w-[200px] rounded-lg bg-[#0038a8] px-10 py-3 text-base font-bold text-white transition hover:bg-[#002d87] disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              Reset Password
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};
