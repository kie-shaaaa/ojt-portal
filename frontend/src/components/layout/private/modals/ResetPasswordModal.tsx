"use client";

import type { AccountRow } from "@/app/(private)/accounts/page";
import type { FormEvent, JSX } from "react";
import { useId, useMemo, useState } from "react";
import { Check, X, ShieldCheck, Type, Hash, Lock, Eye, EyeOff } from "lucide-react";

interface ResetPasswordModalProps {
  account: AccountRow;
  onClose: () => void;
  onReset: (newPassword: string) => Promise<void>;
}

export const ResetPasswordModal = ({
  account,
  onClose,
  onReset,
}: ResetPasswordModalProps): JSX.Element => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    onReset(password);
  };

  return (
    <main className="relative flex min-h-screen w-full items-start justify-center bg-gray-100 px-3 py-4 sm:items-center sm:px-4 sm:py-12">
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={handleCancel}
        aria-hidden="true"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-password-title"
        className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-1rem)] max-w-[620px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl sm:w-[calc(100%-2rem)]"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:items-center sm:px-7 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <ShieldCheck className="h-6 w-6 text-[#0038a8]" />
            </div>

            <h1 id="reset-password-title" className="text-xl font-bold text-[#0038a8] sm:text-2xl">
              Reset Password
            </h1>
          </div>

          <button
            type="button"
            aria-label="Close reset password dialog"
            onClick={handleCancel}
            className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          {/* Content */}
          <div className="flex max-h-[calc(100vh-12rem)] flex-col gap-5 overflow-y-auto px-4 py-5 sm:px-10 sm:py-8">
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
                <style>{`
                  #\\:r1\\: /* Fallback since ID might have colons */,
                  [id="${passwordId}"]::-ms-reveal,
                  [id="${passwordId}"]::-ms-clear {
                    display: none;
                  }
                `}</style>
                <input
                  id={passwordId}
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  aria-describedby={`${passwordId}-requirements`}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-14 w-full rounded-lg border border-gray-300 px-4 pr-12 text-[15px] text-gray-900 shadow-sm outline-none transition focus:border-[#0038a8] focus:ring-4 focus:ring-blue-100"
                />

                <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0038a8]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <section
              id={`${passwordId}-requirements`}
              aria-label="Password requirements"
              className="rounded-xl border border-gray-200 bg-neutral-50 px-4 py-4 sm:px-6 sm:py-5"
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
                        className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-300 ${
                          requirement.isValid
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {requirement.isValid ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Icon className="h-3.5 w-3.5" />
                        )}
                      </div>

                      <span
                        className={`text-[15px] transition-colors duration-300 ${
                          requirement.isValid
                            ? "font-medium text-green-600"
                            : "text-red-600"
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
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-8 sm:py-6">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full rounded-lg border border-gray-300 px-6 py-3 text-base font-bold text-gray-700 transition hover:bg-gray-50 sm:w-auto sm:min-w-[120px] sm:px-8"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isPasswordValid}
              className="w-full rounded-lg bg-[#0038a8] px-6 py-3 text-base font-bold text-white transition hover:bg-[#002d87] disabled:cursor-not-allowed disabled:bg-blue-300 sm:w-auto sm:min-w-[200px] sm:px-10"
            >
              Reset Password
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};
