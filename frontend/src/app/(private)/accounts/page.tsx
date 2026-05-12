"use client";
import { AccountsFilterSection } from "../../../components/layout/private/Accounts/AccountsFilterSection";
import { AccountsHeaderSection } from "../../../components/layout/private/Accounts/HeaderSection";
import { AccountsStatsSection } from "../../../components/layout/private/Accounts/AccountsStatsSection";
import { AccountsTableSection } from "../../../components/layout/private/Accounts/AccountsTableSection";
import { JSX, useState, useMemo, useEffect } from "react";
import { apiCall } from "@/lib/api";

export type AccountRow = {
  id: number;
  username: string;
  email: string;
  account_type: "Admin" | "Employee";
  created_at: string;
  isCurrentUser?: boolean;
};

type AccountsResponse = {
  status: string;
  ok: boolean;
  message: string;
  data: AccountRow[];
};

export const MainContentArea = (): JSX.Element => {
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    accountType: "all",
    sortByDate: "newest",
  });

  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);

        const result: AccountsResponse = await apiCall(`/accounts/active`, {
          method: "GET",
        });

        setAccounts(result.data);
      } catch (err) {
        console.error("Error fetching accounts:", err);
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []); // fetch once on mount — all filtering is client-side

  const filteredAccounts = useMemo(() => {
    console.log("[Filter Change]", {
      accountType: filters.accountType,
      sortByDate: filters.sortByDate,
      searchTerm,
      totalAccounts: accounts.length,
    });

    let result = [...accounts];

    if (searchTerm.trim() !== "") {
      result = result.filter(
        (account) =>
          account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filters.accountType.toLowerCase() !== "all") {
      result = result.filter(
        (account) =>
          account.account_type.toLowerCase() ===
          filters.accountType.toLowerCase(),
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return filters.sortByDate === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [accounts, filters, searchTerm]);

  // Lifted mutation handler — keeps accounts state as single source of truth
  const handleAccountsChange = (updated: AccountRow[]) => {
    setAccounts(updated);
  };

  return (
    <main
      className="relative flex flex-col items-start gap-6 p-8"
      aria-label="Accounts main content"
    >
      <AccountsHeaderSection
        searchTerm={searchTerm}
        onSearchChange={(value: string) => setSearchTerm(value)}
      />

      <AccountsStatsSection accounts={accounts} />

      <AccountsFilterSection filters={filters} onFilterChange={setFilters} />

      {loading ? (
        <p className="text-sm text-gray-500">Loading accounts...</p>
      ) : (
        <AccountsTableSection
          accounts={filteredAccounts}
          onAccountsChange={handleAccountsChange}
        />
      )}
    </main>
  );
};

export default MainContentArea;