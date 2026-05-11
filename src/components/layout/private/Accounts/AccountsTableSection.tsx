import { AccountRow } from "../../../../app/(private)/accounts/page";
import { JSX, useState } from "react";
import {
  UserPlus,
  KeyRound,
  SquarePen,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { EditAccountModal } from "../EditAccountModal";

// Using lucide icons for row actions and buttons

const columns = [
  { key: "id", label: "ID", width: "w-[68.98px]", align: "items-start" },
  {
    key: "username",
    label: "USERNAME",
    width: "w-[149.08px]",
    align: "items-start",
  },
  { key: "email", label: "EMAIL", width: "w-[239.05px]", align: "items-start" },
  {
    key: "accountType",
    label: "ACCOUNT TYPE",
    width: "w-[170.5px]",
    align: "items-start",
  },
  {
    key: "dateCreated",
    label: "DATE CREATED",
    width: "w-[163.66px]",
    align: "items-start",
  },
  {
    key: "actions",
    label: "ACTIONS",
    width: "w-[166.73px]",
    align: "items-center",
  },
];

interface AccountsTableSectionProps {
  accounts: AccountRow[];
}

export const AccountsTableSection = ({
  accounts: initialAccounts,
}: AccountsTableSectionProps): JSX.Element => {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountRow | null>(
    null,
  );

  const handleEditClick = (account: AccountRow) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
  };

  const handleUpdateAccount = (updatedAccount: AccountRow) => {
    setAccounts(
      accounts.map((account) =>
        account.id === updatedAccount.id ? updatedAccount : account,
      ),
    );
  };
  return (
    <>
      <section className="flex flex-col items-start pt-2 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-xl overflow-hidden border border-solid border-gray-100 shadow-sm">
        <div className="flex items-start justify-between p-6 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center gap-3">
            <h2 className="m-0 font-bold text-gray-700 text-lg">
              Admin &amp; Employee Accounts
            </h2>
            <p className="text-sm text-gray-400">
              ({accounts.length} of {accounts.length})
            </p>
          </div>
          <button
            type="button"
            aria-label="Create account"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0033a0] text-white rounded-lg hover:bg-[#002a80] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0033a0]"
          >
            <UserPlus className="w-4 h-4 text-white" aria-hidden="true" />
            <span className="text-sm font-semibold">Create Account</span>
          </button>
        </div>

        <div className="px-6 pb-6 w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left table-fixed">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {columns.map((column) => (
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
                {accounts.map((account) => {
                  const isAdmin = account.accountType === "Admin";

                  return (
                    <tr
                      key={account.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {account.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-800">
                        {account.username}{" "}
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
                            backgroundColor: isAdmin ? "#e0e7ff" : "#DCFCE7",
                            color: isAdmin ? "#4338ca" : "#15803D",
                          }}
                        >
                          {account.accountType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {account.dateCreated}
                      </td>
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
                            aria-label={`View ${account.username}`}
                            className="rounded-md bg-blue-50 p-2 text-blue-500 transition hover:bg-blue-100"
                            title="Reset Password"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                          <button
                            aria-label={`Delete ${account.username}`}
                            className="rounded-md bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                            title="Delete Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {isModalOpen && selectedAccount && (
        <EditAccountModal
          account={selectedAccount}
          onClose={handleCloseModal}
          onUpdate={handleUpdateAccount}
        />
      )}
    </>
  );
};
