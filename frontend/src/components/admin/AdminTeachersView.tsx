"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import UserAvatar from "@/components/ui/UserAvatar";

export interface Teacher {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  designation?: string;
  isHOD?: boolean;
  assignedClass?: string;
  assignedSection?: string;
  avatarUrl?: string;
  createdAt?: string;
}

interface AdminTeachersViewProps {
  users: Teacher[];
  onAddTeacher: () => void;
  onEditTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
  onAssignTeacherClass?: (teacherId: string, assignedClass: string, assignedSection: string) => void;
}

export default function AdminTeachersView({
  users,
  onAddTeacher,
  onEditTeacher,
  onDeleteTeacher,
  onAssignTeacherClass,
}: AdminTeachersViewProps) {
  const [teacherPage, setTeacherPage] = useState(1);
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "HOD" | "TEACHING">("ALL");

  // Assignment Modal State
  const [assigningTeacher, setAssigningTeacher] = useState<Teacher | null>(null);
  const [targetClass, setTargetClass] = useState<string>("Class 12");
  const [targetSection, setTargetSection] = useState<string>("Section A");

  const allTeachers = users.filter((u) => u.role === "TEACHER" || u.role === "ADMIN");

  const filteredTeachers = allTeachers.filter((t) => {
    if (departmentFilter !== "ALL" && t.department !== departmentFilter) return false;
    if (roleFilter === "HOD" && !t.isHOD && !t.designation?.includes("HOD")) return false;
    if (roleFilter === "TEACHING" && (t.isHOD || t.designation?.includes("HOD"))) return false;
    return true;
  });

  const pageSize = 10;
  const totalPages = Math.ceil(filteredTeachers.length / pageSize) || 1;
  const currentTeachers = filteredTeachers.slice(
    (teacherPage - 1) * pageSize,
    teacherPage * pageSize
  );

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningTeacher) return;

    if (assigningTeacher.isHOD || assigningTeacher.designation?.includes("HOD")) {
      toast.error("Security Restriction: Department Heads (HODs) cannot be assigned to teach classes!");
      return;
    }

    if (onAssignTeacherClass) {
      onAssignTeacherClass(assigningTeacher.id, targetClass, targetSection);
    }
    toast.success(
      `Admin / HOD Privilege: Reassigned ${assigningTeacher.name} to ${targetClass} (${targetSection}) successfully!`
    );
    setAssigningTeacher(null);
  };

  const departmentsList = [
    "ALL",
    "Higher Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "ICT & Computer Science",
    "Bangla",
    "English",
    "Accounting & Finance",
  ];

  return (
    <div className="space-y-6 font-outfit">

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-md bg-[#0B0F17] p-7 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-white/10 text-white font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                Faculty & Department Roster
              </span>
              <span className="bg-amber-400 text-black font-extrabold text-[10px] px-3 py-1 rounded-md uppercase">
                Admin & HOD Privilege Control
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Faculty & Class Assignment Directory
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Managing 76 Faculty Members & 8 Department Heads across 12 Classes (36 Sections).
              <strong className="text-amber-300"> Note:</strong> Department Heads (HODs) hold administrative supervision only and do not teach class sections.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold bg-white/10 text-white border border-white/10 px-4 py-2 rounded-md">
              Total Faculty: {allTeachers.length}
            </span>
          </div>
        </div>
      </div>

      {/* Faculty Table Container */}
      <div className="bg-white rounded-md p-6 border border-slate-200 shadow-sm space-y-6">

        {/* Filter and Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-700">Filter Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setTeacherPage(1);
              }}
              className="text-xs px-3 py-1.5 rounded-md border border-gray-300 font-semibold focus:outline-none focus:border-black"
            >
              {departmentsList.map((d) => (
                <option key={d} value={d}>
                  {d === "ALL" ? "All Departments (8)" : d}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 ml-2">
              {(["ALL", "HOD", "TEACHING"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRoleFilter(r);
                    setTeacherPage(1);
                  }}
                  className={`text-xs font-bold px-3 py-1.5 rounded-md border cursor-pointer transition ${
                    roleFilter === r
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {r === "ALL" ? "All Staff" : r === "HOD" ? "👑 HODs Only (8)" : "Teaching Faculty"}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onAddTeacher}
            className="bg-black hover:bg-black/90 text-white px-5 py-2.5 rounded-md font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition border-none shrink-0"
          >
            <i className="fi fi-rr-plus text-xs" /> Add New Faculty Member
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-3 w-14 text-center">SL#</th>
                <th className="p-3">Faculty Member</th>
                <th className="p-3">Designation</th>
                <th className="p-3">Department</th>
                <th className="p-3">Class Assignment</th>
                <th className="p-3">Official Email</th>
                <th className="p-3 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {currentTeachers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-gray-400 font-semibold">
                    No faculty members found for the selected department/role filter.
                  </td>
                </tr>
              ) : (
                currentTeachers.map((t, idx) => {
                  const globalIndex = (teacherPage - 1) * pageSize + idx + 1;
                  const formattedSL = String(globalIndex).padStart(3, "0");
                  const isHOD = t.isHOD || t.designation?.includes("HOD");

                  return (
                    <tr key={t.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 text-center font-mono font-bold text-slate-400 bg-slate-50/50">
                        {formattedSL}
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-900 flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full overflow-hidden border border-indigo-400/50 flex items-center justify-center bg-[#2b2b36] shrink-0 shadow-xs">
                            <UserAvatar
                              name={t.name}
                              avatarUrl={t.avatarUrl}
                              sizeClassName="h-12 w-12"
                            />
                          </div>
                          <span>{t.name}</span>
                          {isHOD && (
                            <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[9px] px-2 py-0.5 rounded-md">
                              👑 HOD
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                            isHOD
                              ? "bg-amber-100 text-amber-900 border border-amber-300 font-extrabold"
                              : t.designation?.includes("Assistant Professor")
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : t.designation?.includes("Senior Lecturer")
                              ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {t.designation || "Lecturer"}
                        </span>
                      </td>

                      <td className="p-3 text-slate-700 font-semibold">
                        {t.department || "Higher Mathematics"}
                      </td>

                      <td className="p-3">
                        {isHOD ? (
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md italic">
                            No Class (Dept Head)
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-indigo-900 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md">
                            {t.assignedClass || "Class 12"} ({t.assignedSection || "Section A"})
                          </span>
                        )}
                      </td>

                      <td className="p-3 font-mono text-slate-500">{t.email}</td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isHOD && (
                            <button
                              onClick={() => setAssigningTeacher(t)}
                              className="bg-black hover:bg-black/90 text-white font-bold text-[10px] px-2.5 py-1 rounded-md transition cursor-pointer border-none shadow-xs"
                              title="Reassign Class & Section"
                            >
                              Assign Class +
                            </button>
                          )}
                          <button
                            onClick={() => onEditTeacher(t)}
                            className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition cursor-pointer border-none"
                            title="Edit Teacher Record"
                          >
                            <i className="fi fi-rr-edit text-xs" />
                          </button>
                          <button
                            onClick={() => onDeleteTeacher(t.id)}
                            className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition cursor-pointer border-none"
                            title="Delete Teacher"
                          >
                            <i className="fi fi-rr-trash text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <span className="text-xs text-slate-500 font-semibold">
            Page {teacherPage} of {totalPages} ({filteredTeachers.length} Total Records)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTeacherPage((prev) => Math.max(prev - 1, 1))}
              disabled={teacherPage === 1}
              className="px-3.5 py-1.5 rounded-md border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setTeacherPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={teacherPage === totalPages}
              className="px-3.5 py-1.5 rounded-md border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ── ADMIN / HOD CLASS ASSIGNMENT MODAL ── */}
      {assigningTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Admin & HOD Class Assignment</h3>
                <p className="text-[11px] text-gray-500">{assigningTeacher.name} ({assigningTeacher.department})</p>
              </div>
              <button
                onClick={() => setAssigningTeacher(null)}
                className="text-gray-400 hover:text-black border-none cursor-pointer bg-transparent text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAssignment} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-[11px] text-amber-900 font-semibold">
                🔒 Privilege Rule: Class assignment can only be modified by Admins or Department Heads (HOD). Teachers cannot self-assign.
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Target Class Level (Class 1 – 12)</label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-gray-300 focus:outline-none focus:border-black font-semibold text-xs"
                >
                  {Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Target Class Section</label>
                <select
                  value={targetSection}
                  onChange={(e) => setTargetSection(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-gray-300 focus:outline-none focus:border-black font-semibold text-xs"
                >
                  <option value="Section A">Section A</option>
                  <option value="Section B">Section B</option>
                  <option value="Section C">Section C</option>
                  <option value="Section D">Section D</option>
                  <option value="Section E">Section E</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setAssigningTeacher(null)}
                  className="px-4 py-2 rounded-md bg-gray-100 font-semibold text-gray-600 border-none cursor-pointer hover:bg-gray-200 text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-md bg-black hover:bg-black/90 text-white font-bold border-none cursor-pointer text-xs transition shadow-md"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
