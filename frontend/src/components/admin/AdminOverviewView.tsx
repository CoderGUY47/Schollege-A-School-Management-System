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

      {/* SECTION 2: FINANCIAL TREND & EARNINGS ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminFinancialTrend financialTrendData={monthlyTrends} />
        </div>
        <div className="lg:col-span-1">
          <AdminEarningsAnalytics financialTrendData={monthlyTrends} />
        </div>
      </div>

      {/* SECTION 3: SYSTEM SERVICE HUBS */}
      <AdminServiceHubs />
    </div>
  );
}
