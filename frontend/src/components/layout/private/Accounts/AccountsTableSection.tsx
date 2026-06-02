"use client";

import type { AccountRow } from "@/app/(private)/accounts/page";
import { JSX, useId, useState } from "react";
import { KeyRound, Search, SquarePen, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { EditAccountModal } from "../modals/EditAccountModal";
import { ResetPasswordModal } from "../modals/ResetPasswordModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import { CreateAccountModal } from "../modals/CreateAccountModal";
import { apiCall } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const columns = [
  { key: "id", label: "ID" },
  { key: "username", label: "USERNAME" },
  { key: "email", label: "EMAIL" },
  { key: "accountType", label: "ACCOUNT TYPE" },
  { key: "dateCreated", label: "DATE CREATED" },
  { key: "actions", label: "ACTIONS" },
];

interface StoredUser {
  id: number;
  email: string;
  account_type: string;
}

interface AccountsTableSectionProps {
  accounts: AccountRow[];
  onAccountsChange: (accounts: AccountRow[]) => void;
  user?: StoredUser;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const AccountsTableSection = ({
  accounts,
  onAccountsChange,
  user,
  searchTerm,
  onSearchChange,
}: AccountsTableSectionProps): JSX.Element => {
  const { logout } = useAuth();
  const router = useRouter();
  const searchInputId = useId();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountRow | null>(
    null,
  );

  const handleEditClick = (account: AccountRow) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  const handleResetClick = (account: AccountRow) => {
    setSelectedAccount(account);
    setIsResetModalOpen(true);
  };

  const handleDeleteClick = (account: AccountRow) => {
    setSelectedAccount(account);
    setIsDeleteModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAccount(null);
  };

  const handleCloseResetModal = () => {
    setIsResetModalOpen(false);
    setSelectedAccount(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedAccount(null);
  };

  const handleUpdateAccount = async (updatedAccount: AccountRow) => {
    try {
      const result = await apiCall("/accounts/update", {
        method: "PATCH",
        body: JSON.stringify({
          id: updatedAccount.id,
          newUser: updatedAccount.username,
          newType: updatedAccount.account_type,
        }),
      });

      if (!result.ok) {
        throw new Error("Updating account data failed");
      }

      if (updatedAccount.id === user?.id) {
        window.location.reload();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error updating account information";
      console.error(errorMessage, error);
      toast.error(errorMessage);
    }

    onAccountsChange(
      accounts.map((account) =>
        account.id === updatedAccount.id ? updatedAccount : account,
      ),
    );
  };

  const handleConfirmDelete = async () => {
    if (!selectedAccount) return;
    try {
      const result = await apiCall("/accounts/disable", {
        method: "PATCH",
        body: JSON.stringify({ id: selectedAccount.id }),
      });

      if (!result.ok) {
        setIsDeleteModalOpen(false);
        throw new Error("Updating account data failed");
      }

      if (selectedAccount.id === user?.id) {
        await logout();
        router.push("/");
      }

      setIsDeleteModalOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error deleting account";
      console.error(errorMessage, error);
      toast.error(errorMessage);
    }

    onAccountsChange(
      accounts.filter((account) => account.id !== selectedAccount.id),
    );
    setIsDeleteModalOpen(false);
    setSelectedAccount(null);
  };

  const handlePasswordReset = async (newPassword: string) => {
    if (!selectedAccount) return;
    try {
      const result = await apiCall("/accounts/reset-password", {
        method: "POST",
        body: JSON.stringify({
          id: selectedAccount.id,
          newPassword: newPassword,
        }),
      });

      if (!result.ok) {
        throw new Error("Updating account data failed");
      }

      ("Successfully reset password");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error resetting password";
      console.error(errorMessage, error);
      toast.error(errorMessage);
    }

    setIsResetModalOpen(false);
    setSelectedAccount(null);
  };

  const handleCreateClick = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const handleAccountCreated = async (
    newAccount: AccountRow & { password: string },
  ) => {
    try {
      const result = await apiCall("/accounts/create", {
        method: "POST",
        body: JSON.stringify({ newAccount }),
      });

      if (!result.ok) {
        throw new Error("Creating account failed");
      }

      ("Successfully created account");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error creating account";
      console.error(errorMessage, error);
      toast.error(errorMessage);
    }

    onAccountsChange([newAccount, ...accounts].sort((a, b) => a.id - b.id));
  };

  const nextId =
    accounts.length > 0 ? Math.max(...accounts.map((a) => a.id)) + 1 : 1;

  return (
    <>
      <section className="flex flex-col items-start pt-2 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-xl overflow-hidden border border-solid border-gray-100 shadow-sm">
        <div className="flex items-start justify-between gap-4 p-6 relative self-stretch w-full flex-[0_0_auto] max-[767px]:flex-col max-[767px]:items-start">
          <div className="flex items-center gap-3">
            <h2 className="m-0 font-bold text-gray-700 text-lg">
              Admin &amp; Employee Accounts
            </h2>
            <p className="text-sm text-gray-400">
              ({accounts.length} of {accounts.length})
            </p>
          </div>

          <div className="ml-auto flex items-center gap-4 max-[767px]:ml-0 max-[767px]:w-full max-[767px]:flex-col max-[767px]:items-stretch">
            <div className="relative w-full sm:w-md lg:w-136">
              <Search
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <label htmlFor={searchInputId} className="sr-only">
                Search by username or email
              </label>

              <input
                id={searchInputId}
                type="search"
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search by username or email..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-slate-300 focus:ring-0"
              />
            </div>

            {user?.account_type == "admin" && (
              <button
                type="button"
                onClick={handleCreateClick}
                aria-label="Create account"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0033a0] text-white rounded-lg hover:bg-[#002a80] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0033a0]"
              >
                <UserPlus className="w-4 h-4 text-white" aria-hidden="true" />
                <span className="text-sm font-semibold">Create Account</span>
              </button>
            )}
          </div>
        </div>

        <div className="px-6 pb-6 w-full">
          <div className="relative min-h-[320px] overflow-x-auto w-full">
            <table className="w-full min-w-[920px] border-collapse text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {columns
                    .filter(
                      (col) =>
                        user?.account_type == "admin" || col.key !== "actions",
                    )
                    .map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className={`px-6 py-4 text-sm font-semibold text-slate-700 ${column.key === "actions" ? "text-right" : ""}`}
                        style={{
                          width:
                            column.key === "id"
                              ? "6%"
                              : column.key === "username"
                                ? "24%"
                                : column.key === "email"
                                  ? "30%"
                                  : column.key === "accountType"
                                    ? "14%"
                                    : column.key === "dateCreated"
                                      ? "16%"
                                      : "10%",
                        }}
                      >
                        {column.label}
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody className="bg-white">
                {accounts.length === 0 && (
                  <tr>
                    <td
                      colSpan={user?.account_type == "admin" ? 6 : 5}
                      className="px-6 py-14 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                          <Search size={32} />
                        </div>

                        <h3 className="text-lg font-bold text-slate-800">
                          No accounts found
                        </h3>

                        <p className="max-w-xs text-sm text-slate-500">
                          We couldn&apos;t find any accounts matching your
                          current search.
                        </p>

                        <button
                          onClick={() => onSearchChange("")}
                          className="mt-4 text-sm font-bold text-blue-600 hover:underline"
                          type="button"
                        >
                          Clear search
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {accounts.map((account) => {
                  const accountIsAdmin = account.account_type === "admin";

                  return (
                    <tr
                      key={account.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {account.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-800">
                        {account.username}
                        {account.isCurrentUser && (
                          <span className="ml-2 text-xs text-[#0b5cff]">
                            You
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {account.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: accountIsAdmin
                              ? "#e0e7ff"
                              : "#DCFCE7",
                            color: accountIsAdmin ? "#4338ca" : "#15803D",
                          }}
                        >
                          {account.account_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(account.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </td>

                      {user?.account_type == "admin" && (
                        <td className="px-6 py-4 text-sm text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleEditClick(account)}
                              aria-label={`Edit ${account.username}`}
                              className="rounded-md bg-amber-50 p-2 text-[#CA8A04] transition hover:bg-amber-100"
                              title="Edit Account"
                            >
                              <SquarePen className="w-4.5 h-4.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleResetClick(account)}
                              aria-label={`Reset password for ${account.username}`}
                              className="rounded-md bg-blue-50 p-2 text-blue-500 transition hover:bg-blue-100"
                              title="Reset Password"
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(account)}
                              aria-label={`Delete ${account.username}`}
                              className="rounded-md bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                              title="Delete Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {isEditModalOpen && selectedAccount && (
        <EditAccountModal
          account={selectedAccount}
          onClose={handleCloseEditModal}
          onUpdate={handleUpdateAccount}
        />
      )}
      {isResetModalOpen && selectedAccount && (
        <ResetPasswordModal
          account={selectedAccount}
          onReset={handlePasswordReset}
          onClose={handleCloseResetModal}
        />
      )}
      <ConfirmDeleteModal
        open={isDeleteModalOpen && selectedAccount !== null}
        title="Delete account"
        message={`Are you sure you want to delete ${selectedAccount?.username}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteModal}
      />
      <CreateAccountModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onCreate={handleAccountCreated}
        nextId={nextId}
      />
    </>
  );
};
