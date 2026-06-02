"use client";

import type { AccountRow } from "@/app/(private)/accounts/page";
import type { FormEvent, JSX } from "react";
import { useId, useState, useRef } from "react";
import { ChevronDown, Shield, X } from "lucide-react";

import {
  useEscapeKey,
  useOutsidePointerDown,
} from "@/hooks/useDismissableEvents";

type AccountType = AccountRow["account_type"];

const accountTypes = [
  { label: "Admin", value: "admin" },
  { label: "Employee", value: "employee" },
];

interface EditAccountModalProps {
  account: AccountRow;
  onClose: () => void;
  onUpdate: (updatedAccount: AccountRow) => void;
}

export const EditAccountModal = ({
  account,
  onClose,
  onUpdate,
}: EditAccountModalProps): JSX.Element => {
  const usernameId = useId();
  const accountTypeId = useId();
  const accountTypeDropdownRef = useRef<HTMLDivElement>(null);

  const [username, setUsername] = useState(account.username);
  const [account_type, setAccountType] = useState<AccountType>(
    account.account_type,
  );
  const [isAccountTypeOpen, setIsAccountTypeOpen] = useState(false);

  useEscapeKey(onClose);
  useOutsidePointerDown(
    accountTypeDropdownRef,
    () => setIsAccountTypeOpen(false),
    isAccountTypeOpen,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    onUpdate({
      ...account,
      username,
      account_type,
    });

    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 p-3 sm:p-4"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-account-title"
        className="fixed left-1/2 top-1/2 z-50 flex w-[calc(100%-1rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-white shadow-[0px_25px_50px_-12px_#00000040] sm:w-[calc(100%-2rem)]"
      >
        {/* Header */}
        <div className="relative flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
          <div className="inline-flex items-center gap-3">
            <div
              className="inline-flex items-center justify-center"
              aria-hidden="true"
            >
              <Shield className="h-5 w-5 text-[#0038A8]" />
            </div>

            <div className="inline-flex flex-col items-start">
              <h1
                id="edit-account-title"
                className="text-lg font-semibold leading-7 text-[#0038A8]"
              >
                Edit Account
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit account dialog"
            className="inline-flex items-center justify-center rounded-md p-1 transition hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form className="flex w-full flex-col gap-5 p-4 sm:gap-6 sm:p-8" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor={usernameId}
              className="text-sm font-medium leading-5 text-gray-700"
            >
              Username
            </label>

            <div className="flex w-full items-center rounded-lg border border-gray-300 bg-white px-4 py-3 focus-within:border-[#0038A8] focus-within:ring-2 focus-within:ring-[#0038A8]/20 transition">
              <input
                id={usernameId}
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full bg-transparent text-base font-normal leading-6 text-gray-700 outline-none"
              />
            </div>
          </div>

          {/* Account Type */}
          <div className="flex w-full flex-col gap-2" ref={accountTypeDropdownRef}>
            <label
              htmlFor={accountTypeId}
              className="text-sm font-medium leading-5 text-gray-700"
            >
              Account Type
            </label>

            <div className="relative w-full">
              <input
                id={accountTypeId}
                name="accountType"
                type="text"
                value={
                  accountTypes.find((type) => type.value === account_type)
                    ?.label ?? ""
                }
                readOnly
                onClick={() => setIsAccountTypeOpen((current) => !current)}
                onFocus={() => setIsAccountTypeOpen(true)}
                className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-base font-normal leading-6 text-gray-700 outline-none transition focus:border-[#0038A8] focus:ring-2 focus:ring-[#0038A8]/20"
              />

              {isAccountTypeOpen && (
                <div className="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-[0px_25px_50px_-12px_#00000040]">
                  {accountTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        setAccountType(type.value as AccountType);
                        setIsAccountTypeOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-base transition-colors hover:bg-slate-100 ${
                        account_type === type.value
                          ? "bg-slate-50 text-slate-900"
                          : "text-slate-600"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              )}

              <div
                className="pointer-events-none absolute inset-y-0 right-3 flex items-center"
                aria-hidden="true"
              >
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-[#0038A8] px-6 py-2.5 text-sm font-semibold text-white shadow-[0px_1px_2px_#0000000d] transition hover:bg-[#002d87]"
            >
              Update Account
            </button>
          </div>
        </form>

        <div className="h-4 w-full sm:h-8" />
      </section>
    </>
  );
};
