"use client";

import React from "react";
import AdminRoleCards from "@/components/admin/AdminRoleCards";
import AdminServiceHubs from "@/components/admin/AdminServiceHubs";
import AdminFinancialTrend from "@/components/admin/AdminFinancialTrend";
import AdminEarningsAnalytics from "@/components/admin/AdminEarningsAnalytics";

interface AdminOverviewViewProps {
  users: any[];
  classes: any[];
  subjects: any[];
  monthlyTrends: any[];
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}

export default function AdminOverviewView({
  users,
  classes,
  subjects,
  monthlyTrends,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}: AdminOverviewViewProps) {
  return (
    <div className="space-y-8">
      {/* SECTION 1: ROLE METRICS & QUICK SUMMARY */}
      <AdminRoleCards />

      {/* SECTION 2: FINANCIAL OVERVIEW GRAPH & ACADEMIC CALENDAR */}
      <AdminFinancialTrend financialTrendData={monthlyTrends} />

      {/* SECTION 3: EARNINGS ANALYTICS & MESSAGES INBOX */}
      <AdminEarningsAnalytics financialTrendData={monthlyTrends} />

      {/* SECTION 4: SYSTEM SERVICE HUBS */}
      <AdminServiceHubs />
    </div>
  );
}
