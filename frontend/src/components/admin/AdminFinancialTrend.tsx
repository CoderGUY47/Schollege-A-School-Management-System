"use client";

import React from "react";
import { FinancialOverviewChart } from "./financial/FinancialOverviewChart";
import { CompactMonthCalendar } from "./financial/CompactMonthCalendar";

export interface AdminFinancialTrendProps {
  financialTrendData?: any[];
  financialSummary?: any;
  mounted?: boolean;
  currentDate?: Date;
  setCurrentDate?: (date: Date) => void;
  selectedDay?: number;
  setSelectedDay?: (day: number) => void;
  calendarGrid?: any[];
}

export default function AdminFinancialTrend({
  financialTrendData,
  financialSummary,
}: AdminFinancialTrendProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* LEFT 9 COLS: FINANCIAL OVERVIEW GRAPH */}
      <FinancialOverviewChart
        financialTrendData={financialTrendData}
        financialSummary={financialSummary}
      />

      {/* RIGHT 3 COLS: COMPACT MONTH CALENDAR */}
      <CompactMonthCalendar />
    </div>
  );
}
