"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface FinancialOverviewChartProps {
  financialTrendData?: any[];
  financialSummary?: any;
}

export function FinancialOverviewChart({
  financialTrendData,
  financialSummary,
}: FinancialOverviewChartProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<"YEAR" | "MONTH" | "WEEK">("YEAR");
  const [showBaseline, setShowBaseline] = useState<boolean>(true);
  const [showValues, setShowValues] = useState<boolean>(true);
  const [darkTheme, setDarkTheme] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rawChartData =
    Array.isArray(financialTrendData) && financialTrendData.length > 0
      ? financialTrendData
      : [
          { month: "Jan", Income: 1850000, Expense: 1200000 },
          { month: "Feb", Income: 2100000, Expense: 1350000 },
          { month: "Mar", Income: 2400000, Expense: 1500000 },
          { month: "Apr", Income: 2200000, Expense: 1400000 },
          { month: "May", Income: 2650000, Expense: 1650000 },
          { month: "Jun", Income: 2800000, Expense: 1750000 },
          { month: "Jul", Income: 2500000, Expense: 1600000 },
          { month: "Aug", Income: 2900000, Expense: 1800000 },
          { month: "Sep", Income: 3100000, Expense: 1950000 },
          { month: "Oct", Income: 2950000, Expense: 1850000 },
          { month: "Nov", Income: 3200000, Expense: 2000000 },
          { month: "Dec", Income: 3450000, Expense: 2100000 },
        ];

  // Enrich data with 2025 prior year baseline for comparison
  const enrichedChartData = rawChartData.map((d, idx) => ({
    ...d,
    PriorYearIncome: d.PriorYearIncome ?? Math.round(d.Income * 0.82),
  }));

  // Filter based on selected timeframe
  const filteredData =
    timeframe === "WEEK"
      ? enrichedChartData.slice(-4)
      : timeframe === "MONTH"
        ? enrichedChartData.slice(-6)
        : enrichedChartData;

  const formatBDT = (val: number) => {
    if (val >= 10000000) return `৳${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `৳${(val / 100000).toFixed(1)}L`;
    return `৳${val.toLocaleString()}`;
  };

  // Custom Floating Value Badge Dot (Shifted dynamically at boundaries so badges never clip)
  const renderCustomDot = (props: any) => {
    const { cx, cy, value, payload, index } = props;
    if (!cx || !cy) return null;

    const rawVal = Array.isArray(value)
      ? value[1]
      : typeof value === "number"
        ? value
        : payload?.Income || 0;

    let formatted = "";
    if (rawVal >= 10000000) {
      formatted = `৳${(rawVal / 10000000).toFixed(1)}Cr`;
    } else if (rawVal >= 100000) {
      const lakhs = rawVal / 100000;
      formatted =
        lakhs % 1 === 0 ? `${lakhs.toFixed(0)}L` : `${lakhs.toFixed(1)}L`;
    } else if (rawVal >= 1000) {
      formatted = `${Math.round(rawVal / 1000)}k`;
    } else {
      formatted = `${rawVal}`;
    }

    let shiftX = 0;
    if (index === 0 || cx < 50) shiftX = 14;
    else if (index === filteredData.length - 1 || cx > 450) shiftX = -16;

    return (
      <g key={`dot-${cx}-${cy}`}>
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill="#2563EB"
          stroke="#FFFFFF"
          strokeWidth={2.5}
        />

        {showValues && (
          <g transform={`translate(${cx + shiftX}, ${cy - 22})`}>
            <rect
              x={-28}
              y={-12}
              width={56}
              height={24}
              rx={6}
              fill="#1E40AF"
              stroke="#FFFFFF"
              strokeWidth={1.5}
              className="drop-shadow-lg"
            />
            <rect
              x={-27}
              y={-11}
              width={54}
              height={22}
              rx={5}
              fill="#2563EB"
            />
            <text
              x={0}
              y={3}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize={11}
              fontWeight="900"
              letterSpacing="0.4px"
            >
              {formatted}
            </text>
          </g>
        )}
      </g>
    );
  };

  return (
    <div
      className={`lg:col-span-9 p-5 rounded-xl border-none transition-colors duration-300 space-y-4 flex flex-col justify-between min-h-[350px] shadow-md relative overflow-hidden ${
        darkTheme
          ? "bg-slate-950 text-white"
          : "bg-white text-slate-900"
      }`}
    >
      {/* Redesigned Header Bar & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black tracking-tight">
              Financial Overview
            </h3>
            <span className="text-[10px] font-extrabold bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-sm">
              500 Crore Dev Fund
            </span>
          </div>
          <p
            className={`text-[10px] font-semibold ${darkTheme ? "text-slate-400" : "text-slate-500"}`}
          >
            School & College Infrastructure Grant vs. Annual Revenue Streams
          </p>
        </div>

        {/* Unified Controls Strip */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
          <div
            className={`flex items-center p-0.5 rounded-lg border-none ${darkTheme ? "bg-slate-900" : "bg-slate-100 shadow-inner"}`}
          >
            {(["YEAR", "MONTH", "WEEK"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md transition-all ${
                  timeframe === tf
                    ? "bg-blue-600 text-white shadow-md"
                    : darkTheme
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tf === "YEAR"
                  ? "12 MONTH"
                  : tf === "MONTH"
                    ? "6 MONTH"
                    : "7 DAYS"}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowBaseline((v) => !v)}
            className={`px-2.5 py-1 rounded-lg border-none font-extrabold transition-all shadow-sm ${
              showBaseline
                ? darkTheme
                  ? "bg-slate-800 text-slate-200 shadow-md"
                  : "bg-slate-900 text-white shadow-md"
                : darkTheme
                  ? "bg-slate-900 text-slate-400"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            {showBaseline ? "✓ 2025 Prior" : "+ 2025 Prior"}
          </button>

          <button
            onClick={() => setShowValues((v) => !v)}
            className={`px-2.5 py-1 rounded-lg border-none font-extrabold transition-all shadow-sm ${
              showValues
                ? "bg-blue-600 text-white shadow-md"
                : darkTheme
                  ? "bg-slate-900 text-slate-400"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            {showValues ? "✓ Badges On" : "Badges Off"}
          </button>

          <button
            onClick={() => setDarkTheme((v) => !v)}
            className={`p-1.5 rounded-lg border-none transition-colors shadow-sm ${
              darkTheme
                ? "bg-slate-900 text-amber-400 hover:bg-slate-800"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            title="Toggle Dark Graph Mode"
          >
            {darkTheme ? (
              <i className="fi fi-rr-sun text-amber-400 text-xs" />
            ) : (
              <i className="fi fi-rr-moon text-slate-700 text-xs" />
            )}
          </button>
        </div>
      </div>

      {/* Unified 4-Metric Cards Grid (Only Icons, No Background Squares, Shadow Elevation) */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl border-none shadow-sm ${
          darkTheme
            ? "bg-slate-900/90"
            : "bg-slate-50/70"
        }`}
      >
        <div
          className={`p-2.5 rounded-lg border-none flex items-center gap-2.5 transition-all shadow-xs hover:shadow-sm ${
            darkTheme
              ? "bg-slate-950/80"
              : "bg-white shadow-sm"
          }`}
        >
          <i className="fi fi-rr-bank text-teal-600 text-base flex-shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <span
              className={`text-[8.5px] font-bold block uppercase tracking-wider ${darkTheme ? "text-teal-400" : "text-teal-700"}`}
            >
              Collect Funding
            </span>
            <span className="text-xs font-black flex items-center tracking-tight">
              <i className="fa-solid fa-bangladeshi-taka-sign text-[9px] mr-1 text-teal-500 font-bold" aria-hidden="true" />
              500 Crore
            </span>
          </div>
        </div>

        <div
          className={`p-2.5 rounded-lg border-none flex items-center gap-2.5 transition-all shadow-xs hover:shadow-sm ${
            darkTheme
              ? "bg-slate-950/80"
              : "bg-white shadow-sm"
          }`}
        >
          <i className="fi fi-rr-chart-tree text-purple-600 text-base flex-shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <span
              className={`text-[8.5px] font-bold block uppercase tracking-wider ${darkTheme ? "text-purple-400" : "text-purple-700"}`}
            >
              Expense Funding
            </span>
            <span className="text-xs font-black flex items-center tracking-tight">
              <i className="fa-solid fa-bangladeshi-taka-sign text-[9px] mr-1 text-purple-500 font-bold" aria-hidden="true" />
              340 Crore
            </span>
          </div>
        </div>

        <div
          className={`p-2.5 rounded-lg border-none flex items-center gap-2.5 transition-all shadow-xs hover:shadow-sm ${
            darkTheme
              ? "bg-slate-950/80"
              : "bg-white shadow-sm"
          }`}
        >
          <i className="fi fi-rr-stats text-blue-600 text-base flex-shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span
                className={`text-[8.5px] font-bold uppercase tracking-wider ${darkTheme ? "text-blue-400" : "text-blue-700"}`}
              >
                Peak Revenue
              </span>
              <span className="text-[8px] font-black text-emerald-600 bg-emerald-500/15 px-1.5 py-0.2 rounded-full">
                ↑ 22% YOY
              </span>
            </div>
            <span className="text-xs font-black flex items-center tracking-tight text-blue-600">
              <i className="fa-solid fa-bangladeshi-taka-sign text-[9px] mr-1 font-bold" aria-hidden="true" />
              3,45,00,000
            </span>
          </div>
        </div>

        <div
          className={`p-2.5 rounded-lg border-none flex items-center gap-2.5 transition-all shadow-xs hover:shadow-sm ${
            darkTheme
              ? "bg-slate-950/80"
              : "bg-white shadow-sm"
          }`}
        >
          <i className="fi fi-rr-wallet text-emerald-600 text-base flex-shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <span
              className={`text-[8.5px] font-bold block uppercase tracking-wider ${darkTheme ? "text-emerald-400" : "text-emerald-700"}`}
            >
              Cleared Revenue
            </span>
            <span className="text-xs font-black flex items-center tracking-tight text-emerald-600">
              <i className="fa-solid fa-bangladeshi-taka-sign text-[9px] mr-1 font-bold" aria-hidden="true" />
              {(financialSummary?.facultyPayroll || "19,291,266")
                .toString()
                .replace(/৳/g, "")}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Smooth Area & Line Chart */}
      <div className="h-60 w-full pt-1 relative">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 32, right: 35, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={darkTheme ? "#1E293B" : "#F1F5F9"}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: darkTheme ? "#94A3B8" : "#64748B",
                  fontWeight: 700,
                }}
              />
              <YAxis
                width={48}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 9,
                  fill: darkTheme ? "#94A3B8" : "#64748B",
                }}
                tickFormatter={(v) => `৳ ${Math.round(v / 100000)}L`}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;
                  const income = payload.find((p) => p.dataKey === "Income")
                    ?.value as number;
                  const expense = payload.find((p) => p.dataKey === "Expense")
                    ?.value as number;
                  const prior = payload.find(
                    (p) => p.dataKey === "PriorYearIncome"
                  )?.value as number;
                  const margin =
                    income && expense
                      ? Math.round(((income - expense) / income) * 100)
                      : 0;

                  return (
                    <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl border border-slate-700 shadow-2xl text-xs space-y-1.5 min-w-[160px]">
                      <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                        <span className="font-extrabold text-blue-400">
                          {label} 2026
                        </span>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                          +{margin}% Margin
                        </span>
                      </div>
                      {income !== undefined && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-300 flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-blue-500" />{" "}
                            Revenue:
                          </span>
                          <span className="font-bold text-blue-300">
                            {formatBDT(income)}
                          </span>
                        </div>
                      )}
                      {expense !== undefined && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-300 flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />{" "}
                            Expense:
                          </span>
                          <span className="font-bold text-emerald-300">
                            {formatBDT(expense)}
                          </span>
                        </div>
                      )}
                      {prior !== undefined && showBaseline && (
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                          <span>2025 Baseline:</span>
                          <span className="font-bold">{formatBDT(prior)}</span>
                        </div>
                      )}
                    </div>
                  );
                }}
              />

              {showBaseline && (
                <Area
                  type="monotone"
                  dataKey="PriorYearIncome"
                  stroke="#94A3B8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="none"
                  dot={false}
                  name="2025 Baseline"
                />
              )}

              <Area
                type="monotone"
                dataKey="Expense"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#expenseGrad)"
                dot={false}
                name="Expense"
              />

              <Area
                type="monotone"
                dataKey="Income"
                stroke="#3B82F6"
                strokeWidth={3.5}
                fill="url(#incomeGrad)"
                dot={renderCustomDot}
                activeDot={{
                  r: 8,
                  fill: "#2563EB",
                  stroke: "#FFFFFF",
                  strokeWidth: 3,
                }}
                name="Income"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
