"use client";

import type { FormEvent, JSX } from "react";
import { useId, useMemo, useState } from "react";
import { X, Check, ChevronDown, UserPlus, ShieldCheck } from "lucide-react";
import type { AccountRow } from "../../../app/(private)/accounts/page";

type AccountTypeOption = {
  value: string;
  label: string;
};

interface CreateAccountModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (newAccount: AccountRow) => void;
  nextId: number;
}

export const CreateAccountModal = ({
  open,
  onClose,
  onCreate,
  nextId,
}: CreateAccountModalProps): JSX.Element | null => {
  const formId = useId();

  const usernameId = `${formId}-username`;
  const emailId = `${formId}-email`;
  const passwordId = `${formId}-password`;
  const confirmPasswordId = `${formId}-confirm-password`;
  const accountTypeId = `${formId}-account-type`;
  const passwordRequirementsId = `${formId}-password-requirements`;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "Admin",
  });

  const accountTypes: AccountTypeOption[] = [
    { value: "admin", label: "Admin" },
    { value: "employee", label: "Employee" },
  ];

  const passwordRequirements = useMemo(
    () => [
      {
        id: "length",
        label: "8+ characters",
        met: formData.password.length >= 8,
      },
      {
        id: "uppercase",
        label: "Uppercase (A-Z)",
        met: /[A-Z]/.test(formData.password),
      },
      {
        id: "number",
        label: "Number (0-9)",
        met: /\d/.test(formData.password),
      },
      {
        id: "match",
        label: "Passwords match",
        met:
          formData.confirmPassword.length > 0 &&
          formData.password === formData.confirmPassword,
      },
    ],
    [formData.password, formData.confirmPassword],
  );

  const isFormValid =
    passwordRequirements.every((req) => req.met) &&
    formData.username.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.accountType !== "";

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) return;

    const newAccount: AccountRow = {
      id: nextId,
      username: formData.username,
      email: formData.email,
      account_type: formData.accountType as "admin" | "employee",
      created_at: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    onCreate(newAccount);
    handleCancel();
  };

  const handleCancel = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountType: "admin",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={handleCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-title`}
        className="fixed top-1/2 left-1/2 z-50 w-[550px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white shadow-xl"
      >
        {/* Header */}
        <header className="relative flex w-full items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <ShieldCheck className="h-5 w-5 text-[#003eb3]" />
            </div>

            <h1
              id={`${formId}-title`}
              className="text-xl font-bold leading-7 tracking-[-0.5px] text-[#003eb3]"
            >
              Create New Account
            </h1>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            aria-label="Close dialog"
            className="rounded-md p-2 transition hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
          <div className="flex w-full flex-col items-start gap-5 px-6 py-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Username */}
            <div className="flex w-full flex-col items-start gap-1.5">
              <label
                htmlFor={usernameId}
                className="text-sm font-bold leading-5 text-gray-700"
              >
                Username *
              </label>

              <div className="flex w-full items-start justify-center overflow-hidden rounded-md border border-gray-300 bg-white px-4 pb-3 pt-[13px]">
                <input
                  id={usernameId}
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  className="grow border-none bg-transparent px-0 pb-0.5 pt-px text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex w-full flex-col items-start gap-1.5">
              <label
                htmlFor={emailId}
                className="text-sm font-bold leading-5 text-gray-700"
              >
                Email *
              </label>

              <div className="flex w-full items-start justify-center overflow-hidden rounded-md border border-gray-300 bg-white px-4 pb-3 pt-[13px]">
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="grow border-none bg-transparent px-0 pb-0.5 pt-px text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex w-full flex-col items-start gap-1.5">
              <label
                htmlFor={passwordId}
                className="text-sm font-bold leading-5 text-gray-700"
              >
                Password *
              </label>

              <div className="flex w-full items-start justify-center overflow-hidden rounded-md border border-gray-300 bg-white px-4 pb-3 pt-[13px]">
                <input
                  id={passwordId}
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  aria-describedby={passwordRequirementsId}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="grow border-none bg-transparent px-0 pb-0.5 pt-px text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Requirements */}
            <div
              id={passwordRequirementsId}
              aria-live="polite"
              className="grid h-fit grid-cols-2 grid-rows-[16px_16px] gap-y-[10px] rounded-lg border bg-gray-50 p-4"
            >
              {passwordRequirements.map((requirement, index) => {
                const cellClassNames = [
                  "relative flex h-4 w-full items-center gap-2",
                  index === 0 ? "col-[1_/_2] row-[1_/_2]" : "",
                  index === 1 ? "col-[2_/_3] row-[1_/_2]" : "",
                  index === 2 ? "col-[1_/_2] row-[2_/_3]" : "",
                  index === 3 ? "col-[2_/_3] row-[2_/_3]" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div key={requirement.id} className={cellClassNames}>
                    <Check
                      className={`h-3 w-3 ${
                        requirement.met ? "text-green-500" : "text-gray-400"
                      }`}
                    />

                    <span
                      className={`text-xs leading-4 ${
                        requirement.met ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {requirement.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Confirm Password */}
            <div className="flex w-full flex-col items-start gap-1.5">
              <label
                htmlFor={confirmPasswordId}
                className="text-sm font-bold leading-5 text-gray-700"
              >
                Confirm Password *
              </label>

              <div className="flex w-full items-start justify-center overflow-hidden rounded-md border border-gray-300 bg-white px-4 pb-3 pt-[13px]">
                <input
                  id={confirmPasswordId}
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="grow border-none bg-transparent px-0 pb-0.5 pt-px text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Account Type */}
            <div className="flex w-full flex-col items-start gap-1.5">
              <label
                htmlFor={accountTypeId}
                className="text-sm font-bold leading-5 text-gray-700"
              >
                Account Type *
              </label>

              <div className="relative flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2.5">
                <select
                  id={accountTypeId}
                  name="accountType"
                  required
                  value={formData.accountType}
                  onChange={handleChange}
                  className="z-10 flex-1 grow appearance-none bg-transparent pr-8 pb-0.5 pt-px text-base leading-6 text-gray-600 focus:outline-none"
                >
                  {accountTypes.map((option) => (
                    <option
                      key={option.value || "placeholder"}
                      value={option.value}
                      disabled={option.value === ""}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative flex w-full items-start justify-end gap-3 border-t border-gray-100 bg-[#f9fafb80] px-8 py-5">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isFormValid}
              className="inline-flex items-center gap-2 rounded-lg bg-[#003eb3] px-6 py-[9px] text-sm font-bold text-white transition hover:bg-[#003299] disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              <UserPlus className="h-4 w-4" />
              Create Account
            </button>
          </div>
        </form>
      </section>
    </>
  );
};
