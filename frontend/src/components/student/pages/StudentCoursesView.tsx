"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CustomSelect from "@/components/ui/CustomSelect";
import { downloadDocument } from "@/lib/download-utils";

// Subject Color Badge Theme Helper
const getSubjectBadgeTheme = (name: string, code: string) => {
  const lower = (name + " " + code).toLowerCase();

  if (lower.includes("phy")) return "bg-indigo-100 text-indigo-800";
  if (lower.includes("che")) return "bg-emerald-100 text-emerald-800";
  if (lower.includes("math")) return "bg-blue-100 text-blue-800";
  if (lower.includes("bio")) return "bg-teal-100 text-teal-800";
  if (lower.includes("ict") || lower.includes("computer")) return "bg-fuchsia-100 text-fuchsia-800";
  if (lower.includes("bangla") || lower.includes("ban")) return "bg-rose-100 text-rose-800";
  if (lower.includes("eng")) return "bg-sky-100 text-sky-800";
  if (lower.includes("acc") || lower.includes("fin") || lower.includes("bus")) return "bg-amber-100 text-amber-800";
  if (lower.includes("his") || lower.includes("civ") || lower.includes("geo") || lower.includes("eco")) return "bg-violet-100 text-violet-800";

  return "bg-slate-100 text-slate-800";
};

export default function StudentCoursesView() {
  const [selectedClass, setSelectedClass] = useState("Class 12");
  const [selectedGroup, setSelectedGroup] = useState("Science");
  const [curriculumData, setCurriculumData] = useState<any | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if current selected class has group streams (Class 9 - 12)
  const classNum = parseInt(selectedClass.replace("Class ", ""), 10);
  const hasGroups = classNum >= 9;

  useEffect(() => {
    fetchCurriculum();
  }, [selectedClass]);

  const fetchCurriculum = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/curriculum?className=${encodeURIComponent(selectedClass)}`);
      if (res.ok) {
        const json = await res.json();
        setCurriculumData(json);
      }
    } catch (err: any) {
      console.error("Failed to load curriculum:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectsForGroup = () => {
    if (!curriculumData || !curriculumData.subjects) return [];
    if (hasGroups && curriculumData.subjects[selectedGroup]) {
      return curriculumData.subjects[selectedGroup];
    }
    if (curriculumData.subjects["DEFAULT"]) {
      return curriculumData.subjects["DEFAULT"];
    }
    return Object.values(curriculumData.subjects)[0] as any[] || [];
  };

  const currentSubjects = getSubjectsForGroup();

  const classOptions = Array.from({ length: 12 }, (_, i) => ({
    value: `Class ${i + 1}`,
    label: `Class ${i + 1}`,
  }));

  const groupOptions = [
    { value: "Science", label: "Science" },
    { value: "Commerce", label: "Commerce" },
    { value: "Arts", label: "Arts" },
  ];

  return (
    <div className="space-y-6">
      {/* Header (rounded-md) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-md border-none shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            NCTB Curriculum Courses ({selectedClass})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Schollege MS Official Syllabus • {currentSubjects.length} Registered Subjects
            {hasGroups ? ` (${selectedGroup} Stream)` : " (General Curriculum)"}
          </p>
        </div>

        {/* Custom Class & Group Dropdown Selectors */}
        <div className="flex items-center gap-3">
          <CustomSelect
            options={classOptions}
            value={selectedClass}
            onChange={(val) => {
              setSelectedClass(val);
              const newNum = parseInt(val.replace("Class ", ""), 10);
              if (newNum < 9) {
                setSelectedGroup("");
              } else if (!selectedGroup) {
                setSelectedGroup("Science");
              }
            }}
          />

          {/* Render Group Selector ONLY for Class 9 to Class 12 */}
          {hasGroups && (
            <CustomSelect
              options={groupOptions}
              value={selectedGroup}
              placeholder="Select Group"
              onChange={(val) => setSelectedGroup(val)}
            />
          )}
        </div>
      </div>

      {/* Grid Table for Enrolled Courses (rounded-md) */}
      <div className="bg-white rounded-md p-6 border-none shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">
            Curriculum Grid Table ({selectedClass} • {hasGroups ? `${selectedGroup} Stream` : "General"})
          </h3>
          <span className="text-xs font-bold bg-gray-100 text-gray-800 px-3 py-1 rounded-md">
            {currentSubjects.length} Courses Registered
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-semibold text-gray-500 flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-indigo-600 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-bold uppercase text-[10px]">
                  <th className="p-3.5">Serial #</th>
                  <th className="p-3.5">Course Code</th>
                  <th className="p-3.5">Course Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Credit Hrs</th>
                  <th className="p-3.5">Marks Breakdown</th>
                  <th className="p-3.5">Registration Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {currentSubjects.map((sub: any, idx: number) => {
                  const badgeClass = getSubjectBadgeTheme(sub.name, sub.code);

                  return (
                    <tr key={sub.code} className="hover:bg-gray-50/80 transition">
                      <td className="p-3.5 font-bold text-gray-500">#{String(idx + 1).padStart(2, "0")}</td>
                      <td className="p-3.5">
                        <span className={`font-bold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider ${badgeClass}`}>
                          {sub.code}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-gray-900 block leading-tight">{sub.name}</span>
                        <span className="text-[10px] text-gray-400 font-normal">NCTB Approved Syllabus</span>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-gray-100 text-gray-800 font-bold text-[10px] px-2.5 py-0.5 rounded-md">
                          {sub.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-gray-900">
                        {sub.creditHours} Hrs / Wk
                      </td>
                      <td className="p-3.5 text-gray-600">
                        Total: <strong>{sub.fullMarks} Marks</strong> (Theory: {sub.theoryMarks}{sub.practicalMarks ? `, Practical: ${sub.practicalMarks}` : ""})
                      </td>
                      <td className="p-3.5">
                        <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-md flex items-center gap-1 w-max">
                          <i className="fi fi-rr-check text-[10px]"></i> Registered ({selectedClass})
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedSubject(sub)}
                          className="border-none bg-black hover:bg-black/90 text-white font-bold px-3.5 py-1.5 rounded-md text-xs transition cursor-pointer shadow-xs"
                        >
                          View Syllabus →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Subject Detail Modal (rounded-md) */}
      {selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-md bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 border-none">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold bg-black text-white px-3 py-1 rounded-md">
                  {selectedSubject.code}
                </span>
                <h2 className="text-lg font-bold text-gray-900 mt-2">
                  {selectedSubject.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSubject(null)}
                className="text-gray-400 hover:text-black transition text-lg cursor-pointer border-none bg-transparent"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-md bg-gray-50 text-xs space-y-2 border-none">
              <p><strong>Curriculum:</strong> Schollege MS / NCTB National Curriculum</p>
              <p><strong>Class Level:</strong> {selectedClass}</p>
              {hasGroups && <p><strong>Academic Stream:</strong> {selectedGroup}</p>}
              <p><strong>Full Marks:</strong> {selectedSubject.fullMarks} (Theory: {selectedSubject.theoryMarks}{selectedSubject.practicalMarks ? `, Practical: ${selectedSubject.practicalMarks}` : ""})</p>
              <p><strong>Credit Hours:</strong> {selectedSubject.creditHours} Hours / Week</p>
              <p><strong>Registration Status:</strong> Enrolled & Verified in {selectedClass}</p>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-gray-900">Lecture Materials & Syllabi</h4>
              <div className="p-3 bg-gray-50 rounded-md flex items-center justify-between hover:bg-gray-100 transition border-none">
                <span className="font-semibold text-gray-800">📄 {selectedSubject.name} - Official NCTB Syllabus.pdf</span>
                <button
                  onClick={() => {
                    const syllabus = `====================================================
SCHOLLEGE OFFICIAL NCTB SYLLABUS - ${selectedSubject.name.toUpperCase()}
====================================================
Course Code: ${selectedSubject.code}
Target Class: ${selectedClass}
Teacher / Head: ${selectedSubject.teacher}

CHAPTER OUTLINE & LEARNING MODULES:
1. Core Fundamental Concepts & Theories
2. Laboratory Experiments & Practical Application
3. Advanced Numerical Analysis & Problem Solving
4. Final Board Examination Preparation & Model Tests

Schollege School & College Management System
====================================================`;
                    downloadDocument(`${selectedSubject.name.replace(/[^a-zA-Z0-9]/g, "_")}_Syllabus.txt`, syllabus);
                  }}
                  className="font-normal text-white bg-black hover:bg-slate-800 text-xs px-3 py-1.5 rounded-md cursor-pointer border-none shadow-xs"
                >
                  Download ↓
                </button>
              </div>
              <div className="p-3 bg-gray-50 rounded-md flex items-center justify-between hover:bg-gray-100 transition border-none">
                <span className="font-semibold text-gray-800">📊 Schollege Model Questions & Lecture Notes.pdf</span>
                <button
                  onClick={() => {
                    const notes = `====================================================
SCHOLLEGE LECTURE NOTES & MODEL QUESTIONS
====================================================
Subject: ${selectedSubject.name} (${selectedSubject.code})
Instructor: ${selectedSubject.teacher}

SUMMARY NOTES:
- Key formulas, derivations, and board question solutions.
- Step-by-step problem solving guide for Mid-Term & Final Exams.

Schollege School & College Management System
====================================================`;
                    downloadDocument(`${selectedSubject.name.replace(/[^a-zA-Z0-9]/g, "_")}_Lecture_Notes.txt`, notes);
                  }}
                  className="font-normal text-white bg-black hover:bg-slate-800 text-xs px-3 py-1.5 rounded-md cursor-pointer border-none shadow-xs"
                >
                  Download ↓
                </button>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedSubject(null)}
                className="border-none bg-black text-white font-bold text-xs px-5 py-2 rounded-md cursor-pointer shadow-md"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
