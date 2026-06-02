"use client";

import { JSX } from "react";
import { Users, UserRoundCog, Briefcase } from "lucide-react";
import { AccountRow } from "../../../../app/(private)/accounts/page";

interface AccountsStatsSectionProps {
  accounts: AccountRow[];
}

export const AccountsStatsSection = ({ accounts }: AccountsStatsSectionProps): JSX.Element => {
  const totalAccounts = accounts.length;
  const admins = accounts.filter(acc => acc.account_type === "admin").length;
  const employees = accounts.filter(acc => acc.account_type === "employee").length;

  const stats = [
    {
      id: "total-accounts",
      value: String(totalAccounts),
      label: "Total Accounts",
      icon: (
        <Users className="w-6 h-6 text-blue-600" aria-hidden="true" />
      ),
      iconBg: "bg-blue-50",
    },
    {
      id: "admins",
      value: String(admins),
      label: "Admins",
      icon: (
        <UserRoundCog className="w-6 h-6 text-blue-600" aria-hidden="true" />
      ),
      iconBg: "bg-blue-50",
    },
    {
      id: "employees",
      value: String(employees),
      label: "Employees",
      icon: (
        <Briefcase className="w-6 h-6 text-green-600" aria-hidden="true" />
      ),
      iconBg: "bg-green-50",
    },
  ];

  return (
    <section aria-label="Account statistics" className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <article
            key={stat.id}
            className="flex items-center gap-4 p-5 sm:p-6 bg-white rounded-xl border border-solid border-gray-100 shadow-[0px_1px_2px_#0000000d]"
          >
            {/* Icon with background */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-full ${stat.iconBg} flex items-center justify-center`}>
              {stat.icon}
            </div>
            
            {/* Text Content */}
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 text-2xl leading-8">
                {stat.value}
              </span>
              <span className="font-medium text-gray-400 text-xs sm:text-sm leading-4">
                {stat.label}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};