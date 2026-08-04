"use client";

import React from "react";
import Link from "next/link";


interface AdminServiceHubsProps {
  blushVectorImages?: Record<string, string>;
  financialSummary?: any;
}

export default function AdminServiceHubs({
  blushVectorImages = {},
  financialSummary = {},
}: AdminServiceHubsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Academic Services Hub */}
      <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-3 min-h-[175px] flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <i className="fi fi-rr-book-alt text-blue-600 text-sm"></i> Academic Services
          </h4>
          <span className="text-[9px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">
            Active Portal
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 flex-1 relative z-10">
          {/* Faculty */}
          <Link
            href="/admin/teachers"
            className="relative p-3.5 rounded-md bg-gradient-to-br from-indigo-900 to-slate-900 text-white flex flex-col items-center justify-center text-center gap-1 hover:opacity-95 transition shadow-sm group overflow-hidden"
          >
            <i className="fi fi-rr-graduation-cap text-indigo-300 text-lg group-hover:scale-110 transition relative z-10"></i>
            <span className="text-xs font-bold relative z-10">Faculty</span>
            <span className="text-[9px] text-indigo-200 font-bold relative z-10">
              60 Active
            </span>
          </Link>

          {/* Students */}
          <Link
            href="/admin/students"
            className="relative p-3.5 rounded-md bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex flex-col items-center justify-center text-center gap-1 hover:opacity-95 transition shadow-sm group overflow-hidden"
          >
            <i className="fi fi-rr-users text-emerald-200 text-lg group-hover:scale-110 transition relative z-10"></i>
            <span className="text-xs font-bold relative z-10">Students</span>
            <span className="text-[9px] text-emerald-100 font-bold relative z-10">
              5,909 Total
            </span>
          </Link>

          {/* Routine */}
          <Link
            href="/admin/calendar"
            className="relative p-3.5 rounded-md bg-gradient-to-br from-cyan-500 to-blue-700 text-white flex flex-col items-center justify-center text-center gap-1 hover:opacity-95 transition shadow-sm group overflow-hidden"
          >
            <i className="fi fi-rr-calendar text-cyan-200 text-lg group-hover:scale-110 transition relative z-10"></i>
            <span className="text-xs font-bold relative z-10">Routine</span>
            <span className="text-[9px] text-cyan-100 font-bold relative z-10">
              Term 2026
            </span>
          </Link>
        </div>
      </div>

      {/* 2. Campus Services Hub */}
      <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-3 min-h-[175px] flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <i className="fi fi-rr-building text-purple-600 text-sm"></i> Campus Services
          </h4>
          <span className="text-[9px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-100">
            Operations
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 flex-1 relative z-10">
          {/* Notice */}
          <Link
            href="/admin/notice"
            className="relative p-3.5 rounded-md bg-gradient-to-br from-purple-600 to-indigo-800 text-white flex flex-col items-center justify-center text-center gap-1 hover:opacity-95 transition shadow-sm group overflow-hidden"
          >
            <i className="fi fi-rr-bell text-purple-200 text-lg group-hover:scale-110 transition relative z-10"></i>
            <span className="text-xs font-bold relative z-10">Notice</span>
            <span className="text-[9px] text-purple-100 font-bold relative z-10">
              5 Bulletins
            </span>
          </Link>

          {/* Transport */}
          <button className="relative p-3.5 rounded-md bg-gradient-to-br from-rose-600 to-pink-800 text-white flex flex-col items-center justify-center text-center gap-1 hover:opacity-95 transition shadow-sm group overflow-hidden">
            <i className="fi fi-rr-bus text-rose-200 text-lg group-hover:scale-110 transition relative z-10"></i>
            <span className="text-xs font-bold relative z-10">Transport</span>
            <span className="text-[9px] text-rose-100 font-bold relative z-10">
              12 Routes
            </span>
          </button>

          {/* Laptops */}
          <button className="relative p-3.5 rounded-md bg-gradient-to-br from-amber-500 to-orange-700 text-white flex flex-col items-center justify-center text-center gap-1 hover:opacity-95 transition shadow-sm group overflow-hidden">
            <i className="fi fi-rr-laptop text-amber-200 text-lg group-hover:scale-110 transition relative z-10"></i>
            <span className="text-xs font-bold relative z-10">Laptops</span>
            <span className="text-[9px] text-amber-100 font-bold relative z-10">
              450 Units
            </span>
          </button>
        </div>
      </div>

      {/* 3. Financial Services Hub */}
      <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-3 min-h-[175px] flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <i className="fi fi-rr-credit-card text-emerald-600 text-sm"></i> Financial Services
          </h4>
          <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100">
            Audit Ready
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 flex-1 relative z-10">
          {/* Total Payable */}
          <div className="relative p-3.5 rounded-md bg-gradient-to-br from-slate-950 to-indigo-950 text-white flex flex-col justify-between space-y-1 border border-slate-800 shadow-sm overflow-hidden">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider relative z-10">
              Total Payable
            </div>
            <div className="text-sm font-bold text-amber-400 flex items-center relative z-10">
              <i className="fa-solid fa-bangladeshi-taka-sign mr-1 text-amber-400 font-bold" aria-hidden="true" />
              {(financialSummary?.totalRevenue || "29,545,000")
                .toString()
                .replace(/৳/g, "")}
            </div>
            <span className="text-[8px] font-bold text-slate-400 block relative z-10">
              Annual Invoiced
            </span>
          </div>

          {/* Total Collected */}
          <div className="relative p-3.5 rounded-md bg-gradient-to-br from-slate-900 to-emerald-950 text-white flex flex-col justify-between space-y-1 border border-slate-800 shadow-sm overflow-hidden">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider relative z-10">
              Total Collected
            </div>
            <div className="text-sm font-bold text-emerald-400 flex items-center relative z-10">
              <i className="fa-solid fa-bangladeshi-taka-sign mr-1 text-emerald-400 font-bold" aria-hidden="true" />
              {(financialSummary?.facultyPayroll || "19,291,266")
                .toString()
                .replace(/৳/g, "")}
            </div>
            <span className="text-[8px] font-bold text-slate-400 block relative z-10">
              Cleared Revenue
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
