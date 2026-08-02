"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import Loader from "@/components/ui/Loader";
import TakaIcon from "@/components/TakaIcon";
import { useSession } from "@/lib/auth-client";
import { downloadDocument, pushNotification } from "@/lib/download-utils";
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

export default function TeacherFinanceView() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "robert.chen@schollege.edu.bd";

  const [financeData, setFinanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [filterType, setFilterType] = useState<
    "ALL" | "SALARY" | "ALLOWANCE" | "EXPENSE"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Expense Claim Modal State
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [claimForm, setClaimForm] = useState({
    description: "",
    category: "Lab Equipment & Supplies",
    amount: "",
    paymentMethod: "Out-of-Pocket Cash / bKash",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchFinanceLedger = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/finance/teacher?email=${encodeURIComponent(userEmail)}`,
      );
      if (res.ok) {
        const data = await res.json();
        setFinanceData(data);
      }
    } catch (err) {
      console.error("Failed to load teacher financial ledger:", err);
      toast.error("Failed to load financial ledger from backend API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceLedger();
  }, [userEmail]);

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimForm.description || !claimForm.amount) {
      toast.error("Please enter expense description and amount");
      return;
    }

    setIsSubmittingClaim(true);
    try {
      const res = await fetch("/api/finance/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...claimForm, email: userEmail }),
      });

      if (res.ok) {
        toast.success(`Expense claim submitted to Accounts Office!`);
        pushNotification(
          "Expense Reimbursement Submitted",
          `Reimbursement claim for "${claimForm.description}" (BDT ${claimForm.amount}) submitted to Accounts Office.`,
          "FINANCE",
          "TEACHER",
        );
        setShowClaimModal(false);
        setClaimForm({
          description: "",
          category: "Lab Equipment & Supplies",
          amount: "",
          paymentMethod: "Out-of-Pocket Cash / bKash",
        });
        fetchFinanceLedger();
      } else {
        toast.error("Failed to submit expense claim");
      }
    } catch (err) {
      console.error("Error submitting expense claim:", err);
      toast.error("An error occurred while submitting claim");
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center p-20 bg-white rounded-md border border-gray-500/30 shadow-md min-h-[360px] font-outfit">
        <Loader
          size="md"
          text="Loading teacher salary & expense payment ledger..."
        />
      </div>
    );
  }

  const profile = financeData?.teacherProfile || {
    name: "Dr. Robert Chen",
    teacherIdNumber: "SCH-T-1001",
    department: "Physics",
    designation: "Senior Professor & HOD",
    bankAccount: "Sonali Bank PLC • A/C 4402-991823-01",
    payGrade: "Grade 4 Senior Professor",
  };

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

  const ledgerList: any[] = financeData?.ledger || [];

  const filteredLedger = ledgerList.filter((item) => {
    if (filterType !== "ALL" && item.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.description.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-outfit">
      {/* ── Hero Banner ── */}
      <div className="bg-[#0B0F17] text-white p-6 md:p-8 rounded-md shadow-xl border border-gray-400/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block bg-white/10 border border-white/20 text-white font-normal text-[10px] px-3 py-1 rounded-md uppercase tracking-wider mb-3">
              Schollege MS • Teacher Faculty Salary & Expense Ledger
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Faculty Salary Disbursal & Out-of-Pocket Expense Ledger
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
              {profile.name} • {profile.designation} ({profile.department}) •{" "}
              {profile.bankAccount}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowClaimModal(true)}
              className="border-none bg-emerald-600 hover:bg-emerald-700 text-white font-normal text-base px-5 py-2.5 rounded-md flex items-center gap-2 shadow-md cursor-pointer transition"
            >
              <i className="fi fi-rr-plus text-base text-white" />
              Claim Expense Reimbursement +
            </button>
            <button
              onClick={() => {
                const statement = `====================================================
SCHOLLEGE EDUCATIONAL INSTITUTION - FACULTY PAYSLIP
====================================================
Faculty Name: ${profile.name}
Designation: ${profile.designation} (${profile.department})
Teacher ID: ${profile.teacherIdNumber}
Bank Account: ${profile.bankAccount}

----------------------------------------------------
ANNUAL SUMMARY (2026)
----------------------------------------------------
Total Base Salary Received: BDT ${kpis.totalSalaryReceived.toLocaleString()}
Grants & Allowances (Get): BDT ${kpis.totalAllowances.toLocaleString()}
Out-of-Pocket Expenses Spent: BDT ${kpis.totalExpensesSpent.toLocaleString()}
Net Disbursed Balance: BDT ${kpis.netDisbursedBalance.toLocaleString()}

Generated on: ${new Date().toLocaleString()}
====================================================`;
                downloadDocument(
                  "Faculty_Annual_Payslip_Statement.txt",
                  statement,
                );
              }}
              className="border border-white/30 bg-white/20 hover:bg-white/30 text-white font-normal text-base px-5 py-2.5 rounded-md flex items-center gap-2 cursor-pointer transition"
            >
              <i className="fi fi-rr-download text-base text-white" />
              Download Payslip Statement
            </button>
          </div>
        </div>

        {/* ── 4 KPI Gradient Cards ── */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-md p-5 border border-slate-700 shadow-lg space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Total Base Salary Received
            </span>
            <div className="flex items-baseline gap-1 text-2xl font-bold text-white">
              <TakaIcon className="text-xl text-emerald-400" />
              <span>{kpis.totalSalaryReceived.toLocaleString()}</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-normal block">
              Disbursed by Accounts
            </span>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/80 to-teal-900/80 rounded-md p-5 border border-emerald-700/50 shadow-lg space-y-1">
            <span className="text-xs text-emerald-200 font-semibold uppercase tracking-wider block">
              Grants & Allowances (Get from School)
            </span>
            <div className="flex items-baseline gap-1 text-2xl font-bold text-white">
              <TakaIcon className="text-xl text-teal-300" />
              <span>{kpis.totalAllowances.toLocaleString()}</span>
            </div>
            <span className="text-[11px] text-teal-300 font-normal block">
              Research & Festival Bonus
            </span>
          </div>

          <div className="bg-gradient-to-br from-rose-950/80 to-slate-900 rounded-md p-5 border border-rose-800/50 shadow-lg space-y-1">
            <span className="text-xs text-rose-300 font-semibold uppercase tracking-wider block">
              Teacher Expenses Spent (Give/Out-of-Pocket)
            </span>
            <div className="flex items-baseline gap-1 text-2xl font-bold text-white">
              <TakaIcon className="text-xl text-rose-400" />
              <span>{kpis.totalExpensesSpent.toLocaleString()}</span>
            </div>
            <span className="text-[11px] text-rose-300 font-normal block">
              Lab Supplies & Subscriptions
            </span>
          </div>

          <div className="bg-gradient-to-br from-indigo-950/90 to-purple-950/90 rounded-md p-5 border border-indigo-700/50 shadow-lg space-y-1">
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
      </div>

      {/* ── 1-Row Grid: Line Graph + Payment Ratio Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Monthly Line Trend */}
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

        {/* Right Column: Donut Pie Chart */}
        <div className="min-w-0 rounded-md border border-gray-400/50 bg-white p-6 shadow-inner flex flex-col justify-between space-y-4">
          <div className="border-b border-gray-200 pb-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <i className="fi fi-rr-pie-chart text-teal-600 text-base" />
              Teacher Payment Ratio & Allocation
            </h3>
            <p className="text-xs text-gray-500 font-normal mt-0.5">
              Distribution ratio of base salary, allowances, grants, and
              out-of-pocket spent
            </p>
          </div>

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

      {/* ── Financial Ledger & Salary Slip Table ── */}
      <div className="rounded-md border border-gray-400/50 bg-white p-6 shadow-inner space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <i className="fi fi-rr-document-signed text-indigo-600 text-base" />
              Payment Ledger & Salary Slip History
            </h3>
            <p className="text-xs text-gray-500 font-normal mt-0.5">
              Complete transactional ledger of salary deposits, allowances, and
              out-of-pocket claims
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center bg-[#0B0F17] p-1 rounded-md text-sm font-normal text-white shadow-inner">
              <button
                onClick={() => setFilterType("ALL")}
                className={`px-3.5 py-1.5 rounded-md transition cursor-pointer border-none font-normal ${
                  filterType === "ALL"
                    ? "bg-black text-white shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                All Records
              </button>
              <button
                onClick={() => setFilterType("SALARY")}
                className={`px-3.5 py-1.5 rounded-md transition cursor-pointer border-none font-normal ${
                  filterType === "SALARY"
                    ? "bg-black text-white shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Salary Deposits
              </button>
              <button
                onClick={() => setFilterType("ALLOWANCE")}
                className={`px-3.5 py-1.5 rounded-md transition cursor-pointer border-none font-normal ${
                  filterType === "ALLOWANCE"
                    ? "bg-black text-white shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Grants & Bonuses
              </button>
              <button
                onClick={() => setFilterType("EXPENSE")}
                className={`px-3.5 py-1.5 rounded-md transition cursor-pointer border-none font-normal ${
                  filterType === "EXPENSE"
                    ? "bg-black text-white shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Out-of-Pocket Spent
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-48">
              <i className="fi fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="Search ledger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-gray-300 rounded-md py-1.5 pl-8 pr-3 text-xs font-normal text-gray-900 focus:outline-none focus:bg-white focus:border-black shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-normal">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-50 text-gray-700 font-bold uppercase text-[11px]">
                <th className="p-3">Ref ID & Date</th>
                <th className="p-3">Description & Category</th>
                <th className="p-3 text-right">Credited (Get from School)</th>
                <th className="p-3 text-right">Debited (Spent / Deduction)</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLedger.length > 0 ? (
                filteredLedger.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3">
                      <span className="font-bold text-gray-900 block">
                        {item.id}
                      </span>
                      <span className="text-[10px] text-gray-500 block">
                        {item.date}
                      </span>
                    </td>

                    <td className="p-3 max-w-xs">
                      <span className="font-bold text-gray-900 block truncate">
                        {item.description}
                      </span>
                      <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block">
                        {item.category}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      {item.creditAmount > 0 ? (
                        <span className="font-bold text-emerald-600 flex items-center justify-end gap-0.5">
                          +{" "}
                          <TakaIcon className="text-[11px] text-emerald-600" />
                          {item.creditAmount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      {item.debitAmount > 0 ? (
                        <span className="font-bold text-rose-600 flex items-center justify-end gap-0.5">
                          - <TakaIcon className="text-[11px] text-rose-600" />
                          {item.debitAmount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    <td className="p-3">
                      <span className="font-semibold text-gray-800 block">
                        {item.paymentMethod}
                      </span>
                      <span className="text-[10px] text-gray-500 block">
                        Ref: {item.referenceNo}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[10px] font-bold ${
                          item.status === "PAID" || item.status === "REIMBURSED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : item.status === "APPROVED"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          const slip = `====================================================
SCHOLLEGE PAYSLIP RECORD - REF #${item.referenceNo}
====================================================
Transaction ID: ${item.id}
Date: ${item.date}
Description: ${item.description}
Category: ${item.category}
Credited Amount: BDT ${item.creditAmount}
Debited Amount: BDT ${item.debitAmount}
Payment Method: ${item.paymentMethod}
Status: ${item.status}

Generated on: ${new Date().toLocaleString()}
====================================================`;
                          downloadDocument(
                            `Payslip_${item.referenceNo}.txt`,
                            slip,
                          );
                        }}
                        className="px-4 py-2 rounded-md bg-black hover:bg-slate-800 text-white text-sm font-normal transition border-none cursor-pointer flex items-center gap-1.5 ml-auto shadow-sm"
                      >
                        <i className="fi fi-rr-file-pdf text-xs text-white" />
                        Slip PDF
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-gray-400 font-medium"
                  >
                    No transactions found for the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Claim Expense Reimbursement Modal ── */}
      {showClaimModal &&
        mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-md bg-white p-6 shadow-2xl space-y-4 border border-gray-400/50 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto font-outfit">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <i className="fi fi-rr-credit-card text-emerald-600 text-base" />
                  <h3 className="text-base font-bold text-gray-900">
                    Submit Teacher Out-of-Pocket Expense Claim
                  </h3>
                </div>
                <button
                  onClick={() => setShowClaimModal(false)}
                  className="h-8 w-8 rounded-md bg-slate-800 text-white hover:bg-black border-none cursor-pointer flex items-center justify-center transition"
                >
                  <i className="fi fi-rr-cross text-xs text-white" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleClaimSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block font-bold text-gray-900 mb-1">
                    Expense Description & Purpose *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Purchase of Multimeters & Oscilloscope Probes for Lab"
                    value={claimForm.description}
                    onChange={(e) =>
                      setClaimForm({
                        ...claimForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-gray-400/50 bg-slate-50 p-2.5 text-sm font-normal text-gray-900 focus:border-black focus:bg-white focus:outline-none shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-900 mb-1">
                      Expense Category *
                    </label>
                    <select
                      value={claimForm.category}
                      onChange={(e) =>
                        setClaimForm({ ...claimForm, category: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-400/50 bg-slate-50 p-2.5 text-sm font-normal text-gray-900 focus:border-black focus:bg-white focus:outline-none shadow-inner"
                    >
                      <option value="Lab Equipment & Supplies">
                        Lab Equipment & Supplies
                      </option>
                      <option value="Research & Publication">
                        Research & Publication
                      </option>
                      <option value="Books & Subscriptions">
                        Books & Subscriptions
                      </option>
                      <option value="Seminar & Academic Travel">
                        Seminar & Academic Travel
                      </option>
                      <option value="Classroom Stationeries">
                        Classroom Stationeries
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-900 mb-1">
                      Amount Spent (BDT) *
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      placeholder="4800"
                      value={claimForm.amount}
                      onChange={(e) =>
                        setClaimForm({ ...claimForm, amount: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-400/50 bg-slate-50 p-2.5 text-sm font-normal text-gray-900 focus:border-black focus:bg-white focus:outline-none shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-1">
                    Payment Method Used *
                  </label>
                  <select
                    value={claimForm.paymentMethod}
                    onChange={(e) =>
                      setClaimForm({
                        ...claimForm,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-gray-400/50 bg-slate-50 p-2.5 text-sm font-normal text-gray-900 focus:border-black focus:bg-white focus:outline-none shadow-inner"
                  >
                    <option value="Out-of-Pocket Cash / bKash">
                      Out-of-Pocket Cash / bKash
                    </option>
                    <option value="Personal Credit Card">
                      Personal Credit Card
                    </option>
                    <option value="Direct Vendor Invoice">
                      Direct Vendor Invoice
                    </option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowClaimModal(false)}
                    className="rounded-md border-none bg-slate-800 px-5 py-2.5 text-base font-normal text-white hover:bg-slate-900 cursor-pointer transition shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingClaim}
                    className="rounded-md border-none bg-black px-6 py-2.5 text-base font-normal text-white hover:bg-black/90 cursor-pointer disabled:opacity-50 transition shadow-md"
                  >
                    {isSubmittingClaim
                      ? "Submitting..."
                      : "Submit Claim to Accounts"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
