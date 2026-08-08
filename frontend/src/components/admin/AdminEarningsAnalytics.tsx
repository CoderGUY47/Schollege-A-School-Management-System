"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AdminEarningsAnalyticsProps {
  financialTrendData?: any[];
  mounted?: boolean;
  mockMessages?: any[];
}

const DEFAULT_FALLBACK_MESSAGES = [
  {
    id: "msg-1",
    sender: "Prof. Md. Rafiqul Islam",
    text: "Higher Math Class 12 Syllabus and midterm routine updated.",
    time: "10:30 AM",
  },
  {
    id: "msg-2",
    sender: "Dr. Anowar Hossain",
    text: "Physics Lab equipment inspection completed for Term 2.",
    time: "11:15 AM",
  },
  {
    id: "msg-3",
    sender: "Academic Council",
    text: "Staff meeting scheduled for Thursday at 02:00 PM in Conference Room.",
    time: "01:45 PM",
  },
  {
    id: "msg-4",
    sender: "Accounts Office",
    text: "Monthly faculty salary slips generated and ready for distribution.",
    time: "03:20 PM",
  },
];

export default function AdminEarningsAnalytics({
  financialTrendData = [],
  mounted = true,
  mockMessages = [],
}: AdminEarningsAnalyticsProps) {
  const [fetchedMessages, setFetchedMessages] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => {
        if (data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
          const formatted = data.messages.map((m: any) => ({
            id: m.id,
            sender: m.sender_name || m.sender || "Campus Notice",
            text: m.content || m.subject || m.text || "New message received",
            time: m.time || "Today",
          }));
          setFetchedMessages(formatted);
        }
      })
      .catch(() => {});
  }, []);

  const displayMessages =
    Array.isArray(mockMessages) && mockMessages.length > 0
      ? mockMessages
      : fetchedMessages.length > 0
      ? fetchedMessages
      : DEFAULT_FALLBACK_MESSAGES;

  const donutData = [
    {
      name: "Tuition Fees",
      value: 65,
      count: 300,
      color: "url(#tuitionDonutGradient)",
    },
    {
      name: "Lab & Library",
      value: 20,
      count: 100,
      color: "url(#labDonutGradient)",
    },
    {
      name: "Transport",
      value: 15,
      count: 50,
      color: "url(#transportDonutGradient)",
    },
  ];

  const safeChartData = Array.isArray(financialTrendData) ? financialTrendData : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Redesigned Earnings Card */}
      <div className="lg:col-span-8 bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-4 min-h-[350px] flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                Earnings Analytics
              </h3>
              <span className="text-[9px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">
                12 Months (Jan - Dec)
              </span>
            </div>
            <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
              Annual revenue vs operating expense monthly breakdown
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-md border border-slate-200 text-[11px]">
              <span className="text-slate-500">Annual Total:</span>
              <span className="font-bold text-gray-900 flex items-center">
                <i className="fa-solid fa-bangladeshi-taka-sign mr-1 text-emerald-600 font-bold" aria-hidden="true" />
                32,100,000
              </span>
            </div>

            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1.5 text-gray-600 font-bold">
                <span className="h-2.5 w-2.5 rounded-sm bg-sky-400" /> Income
              </span>
              <span className="flex items-center gap-1.5 text-gray-600 font-bold">
                <span className="h-2.5 w-2.5 rounded-sm bg-purple-400" /> Expense
              </span>
            </div>
          </div>
        </div>

        {/* Grid Split */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 h-64 min-h-[220px]">
          {/* Left Side: Bar Chart */}
          <div className="sm:col-span-8 h-full min-h-[200px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={safeChartData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity={1} />
                      <stop offset="100%" stopColor="#1D4ED8" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C084FC" stopOpacity={1} />
                      <stop offset="100%" stopColor="#6D28D9" stopOpacity={1} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8FAFC" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#64748B" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#64748B" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      borderRadius: "6px",
                      color: "#FFF",
                      fontSize: "10px",
                    }}
                    formatter={(value: any, name: any) => [
                      `BDT ${value.toLocaleString()}`,
                      name,
                    ]}
                  />
                  <Bar dataKey="Income" fill="url(#incomeGradient)" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="Expense" fill="url(#expenseGradient)" radius={[4, 4, 0, 0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Right Side: Donut Chart */}
          <div className="sm:col-span-4 h-full flex flex-col items-center justify-between relative min-h-[220px] border-l border-slate-100 pl-3 py-1">
            <div className="w-full h-44 relative flex items-center justify-center">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="tuitionDonutGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#38BDF8" stopOpacity={1} />
                        <stop offset="100%" stopColor="#1D4ED8" stopOpacity={1} />
                      </linearGradient>
                      <linearGradient id="labDonutGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#A3E635" stopOpacity={1} />
                        <stop offset="100%" stopColor="#15803D" stopOpacity={1} />
                      </linearGradient>
                      <linearGradient id="transportDonutGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FB7185" stopOpacity={1} />
                        <stop offset="100%" stopColor="#B91C1C" stopOpacity={1} />
                      </linearGradient>
                    </defs>

                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={46}
                      outerRadius={76}
                      paddingAngle={6}
                      cornerRadius={4}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0F172A",
                        borderRadius: "6px",
                        color: "#FFF",
                        fontSize: "10px",
                      }}
                      formatter={(val: any) => [`${val}% Share`, "Contribution"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-sm font-bold text-gray-900 tracking-tight">450</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Headcount</span>
              </div>
            </div>

            <div className="w-full space-y-1.5 text-[10px]">
              <div>
                <div className="flex justify-between font-bold text-gray-700 mb-0.5">
                  <span className="text-blue-600 font-bold">Tuition Fees</span>
                  <span>300 (65%)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full w-[65%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-gray-700 mb-0.5">
                  <span className="text-emerald-600 font-bold">Lab & Library</span>
                  <span>100 (20%)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-lime-400 to-emerald-600 rounded-full w-[20%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-gray-700 mb-0.5">
                  <span className="text-rose-600 font-bold">Transport</span>
                  <span>50 (15%)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-rose-400 to-red-700 rounded-full w-[15%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Preview Card */}
      <div className="lg:col-span-4 bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between min-h-[350px]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <i className="fi fi-rr-comment-alt text-emerald-600 text-sm"></i> Messages
          </h3>
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
            Inbox
          </span>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto max-h-[220px] pr-1">
          {displayMessages.slice(0, 3).map((msg) => (
            <div
              key={msg.id}
              className="p-2.5 rounded-md bg-gray-50 border border-gray-100 hover:bg-emerald-50/50 transition cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900">{msg.sender}</span>
                <span className="text-[9px] font-semibold text-gray-400">{msg.time}</span>
              </div>
              <p className="text-[11px] text-gray-600 line-clamp-1 leading-snug">{msg.text}</p>
            </div>
          ))}
        </div>

        <Link
          href="/admin/messages"
          className="block w-full text-[10px] font-bold bg-gray-100 text-gray-600 py-1.5 rounded-md hover:bg-gray-200 transition text-center"
        >
          View All Inbox
        </Link>
      </div>
    </div>
  );
}
