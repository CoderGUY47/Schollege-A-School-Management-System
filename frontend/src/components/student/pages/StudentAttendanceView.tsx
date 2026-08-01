"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

// ── Attendance data ─────────────────────────────────────────
const MONTHLY_ATTENDANCE = [
  {
    month: "January 2026",
    workingDays: 22,
    present: 21,
    absent: 1,
    late: 0,
    leave: 0,
  },
  {
    month: "February 2026",
    workingDays: 20,
    present: 19,
    absent: 0,
    late: 1,
    leave: 0,
  },
  {
    month: "March 2026",
    workingDays: 24,
    present: 22,
    absent: 1,
    late: 0,
    leave: 1,
  },
  {
    month: "April 2026",
    workingDays: 22,
    present: 20,
    absent: 0,
    late: 0,
    leave: 2,
  },
  {
    month: "May 2026",
    workingDays: 21,
    present: 21,
    absent: 0,
    late: 0,
    leave: 0,
  },
  {
    month: "June 2026",
    workingDays: 20,
    present: 19,
    absent: 1,
    late: 0,
    leave: 0,
  },
  {
    month: "July 2026",
    workingDays: 23,
    present: 22,
    absent: 0,
    late: 1,
    leave: 0,
  },
  {
    month: "August 2026",
    workingDays: 8,
    present: 7,
    absent: 0,
    late: 0,
    leave: 1,
  },
];

const SUBJECT_ATTENDANCE = [
  {
    subject: "Bangla (Paper I & II)",
    code: "BNG",
    classes: 48,
    attended: 46,
    percentage: 95.8,
  },
  {
    subject: "English (Paper I & II)",
    code: "ENG",
    classes: 48,
    attended: 45,
    percentage: 93.7,
  },
  {
    subject: "Physics (Paper I & II)",
    code: "PHY",
    classes: 52,
    attended: 50,
    percentage: 96.2,
  },
  {
    subject: "Chemistry (Paper I & II)",
    code: "CHM",
    classes: 52,
    attended: 51,
    percentage: 98.1,
  },
  {
    subject: "Higher Mathematics (Paper I & II)",
    code: "MTH",
    classes: 52,
    attended: 52,
    percentage: 100,
  },
  {
    subject: "Biology (Paper I & II)",
    code: "BIO",
    classes: 48,
    attended: 44,
    percentage: 91.7,
  },
  {
    subject: "ICT (Theory & Lab)",
    code: "ICT",
    classes: 36,
    attended: 36,
    percentage: 100,
  },
  {
    subject: "Islam & Moral Education",
    code: "REL",
    classes: 24,
    attended: 23,
    percentage: 95.8,
  },
];

const LEAVE_HISTORY = [
  {
    id: "LV-001",
    startDate: "2026-03-12",
    endDate: "2026-03-12",
    days: 1,
    reason: "Medical (Fever)",
    status: "APPROVED",
  },
  {
    id: "LV-002",
    startDate: "2026-04-03",
    endDate: "2026-04-04",
    days: 2,
    reason: "Family Event (Eid)",
    status: "APPROVED",
  },
  {
    id: "LV-003",
    startDate: "2026-08-05",
    endDate: "2026-08-05",
    days: 1,
    reason: "Medical Certificate pending",
    status: "PENDING",
  },
];

const totalWorking = MONTHLY_ATTENDANCE.reduce((s, m) => s + m.workingDays, 0);
const totalPresent = MONTHLY_ATTENDANCE.reduce((s, m) => s + m.present, 0);
const totalAbsent = MONTHLY_ATTENDANCE.reduce((s, m) => s + m.absent, 0);
const totalLate = MONTHLY_ATTENDANCE.reduce((s, m) => s + m.late, 0);
const totalLeave = MONTHLY_ATTENDANCE.reduce((s, m) => s + m.leave, 0);
const overallPct = ((totalPresent / totalWorking) * 100).toFixed(1);

const getAttBadge = (pct: number) => {
  if (pct >= 95) return "bg-emerald-100 text-emerald-800";
  if (pct >= 85) return "bg-blue-100 text-blue-800";
  if (pct >= 75) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
};

// ── Component ───────────────────────────────────────────────
export default function StudentAttendanceView() {
  const [tab, setTab] = useState<"monthly" | "subject" | "leave">("monthly");
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Leave application submitted to class teacher for approval!");
    setShowLeaveModal(false);
    setLeaveForm({ startDate: "", endDate: "", reason: "" });
  };

  return (
    <div className="space-y-5 font-outfit">
      {/* ── Hero Banner ── */}
      <div className="bg-[#0B0F17] text-white p-6 rounded-md shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div className="space-y-2">
            <span className="bg-white/10 border border-white/20 text-white font-bold text-[10px] px-3 py-1 rounded-md uppercase tracking-widest">
              Schollege MS · Student Portal
            </span>
            <h1 className="text-2xl font-bold">Attendance & Logs</h1>
            <p className="text-xs text-slate-400">
              Class 12-A &nbsp;·&nbsp; Roll #261-12-0003 &nbsp;·&nbsp; Session
              2025–2026
            </p>
          </div>
          <button
            onClick={() => setShowLeaveModal(true)}
            className="border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-2.5 rounded-md flex items-center gap-2 cursor-pointer transition self-start"
          >
            <i className="fi fi-rr-envelope text-xs" />
            Apply for Leave
          </button>
        </div>

        {/* ── KPI Cards ── */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            {
              label: "Overall Rate",
              value: `${overallPct}%`,
              gradient:
                parseFloat(overallPct) >= 85
                  ? "bg-gradient-to-br from-emerald-500 to-teal-700"
                  : "bg-gradient-to-br from-rose-500 to-red-700",
            },
            {
              label: "Working Days",
              value: `${totalWorking}`,
              gradient: "bg-gradient-to-br from-slate-600 to-slate-800",
            },
            {
              label: "Days Present",
              value: `${totalPresent}`,
              gradient: "bg-gradient-to-br from-green-500 to-emerald-700",
            },
            {
              label: "Absent Days",
              value: `${totalAbsent}`,
              gradient:
                totalAbsent > 0
                  ? "bg-gradient-to-br from-rose-500 to-red-700"
                  : "bg-gradient-to-br from-emerald-500 to-green-700",
            },
            {
              label: "Late / Excused",
              value: `${totalLate + totalLeave}`,
              gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className={`${kpi.gradient} rounded-md px-5 py-6 text-center shadow-lg`}
            >
              <p className="text-xs text-white/70 font-semibold uppercase tracking-wider">
                {kpi.label}
              </p>
              <p className="text-4xl font-extrabold mt-1.5 text-white">
                {kpi.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Progress Bar ── */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold mb-1">
            <span>Attendance Progress</span>
            <span>{overallPct}% · Minimum Required: 75%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                parseFloat(overallPct) >= 85 ? "bg-emerald-400" : "bg-rose-500"
              }`}
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Tab Panel ── */}
      <div className="bg-white border border-gray-200 rounded-md shadow-xs">
        <div className="flex items-center border-b border-gray-100 px-4 pt-4 gap-1">
          {(
            [
              { key: "monthly", label: "📅 Monthly Record" },
              { key: "subject", label: "📚 Subject-wise" },
              { key: "leave", label: "📝 Leave History" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-xs font-bold px-4 py-2 rounded-md border-none cursor-pointer transition ${
                tab === t.key
                  ? "bg-black text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {/* ── Monthly Record Table ── */}
          {tab === "monthly" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                    <th className="p-3">Month</th>
                    <th className="p-3 text-center">Working Days</th>
                    <th className="p-3 text-center">Present</th>
                    <th className="p-3 text-center">Absent</th>
                    <th className="p-3 text-center">Late</th>
                    <th className="p-3 text-center">Leave</th>
                    <th className="p-3 text-center">Rate</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  {MONTHLY_ATTENDANCE.map((m) => {
                    const pct = ((m.present / m.workingDays) * 100).toFixed(1);
                    return (
                      <tr
                        key={m.month}
                        className="hover:bg-gray-50/70 transition"
                      >
                        <td className="p-3 font-semibold text-gray-900">
                          {m.month}
                        </td>
                        <td className="p-3 text-center text-gray-600">
                          {m.workingDays}
                        </td>
                        <td className="p-3 text-center font-bold text-emerald-700">
                          {m.present}
                        </td>
                        <td className="p-3 text-center font-bold text-rose-600">
                          {m.absent}
                        </td>
                        <td className="p-3 text-center font-bold text-amber-700">
                          {m.late}
                        </td>
                        <td className="p-3 text-center font-bold text-indigo-600">
                          {m.leave}
                        </td>
                        <td className="p-3 text-center font-bold text-gray-800">
                          {pct}%
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${getAttBadge(parseFloat(pct))}`}
                          >
                            {parseFloat(pct) >= 95
                              ? "EXCELLENT"
                              : parseFloat(pct) >= 85
                                ? "GOOD"
                                : parseFloat(pct) >= 75
                                  ? "WARNING"
                                  : "CRITICAL"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-900 text-white font-bold text-xs border-t-2 border-gray-700">
                    <td className="p-3 uppercase text-gray-400 tracking-wider">
                      Grand Total
                    </td>
                    <td className="p-3 text-center">{totalWorking}</td>
                    <td className="p-3 text-center text-emerald-400 font-extrabold">
                      {totalPresent}
                    </td>
                    <td className="p-3 text-center text-rose-400 font-extrabold">
                      {totalAbsent}
                    </td>
                    <td className="p-3 text-center text-amber-400">
                      {totalLate}
                    </td>
                    <td className="p-3 text-center text-indigo-400">
                      {totalLeave}
                    </td>
                    <td className="p-3 text-center text-emerald-400 font-extrabold">
                      {overallPct}%
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                          parseFloat(overallPct) >= 85
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-rose-500/20 text-rose-300"
                        }`}
                      >
                        {parseFloat(overallPct) >= 85
                          ? "✓ ELIGIBLE"
                          : "⚠ AT RISK"}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* ── Subject-wise Table ── */}
          {tab === "subject" && (
            <div className="overflow-x-auto">
              <p className="text-[10px] text-gray-400 font-semibold mb-3">
                Minimum 75% attendance required per subject to qualify for final
                exam
              </p>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                    <th className="p-3">Subject</th>
                    <th className="p-3">Code</th>
                    <th className="p-3 text-center">Total Classes</th>
                    <th className="p-3 text-center">Attended</th>
                    <th className="p-3 text-center">Missed</th>
                    <th className="p-3 text-center">Rate</th>
                    <th className="p-3 text-center">Exam Eligibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  {SUBJECT_ATTENDANCE.map((s) => (
                    <tr key={s.code} className="hover:bg-gray-50/70 transition">
                      <td className="p-3 font-semibold text-gray-900">
                        {s.subject}
                      </td>
                      <td className="p-3">
                        <span className="bg-gray-100 text-gray-700 font-bold text-[10px] px-2 py-0.5 rounded-md">
                          {s.code}
                        </span>
                      </td>
                      <td className="p-3 text-center text-gray-600">
                        {s.classes}
                      </td>
                      <td className="p-3 text-center font-bold text-emerald-700">
                        {s.attended}
                      </td>
                      <td className="p-3 text-center font-bold text-rose-600">
                        {s.classes - s.attended}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${s.percentage >= 85 ? "bg-emerald-500" : s.percentage >= 75 ? "bg-amber-500" : "bg-rose-500"}`}
                              style={{ width: `${s.percentage}%` }}
                            />
                          </div>
                          <span className="font-bold text-gray-800">
                            {s.percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                            s.percentage >= 75
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {s.percentage >= 75 ? "✓ ELIGIBLE" : "✗ NOT ELIGIBLE"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Leave History ── */}
          {tab === "leave" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] text-gray-400 font-semibold">
                  {LEAVE_HISTORY.length} leave application(s) on record for
                  session 2025–2026
                </p>
                <button
                  onClick={() => setShowLeaveModal(true)}
                  className="text-[10px] font-bold bg-black text-white px-3 py-1.5 rounded-md border-none cursor-pointer hover:bg-black/80 transition"
                >
                  + New Application
                </button>
              </div>
              {LEAVE_HISTORY.map((lv) => (
                <div
                  key={lv.id}
                  className="flex items-start gap-4 p-4 border border-gray-100 rounded-md hover:bg-gray-50/60 transition"
                >
                  <div
                    className={`mt-0.5 h-8 w-8 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${
                      lv.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-700"
                        : lv.status === "PENDING"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    <i
                      className={`fi ${lv.status === "APPROVED" ? "fi-rr-check" : lv.status === "PENDING" ? "fi-rr-clock" : "fi-rr-cross"} text-xs`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="text-xs font-bold text-gray-900">
                        {lv.reason}
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                          lv.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : lv.status === "PENDING"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {lv.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {lv.startDate} → {lv.endDate} &nbsp;·&nbsp;{" "}
                      <strong>{lv.days} day(s)</strong> &nbsp;·&nbsp; ID:{" "}
                      {lv.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Leave Application Modal ── */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-gray-900">
                Leave Application Form
              </h3>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="text-gray-400 hover:text-black border-none cursor-pointer bg-transparent text-lg"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitLeave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) =>
                      setLeaveForm((p) => ({ ...p, startDate: e.target.value }))
                    }
                    className="w-full p-2.5 rounded-md border border-gray-300 focus:outline-none focus:border-black text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) =>
                      setLeaveForm((p) => ({ ...p, endDate: e.target.value }))
                    }
                    className="w-full p-2.5 rounded-md border border-gray-300 focus:outline-none focus:border-black text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Reason for Leave
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Medical, family event, sports, etc."
                  value={leaveForm.reason}
                  onChange={(e) =>
                    setLeaveForm((p) => ({ ...p, reason: e.target.value }))
                  }
                  className="w-full p-2.5 rounded-md border border-gray-300 focus:outline-none focus:border-black text-xs resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-100 font-semibold text-gray-600 border-none cursor-pointer text-xs hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-black font-semibold text-white border-none cursor-pointer text-xs hover:bg-black/80 transition"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
