"use client";

import React, { useState, useEffect, useRef } from "react";
import TakaIcon from "@/components/TakaIcon";
import { downloadDocument } from "@/lib/download-utils";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { SCH_FINANCIAL_LEDGERS, PaymentRecord } from "@backend/Data/Finance/ledgers";

const spring2026Ledger: PaymentRecord[] = SCH_FINANCIAL_LEDGERS.spring2026 || [];
const summer2026Ledger: PaymentRecord[] = SCH_FINANCIAL_LEDGERS.summer2026 || [];
const spring2025Ledger: PaymentRecord[] = SCH_FINANCIAL_LEDGERS.spring2025 || [];
const summer2025Ledger: PaymentRecord[] = SCH_FINANCIAL_LEDGERS.summer2025 || [];
const fall2025Ledger: PaymentRecord[] = SCH_FINANCIAL_LEDGERS.fall2025 || [];

const defaultHistoricTimeline = [
  { month: "Jan 25", Collected: 2450000, Dues: 550000, isFinished: true },
  { month: "Feb 25", Collected: 2800000, Dues: 400000, isFinished: true },
  { month: "Mar 25", Collected: 3100000, Dues: 350000, isFinished: true },
  { month: "Apr 25", Collected: 2600000, Dues: 300000, isFinished: true },
  { month: "May 25", Collected: 2900000, Dues: 450000, isFinished: true },
  { month: "Jun 25", Collected: 3200000, Dues: 380000, isFinished: true },
  { month: "Jul 25", Collected: 2750000, Dues: 320000, isFinished: true },
  { month: "Aug 25", Collected: 3050000, Dues: 410000, isFinished: true },
  { month: "Sep 25", Collected: 3400000, Dues: 500000, isFinished: true },
  { month: "Oct 25", Collected: 3150000, Dues: 420000, isFinished: true },
  { month: "Nov 25", Collected: 3500000, Dues: 480000, isFinished: true },
  { month: "Dec 25", Collected: 3800000, Dues: 520000, isFinished: true },
  { month: "Jan 26", Collected: 2850000, Dues: 650000, isFinished: true },
  { month: "Feb 26", Collected: 3100000, Dues: 450000, isFinished: true },
  { month: "Mar 26", Collected: 2400000, Dues: 350000, isFinished: true },
  { month: "Apr 26", Collected: 1500000, Dues: 250000, isFinished: true },
  { month: "May 26", Collected: 2200000, Dues: 500000, isFinished: true },
  { month: "Jun 26", Collected: 2600000, Dues: 400000, isFinished: true },
  { month: "Jul 26", Collected: 2100000, Dues: 300000, isFinished: true },
  { month: "Aug 26", Collected: 0, Dues: 0, isFinished: false },
  { month: "Sep 26", Collected: 0, Dues: 0, isFinished: false },
  { month: "Oct 26", Collected: 0, Dues: 0, isFinished: false },
  { month: "Nov 26", Collected: 0, Dues: 0, isFinished: false },
  { month: "Dec 26", Collected: 0, Dues: 0, isFinished: false },
];

export default function AdminFinanceView() {
  const [selectedSessionKey, setSelectedSessionKey] = useState<string>("SPRING_2026");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [backendData, setBackendData] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFinancialBackendData();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchFinancialBackendData = async () => {
    try {
      const res = await fetch("/api/finance?type=all");
      if (res.ok) {
        const data = await res.json();
        setBackendData(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fallbackSessionDetails: Record<string, any> = {
    SPRING_2026: {
      name: "Spring 2026 Academic Session",
      badge: "Jan - Apr 2026",
      icon: "🌸",
      enrolled: "5,909",
      collected: "৳9,850,000",
      hasData: true,
      badgeClass: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
      ledger: spring2026Ledger,
      statusRatio: [
        { name: "Paid In Full", value: 60, color: "#10B981" },
        { name: "Partial Payment", value: 25, color: "#F59E0B" },
        { name: "Pending Dues", value: 10, color: "#EF4444" },
        { name: "Scholarship / Grant", value: 5, color: "#6366F1" },
      ],
    },
    SUMMER_2026: {
      name: "Summer 2026 Academic Session",
      badge: "May - Aug 2026",
      icon: "☀️",
      enrolled: "4,850",
      collected: "৳8,200,000",
      hasData: true,
      badgeClass: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
      ledger: summer2026Ledger,
      statusRatio: [
        { name: "Paid In Full", value: 65, color: "#10B981" },
        { name: "Partial Payment", value: 20, color: "#F59E0B" },
        { name: "Pending Dues", value: 10, color: "#EF4444" },
        { name: "Scholarship / Grant", value: 5, color: "#6366F1" },
      ],
    },
    FALL_2026: {
      name: "Fall 2026 Academic Session",
      badge: "Sep - Dec 2026",
      icon: "🍂",
      enrolled: "0",
      collected: "৳0",
      hasData: false,
      badgeClass: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
      ledger: [],
      statusRatio: [
        { name: "Paid In Full", value: 0, color: "#10B981" },
        { name: "Partial Payment", value: 0, color: "#F59E0B" },
        { name: "Pending Dues", value: 0, color: "#EF4444" },
        { name: "Scholarship / Grant", value: 0, color: "#6366F1" },
      ],
    },
    SPRING_2025: {
      name: "Spring 2025 Academic Session",
      badge: "Jan - Apr 2025",
      icon: "🌸",
      enrolled: "5,420",
      collected: "৳8,950,000",
      hasData: true,
      badgeClass: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
      ledger: spring2025Ledger,
      statusRatio: [
        { name: "Paid In Full", value: 75, color: "#10B981" },
        { name: "Partial Payment", value: 15, color: "#F59E0B" },
        { name: "Pending Dues", value: 5, color: "#EF4444" },
        { name: "Scholarship / Grant", value: 5, color: "#6366F1" },
      ],
    },
    SUMMER_2025: {
      name: "Summer 2025 Academic Session",
      badge: "May - Aug 2025",
      icon: "☀️",
      enrolled: "4,600",
      collected: "৳7,800,000",
      hasData: true,
      badgeClass: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
      ledger: summer2025Ledger,
      statusRatio: [
        { name: "Paid In Full", value: 80, color: "#10B981" },
        { name: "Partial Payment", value: 12, color: "#F59E0B" },
        { name: "Pending Dues", value: 5, color: "#EF4444" },
        { name: "Scholarship / Grant", value: 3, color: "#6366F1" },
      ],
    },
    FALL_2025: {
      name: "Fall 2025 Academic Session",
      badge: "Sep - Dec 2025",
      icon: "🍂",
      enrolled: "5,800",
      collected: "৳10,200,000",
      hasData: true,
      badgeClass: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
      ledger: fall2025Ledger,
      statusRatio: [
        { name: "Paid In Full", value: 82, color: "#10B981" },
        { name: "Partial Payment", value: 10, color: "#F59E0B" },
        { name: "Pending Dues", value: 5, color: "#EF4444" },
        { name: "Scholarship / Grant", value: 3, color: "#6366F1" },
      ],
    },
  };

  const sessionDetails = backendData?.sessionBreakdowns || fallbackSessionDetails;
  const currentSession = sessionDetails[selectedSessionKey] || fallbackSessionDetails[selectedSessionKey];
  const chartTimelineData = backendData?.historicTimeline2025To2026 || defaultHistoricTimeline;

  const filterLedger = (ledger: PaymentRecord[]) => {
    if (!ledger) return [];
    return ledger.filter((item) => {
      const matchesSearch =
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "ALL" || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const getStatusBadge = (status: PaymentRecord["status"]) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center justify-center gap-1.5 w-32 py-1.5 rounded-full text-[11px] font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-sm leading-none text-center">
            <i className="fi fi-rr-check text-xs"></i> Paid
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center justify-center gap-1.5 w-32 py-1.5 rounded-full text-[11px] font-medium text-white bg-gradient-to-r from-rose-500 to-pink-600 shadow-sm leading-none text-center">
            <i className="fi fi-rr-exclamation text-xs"></i> Pending
          </span>
        );
      case "Partial":
        return (
          <span className="inline-flex items-center justify-center gap-1.5 w-32 py-1.5 rounded-full text-[11px] font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-sm leading-none text-center">
            <i className="fi fi-rr-clock text-xs"></i> Partial
          </span>
        );
      case "Waived":
        return (
          <span className="inline-flex items-center justify-center gap-1.5 w-32 py-1.5 rounded-full text-[11px] font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-sm leading-none text-center">
            <i className="fi fi-rr-sparkles text-xs"></i> Grant / Waived
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* RADIANT GRADIENT HERO HEADER BANNER */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-7 text-white shadow-xl border border-indigo-500/20">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                Financial Hub
              </span>
              <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur">
                Running 2026
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3 tracking-tight">
              Campus Ledger & Session Analytics
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 max-w-xl leading-relaxed">
              Historical 2025 & Running 2026 Session records. Interactive ratio graphs, payment clearance analytics, and student ledgers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-black hover:bg-slate-800 text-white font-normal text-base px-5 py-2.5 rounded-md shadow-md flex items-center gap-2 transition border-none cursor-pointer">
              <i className="fi fi-rr-download text-sm text-white"></i> Export Audit Ledger
            </button>
          </div>
        </div>
      </div>

      {/* 4 GRADIENT SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="relative overflow-hidden p-5 rounded-xl bg-gradient-to-br from-white to-emerald-50/40 border border-emerald-100 shadow-sm hover:shadow-md transition">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Annual Invoiced</span>
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md">
              <i className="fi fi-rr-money-bill-wave text-base"></i>
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3 flex items-center">
            <i className="fa-solid fa-bangladeshi-taka-sign text-emerald-600 mr-1.5 text-xl font-bold" aria-hidden="true" />
            {backendData?.summary?.totalRevenue || "65,545,000"}
          </div>
          <span className="text-[10px] font-bold text-emerald-600 mt-2 flex items-center gap-1">
            <i className="fi fi-rr-arrow-small-right text-xs"></i> 2025 - Running 2026
          </span>
        </div>

        {/* Card 2 */}
        <div className="relative overflow-hidden p-5 rounded-xl bg-gradient-to-br from-white to-blue-50/40 border border-blue-100 shadow-sm hover:shadow-md transition">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Cleared Collections</span>
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <i className="fi fi-rr-check text-base"></i>
            </div>
          </div>
          <div className="text-2xl font-black text-blue-900 mt-3 flex items-center">
            <i className="fa-solid fa-bangladeshi-taka-sign text-blue-600 mr-1.5 text-xl font-bold" aria-hidden="true" />
            {backendData?.summary?.clearedCollections || "51,291,266"}
          </div>
          <span className="text-[10px] font-bold text-blue-600 mt-2 block">
            78.2% Total Cleared Collections
          </span>
        </div>

        {/* Card 3 */}
        <div className="relative overflow-hidden p-5 rounded-xl bg-gradient-to-br from-white to-rose-50/40 border border-rose-100 shadow-sm hover:shadow-md transition">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Outstanding Dues</span>
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md">
              <i className="fi fi-rr-exclamation text-base"></i>
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-3 flex items-center">
            <i className="fa-solid fa-bangladeshi-taka-sign text-rose-600 mr-1.5 text-xl font-bold" aria-hidden="true" />
            {backendData?.summary?.outstandingDues || "14,253,734"}
          </div>
          <span className="text-[10px] font-bold text-rose-500 mt-2 block">
            21.8% Pending Clearance
          </span>
        </div>

        {/* Card 4 */}
        <div className="relative overflow-hidden p-5 rounded-xl bg-gradient-to-br from-white to-purple-50/40 border border-purple-100 shadow-sm hover:shadow-md transition">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Waived / Grants</span>
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 text-white flex items-center justify-center shadow-md">
              <i className="fi fi-rr-sparkles text-base"></i>
            </div>
          </div>
          <div className="text-2xl font-black text-purple-900 mt-3 flex items-center">
            <i className="fa-solid fa-bangladeshi-taka-sign text-purple-600 mr-1.5 text-xl font-bold" aria-hidden="true" />
            {backendData?.summary?.grantsWaived || "3,200,000"}
          </div>
          <span className="text-[10px] font-bold text-purple-600 mt-2 block">
            105 Student Grants Approved
          </span>
        </div>
      </div>

      {/* FILTER & DROPDOWN HEADER BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Session Select Dropdown */}
        <div className="relative w-full md:w-80" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-extrabold px-3.5 py-2.5 rounded-xl flex items-center justify-between shadow-xs transition"
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className="text-base">{currentSession.icon}</span>
              <span className="truncate">{currentSession.name}</span>
            </div>
            <i className={`fi fi-rr-angle-small-down text-slate-400 text-xs transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}></i>
          </button>

          {/* Floating Dropdown Popover */}
          {isDropdownOpen && (
            <div className="absolute top-12 left-0 w-full md:w-80 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in-80">
              <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Running 2026 Sessions
              </div>
              <button
                type="button"
                onClick={() => { setSelectedSessionKey("SPRING_2026"); setIsDropdownOpen(false); }}
                className={`w-full px-3.5 py-2.5 text-left text-xs font-medium flex items-center justify-between hover:bg-slate-50 transition ${selectedSessionKey === "SPRING_2026" ? "bg-emerald-50/70 font-bold text-emerald-800" : "text-slate-700"}`}
              >
                <span className="flex items-center gap-2">🌸 Spring 2026 (Jan - Apr 2026)</span>
                {selectedSessionKey === "SPRING_2026" && <i className="fi fi-rr-check text-emerald-600 text-xs"></i>}
              </button>
              <button
                type="button"
                onClick={() => { setSelectedSessionKey("SUMMER_2026"); setIsDropdownOpen(false); }}
                className={`w-full px-3.5 py-2.5 text-left text-xs font-medium flex items-center justify-between hover:bg-slate-50 transition ${selectedSessionKey === "SUMMER_2026" ? "bg-amber-50/70 font-bold text-amber-800" : "text-slate-700"}`}
              >
                <span className="flex items-center gap-2">☀️ Summer 2026 (May - Aug 2026)</span>
                {selectedSessionKey === "SUMMER_2026" && <i className="fi fi-rr-check text-amber-600 text-xs"></i>}
              </button>
              <button
                type="button"
                onClick={() => { setSelectedSessionKey("FALL_2026"); setIsDropdownOpen(false); }}
                className={`w-full px-3.5 py-2.5 text-left text-xs font-medium flex items-center justify-between hover:bg-slate-50 transition ${selectedSessionKey === "FALL_2026" ? "bg-purple-50/70 font-bold text-purple-800" : "text-slate-700"}`}
              >
                <span className="flex items-center gap-2">🍂 Fall 2026 (Sep - Dec 2026)</span>
                {selectedSessionKey === "FALL_2026" && <i className="fi fi-rr-check text-purple-600 text-xs"></i>}
              </button>

              <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider border-y border-slate-100 mt-1">
                Historical 2025 Sessions
              </div>
              <button
                type="button"
                onClick={() => { setSelectedSessionKey("SPRING_2025"); setIsDropdownOpen(false); }}
                className={`w-full px-3.5 py-2.5 text-left text-xs font-medium flex items-center justify-between hover:bg-slate-50 transition ${selectedSessionKey === "SPRING_2025" ? "bg-emerald-50/70 font-bold text-emerald-800" : "text-slate-700"}`}
              >
                <span className="flex items-center gap-2">🌸 Spring 2025 (Jan - Apr 2025)</span>
                {selectedSessionKey === "SPRING_2025" && <i className="fi fi-rr-check text-emerald-600 text-xs"></i>}
              </button>
              <button
                type="button"
                onClick={() => { setSelectedSessionKey("SUMMER_2025"); setIsDropdownOpen(false); }}
                className={`w-full px-3.5 py-2.5 text-left text-xs font-medium flex items-center justify-between hover:bg-slate-50 transition ${selectedSessionKey === "SUMMER_2025" ? "bg-amber-50/70 font-bold text-amber-800" : "text-slate-700"}`}
              >
                <span className="flex items-center gap-2">☀️ Summer 2025 (May - Aug 2025)</span>
                {selectedSessionKey === "SUMMER_2025" && <i className="fi fi-rr-check text-amber-600 text-xs"></i>}
              </button>
              <button
                type="button"
                onClick={() => { setSelectedSessionKey("FALL_2025"); setIsDropdownOpen(false); }}
                className={`w-full px-3.5 py-2.5 text-left text-xs font-medium flex items-center justify-between hover:bg-slate-50 transition ${selectedSessionKey === "FALL_2025" ? "bg-purple-50/70 font-bold text-purple-800" : "text-slate-700"}`}
              >
                <span className="flex items-center gap-2">🍂 Fall 2025 (Sep - Dec 2025)</span>
                {selectedSessionKey === "FALL_2025" && <i className="fi fi-rr-check text-purple-600 text-xs"></i>}
              </button>
            </div>
          )}
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 flex items-center">
            <i className="fi fi-rr-search absolute left-3 text-slate-400 text-xs"></i>
            <input
              type="text"
              placeholder="Search student or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <i className="fi fi-rr-filter text-slate-400 text-xs"></i>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-3 py-2.5 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
              <option value="Waived">Waived</option>
            </select>
          </div>
        </div>
      </div>

      {/* SINGLE UNIFIED SESSION CONTAINER ROW WITH GRADIENT HEADER */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition">
        {/* Selected Session Gradient Header Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-white/10 flex items-center justify-center font-bold text-2xl border border-white/10 shadow-inner">
              {currentSession.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">{currentSession.name}</h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${currentSession.badgeClass}`}>
                  {currentSession.badge}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 flex-wrap">
                <span>Enrolled Headcount:</span> <strong className="text-white">{currentSession.enrolled}</strong>
                <span className="mx-1">|</span>
                <span>Session Invoiced:</span>
                <strong className="text-emerald-400 inline-flex items-center gap-0.5">
                  <span className="font-bold text-emerald-400">৳</span>
                  <span>{currentSession.collected.replace(/^৳/, '')}</span>
                </strong>
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-200 bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/10 backdrop-blur self-start sm:self-center">
            Active Selected Session
          </span>
        </div>

        {/* Selected Session Content OR EMPTY STATE */}
        {!currentSession.hasData || (currentSession.ledger && currentSession.ledger.length === 0) ? (
          <div className="p-16 text-center space-y-4 bg-slate-50/50">
            <div className="h-20 w-20 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 rounded-full flex items-center justify-center mx-auto border border-slate-200 shadow-sm">
              <i className="fi fi-rr-inbox text-3xl text-slate-400"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-900">There is nothing to show for now.</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              No financial billing records or collection ledgers have been processed yet for <strong>{currentSession.name}</strong> ({currentSession.badge}).
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6 bg-slate-50/50">
            {/* DYNAMIC HISTORIC RATIO GRAPH DIV */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <i className="fi fi-rr-chart-line-up text-xs"></i>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    {currentSession.name} - Monthly Ratio Timeline (Jan 2025 to Previous Month Jul 2026)
                  </h4>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${currentSession.badgeClass}`}>
                    Historical & Active
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Collection Ratio
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-600">
                    <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" /> Outstanding Dues
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    (Aug 2026+ unfinished months display empty bars)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Bar Graph */}
                <div className="lg:col-span-8 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartTimelineData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#64748B" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#64748B" }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0F172A", borderRadius: "8px", color: "#FFF", fontSize: "10px" }}
                        formatter={(val: any, name: any, item: any) => [
                          item.payload.isFinished
                            ? `৳${val.toLocaleString()}`
                            : "Unfinished / Future Month",
                          name,
                        ]}
                      />
                      <Bar dataKey="Collected" fill="#10B981" radius={[4, 4, 0, 0]} name="Collected (BDT)" />
                      <Bar dataKey="Dues" fill="#EF4444" radius={[4, 4, 0, 0]} name="Dues (BDT)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Right Donut Chart */}
                <div className="lg:col-span-4 h-64 border-l border-slate-100 pl-6 flex flex-col justify-between">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <i className="fi fi-rr-chart-pie text-indigo-600 text-xs"></i> {currentSession.name} Payment Ratio
                  </div>
                  <div className="h-44 w-full relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={currentSession.statusRatio}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={68}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {currentSession.statusRatio.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderRadius: "8px", color: "#FFF", fontSize: "10px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                    <span className="text-emerald-700 flex items-center gap-1">● Paid: {currentSession.statusRatio[0]?.value}%</span>
                    <span className="text-amber-700 flex items-center gap-1">● Partial: {currentSession.statusRatio[1]?.value}%</span>
                    <span className="text-rose-700 flex items-center gap-1">● Pending: {currentSession.statusRatio[2]?.value}%</span>
                    <span className="text-indigo-700 flex items-center gap-1">● Grants: {currentSession.statusRatio[3]?.value}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT LEDGER TABLE FOR SELECTED SESSION */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  {currentSession.name} Student Payment Ledger
                </h4>
                <span className="text-xs font-bold text-slate-500">
                  Showing {filterLedger(currentSession.ledger).length} Entries
                </span>
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                    <th className="p-3.5 w-14 text-center">SL#</th>
                    <th className="p-3.5">Invoice</th>
                    <th className="p-3.5">Student Name</th>
                    <th className="p-3.5">Student ID</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Paid Amount</th>
                    <th className="p-3.5">Due Amount</th>
                    <th className="p-3.5">Payment Method</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filterLedger(currentSession.ledger).map((item: PaymentRecord, idx: number) => {
                    const formattedSL = String(idx + 1).padStart(3, '0');
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition">
                        <td className="p-3.5 text-center font-mono font-bold text-slate-400 bg-slate-50/50">{formattedSL}</td>
                        <td className="p-3.5 font-mono font-bold text-slate-900">{item.id}</td>
                        <td className="p-3.5 font-bold text-slate-900">{item.studentName}</td>
                        <td className="p-3.5 text-slate-600">{item.studentId}</td>
                        <td className="p-3.5 text-slate-600">{item.department}</td>
                        <td className="p-3.5 font-bold text-emerald-700">
                          <span className="inline-flex items-center gap-1">
                            <TakaIcon className="h-3 w-3 text-emerald-600 shrink-0" />
                            <span>{item.amountPaid.replace(/^৳/, '')}</span>
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-rose-600">
                          <span className="inline-flex items-center gap-1">
                            <TakaIcon className="h-3 w-3 text-rose-500 shrink-0" />
                            <span>{item.dueAmount.replace(/^৳/, '')}</span>
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600">{item.paymentMethod}</td>
                        <td className="p-3.5">{getStatusBadge(item.status)}</td>
                        <td className="p-3.5 text-slate-500">{item.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
