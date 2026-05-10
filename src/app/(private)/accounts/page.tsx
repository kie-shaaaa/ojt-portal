"use client";
import { AccountsFilterSection } from "../../../components/layout/private/Accounts/AccountsFilterSection";
import { AccountsHeaderSection } from "../../../components/layout/private/Accounts/HeaderSection";
import { AccountsStatsSection } from "../../../components/layout/private/Accounts/AccountsStatsSection";
import { AccountsTableSection } from "../../../components/layout/private/Accounts/AccountsTableSection";
import { JSX, useState, useMemo } from "react";

export type AccountRow = {
  id: number;
  username: string;
  email: string;
  accountType: "Admin" | "Employee";
  dateCreated: string;
  isCurrentUser?: boolean;
};

const mockAccounts: AccountRow[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@ntc.gov.ph",
    accountType: "Admin",
    dateCreated: "May 4, 2026",
    isCurrentUser: true,
  },
  {
    id: 2,
    username: "adminhr",
    email: "adminhr@gmail.com",
    accountType: "Admin",
    dateCreated: "May 4, 2026",
  },
  {
    id: 3,
    username: "hr_employee",
    email: "hr.employee@ntc.gov.ph",
    accountType: "Employee",
    dateCreated: "May 4, 2026",
  },
];

export const MainContentArea = (): JSX.Element => {
  const [filters, setFilters] = useState({
    accountType: "all",
    sortByDate: "newest",
  });

  // Filter and sort accounts based on filter values
  const filteredAccounts = useMemo(() => {
    let result = [...mockAccounts];

    // Filter by account type
    if (filters.accountType !== "all") {
      result = result.filter(
        (account) => account.accountType.toLowerCase() === filters.accountType
      );
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.dateCreated).getTime();
      const dateB = new Date(b.dateCreated).getTime();
      return filters.sortByDate === "newest" 
        ? dateB - dateA 
        : dateA - dateB;
    });

    return result;
  }, [filters]);

  return (
    <main
      className="relative flex flex-col items-start gap-6 p-8"
      aria-label="Accounts main content"
    >
      <AccountsHeaderSection />
      <AccountsStatsSection accounts={mockAccounts} />
      <AccountsFilterSection 
        filters={filters}
        onFilterChange={setFilters}
      />
      <AccountsTableSection accounts={filteredAccounts} />
    </main>
  );
};

export default MainContentArea;