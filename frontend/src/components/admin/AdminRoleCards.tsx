"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";


interface AdminRoleCardsProps {
  ratioFilterCategory?: "ALL" | "STUDENTS" | "TEACHERS" | "EMPLOYEES";
  setRatioFilterCategory?: (
    val: "ALL" | "STUDENTS" | "TEACHERS" | "EMPLOYEES",
  ) => void;
  ratioViewType?: "GENDER" | "AGE";
  setRatioViewType?: (val: "GENDER" | "AGE") => void;
}

function AnimatedCounter({
  end,
  suffix = "",
  duration = 1200,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function AdminRoleCards({
  ratioFilterCategory,
  setRatioFilterCategory,
  ratioViewType,
  setRatioViewType,
}: AdminRoleCardsProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full items-stretch">
      {/* 1. Students Card (Expanded to 19%) */}
      <div className="w-full lg:w-[19%] p-4 rounded-md border-none flex flex-col justify-between shadow-sm relative overflow-hidden min-h-[160px] group transition hover:shadow-md">
        <Image
          src="/images/student.jpg"
          alt="Students"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 19vw"
        />
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />
        <div className="relative z-10">
          <span className="text-base font-bold text-white tracking-wide drop-shadow">
            Students
          </span>
        </div>
        <div className="mt-4 relative z-10">
          <div className="text-6xl font-bold text-white drop-shadow">
            <AnimatedCounter end={5909} suffix="+" />
          </div>
          <span className="text-xs font-bold text-white mt-0.5 block drop-shadow">
            ↑ 8.4% this year
          </span>
        </div>
      </div>

      {/* 2. Teachers Card (Expanded to 19%) */}
      <div className="w-full lg:w-[19%] p-4 rounded-md border-none flex flex-col justify-between shadow-sm relative overflow-hidden min-h-[160px] group transition hover:shadow-md">
        <Image
          src="/images/teacher.jpg"
          alt="Teachers"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 19vw"
        />
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />
        <div className="relative z-10">
          <span className="text-base font-bold text-white tracking-wide drop-shadow">
            Teachers
          </span>
        </div>
        <div className="mt-4 relative z-10">
          <div className="text-6xl font-bold text-white drop-shadow">
            <AnimatedCounter end={60} suffix="+" />
          </div>
          <span className="text-xs font-bold text-white mt-0.5 block drop-shadow">
            Active Faculty
          </span>
        </div>
      </div>

      {/* 3. Employee Card (Expanded to 19%) */}
      <div className="w-full lg:w-[19%] p-4 rounded-md border-none flex flex-col justify-between shadow-sm relative overflow-hidden min-h-[160px] group transition hover:shadow-md">
        <Image
          src="/images/employee.jpg"
          alt="Employee"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 19vw"
        />
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />
        <div className="relative z-10">
          <span className="text-base font-bold text-white tracking-wide drop-shadow">
            Employee
          </span>
        </div>
        <div className="mt-4 relative z-10">
          <div className="text-6xl font-bold text-white drop-shadow">
            <AnimatedCounter end={100} suffix="+" />
          </div>
          <span className="text-xs font-bold text-amber-200 mt-0.5 block drop-shadow">
            Staff Members
          </span>
        </div>
      </div>

      {/* 4. FEE STATUS CARD */}
      <div className="w-full lg:w-[20%] p-5 rounded-md border-none shadow-sm flex flex-col justify-between space-y-2 min-h-[180px] relative overflow-hidden">
        {/* Background layer: image + overlay always co-extensive */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/finance.jpg"
            alt="Fee Status Background"
            fill
            className="object-cover opacity-90"
            sizes="(max-width: 1024px) 100vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/65 h-[105%]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <i
              className="fa-solid fa-bangladeshi-taka-sign text-emerald-400 text-sm"
              aria-hidden="true"
            />
            Fee Status
          </h3>
          <span className="text-[9px] font-bold bg-emerald-500/70 text-white/95 px-1.5 py-0.5 rounded-sm border-none">
            2026 Live
          </span>
        </div>

        <div className="space-y-1.5 text-xs relative z-10">
          {/* Paid */}
          <div>
            <div className="flex items-center justify-between font-bold text-white/90 text-[10px] mb-0.5">
              <span className="flex items-center gap-1">
                <i className="fi fi-rr-check text-emerald-400 text-xs"></i> Paid
              </span>
              <span className="text-emerald-300 font-bold">1,335 (60%)</span>
            </div>
            <div className="h-1.5 w-full bg-white/15 rounded-md overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-md w-[60%]" />
            </div>
          </div>

          {/* Pending */}
          <div>
            <div className="flex items-center justify-between font-bold text-white/90 text-[10px] mb-0.5">
              <span className="flex items-center gap-1">
                <i className="fi fi-rr-clock text-amber-400 text-xs"></i> Pending
              </span>
              <span className="text-amber-300 font-bold">520 (25%)</span>
            </div>
            <div className="h-1.5 w-full bg-white/15 rounded-md overflow-hidden">
              <div className="h-full bg-amber-400 rounded-md w-[25%]" />
            </div>
          </div>

          {/* Overdue */}
          <div>
            <div className="flex items-center justify-between font-bold text-white/90 text-[10px] mb-0.5">
              <span className="flex items-center gap-1">
                <i className="fi fi-rr-exclamation text-rose-400 text-xs"></i> Overdue
              </span>
              <span className="text-rose-300 font-bold">208 (10%)</span>
            </div>
            <div className="h-1.5 w-full bg-white/15 rounded-md overflow-hidden">
              <div className="h-full bg-rose-400 rounded-md w-[10%]" />
            </div>
          </div>

          {/* Waived / Scholarship */}
          <div>
            <div className="flex items-center justify-between font-bold text-white/90 text-[10px] mb-0.5">
              <span className="flex items-center gap-1">
                <i className="fi fi-rr-sparkles text-indigo-300 text-xs"></i> Waived / Grant
              </span>
              <span className="text-indigo-300 font-bold">105 (5%)</span>
            </div>
            <div className="h-1.5 w-full bg-white/15 rounded-md overflow-hidden">
              <div className="h-full bg-indigo-400 rounded-md w-[5%]" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. RATIO CARD — Interactive Grouped Bar Chart */}
      <div className="w-full lg:w-[25%] p-4 rounded-md border-none shadow-sm flex flex-col justify-between min-h-[180px] relative overflow-hidden">
        {/* Background layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/statistics.jpg"
            alt="Statistics Background"
            fill
            className="object-cover opacity-90"
            sizes="(max-width: 1024px) 100vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-white">Personnel</span>
            <span className="text-[8px] font-bold bg-white/15 text-white/80 px-1.5 py-0.5 rounded-sm tracking-wide">
              BY ROLE
            </span>
          </div>
          <div className="flex items-center gap-2 text-[8px] font-bold">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm" style={{ background: "linear-gradient(to top, #3b82f6, #818cf8)" }} />
              <span className="text-blue-300">Male</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm" style={{ background: "linear-gradient(to top, #ec4899, #f9a8d4)" }} />
              <span className="text-pink-300">Female</span>
            </span>
          </div>
        </div>

        {/* Chart area */}
        <div className="relative z-10 mt-2 flex-1 flex flex-col">
          {/* Subtle grid lines */}
          <div className="flex-1 relative flex flex-col justify-between mb-1 pointer-events-none">
            {[100, 75, 50, 25].map((pct) => (
              <div key={pct} className="flex items-center gap-1.5 absolute w-full" style={{ bottom: `${pct}%` }}>
                <span className="text-[6px] text-white/25 font-bold w-4 text-right flex-shrink-0">{pct}%</span>
                <div className="flex-1 border-t border-white/10 border-dashed" />
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="flex items-end justify-around gap-2 h-[80px]">
            {[
              { label: "Teachers", total: 76, male: 44, female: 32, accent: "from-violet-500 to-indigo-700", maleGrad: "linear-gradient(to top, #4f46e5, #818cf8)", femaleGrad: "linear-gradient(to top, #db2777, #f472b6)" },
              { label: "Students", total: 5909, male: 3640, female: 2269, accent: "from-cyan-500 to-blue-700", maleGrad: "linear-gradient(to top, #2563eb, #60a5fa)", femaleGrad: "linear-gradient(to top, #e11d48, #fb7185)" },
              { label: "Employees", total: 100, male: 67, female: 33, accent: "from-amber-500 to-orange-700", maleGrad: "linear-gradient(to top, #0284c7, #38bdf8)", femaleGrad: "linear-gradient(to top, #c026d3, #e879f9)" },
            ].map(({ label, total, male, female, maleGrad, femaleGrad }) => {
              const maleH = Math.max(12, Math.round((male / total) * 100));
              const femaleH = Math.max(12, Math.round((female / total) * 100));
              const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
              return (
                <div key={label} className="flex flex-col items-center gap-1 flex-1 group/bar">
                  {/* Total count */}
                  <span className="text-[8px] font-bold text-white/70 mb-0.5">{fmt(total)}</span>
                  {/* Bars pair */}
                  <div className="flex items-end gap-1 w-full justify-center h-[68px]">
                    {/* Male bar */}
                    <div className="relative flex-1 max-w-[30px] flex items-end" style={{ height: "100%" }}>
                      <div
                        className="w-full rounded-t-xs cursor-pointer transition-all duration-300 hover:brightness-125 hover:scale-105 origin-bottom relative group/mb"
                        style={{
                          height: `${maleH}%`,
                          background: maleGrad,
                          boxShadow: "0 -2px 10px rgba(79,70,229,0.5)",
                        }}
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover/mb:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
                          ♂ {fmt(male)}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                        </div>
                      </div>
                    </div>
                    {/* Female bar */}
                    <div className="relative flex-1 max-w-[30px] flex items-end" style={{ height: "100%" }}>
                      <div
                        className="w-full rounded-t-xs cursor-pointer transition-all duration-300 hover:brightness-125 hover:scale-105 origin-bottom relative group/fb"
                        style={{
                          height: `${femaleH}%`,
                          background: femaleGrad,
                          boxShadow: "0 -2px 10px rgba(219,39,119,0.5)",
                        }}
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover/fb:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
                          ♀ {fmt(female)}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Label */}
                  <div className="text-center mt-0.5">
                    <div className="text-[8.5px] font-bold text-white/90">{label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Baseline */}
          <div className="h-px bg-white/20 mt-1 mx-1" />

          {/* Bottom total summary */}
          <div className="flex justify-around mt-1">
            {[
              { label: "T", val: "76", color: "text-violet-300" },
              { label: "S", val: "5,909", color: "text-cyan-300" },
              { label: "E", val: "100+", color: "text-amber-300" },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex items-center gap-0.5">
                <span className={`text-[7px] font-extrabold ${color}`}>{label}:</span>
                <span className="text-[7px] font-bold text-white/60">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

