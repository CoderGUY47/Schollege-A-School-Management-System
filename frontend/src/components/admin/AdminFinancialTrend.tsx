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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT 8 COLS: FINANCIAL OVERVIEW GRAPH */}
      <div className="lg:col-span-8">
        <FinancialOverviewChart
          financialTrendData={financialTrendData}
          financialSummary={financialSummary}
        />
      </div>

      {/* RIGHT 4 COLS: COMPACT MONTH CALENDAR */}
      <div className="lg:col-span-4">
        <CompactMonthCalendar />
      </div>
    </div>
  );
}
