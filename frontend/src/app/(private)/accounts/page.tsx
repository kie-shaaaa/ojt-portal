"use client";
import { AccountsFilterSection } from "../../../components/layout/private/Accounts/AccountsFilterSection";
import { AccountsHeaderSection } from "../../../components/layout/private/Accounts/HeaderSection";
import { AccountsStatsSection } from "../../../components/layout/private/Accounts/AccountsStatsSection";
import { AccountsTableSection } from "../../../components/layout/private/Accounts/AccountsTableSection";
import { JSX, useState, useMemo, useEffect } from "react";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { apiCall } from "@/lib/api";
import { fetchToken } from "@/lib/token";

export type AccountRow = {
  id: number;
  username: string;
  email: string;
  account_type: "admin" | "employee";
  created_at: string;
  isCurrentUser?: boolean;
};

type AccountsResponse = {
  status: string;
  ok: boolean;
  message: string;
  data: AccountRow[];
};

interface StoredUser {
  id: number;
  email: string;
  account_type: string;
}

export const MainContentArea = (): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<StoredUser | undefined>(
    undefined,
  );
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    accountType: "all",
    sortByDate: "newest",
  });

  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const data = fetchToken();
    if (!data?.user) {
      requestAnimationFrame(() => setCurrentUser(undefined));
      return;
    }

    try {
      // fetchToken returns user as a raw JSON string — parse it
      const parsed: StoredUser =
        typeof data.user === "string" ? JSON.parse(data.user) : data.user;
      requestAnimationFrame(() => setCurrentUser(parsed));
    } catch {
      // Ignore malformed data
      requestAnimationFrame(() => setCurrentUser(undefined));
    }
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);

        const result: AccountsResponse = await apiCall(
          `/accounts/active?count=50`,
          {
            method: "GET",
          },
        );

        setAccounts(result.data);
      } catch (err) {
        console.error("Error fetching accounts:", err);
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    if (debouncedSearch.trim() !== "") {
      result = result.filter(
        (account) =>
          account.username
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          account.email.toLowerCase().includes(debouncedSearch.toLowerCase()),
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
  }, [accounts, filters, debouncedSearch]);

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
          user={currentUser}
        />
      )}
    </main>
  );
};

export default MainContentArea;
