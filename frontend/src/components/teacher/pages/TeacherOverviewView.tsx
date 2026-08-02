"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import Loader from "@/components/ui/Loader";
import TakaIcon from "@/components/TakaIcon";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// FontAwesome Taka Custom Chart Tooltips
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0B0F17] text-white p-3 rounded-md border border-slate-700 shadow-2xl text-xs space-y-1.5 font-outfit z-50">
        <p className="font-bold border-b border-slate-800 pb-1 text-slate-300">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium text-slate-300">{entry.name}:</span>
            </div>
            <span className="font-bold text-white flex items-center gap-0.5">
              <TakaIcon className="text-[11px] text-amber-400" />
              {Number(entry.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-[#0B0F17] text-white p-3 rounded-md border border-slate-700 shadow-2xl text-xs space-y-1 font-outfit z-50">
        <div className="flex items-center gap-1.5 font-bold">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.payload.color }}
          />
          <span>{item.name}</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-slate-300 text-[11px] pt-0.5">
          <span>Allocation:</span>
          <span className="font-extrabold text-white">{item.value}%</span>
        </div>
        {item.payload.amount && (
          <div className="flex items-center justify-between gap-3 text-slate-300 text-[11px]">
            <span>Amount:</span>
            <span className="font-extrabold text-white flex items-center gap-0.5">
              <TakaIcon className="text-[10px] text-amber-400" />
              {Number(item.payload.amount).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function TeacherOverviewView() {
  const { data: session } = useSession();
  const rawName = session?.user?.name;
  const userName =
    !rawName || rawName === "Alex Johnson" || rawName === "Teacher Account"
      ? "Dr. Robert Chen"
      : rawName;
  const userEmail = session?.user?.email || "robert.chen@schollege.edu.bd";

  const [teacherProfile, setTeacherProfile] = useState<any | null>(null);
  const [financeData, setFinanceData] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalAssignments: 8,
    pendingGrading: 12,
    assignedClasses: 4,
    averageGrade: "88.5%",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchTeacherData() {
      setLoading(true);
      try {
        const [tRes, aRes, sRes, fRes] = await Promise.all([
          fetch(`/api/teachers?email=${encodeURIComponent(userEmail)}`),
          fetch("/api/assignments"),
          fetch("/api/submissions"),
          fetch(`/api/finance/teacher?email=${encodeURIComponent(userEmail)}`),
        ]);

        if (tRes.ok) {
          const tData = await tRes.json();
          if (tData.teachers && tData.teachers.length > 0) {
            setTeacherProfile(tData.teachers[0]);
          }
        }

        if (fRes.ok) {
          const fData = await fRes.json();
          setFinanceData(fData);
        }

        if (aRes.ok && sRes.ok) {
          const aData = await aRes.json();
          const sData = await sRes.json();

          if (Array.isArray(aData)) {
            const pendingCount = Array.isArray(sData)
              ? sData.filter((s: any) => s.status !== "GRADED").length
              : 12;
            setStats({
              totalAssignments: aData.length || 8,
              pendingGrading: pendingCount || 12,
              assignedClasses: 4,
              averageGrade: "88.5%",
            });
          }
        }
      } catch (err) {
        console.error("Error loading teacher overview stats:", err);
      } finally {
        setTimeout(() => setLoading(false), 200);
      }
    }
    fetchTeacherData();
  }, [userEmail]);

  const displayName = teacherProfile?.name || userName;
  const displayDesignation =
    teacherProfile?.designation || "Senior Professor & HOD";
  const displayDept = teacherProfile?.department || "Physics";
  const displayTeacherId = teacherProfile?.teacherIdNumber || "SCH-T-1001";

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center p-20 bg-white rounded-md border border-gray-500/30 shadow-md min-h-[360px] font-outfit">
        <Loader size="md" text="Loading teacher overview..." />
      </div>
    );
  }

  const kpis = financeData?.kpis || {
    totalSalaryReceived: 680000,
    totalAllowances: 67500,
    totalExpensesSpent: 12200,
    netDisbursedBalance: 735300,
  };

  const defaultMonthlyTrend = [
    { month: "Jan 26", SalaryCredited: 85000, ExpensesSpent: 2100 },
    { month: "Feb 26", SalaryCredited: 85000, ExpensesSpent: 3400 },
    { month: "Mar 26", SalaryCredited: 85000, ExpensesSpent: 1800 },
    { month: "Apr 26", SalaryCredited: 85000, ExpensesSpent: 4200 },
    { month: "May 26", SalaryCredited: 127500, ExpensesSpent: 2900 },
    { month: "Jun 26", SalaryCredited: 110000, ExpensesSpent: 3700 },
    { month: "Jul 26", SalaryCredited: 85000, ExpensesSpent: 4800 },
    { month: "Aug 26", SalaryCredited: 85000, ExpensesSpent: 1200 },
  ];

  const monthlyTrend =
    financeData?.monthlyTrend && financeData.monthlyTrend.length > 0
      ? financeData.monthlyTrend
      : defaultMonthlyTrend;

  const paymentRatio = financeData?.paymentRatio || [
    {
      name: "Base Salary (Monthly)",
      value: 65,
      amount: 680000,
      color: "#10B981",
    },
    {
      name: "House Rent & Medical",
      value: 20,
      amount: 42500,
      color: "#06B6D4",
    },
    {
      name: "Research Grants & Bonus",
      value: 12,
      amount: 25000,
      color: "#6366F1",
    },
    { name: "Out-of-Pocket Spent", value: 3, amount: 12200, color: "#F43F5E" },
  ];

  return (
    <div className="space-y-6 font-outfit">
      {/* Hero Welcome Banner with Inner Shadow */}
      <div className="rounded-md bg-[#0B0F17] p-6 md:p-8 text-white shadow-inner border border-gray-400/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-white/10 text-white font-normal text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                {displayDesignation}
              </span>
              <span className="bg-emerald-500 text-white font-normal text-xs px-3 py-1 rounded-md uppercase">
                ID: {displayTeacherId}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
              Department of {displayDept}. You have{" "}
              <strong className="text-amber-300 font-bold">
                {stats.pendingGrading} student submissions
              </strong>{" "}
              awaiting evaluation and grade assignment today.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Link
              href="/teacher/finance"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-md text-base font-normal shadow-md transition cursor-pointer flex items-center gap-2 border-none"
            >
              <i className="fi fi-rr-credit-card text-base text-white" />
              <span>Salary & Payment Ledger</span>
            </Link>
            <Link
              href="/teacher/assignments"
              className="bg-black hover:bg-slate-900 text-white px-5 py-2.5 rounded-md text-base font-normal shadow-md transition cursor-pointer flex items-center gap-2 border border-white/20"
            >
              <i className="fi fi-sr-document text-base text-white" />
              <span>Manage Assignments</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Total Assignments */}
        <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-indigo-600 to-purple-800 p-5 text-white shadow-inner border border-gray-400/50 flex flex-col justify-between min-h-[130px]">
          <i className="fi fi-sr-document absolute -right-3 -bottom-3 text-7xl opacity-20 text-white pointer-events-none select-none" />
          <div className="relative z-10">
            <span className="text-sm font-normal text-white uppercase tracking-wider block">
              Total Assignments
            </span>
            <span className="text-3xl font-bold text-white block mt-1 tracking-tight">
              {stats.totalAssignments}
            </span>
          </div>
          <span className="relative z-10 text-sm font-normal text-white block pt-1">
            Active & Draft Tasks
          </span>
        </div>

        {/* Card 2: Pending Grading */}
        <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-amber-500 to-orange-700 p-5 text-white shadow-inner border border-gray-400/50 flex flex-col justify-between min-h-[130px]">
          <i className="fi fi-sr-check-circle absolute -right-3 -bottom-3 text-7xl opacity-20 text-white pointer-events-none select-none" />
          <div className="relative z-10">
            <span className="text-sm font-normal text-white uppercase tracking-wider block">
              Pending Submissions
            </span>
            <span className="text-3xl font-bold text-white block mt-1 tracking-tight">
              {stats.pendingGrading}
            </span>
          </div>
          <span className="relative z-10 text-sm font-normal text-white block pt-1">
            Needs Grade & Feedback
          </span>
        </div>

        {/* Card 3: Assigned Classes */}
        <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-emerald-600 to-teal-800 p-5 text-white shadow-inner border border-gray-400/50 flex flex-col justify-between min-h-[130px]">
          <i className="fi fi-sr-users-alt absolute -right-3 -bottom-3 text-7xl opacity-20 text-white pointer-events-none select-none" />
          <div className="relative z-10">
            <span className="text-sm font-normal text-white uppercase tracking-wider block">
              Assigned Classes
            </span>
            <span className="text-3xl font-bold text-white block mt-1 tracking-tight">
              {stats.assignedClasses}
            </span>
          </div>
          <span className="relative z-10 text-sm font-normal text-white block pt-1">
            Class 11-A, 11-B, 12-A, 12-B
          </span>
        </div>

        {/* Card 4: Class Performance */}
        <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-blue-600 to-indigo-800 p-5 text-white shadow-inner border border-gray-400/50 flex flex-col justify-between min-h-[130px]">
          <i className="fi fi-sr-chart-histogram absolute -right-3 -bottom-3 text-7xl opacity-20 text-white pointer-events-none select-none" />
          <div className="relative z-10">
            <span className="text-sm font-normal text-white uppercase tracking-wider block">
              Average Class Grade
            </span>
            <span className="text-3xl font-bold text-white block mt-1 tracking-tight">
              {stats.averageGrade}
            </span>
          </div>
          <span className="relative z-10 text-sm font-normal text-white block pt-1">
            Term 1 Coursework Score
          </span>
        </div>
      </div>

      {/* ── TEACHER FINANCIAL STATUS SUMMARY CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-md p-5 border border-slate-700 shadow-lg space-y-1 text-white">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
            Base Salary Received
          </span>
          <div className="flex items-baseline gap-1 text-2xl font-bold text-white">
            <TakaIcon className="text-xl text-emerald-400" />
            <span>{kpis.totalSalaryReceived.toLocaleString()}</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-normal block">
            Disbursed by Accounts
          </span>
        </div>

        <div className="bg-gradient-to-br from-emerald-900/80 to-teal-900/80 rounded-md p-5 border border-emerald-700/50 shadow-lg space-y-1 text-white">
          <span className="text-xs text-emerald-200 font-semibold uppercase tracking-wider block">
            Grants & Allowances (Get)
          </span>
          <div className="flex items-baseline gap-1 text-2xl font-bold text-white">
            <TakaIcon className="text-xl text-teal-300" />
            <span>{kpis.totalAllowances.toLocaleString()}</span>
          </div>
          <span className="text-[11px] text-teal-300 font-normal block">
            Research & Festival Bonus
          </span>
        </div>

        <div className="bg-gradient-to-br from-rose-950/80 to-slate-900 rounded-md p-5 border border-rose-800/50 shadow-lg space-y-1 text-white">
          <span className="text-xs text-rose-300 font-semibold uppercase tracking-wider block">
            Expenses Spent (Give/Out-of-Pocket)
          </span>
          <div className="flex items-baseline gap-1 text-2xl font-bold text-white">
            <TakaIcon className="text-xl text-rose-400" />
            <span>{kpis.totalExpensesSpent.toLocaleString()}</span>
          </div>
          <span className="text-[11px] text-rose-300 font-normal block">
            Lab Supplies & Subscriptions
          </span>
        </div>

        <div className="bg-gradient-to-br from-indigo-950/90 to-purple-950/90 rounded-md p-5 border border-indigo-700/50 shadow-lg space-y-1 text-white">
          <span className="text-xs text-indigo-200 font-semibold uppercase tracking-wider block">
            Net Disbursed Balance
          </span>
          <div className="flex items-baseline gap-1 text-2xl font-bold text-white">
            <TakaIcon className="text-xl text-indigo-300" />
            <span>{kpis.netDisbursedBalance.toLocaleString()}</span>
          </div>
          <span className="text-[11px] text-indigo-300 font-normal block">
            Total Earnings Net
          </span>
        </div>
      </div>

      {/* ── 1-ROW GRID: LINE GRAPH (2/3 width) + PAYMENT RATIO BREAKDOWN (1/3 width) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Monthly Salary Credited vs Expenses Line Trend */}
        <div className="lg:col-span-2 min-w-0 rounded-md border border-gray-400/50 bg-white p-6 shadow-inner space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <i className="fi fi-rr-chart-histogram text-indigo-600 text-base" />
                Faculty Salary Credited vs Out-of-Pocket Expenses Line Trend
              </h3>
              <p className="text-xs text-gray-500 font-normal mt-0.5">
                Monthly breakdown comparing total salary credited from school vs
                teacher out-of-pocket expenses spent
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                Salary & Grants
              </span>
              <span className="flex items-center gap-1.5 text-rose-600">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                Expenses Spent
              </span>
            </div>
          </div>

          {/* Recharts Line Chart with Client Mount Protection */}
          <div className="h-72 min-h-[280px] w-full min-w-0 pt-2">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <LineChart
                  data={monthlyTrend}
                  margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="SalaryCredited"
                    name="Salary Credited"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#10B981" }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ExpensesSpent"
                    name="Expenses Spent"
                    stroke="#F43F5E"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#F43F5E" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">
                Loading line chart...
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Teacher Payment Ratio & Allocation Breakdown */}
        <div className="min-w-0 rounded-md border border-gray-400/50 bg-white p-6 shadow-inner flex flex-col justify-between space-y-4">
          <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <i className="fi fi-rr-pie-chart text-teal-600 text-base" />
                Teacher Payment Ratio & Allocation
              </h3>
              <p className="text-xs text-gray-500 font-normal mt-0.5">
                Ratio of base salary, allowances & expenses
              </p>
            </div>
            <Link
              href="/teacher/finance"
              className="text-xs font-bold text-indigo-600 hover:underline shrink-0"
            >
              Full Ledger →
            </Link>
          </div>

          {/* Donut / Pie Chart */}
          <div className="h-44 min-h-[176px] w-full min-w-0 relative flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={176}>
                <PieChart>
                  <Pie
                    data={paymentRatio}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paymentRatio.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : null}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Ratio
              </span>
              <span className="text-sm font-extrabold text-gray-900">100%</span>
            </div>
          </div>

          {/* Ratio Percentage Badges */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            {paymentRatio.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold text-gray-800">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-gray-900">
                    {item.value}%
                  </span>
                  <span className="text-[10px] text-gray-500 font-normal flex items-center gap-0.5">
                    (<TakaIcon className="text-[9px] text-gray-500" />
                    {item.amount ? item.amount.toLocaleString() : "0"})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Overview Grid: Today's Schedule & Quick Grading Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Teaching Schedule Card */}
        <div className="rounded-md border border-gray-400/50 bg-white p-6 shadow-inner space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <i className="fi fi-sr-time-twelve text-emerald-600 text-sm" />
              Today's Teaching Schedule (Thursday)
            </h2>
            <span className="text-xs font-bold bg-black text-white px-2.5 py-0.5 rounded-md">
              2 Periods
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-md bg-black text-white shadow-inner flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-white text-black font-bold text-sm flex items-center justify-center shrink-0">
                  PHY
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Physics II - Electromagnetism
                  </h3>
                  <p className="text-xs text-slate-300 font-normal">
                    Class 12-A • Room 304
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white block">
                  11:30 AM - 12:30 PM
                </span>
                <span className="text-xs font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-md inline-block mt-1 animate-pulse">
                  Active Period
                </span>
              </div>
            </div>

            <div className="p-4 rounded-md bg-slate-50 border border-gray-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-slate-200 text-gray-900 font-bold text-sm flex items-center justify-center shrink-0">
                  LAB
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Physics Lab Session IV
                  </h3>
                  <p className="text-xs text-gray-500 font-normal">
                    Class 12-B • Physics Lab 01
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900 block">
                  01:30 PM - 02:30 PM
                </span>
                <span className="text-xs font-normal text-gray-400 block mt-1">
                  Upcoming
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Pending Submissions Notification Card */}
        <div className="rounded-md border border-gray-400/50 bg-white p-6 shadow-inner space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <i className="fi fi-sr-check-circle text-indigo-600 text-sm" />
              Submissions Awaiting Evaluation
            </h2>
            <Link
              href="/teacher/submissions"
              className="text-sm font-normal text-black hover:underline"
            >
              View All Submissions →
            </Link>
          </div>

          <div className="space-y-3 text-sm">
            <div className="p-3.5 rounded-md bg-slate-50 border border-gray-300 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 uppercase">
                  Class 12-A
                </span>
                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                  NEEDS GRADED
                </span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm">
                Physics II: Electromagnetism & Gauss's Law Lab
              </h4>
              <p className="text-gray-600 text-xs font-normal">
                12 students submitted lab reports. 0 graded so far.
              </p>
              <div className="pt-2">
                <Link
                  href="/teacher/submissions"
                  className="inline-block px-4 py-2 rounded-md bg-black text-white text-base font-normal hover:bg-black/90 transition shadow-inner"
                >
                  Grade Submissions →
                </Link>
              </div>
            </div>

            <div className="p-3.5 rounded-md bg-slate-50 border border-gray-300 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 uppercase">
                  Class 11-A
                </span>
                <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">
                  GRADED (15/15)
                </span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm">
                Higher Mathematics: Calculus Problems
              </h4>
              <p className="text-gray-600 text-xs font-normal">
                All submissions evaluated and grades recorded.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
