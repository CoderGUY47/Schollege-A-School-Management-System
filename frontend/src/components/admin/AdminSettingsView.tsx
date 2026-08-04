"use client";

import React, { useState } from "react";

import TakaIcon from "@/components/TakaIcon";

interface RoundedCheckboxProps {
  checked: boolean;
  onChange: () => void;
}

function RoundedCheckbox({ checked, onChange }: RoundedCheckboxProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`h-5 w-5 rounded-full flex items-center justify-center transition-all shrink-0 ${
        checked
          ? "bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/20"
          : "bg-slate-100 border border-slate-300 text-transparent hover:border-slate-400"
      }`}
    >
      <i className="fi fi-rr-check text-xs"></i>
    </button>
  );
}

export default function AdminSettingsView() {
  const [activeTab, setActiveTab] = useState<"GENERAL" | "ACADEMIC" | "SECURITY" | "NOTIFICATIONS" | "FINANCE" | "PERMISSIONS">("GENERAL");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupDone, setBackupDone] = useState(false);

  // Form States - General
  const [institutionName, setInstitutionName] = useState("Schollege International Academy & College");
  const [institutionCode, setInstitutionCode] = useState("SCH-BD-2026");
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [officialEmail, setOfficialEmail] = useState("admin.office@schollege.edu.bd");
  const [timezone, setTimezone] = useState("Asia/Dhaka (GMT+6)");

  // Academic Settings
  const [gradingScale, setGradingScale] = useState("GPA 5.0 (National Curriculum)");
  const [passingPercentage, setPassingPercentage] = useState(40);
  const [minAttendancePercent, setMinAttendancePercent] = useState(75);
  const [workingDays, setWorkingDays] = useState("SUN_THU");

  // Security Settings
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [passwordExpiryDays, setPasswordExpiryDays] = useState(90);
  const [sessionTimeoutMin, setSessionTimeoutMin] = useState(30);

  // Notification Settings
  const [enableSmsAlerts, setEnableSmsAlerts] = useState(true);
  const [enableEmailDigest, setEnableEmailDigest] = useState(true);
  const [enableFeeReminders, setEnableFeeReminders] = useState(true);

  // Finance Settings
  const [bkashEnabled, setBkashEnabled] = useState(true);
  const [nagadEnabled, setNagadEnabled] = useState(true);
  const [autoInvoicing, setAutoInvoicing] = useState(true);

  // Role Permissions Matrix State
  const [permissions, setPermissions] = useState({
    admin: { manageFees: true, editGrades: true, publishNotices: true, broadcastSms: true, viewReports: true },
    teacher: { manageFees: false, editGrades: true, publishNotices: true, broadcastSms: false, viewReports: true },
    student: { manageFees: false, editGrades: false, publishNotices: false, broadcastSms: false, viewReports: false },
    accountant: { manageFees: true, editGrades: false, publishNotices: false, broadcastSms: true, viewReports: true },
    examiner: { manageFees: false, editGrades: true, publishNotices: true, broadcastSms: false, viewReports: true },
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const handleTriggerBackup = () => {
    setBackupLoading(true);
    setTimeout(() => {
      setBackupLoading(false);
      setBackupDone(true);
      setTimeout(() => setBackupDone(false), 4000);
    }, 1500);
  };

  const togglePermission = (role: keyof typeof permissions, key: keyof typeof permissions.admin) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [key]: !prev[role][key],
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* RADIANT GRADIENT HERO HEADER */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-7 text-white shadow-xl border border-indigo-500/20">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                System Administration
              </span>
              <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur">
                Portal Controls
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3 tracking-tight">
              System Preferences & Administration
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 max-w-xl leading-relaxed">
              Configure campus management defaults, academic grading rules, security access controls, role permissions, and database backup routines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerBackup}
              disabled={backupLoading}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-lg border border-white/20 shadow-md flex items-center gap-2 transition"
            >
              {backupLoading ? <i className="fi fi-rr-spinner animate-spin text-teal-400 text-xs"></i> : <i className="fi fi-rr-download text-xs"></i>}
              {backupLoading ? "Backing up..." : "Backup Database"}
            </button>

            <button
              onClick={handleSaveSettings}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <i className="fi fi-rr-disk text-xs"></i> Save Configuration
            </button>
          </div>
        </div>
      </div>

      {/* TOAST ALERTS */}
      {savedSuccess && (
        <div className="bg-emerald-500 text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-in fade-in-90">
          <div className="flex items-center gap-2.5">
            <i className="fi fi-rr-check text-base"></i>
            <span className="text-xs font-extrabold">System preferences and portal settings saved successfully!</span>
          </div>
        </div>
      )}

      {backupDone && (
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-in fade-in-90 border border-teal-500/40">
          <div className="flex items-center gap-2.5">
            <i className="fi fi-rr-database text-teal-400 text-base"></i>
            <span className="text-xs font-extrabold">Full database snapshot (schollege_backup_2026.sql.gz) created and stored safely.</span>
          </div>
        </div>
      )}

      {/* SYSTEM DIAGNOSTICS QUICK CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Database Status</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-extrabold text-slate-900">PostgreSQL (Prisma)</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500">Latency: 14ms • Healthy</span>
          </div>
          <i className="fi fi-rr-database text-2xl text-indigo-600/20"></i>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Storage Usage</span>
            <div className="text-sm font-extrabold text-slate-900 mt-1">4.2 GB / 50 GB</div>
            <div className="w-28 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-[12%]" />
            </div>
          </div>
          <i className="fi fi-rr-hdd text-2xl text-emerald-600/20"></i>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Active WebSocket Load</span>
            <div className="text-sm font-extrabold text-slate-900 mt-1">142 Live Connections</div>
            <span className="text-[10px] font-bold text-teal-600">Chat & Alerts Synced</span>
          </div>
          <i className="fi fi-rr-chart-line text-2xl text-teal-600/20"></i>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Govt Holiday Sync</span>
            <div className="text-sm font-extrabold text-slate-900 mt-1">BD Gazette 2026</div>
            <span className="text-[10px] font-bold text-indigo-600">Synced Auto</span>
          </div>
          <i className="fi fi-rr-calendar text-2xl text-indigo-600/20"></i>
        </div>
      </div>

      {/* SETTINGS CATEGORY TABS */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-1">
        <button
          onClick={() => setActiveTab("GENERAL")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs transition ${
            activeTab === "GENERAL"
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <i className="fi fi-rr-building text-indigo-400 text-xs"></i> General & Campus
        </button>

        <button
          onClick={() => setActiveTab("ACADEMIC")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs transition ${
            activeTab === "ACADEMIC"
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <i className="fi fi-rr-book-alt text-emerald-400 text-xs"></i> Academic & Grading
        </button>

        <button
          onClick={() => setActiveTab("PERMISSIONS")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs transition ${
            activeTab === "PERMISSIONS"
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <i className="fi fi-rr-settings-sliders text-purple-400 text-xs"></i> Role Permissions
        </button>

        <button
          onClick={() => setActiveTab("SECURITY")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs transition ${
            activeTab === "SECURITY"
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <i className="fi fi-rr-shield-check text-rose-400 text-xs"></i> Security & Access
        </button>

        <button
          onClick={() => setActiveTab("NOTIFICATIONS")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs transition ${
            activeTab === "NOTIFICATIONS"
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <i className="fi fi-rr-bell text-amber-400 text-xs"></i> Notifications & SMS
        </button>

        <button
          onClick={() => setActiveTab("FINANCE")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs transition ${
            activeTab === "FINANCE"
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <i className="fi fi-rr-credit-card text-teal-400 text-xs"></i> Finance & Payment
        </button>
      </div>

      {/* TAB CONTENT PANELS */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-6">
        {/* GENERAL TAB */}
        {activeTab === "GENERAL" && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <i className="fi fi-rr-building text-indigo-600 text-base"></i> Campus Profile & Theme Customization
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage official campus identifiers, contact information, and portal accent theme.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Institution Name</label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Campus Registration Code</label>
                <input
                  type="text"
                  value={institutionCode}
                  onChange={(e) => setInstitutionCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Active Academic Session</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="2025-2026">2025 - 2026 Session</option>
                  <option value="2026-2027">2026 - 2027 Session (Current Active)</option>
                  <option value="2027-2028">2027 - 2028 Session</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Official Administrative Email</label>
                <input
                  type="email"
                  value={officialEmail}
                  onChange={(e) => setOfficialEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">System Timezone</label>
                <input
                  type="text"
                  value={timezone}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Default Currency Symbol</label>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900">
                  <span>BDT - Bangladeshi Taka Symbol (<TakaIcon className="h-3.5 w-3.5 text-slate-900" />)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ROLE PERMISSIONS TAB */}
        {activeTab === "PERMISSIONS" && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <i className="fi fi-rr-settings-sliders text-purple-600 text-base"></i> Interactive Role Permission Matrix
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Toggle granular capabilities for Admin, Teacher, Student, Accountant, and Examiner roles using rounded-full checkboxes.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                    <th className="p-3.5">System Capability</th>
                    <th className="p-3.5 text-center">Admin</th>
                    <th className="p-3.5 text-center">Teacher</th>
                    <th className="p-3.5 text-center">Student</th>
                    <th className="p-3.5 text-center">Accountant</th>
                    <th className="p-3.5 text-center">Examiner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900">Manage Fees & Payments (<TakaIcon className="h-3 w-3 text-slate-600" />)</td>
                    <td className="p-3.5 flex justify-center"><RoundedCheckbox checked={permissions.admin.manageFees} onChange={() => togglePermission('admin', 'manageFees')} /></td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.teacher.manageFees} onChange={() => togglePermission('teacher', 'manageFees')} /></div></td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.student.manageFees} onChange={() => togglePermission('student', 'manageFees')} /></div></td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.accountant.manageFees} onChange={() => togglePermission('accountant', 'manageFees')} /></div></td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.examiner.manageFees} onChange={() => togglePermission('examiner', 'manageFees')} /></div></td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900">Edit Course Grades & Results</td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.admin.editGrades} onChange={() => togglePermission('admin', 'editGrades')} /></div></td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.teacher.editGrades} onChange={() => togglePermission('teacher', 'editGrades')} /></div></td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.student.editGrades} onChange={() => togglePermission('student', 'editGrades')} /></div></td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.accountant.editGrades} onChange={() => togglePermission('accountant', 'editGrades')} /></div></td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.examiner.editGrades} onChange={() => togglePermission('examiner', 'editGrades')} /></div></td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900">Publish Notice Circulars</td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.admin.publishNotices} onChange={() => togglePermission('admin', 'publishNotices')} /></div></td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.teacher.publishNotices} onChange={() => togglePermission('teacher', 'publishNotices')} /></div></td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.student.publishNotices} onChange={() => togglePermission('student', 'publishNotices')} /></div></td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.accountant.publishNotices} onChange={() => togglePermission('accountant', 'publishNotices')} /></div></td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.examiner.publishNotices} onChange={() => togglePermission('examiner', 'publishNotices')} /></div></td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900">Broadcast Bulk SMS Alerts</td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.admin.broadcastSms} onChange={() => togglePermission('admin', 'broadcastSms')} /></div></td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.teacher.broadcastSms} onChange={() => togglePermission('teacher', 'broadcastSms')} /></div></td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.student.broadcastSms} onChange={() => togglePermission('student', 'broadcastSms')} /></div></td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.accountant.broadcastSms} onChange={() => togglePermission('accountant', 'broadcastSms')} /></div></td>
                    <td className="p-3.5 text-center"><div className="flex justify-center"><RoundedCheckbox checked={permissions.examiner.broadcastSms} onChange={() => togglePermission('examiner', 'broadcastSms')} /></div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ACADEMIC TAB */}
        {activeTab === "ACADEMIC" && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <i className="fi fi-rr-book-alt text-emerald-600 text-base"></i> Academic & Grading Policy Rules
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Define minimum passing criteria, GPA conversion scales, and working days.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Grading Scale Model</label>
                <select
                  value={gradingScale}
                  onChange={(e) => setGradingScale(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                >
                  <option value="GPA 5.0 (National Curriculum)">GPA 5.0 (National Curriculum)</option>
                  <option value="GPA 4.0 (International Standard)">GPA 4.0 (International Standard)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Minimum Passing Grade (%)</label>
                <input
                  type="number"
                  value={passingPercentage}
                  onChange={(e) => setPassingPercentage(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Weekly Working Days Schedule</label>
                <select
                  value={workingDays}
                  onChange={(e) => setWorkingDays(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                >
                  <option value="SUN_THU">Sunday - Thursday (BD Standard)</option>
                  <option value="MON_FRI">Monday - Friday (International)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "SECURITY" && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <i className="fi fi-rr-shield-check text-rose-600 text-base"></i> Security Policies & Access Controls
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage authentication security enforcement and active session policies.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Enforce Two-Factor Authentication (2FA)</h4>
                  <p className="text-[11px] text-slate-500">Require 2FA verification for all Administrative & Faculty logins.</p>
                </div>
                <RoundedCheckbox checked={enforce2FA} onChange={() => setEnforce2FA(!enforce2FA)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Password Expiry (Days)</label>
                  <input
                    type="number"
                    value={passwordExpiryDays}
                    onChange={(e) => setPasswordExpiryDays(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Idle Session Timeout (Minutes)</label>
                  <input
                    type="number"
                    value={sessionTimeoutMin}
                    onChange={(e) => setSessionTimeoutMin(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === "NOTIFICATIONS" && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <i className="fi fi-rr-bell text-amber-600 text-base"></i> Automated Notifications & SMS Broadcasts
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Toggle automated SMS broadcasts, email digests, and fee alert notifications.</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <i className="fi fi-rr-mobile text-emerald-600 text-lg"></i>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">SMS Gateway Alerts</h4>
                    <p className="text-[11px] text-slate-500">Send automated SMS for urgent announcements and exam routines.</p>
                  </div>
                </div>
                <RoundedCheckbox checked={enableSmsAlerts} onChange={() => setEnableSmsAlerts(!enableSmsAlerts)} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <i className="fi fi-rr-envelope text-indigo-600 text-lg"></i>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Weekly Email Performance Digest</h4>
                    <p className="text-[11px] text-slate-500">Send weekly academic progress reports to parents and students.</p>
                  </div>
                </div>
                <RoundedCheckbox checked={enableEmailDigest} onChange={() => setEnableEmailDigest(!enableEmailDigest)} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <i className="fi fi-rr-bell text-amber-600 text-lg"></i>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Automated Student Fee Due Reminders</h4>
                    <p className="text-[11px] text-slate-500">Dispatch reminders 3 days before monthly fee deadlines.</p>
                  </div>
                </div>
                <RoundedCheckbox checked={enableFeeReminders} onChange={() => setEnableFeeReminders(!enableFeeReminders)} />
              </div>
            </div>
          </div>
        )}

        {/* FINANCE TAB */}
        {activeTab === "FINANCE" && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <i className="fi fi-rr-credit-card text-teal-600 text-base"></i> Finance & Payment Gateway Integrations
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Enable bKash, Nagad, Rocket, and automated invoice creation for tuition collections in <TakaIcon className="h-3.5 w-3.5 text-slate-800" /> (BDT).</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="bg-pink-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded">bKash</span>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">bKash Merchant Payment Gateway</h4>
                    <p className="text-[11px] text-slate-500">Instant online fee collection via bKash Merchant API in <TakaIcon className="h-3 w-3 text-slate-700" /> BDT.</p>
                  </div>
                </div>
                <RoundedCheckbox checked={bkashEnabled} onChange={() => setBkashEnabled(!bkashEnabled)} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="bg-orange-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded">Nagad</span>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Nagad Direct Payment Gateway</h4>
                    <p className="text-[11px] text-slate-500">Automated tuition fee collection via Nagad API in <TakaIcon className="h-3 w-3 text-slate-700" /> BDT.</p>
                  </div>
                </div>
                <RoundedCheckbox checked={nagadEnabled} onChange={() => setNagadEnabled(!nagadEnabled)} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Auto PDF Receipt Generation</h4>
                  <p className="text-[11px] text-slate-500">Generate downloadable PDF payment vouchers with <TakaIcon className="h-3 w-3 text-slate-700" /> BDT breakdown upon successful payment.</p>
                </div>
                <RoundedCheckbox checked={autoInvoicing} onChange={() => setAutoInvoicing(!autoInvoicing)} />
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BAR */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-md flex items-center gap-2 transition"
          >
            <i className="fi fi-rr-disk text-emerald-400 text-xs"></i> Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
