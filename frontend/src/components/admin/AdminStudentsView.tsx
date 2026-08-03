"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CustomSelect from "@/components/ui/CustomSelect";

interface AdminStudentsViewProps {
  users?: any[];
  onAddStudent?: () => void;
  onEditStudent?: (student: any) => void;
  onDeleteStudent?: (id: string) => void;
}

export default function AdminStudentsView({
  users = [],
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
}: AdminStudentsViewProps) {
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [selectedSection, setSelectedSection] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({
    totalCount: 900,
    totalPages: 36,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, [selectedClass, selectedSection, searchQuery, page]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        className: selectedClass,
        sectionName: selectedSection,
        search: searchQuery,
        page: String(page),
        limit: "25",
      });

      const res = await fetch(`/api/students?${query.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setStudentsData(json.students || []);
        setMeta(json.meta || {});
      }
    } catch (err: any) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  const classOptions = [
    { value: "ALL", label: "All Classes (Class 1 - 12)" },
    ...Array.from({ length: 12 }, (_, i) => ({
      value: `Class ${i + 1}`,
      label: `Class ${i + 1}`,
    })),
  ];

  const sectionOptions = [
    { value: "ALL", label: "All Sections (A, B, C)" },
    { value: "Section A", label: "Section A (25 Students)" },
    { value: "Section B", label: "Section B (25 Students)" },
    { value: "Section C", label: "Section C (25 Students)" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0B0F17] p-7 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="bg-white/10 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                Schollege MS Academic
              </span>
              <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur">
                NCTB National Curriculum
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-3 tracking-tight">
              Students Roster (Class 1 - 12 • 36 Sections)
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 max-w-xl leading-relaxed">
              900 Enrolled Students • 12 Academic Classes (Class 1 to 12) • 3
              Sections per Class (Sec A, B, C) • 25 Students per Section.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold bg-white/10 text-white border border-white/10 px-4 py-2 rounded-full backdrop-blur">
              Total Enrolled: {meta.totalCount || 900} Students
            </span>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar with CustomSelect */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Custom Class & Section Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <CustomSelect
            options={classOptions}
            value={selectedClass}
            onChange={(val) => {
              setSelectedClass(val);
              setPage(1);
            }}
          />

          <CustomSelect
            options={sectionOptions}
            value={selectedSection}
            onChange={(val) => {
              setSelectedSection(val);
              setPage(1);
            }}
          />
        </div>

        {/* Search & Add Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <input
            type="text"
            placeholder="Search student name, Roll #, ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black w-full md:w-64"
          />

          {onAddStudent && (
            <button
              onClick={onAddStudent}
              className="bg-black hover:bg-black/90 text-white px-5 py-2 rounded-full font-bold text-xs flex items-center gap-2 shadow-sm shrink-0 cursor-pointer border-none"
            >
              <i className="fi fi-rr-plus text-xs"></i> Add Student
            </button>
          )}
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Schollege Official Student Roster
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            Showing Page {meta.currentPage || 1} of {meta.totalPages || 1}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-semibold text-gray-500 flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-indigo-600 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                  <th className="p-3">ID #</th>
                  <th className="p-3">Roll</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Class & Section</th>
                  <th className="p-3">Group</th>
                  <th className="p-3">GPA</th>
                  <th className="p-3">Attendance</th>
                  <th className="p-3">Tuition</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {studentsData.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-500">
                      {s.studentIdNumber || s.id}
                    </td>
                    <td className="p-3 font-bold text-black">#{s.rollNo}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-black text-white font-bold text-[10px] flex items-center justify-center">
                          {s.avatarInitials || s.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">
                            {s.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {s.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">
                      {s.className} • {s.sectionName}
                    </td>
                    <td className="p-3">
                      <span className="bg-gray-100 text-gray-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                        {s.group}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-emerald-600">
                      {s.gpa?.toFixed(2) || "4.00"}
                    </td>
                    <td className="p-3 font-semibold text-slate-700">
                      {s.attendanceRate || "96.5%"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          s.tuitionStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {s.tuitionStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditStudent && onEditStudent(s)}
                          className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="Edit Student Record"
                        >
                          <i className="fi fi-rr-edit text-xs"></i>
                        </button>
                        <button
                          onClick={() =>
                            onDeleteStudent && onDeleteStudent(s.id)
                          }
                          className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="Delete Student"
                        >
                          <i className="fi fi-rr-trash text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <span className="text-xs text-slate-500 font-semibold">
            Page {meta.currentPage || 1} of {meta.totalPages || 1} (
            {meta.totalCount || 900} Total Students)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, meta.totalPages || 36))
              }
              disabled={page === (meta.totalPages || 36)}
              className="px-4 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
