"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import TakaIcon from "@/components/TakaIcon";
import { downloadDocument } from "@/lib/download-utils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface StudentRecord {
  id?: string;
  name: string;
  email: string;
  studentIdNumber?: string;
  className: string;
  sectionName: string;
  rollNo: string;
  group?: string;
  gender?: string;
  phone?: string;
  fatherName?: string;
  motherName?: string;
  tuitionStatus?: string;
  attendanceRate?: string;
  gpa?: string;
  duesAmount?: number;
  totalBilled?: number;
  totalPaid?: number;
  waiverPercent?: string;
  waiverAmount?: number;
  rank?: string;
  daysPresent?: number;
  totalDays?: number;
  enrolledSubjects?: number;
  pendingAssignments?: number;
  examCountdown?: number;
  busRoute?: string;
}

export default function StudentOverviewView() {
  const { data: session } = useSession();
  const rawName = session?.user?.name;
  const userName =
    !rawName || rawName === "Alex Johnson" || rawName === "Student Account"
      ? "Aria Rahman"
      : rawName;
  const userEmail =
    session?.user?.email || "aria.rahman.12a03@schollege.edu.bd";

  const [profile, setProfile] = useState<StudentRecord | null>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showQuickPayModal, setShowQuickPayModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bKash");

  // Calendar State
  const [currentDate] = useState<Date>(new Date(2026, 7, 1)); // August 2026
  const [selectedDay, setSelectedDay] = useState<number>(12); // Default 12th

  useEffect(() => {
    setMounted(true);

    async function fetchStudentOverviewData() {
      try {
        setLoading(true);
        // Fetch Student Profile dynamically from Supabase API
        const studentRes = await fetch(
          `/api/students?email=${encodeURIComponent(userEmail)}`,
        );
        if (studentRes.ok) {
          const data = await studentRes.json();
          let currentStudent: StudentRecord | null = null;
          if (Array.isArray(data)) {
            currentStudent =
              data.find(
                (s: StudentRecord) =>
                  s.email?.toLowerCase() === userEmail.toLowerCase(),
              ) ||
              data[0] ||
              null;
          } else if (data && data.name) {
            currentStudent = data;
          }
          if (!currentStudent) {
            const fallbackRes = await fetch(`/api/students?limit=1`);
            if (fallbackRes.ok) {
              const fallbackData = await fallbackRes.json();
              if (Array.isArray(fallbackData) && fallbackData.length > 0) {
                currentStudent = fallbackData[0];
              }
            }
          }
          setProfile(currentStudent);
        }

        // Fetch Campus Notices dynamically from Supabase API
        const noticeRes = await fetch("/api/notices");
        if (noticeRes.ok) {
          const noticeData = await noticeRes.json();
          if (Array.isArray(noticeData)) {
            setNotices(noticeData.slice(0, 3));
          }
        }
      } catch (err) {
        console.error("Error fetching overview from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudentOverviewData();
  }, [userEmail]);

  // Dynamic metrics binding
  const displayName = profile?.name || userName;
  const displayRoll = profile?.rollNo || "261-12-0003";
  const displayClass = profile ? `Class ${profile.className}` : "Class 12";
  const displaySection = profile
    ? `Section ${profile.sectionName}`
    : "Section A";
  const displayGroup = profile?.group || "Science";
  const displayGPA = profile?.gpa || "5.00";
  const displayAttendance = profile?.attendanceRate || "96.4%";
  const displayRank = profile?.rank || "#3";
  const daysPresentVal = profile?.daysPresent || 135;
  const totalDaysVal = profile?.totalDays || 140;
  const enrolledSubjectsVal = profile?.enrolledSubjects || 14;
  const pendingAssignmentsVal = profile?.pendingAssignments || 3;
  const examCountdownVal = profile?.examCountdown || 4;
  const busRouteVal = profile?.busRoute || "Route #4";
  const noticesCountVal = notices.length > 0 ? notices.length : 5;

  const totalBilledVal = profile?.totalBilled || 45000;
  const totalPaidVal = profile?.totalPaid || 40500;
  const outstandingDuesVal = profile?.duesAmount || 4500;
  const waiverPercentVal = profile?.waiverPercent || "25%";
  const waiverAmountVal = profile?.waiverAmount || 11250;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      `Payment of ৳${outstandingDuesVal.toLocaleString()} completed successfully via ${paymentMethod}! Receipt generated.`,
    );
    setShowQuickPayModal(false);
  };

  // Student Payment History & Dues Trend Data
  const studentPaymentData = [
    { month: "Jan", PaidAmount: 5000, DuesAmount: 0 },
    { month: "Feb", PaidAmount: 5000, DuesAmount: 0 },
    { month: "Mar", PaidAmount: 5000, DuesAmount: 0 },
    { month: "Apr", PaidAmount: 5000, DuesAmount: 0 },
    { month: "May", PaidAmount: 5000, DuesAmount: 0 },
    { month: "Jun", PaidAmount: 5500, DuesAmount: 0 },
    { month: "Jul", PaidAmount: 10000, DuesAmount: 0 },
    { month: "Aug", PaidAmount: 0, DuesAmount: outstandingDuesVal },
  ];

  // Calendar Grid Calculation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarGrid = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarGrid.push({ day: daysInPrevMonth - i, currentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarGrid.push({ day: d, currentMonth: true });
  }
  const remaining = 35 - calendarGrid.length;
  for (let n = 1; n <= Math.max(0, remaining); n++) {
    calendarGrid.push({ day: n, currentMonth: false });
  }

  return (
    <div className="space-y-8 font-outfit">
      {/* ── 1st ROW: HERO WELCOME BANNER ── */}
      <div className="rounded-md bg-[#0B0F17] p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-white/10 text-white font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                Student Portal
              </span>
              <span className="bg-amber-400 text-black font-bold text-xs px-3 py-1 rounded-md uppercase">
                Roll #{displayRoll}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="text-sm text-white font-normal leading-relaxed">
              {displayClass} • {displaySection} • Roll{" "}
              <strong className="text-white font-bold">{displayRoll}</strong> •{" "}
              {displayGroup} Department. Your next class is{" "}
              <strong className="text-amber-300 font-bold">
                Physics II (Electromagnetism)
              </strong>{" "}
              at 11:30 AM in Room 304.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/student/fees"
              className="bg-white text-[#0B0F17] hover:bg-slate-100 px-5 py-2.5 rounded-md text-sm font-bold shadow-md transition cursor-pointer flex items-center gap-2 border-none"
            >
              <i className="fi fi-sr-credit-card text-sm text-[#0B0F17]" />
              <span>Financial Ledger</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2nd ROW: STUDENT OVERVIEW (LEFT 8 COLS) & ACADEMIC CALENDAR (RIGHT 4 COLS) IN ONE ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 8 COLS: STUDENT OVERVIEW (9 CARDS IN A 3x3 GRID - WHITE TEXT, BIG BOLD NUMBERS, SM NORMAL LABELS) */}
        <div className="lg:col-span-8 rounded-md bg-white border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-gray-900 tracking-tight">
                Student Overview
              </h2>
              <p className="text-sm text-gray-500 font-normal">
                Key indicators & statistics
              </p>
            </div>
            <span className="text-sm font-bold bg-black text-white px-3 py-1 rounded-md uppercase">
              9 Cards
            </span>
          </div>

          {/* 3x3 GRID OF COMPACT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {/* CARD 1: CUMULATIVE GPA */}
            <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-indigo-600 to-purple-800 p-4 text-white shadow-md border-none flex flex-col justify-between min-h-[130px]">
              <i className="fi fi-sr-graduation-cap absolute -right-3 -bottom-3 text-7xl opacity-20 pointer-events-none select-none text-white" />
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-sm font-normal text-white bg-white/20 px-2.5 py-0.5 rounded-md">
                  Academic
                </span>
                <i className="fi fi-sr-graduation-cap text-sm text-white" />
              </div>
              <div className="relative z-10 mt-2 space-y-1">
                <span className="text-sm font-normal text-white block">
                  Cumulative GPA
                </span>
                <div className="text-3xl font-bold text-white tracking-tight leading-none flex items-baseline gap-1">
                  <span>{displayGPA}</span>
                  <span className="text-sm font-normal text-white">/ 5.00</span>
                </div>
                <span className="text-sm font-normal text-white flex items-center gap-1.5 pt-0.5">
                  <i className="fi fi-sr-star text-xs text-white" /> Golden A+
                  (Rank {displayRank})
                </span>
              </div>
            </div>

            {/* CARD 2: ATTENDANCE */}
            <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-emerald-600 to-teal-800 p-4 text-white shadow-md border-none flex flex-col justify-between min-h-[130px]">
              <i className="fi fi-sr-user-time absolute -right-3 -bottom-3 text-7xl opacity-20 pointer-events-none select-none text-white" />
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-sm font-normal text-white bg-white/20 px-2.5 py-0.5 rounded-md">
                  Attendance
                </span>
                <i className="fi fi-sr-user-time text-sm text-white" />
              </div>
              <div className="relative z-10 mt-2 space-y-1">
                <span className="text-sm font-normal text-white block">
                  Attendance Rate
                </span>
                <div className="text-3xl font-bold text-white tracking-tight leading-none">
                  {displayAttendance}
                </div>
                <span className="text-sm font-normal text-white flex items-center gap-1.5 pt-0.5">
                  <i className="fi fi-sr-check-circle text-xs text-white" />{" "}
                  {daysPresentVal}/{totalDaysVal} Present
                </span>
              </div>
            </div>

            {/* CARD 3: OUTSTANDING DUES */}
            <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-rose-600 to-pink-800 p-4 text-white shadow-md border-none flex flex-col justify-between min-h-[130px]">
              <i className="fi fi-sr-credit-card absolute -right-3 -bottom-3 text-7xl opacity-20 pointer-events-none select-none text-white" />
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-sm font-normal text-white bg-white/20 px-2.5 py-0.5 rounded-md">
                  Financial
                </span>
                <i className="fi fi-sr-credit-card text-sm text-white" />
              </div>
              <div className="relative z-10 mt-2 space-y-1">
                <span className="text-sm font-normal text-white block">
                  Outstanding Dues
                </span>
                <div className="text-3xl font-bold text-white tracking-tight leading-none flex items-center gap-1">
                  <TakaIcon className="text-xl text-white" />
                  <span>{outstandingDuesVal.toLocaleString()}</span>
                </div>
                <span className="text-sm font-normal text-white flex items-center gap-1.5 pt-0.5">
                  <i className="fi fi-sr-exclamation text-xs text-white" /> Due:
                  Aug 20
                </span>
              </div>
            </div>

            {/* CARD 4: ENROLLED SUBJECTS */}
            <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-blue-600 to-indigo-800 p-4 text-white shadow-md border-none flex flex-col justify-between min-h-[130px]">
              <i className="fi fi-sr-book-alt absolute -right-3 -bottom-3 text-7xl opacity-20 pointer-events-none select-none text-white" />
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-sm font-normal text-white bg-white/20 px-2.5 py-0.5 rounded-md">
                  Curriculum
                </span>
                <i className="fi fi-sr-book-alt text-sm text-white" />
              </div>
              <div className="relative z-10 mt-2 space-y-1">
                <span className="text-sm font-normal text-white block">
                  Enrolled Subjects
                </span>
                <div className="text-3xl font-bold text-white tracking-tight leading-none flex items-baseline gap-1">
                  <span>{enrolledSubjectsVal}</span>
                  <span className="text-sm font-normal text-white">
                    Subjects
                  </span>
                </div>
                <span className="text-sm font-normal text-white flex items-center gap-1.5 pt-0.5">
                  <i className="fi fi-sr-books text-xs text-white" /> 8 Main + 6
                  Electives
                </span>
              </div>
            </div>

            {/* CARD 5: ACTIVE ASSIGNMENTS */}
            <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-amber-500 to-orange-700 p-4 text-white shadow-md border-none flex flex-col justify-between min-h-[130px]">
              <i className="fi fi-sr-document absolute -right-3 -bottom-3 text-7xl opacity-20 pointer-events-none select-none text-white" />
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-sm font-normal text-white bg-white/20 px-2.5 py-0.5 rounded-md">
                  Coursework
                </span>
                <i className="fi fi-sr-document text-sm text-white" />
              </div>
              <div className="relative z-10 mt-2 space-y-1">
                <span className="text-sm font-normal text-white block">
                  Pending Tasks
                </span>
                <div className="text-3xl font-bold text-white tracking-tight leading-none flex items-baseline gap-1">
                  <span>{pendingAssignmentsVal}</span>
                  <span className="text-sm font-normal text-white">
                    Pending
                  </span>
                </div>
                <span className="text-sm font-normal text-white flex items-center gap-1.5 pt-0.5">
                  <i className="fi fi-sr-clock text-xs text-white" /> Physics &
                  Math Lab
                </span>
              </div>
            </div>

            {/* CARD 6: SCHOLARSHIP WAIVER */}
            <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-cyan-600 to-blue-800 p-4 text-white shadow-md border-none flex flex-col justify-between min-h-[130px]">
              <i className="fi fi-sr-award absolute -right-3 -bottom-3 text-7xl opacity-20 pointer-events-none select-none text-white" />
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-sm font-normal text-white bg-white/20 px-2.5 py-0.5 rounded-md">
                  Grant
                </span>
                <i className="fi fi-sr-award text-sm text-white" />
              </div>
              <div className="relative z-10 mt-2 space-y-1">
                <span className="text-sm font-normal text-white block">
                  Scholarship Waiver
                </span>
                <div className="text-3xl font-bold text-white tracking-tight leading-none flex items-baseline gap-1">
                  <span>{waiverPercentVal}</span>
                  <span className="text-sm font-normal text-white">Waiver</span>
                </div>
                <span className="text-sm font-normal text-white flex items-center gap-1.5 pt-0.5">
                  <i className="fi fi-sr-badge-percent text-xs text-white" />{" "}
                  Merit Subsidy Active
                </span>
              </div>
            </div>

            {/* CARD 7: UPCOMING EXAMS */}
            <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-purple-700 to-fuchsia-900 p-4 text-white shadow-md border-none flex flex-col justify-between min-h-[130px]">
              <i className="fi fi-sr-calendar absolute -right-3 -bottom-3 text-7xl opacity-20 pointer-events-none select-none text-white" />
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-sm font-normal text-white bg-white/20 px-2.5 py-0.5 rounded-md">
                  Exams
                </span>
                <i className="fi fi-sr-calendar text-sm text-white" />
              </div>
              <div className="relative z-10 mt-2 space-y-1">
                <span className="text-sm font-normal text-white block">
                  Exam Countdown
                </span>
                <div className="text-3xl font-bold text-white tracking-tight leading-none flex items-baseline gap-1">
                  <span>{examCountdownVal}</span>
                  <span className="text-sm font-normal text-white">
                    Days Left
                  </span>
                </div>
                <span className="text-sm font-normal text-white flex items-center gap-1.5 pt-0.5">
                  <i className="fi fi-sr-clock-three text-xs text-white" />{" "}
                  Mid-Term 2026 (Aug 12)
                </span>
              </div>
            </div>

            {/* CARD 8: CAMPUS BULLETINS */}
            <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-slate-900 to-black p-4 text-white shadow-md border-none flex flex-col justify-between min-h-[130px]">
              <i className="fi fi-sr-megaphone absolute -right-3 -bottom-3 text-7xl opacity-20 pointer-events-none select-none text-white" />
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-sm font-normal text-white bg-white/20 px-2.5 py-0.5 rounded-md">
                  Bulletins
                </span>
                <i className="fi fi-sr-megaphone text-sm text-white" />
              </div>
              <div className="relative z-10 mt-2 space-y-1">
                <span className="text-sm font-normal text-white block">
                  Unread Bulletins
                </span>
                <div className="text-3xl font-bold text-white tracking-tight leading-none flex items-baseline gap-1">
                  <span>{noticesCountVal}</span>
                  <span className="text-sm font-normal text-white">
                    Notices
                  </span>
                </div>
                <span className="text-sm font-normal text-white flex items-center gap-1.5 pt-0.5">
                  <i className="fi fi-sr-bell text-xs text-white" /> 2 Urgent
                  Announcements
                </span>
              </div>
            </div>

            {/* CARD 9: CAMPUS ID & TRANSPORT */}
            <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-teal-700 to-slate-950 p-4 text-white shadow-md border-none flex flex-col justify-between min-h-[130px]">
              <i className="fi fi-sr-bus absolute -right-3 -bottom-3 text-7xl opacity-20 pointer-events-none select-none text-white" />
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-sm font-normal text-white bg-white/20 px-2.5 py-0.5 rounded-md">
                  Transport
                </span>
                <i className="fi fi-sr-bus text-sm text-white" />
              </div>
              <div className="relative z-10 mt-2 space-y-1">
                <span className="text-sm font-normal text-white block">
                  Bus Route & Access
                </span>
                <div className="text-3xl font-bold text-white tracking-tight leading-none">
                  {busRouteVal}
                </div>
                <span className="text-sm font-normal text-white flex items-center gap-1.5 pt-0.5">
                  <i className="fi fi-sr-shield-check text-xs text-white" />{" "}
                  RFID Active (Gate 2)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLS: ACADEMIC CALENDAR & UPCOMING EVENTS */}
        <div className="lg:col-span-4 rounded-md bg-white border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <i className="fi fi-sr-calendar text-indigo-600 text-sm" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Academic Calendar
                  </h3>
                  <span className="text-sm font-normal text-gray-500">
                    August 2026 • Events & Exams
                  </span>
                </div>
              </div>
              <span className="bg-black text-white text-sm font-bold px-3 py-1 rounded-md">
                {currentDate.toLocaleString("default", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Calendar Days Grid */}
            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-1 text-center font-normal text-sm text-gray-500 uppercase border-b border-slate-100 pb-1">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-sm font-bold">
                {calendarGrid.map((item, idx) => {
                  const isSelected =
                    item.currentMonth && item.day === selectedDay;
                  const isEventDay =
                    item.currentMonth &&
                    (item.day === 12 || item.day === 14 || item.day === 20);

                  return (
                    <button
                      key={idx}
                      onClick={() =>
                        item.currentMonth && setSelectedDay(item.day)
                      }
                      disabled={!item.currentMonth}
                      className={`h-8 rounded-md flex flex-col items-center justify-center text-sm transition font-bold border-none cursor-pointer ${
                        !item.currentMonth
                          ? "text-gray-300 bg-transparent cursor-default font-normal"
                          : isSelected
                            ? "bg-black text-white shadow-sm"
                            : isEventDay
                              ? "bg-amber-100 text-amber-900 font-bold border border-amber-300"
                              : "bg-slate-50 text-gray-800 hover:bg-slate-100 font-normal"
                      }`}
                    >
                      <span>{item.day}</span>
                      {isEventDay && (
                        <span className="h-1 w-1 rounded-full bg-amber-600 -mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming Event Details Card for Selected Day */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <i className="fi fi-sr-bullseye text-amber-500 text-sm" />
                Events for Aug {selectedDay}, 2026
              </span>
              <span className="text-sm font-normal text-gray-500 uppercase">
                Upcoming
              </span>
            </div>

            <div className="p-3.5 rounded-md bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5 text-sm">
              <div className="flex items-center justify-between font-bold text-sm">
                <span>
                  {selectedDay === 12
                    ? "Mid-Term Physics Exam"
                    : selectedDay === 20
                      ? "Tuition Fee Due Date"
                      : "Regular Academic Classes"}
                </span>
                <span className="bg-amber-200 text-amber-900 text-xs px-2.5 py-0.5 rounded-md font-bold">
                  {selectedDay === 12
                    ? "Exam 10:00 AM"
                    : selectedDay === 20
                      ? "Deadline"
                      : "Scheduled"}
                </span>
              </div>
              <p className="text-sm font-normal text-amber-900 leading-relaxed">
                {selectedDay === 12
                  ? "Main Exam Hall • Seat Plan: Hall B, Row 4"
                  : selectedDay === 20
                    ? `Clear tuition dues of ${outstandingDuesVal.toLocaleString()} BDT before midnight`
                    : "Class 12-A routine schedule active in Room 304"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3rd ROW: TODAY'S CLASS SCHEDULE & LATEST CAMPUS NOTICES (SIDE BY SIDE 2-COLUMN GRID) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: TODAY'S CLASS SCHEDULE (THURSDAY) */}
        <div className="rounded-md bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <i className="fi fi-sr-time-twelve text-emerald-600 text-sm" />
              Today's Class Schedule (Thursday)
            </h2>
            <Link
              href="/student/routine"
              className="text-sm font-normal text-black hover:underline"
            >
              Full Routine →
            </Link>
          </div>

          <div className="space-y-3">
            {/* Active Class */}
            <div className="p-4 rounded-md bg-black/5 border border-black/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-black text-white font-bold text-sm flex items-center justify-center shrink-0">
                  PHY
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Physics II - Electromagnetism
                  </h3>
                  <p className="text-sm font-normal text-gray-500">
                    Dr. Robert Chen • Room 304
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900 block">
                  11:30 AM - 12:30 PM
                </span>
                <span className="text-xs font-bold bg-black text-white px-2.5 py-0.5 rounded-md inline-block mt-1 animate-pulse">
                  Next Class
                </span>
              </div>
            </div>

            {/* Class 2 */}
            <div className="p-4 rounded-md bg-white border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center shrink-0">
                  MATH
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Higher Mathematics
                  </h3>
                  <p className="text-sm font-normal text-gray-500">
                    Prof. Sarah Jenkins • Room 201
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

            {/* Class 3 */}
            <div className="p-4 rounded-md bg-white border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center shrink-0">
                  CSE
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Computer Science & Algorithms
                  </h3>
                  <p className="text-sm font-normal text-gray-500">
                    Eng. Alex Mercer • Lab 02
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900 block">
                  02:45 PM - 04:00 PM
                </span>
                <span className="text-xs font-normal text-gray-400 block mt-1">
                  Upcoming
                </span>
              </div>
            </div>

            {/* Class 4 */}
            <div className="p-4 rounded-md bg-white border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center shrink-0">
                  CHEM
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Organic Chemistry Lab
                  </h3>
                  <p className="text-sm font-normal text-gray-500">
                    Dr. Maya Rahman • Chemistry Lab 01
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900 block">
                  04:15 PM - 05:15 PM
                </span>
                <span className="text-xs font-normal text-gray-400 block mt-1">
                  Upcoming
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LATEST CAMPUS NOTICES (FETCHED DYNAMICALLY FROM SUPABASE) */}
        <div className="rounded-md bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <i className="fi fi-sr-megaphone text-blue-600 text-sm" />
              Latest Campus Notices
            </h2>
            <Link
              href="/student/notice"
              className="text-sm font-normal text-black hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3 text-sm">
            {notices.length > 0 ? (
              notices.map((n, idx) => (
                <div
                  key={n.id || idx}
                  className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1"
                >
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                    {n.category || "Academic Notice"}
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm">{n.title}</h4>
                  <p className="text-gray-600 text-sm font-normal leading-relaxed line-clamp-2">
                    {n.content || n.description}
                  </p>
                  <span className="text-xs text-gray-400 font-normal block pt-1">
                    Posted{" "}
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleDateString()
                      : "recently"}
                  </span>
                </div>
              ))
            ) : (
              <>
                <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                    Academic Notice
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm">
                    Lab Report Submission Extended
                  </h4>
                  <p className="text-gray-600 text-sm font-normal leading-relaxed">
                    Chemistry lab reports for Class 12-A can now be submitted
                    until Aug 10 without penalty.
                  </p>
                  <span className="text-xs text-gray-400 font-normal block pt-1">
                    Posted 2 hours ago by HOD Chemistry
                  </span>
                </div>

                <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                    Tuition Fee
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm">
                    Semester 2 Tuition Fee Due
                  </h4>
                  <p className="text-gray-600 text-sm font-normal leading-relaxed">
                    Please clear tuition dues before Aug 20 to avoid late fee
                    surcharges.
                  </p>
                  <span className="text-xs text-gray-400 font-normal block pt-1">
                    Posted yesterday by Accounts Dept
                  </span>
                </div>

                <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">
                    Mid-Term Exam
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm">
                    Mid-Term Exam Seat Plan Published
                  </h4>
                  <p className="text-gray-600 text-sm font-normal leading-relaxed">
                    Seat allocations for Class 12 Mid-Term 2026 are now
                    available for download.
                  </p>
                  <span className="text-xs text-gray-400 font-normal block pt-1">
                    Posted 3 days ago by Controller of Exams
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── 4th ROW: FINANCIAL PAYMENT STATISTICS & DUES (FULL WIDTH CONTAINER) ── */}
      <div className="rounded-md bg-white border border-slate-200 p-6 shadow-sm space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <i className="fi fi-sr-receipt text-indigo-600 text-lg" />
              <h2 className="text-sm font-bold text-gray-900">
                Financial Payment Statistics & Dues
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-md">
                Active 90% Cleared
              </span>
            </div>
            <p className="text-sm text-gray-500 font-normal mt-0.5">
              Academic Session 2026 • Term 1 Payment Ledger
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const ledgerText = `====================================================
SCHOLLEGE OFFICIAL FINANCIAL LEDGER & PAYMENT
====================================================
Student Roll: 261-12-0003
Academic Session: 2026 (Term 1)
Total Paid Fees: BDT 21,250
Outstanding Dues: BDT 4,250
Current Balance Status: CLEARANCE ACTIVE

Generated on: ${new Date().toLocaleString()}
Schollege School & College Management System
====================================================`;
                downloadDocument(
                  "Student_Payment_Ledger_Receipt.txt",
                  ledgerText,
                );
              }}
              className="px-4 py-2 rounded-md bg-black text-white hover:bg-slate-800 text-sm font-normal transition cursor-pointer border-none shadow-sm flex items-center gap-1.5"
            >
              <i className="fi fi-sr-document text-sm text-white" /> Receipt PDF
            </button>
            <button
              onClick={() => setShowQuickPayModal(true)}
              className="px-5 py-2 rounded-md bg-black text-white text-sm font-bold hover:bg-black/90 transition cursor-pointer shadow-sm border-none flex items-center gap-1.5"
            >
              <i className="fi fi-sr-credit-card text-sm mr-1" /> Pay Dues
              Online (<TakaIcon className="text-xs text-white" />
              {outstandingDuesVal.toLocaleString()})
            </button>
          </div>
        </div>

        {/* 4 Financial Stat Cards (WHITE TEXT, BIG BOLD NUMBERS, SM NORMAL LABELS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 pt-2">
          {/* Card 1: Total Billed */}
          <div className="relative overflow-hidden p-5 rounded-md bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-md border-none min-h-[130px] flex flex-col justify-between">
            <i className="fi fi-sr-receipt absolute -right-3 -bottom-3 text-7xl opacity-20 text-white pointer-events-none select-none" />
            <div className="relative z-10">
              <span className="text-sm font-normal text-white uppercase tracking-wider block">
                Total Billed
              </span>
              <div className="text-3xl font-bold text-white block mt-1 tracking-tight flex items-center gap-1">
                <TakaIcon className="text-xl text-white" />
                <span>{totalBilledVal.toLocaleString()}</span>
              </div>
            </div>
            <span className="relative z-10 text-sm font-normal text-white block pt-1">
              Full Academic Year 2026
            </span>
          </div>

          {/* Card 2: Total Paid */}
          <div className="relative overflow-hidden p-5 rounded-md bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-md border-none min-h-[130px] flex flex-col justify-between">
            <i className="fi fi-sr-check-circle absolute -right-3 -bottom-3 text-7xl opacity-20 text-white pointer-events-none select-none" />
            <div className="relative z-10">
              <span className="text-sm font-normal text-white uppercase tracking-wider block">
                Total Paid
              </span>
              <div className="text-3xl font-bold text-white block mt-1 tracking-tight flex items-center gap-1">
                <TakaIcon className="text-xl text-white" />
                <span>{totalPaidVal.toLocaleString()}</span>
              </div>
            </div>
            <span className="relative z-10 text-sm font-normal text-white block pt-1">
              Verified Bank Deposits
            </span>
          </div>

          {/* Card 3: Outstanding Dues */}
          <div className="relative overflow-hidden p-5 rounded-md bg-gradient-to-br from-rose-600 to-pink-800 text-white shadow-md border-none min-h-[130px] flex flex-col justify-between">
            <i className="fi fi-sr-exclamation absolute -right-3 -bottom-3 text-7xl opacity-20 text-white pointer-events-none select-none" />
            <div className="relative z-10">
              <span className="text-sm font-normal text-white uppercase tracking-wider block">
                Outstanding Dues
              </span>
              <div className="text-3xl font-bold text-white block mt-1 tracking-tight flex items-center gap-1">
                <TakaIcon className="text-xl text-white" />
                <span>{outstandingDuesVal.toLocaleString()}</span>
              </div>
            </div>
            <span className="relative z-10 text-sm font-normal text-white block pt-1">
              Due by Aug 20, 2026
            </span>
          </div>

          {/* Card 4: Merit Waiver */}
          <div className="relative overflow-hidden p-5 rounded-md bg-gradient-to-br from-indigo-600 to-purple-800 text-white shadow-md border-none min-h-[130px] flex flex-col justify-between">
            <i className="fi fi-sr-badge-percent absolute -right-3 -bottom-3 text-7xl opacity-20 text-white pointer-events-none select-none" />
            <div className="relative z-10">
              <span className="text-sm font-normal text-white uppercase tracking-wider block">
                Merit Waiver
              </span>
              <span className="text-3xl font-bold text-white block mt-1 tracking-tight">
                {waiverPercentVal} Waiver
              </span>
            </div>
            <span className="relative z-10 text-sm font-normal text-white block pt-1 flex items-center gap-1">
              <TakaIcon className="text-xs text-white" />
              <span>{waiverAmountVal.toLocaleString()} Annual Subsidy</span>
            </span>
          </div>
        </div>

        {/* Payment Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-sm font-bold text-gray-900">
            <span>Payment Completion Ratio</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              90% Paid (<TakaIcon className="text-xs text-emerald-700" />
              {totalPaidVal.toLocaleString()} /{" "}
              <TakaIcon className="text-xs text-emerald-700" />
              {totalBilledVal.toLocaleString()})
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-md overflow-hidden p-0.5">
            <div className="h-full bg-emerald-600 rounded-md w-[90%] transition-all duration-500" />
          </div>
        </div>

        {/* Recharts Financial Line Chart (Tuition Payment & Dues Trend) */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <i className="fi fi-sr-chart-histogram text-indigo-600 text-sm" />
              Monthly Tuition Payment & Dues Line Graph (2026)
            </h3>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-800 px-2.5 py-0.5 rounded-md">
              Jan - Aug 2026
            </span>
          </div>

          <div className="h-56 w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={studentPaymentData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop
                        offset="95%"
                        stopColor="#10B981"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                    <linearGradient id="duesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                      <stop
                        offset="95%"
                        stopColor="#F43F5E"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fontWeight: 700, fill: "#64748B" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fontWeight: 700, fill: "#64748B" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B0F17",
                      color: "#FFF",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="PaidAmount"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#paidGrad)"
                    name="Tuition Paid"
                  />
                  <Area
                    type="monotone"
                    dataKey="DuesAmount"
                    stroke="#F43F5E"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#duesGrad)"
                    name="Pending Dues"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* ── PORTAL FULL VIEWPORT (MIN-H-SCREEN) OVERLAY COVERING SIDEBAR & TOP HEADER ── */}
      {showQuickPayModal &&
        mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 w-screen h-screen min-h-screen z-[99999] bg-black/65 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-md bg-white p-6 shadow-2xl space-y-4 border border-slate-100 z-[100000] animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <i className="fi fi-sr-credit-card text-sm" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Online Fee Payment Gateway
                    </h3>
                    <p className="text-sm font-normal text-gray-500 flex items-center gap-1">
                      Outstanding Balance:{" "}
                      <TakaIcon className="text-xs text-gray-700" />
                      {outstandingDuesVal.toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQuickPayModal(false)}
                  className="h-8 w-8 rounded-md bg-slate-100 text-slate-500 hover:text-black hover:bg-slate-200 border-none cursor-pointer flex items-center justify-center transition"
                  title="Close Modal"
                >
                  <i className="fi fi-rr-cross text-sm" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleProcessPayment}
                className="space-y-4 text-sm"
              >
                <div>
                  <label className="block font-bold text-gray-900 mb-1.5">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["bKash", "Nagad", "Rocket", "DBBL Nexus"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethod(m)}
                        className={`p-2.5 rounded-md font-bold text-sm border cursor-pointer transition ${
                          paymentMethod === m
                            ? "bg-black text-white border-black shadow-sm"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-1">
                    Amount to Pay (BDT)
                  </label>
                  <input
                    type="text"
                    value={`${outstandingDuesVal.toLocaleString()} BDT`}
                    readOnly
                    className="w-full p-2.5 rounded-md border border-gray-300 bg-slate-50 font-normal text-gray-900 text-sm"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowQuickPayModal(false)}
                    className="px-4 py-2 rounded-md bg-slate-100 font-bold text-gray-600 border-none cursor-pointer hover:bg-slate-200 text-sm transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-md bg-black hover:bg-black/90 text-white font-bold border-none cursor-pointer text-sm transition shadow-md flex items-center gap-1"
                  >
                    Confirm & Pay <TakaIcon className="text-xs text-white" />
                    {outstandingDuesVal.toLocaleString()}
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
