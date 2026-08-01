"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CustomSelect from "@/components/ui/CustomSelect";
import Loader from "@/components/ui/Loader";
import { downloadDocument } from "@/lib/download-utils";

interface ExamResultRecord {
  serial: number;
  subjectCode: string;
  subjectName: string;
  fullMarks: number;
  theoryMarks: number;
  practicalMarks: number;
  marksObtained: number | null;
  isAbsent?: boolean;
}

interface MarkDistribution {
  category: string;
  fullMarks: number;
  passMark: number;
  description: string;
}

const getGradeAndPoint = (marks: number | null, isAbsent?: boolean) => {
  if (marks === null || marks === 0 || isAbsent) {
    return {
      grade: "—",
      gradePoint: "0.00",
      status: "ABSENT",
      badgeClass: "bg-gray-100 text-gray-500 font-bold",
    };
  }
  if (marks >= 80)
    return {
      grade: "A+",
      gradePoint: "5.00",
      status: "PASSED",
      badgeClass: "bg-emerald-100 text-emerald-800 font-bold",
    };
  if (marks >= 70)
    return {
      grade: "A",
      gradePoint: "4.00",
      status: "PASSED",
      badgeClass: "bg-emerald-100 text-emerald-700 font-bold",
    };
  if (marks >= 60)
    return {
      grade: "A-",
      gradePoint: "3.50",
      status: "PASSED",
      badgeClass: "bg-blue-100 text-blue-800 font-bold",
    };
  if (marks >= 50)
    return {
      grade: "B",
      gradePoint: "3.00",
      status: "PASSED",
      badgeClass: "bg-indigo-100 text-indigo-800 font-bold",
    };
  if (marks >= 40)
    return {
      grade: "C",
      gradePoint: "2.00",
      status: "PASSED",
      badgeClass: "bg-amber-100 text-amber-800 font-bold",
    };
  if (marks >= 33)
    return {
      grade: "D",
      gradePoint: "1.00",
      status: "PASSED",
      badgeClass: "bg-orange-100 text-orange-800 font-bold",
    };
  return {
    grade: "F",
    gradePoint: "0.00",
    status: "FAILED",
    badgeClass: "bg-red-100 text-red-800 font-bold",
  };
};

const calcGPA = (results: ExamResultRecord[]) => {
  const valid = results.filter(
    (r) => r.marksObtained !== null && !r.isAbsent && r.marksObtained > 0,
  );
  if (!valid.length) return "0.00";
  const total = valid.reduce(
    (sum, r) => sum + parseFloat(getGradeAndPoint(r.marksObtained).gradePoint),
    0,
  );
  return (total / valid.length).toFixed(2);
};

const calcTotal = (results: ExamResultRecord[]) =>
  results.reduce((sum, r) => sum + (r.marksObtained || 0), 0);

export default function StudentExamsView() {
  const [selectedTerm, setSelectedTerm] = useState("Mid-Term Exam 2026");
  const [examResults, setExamResults] = useState<ExamResultRecord[]>([]);
  const [distribution, setDistribution] = useState<MarkDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"marksheet" | "distribution">(
    "marksheet",
  );

  const termOptions = [
    { value: "Mid-Term Exam 2026", label: "Mid-Term Exam 2026" },
    { value: "Final Term Exam 2025", label: "Final Term Exam 2025" },
    { value: "Pre-Test Examination", label: "Pre-Test Examination" },
  ];

  useEffect(() => {
    const fetchExams = async () => {
      setIsLoading(true);
      try {
        const [resExams, resDist] = await Promise.all([
          fetch(`/api/exams?term=${encodeURIComponent(selectedTerm)}`),
          fetch(`/api/exams?type=distribution`),
        ]);
        const dataExams = await resExams.json();
        const dataDist = await resDist.json();
        if (dataExams.results) setExamResults(dataExams.results);
        if (dataDist.distribution) setDistribution(dataDist.distribution);
      } catch {
        toast.error("Failed to fetch marksheets from backend API");
      } finally {
        setIsLoading(false);
      }
    };
    fetchExams();
  }, [selectedTerm]);

  const gpa = calcGPA(examResults);
  const totalObtained = calcTotal(examResults);
  const totalFull = examResults.reduce((sum, r) => sum + r.fullMarks, 0);
  const passedCount = examResults.filter(
    (r) => r.marksObtained !== null && !r.isAbsent && r.marksObtained >= 33,
  ).length;
  const absentCount = examResults.filter((r) => r.isAbsent).length;

  return (
    <div className="space-y-5 font-outfit">
      {/* ── Hero Banner ── */}
      <div className="bg-[#0B0F17] text-white p-6 rounded-md shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-white/10 border border-white/20 text-white font-bold text-[10px] px-3 py-1 rounded-md uppercase tracking-widest">
              Schollege MS · Academic
            </span>
            <h1 className="text-2xl font-bold text-white">
              Examinations & Result Marksheet
            </h1>
            <p className="text-xs text-slate-400">
              Class 12-A &nbsp;·&nbsp; Roll #261-12-0003 &nbsp;·&nbsp; Science
              Stream
            </p>
          </div>
          <button
            onClick={() => {
              const transcript = `====================================================
SCHOLLEGE OFFICIAL ACADEMIC TRANSCRIPT
====================================================
Student Roll: 261-12-0003
Class & Section: Class 12-A
Stream: Science Stream
Cumulative GPA: ${gpa} / 5.00
Letter Grade: A+ (Outstanding)
Percentage: 88.5%

Generated on: ${new Date().toLocaleString()}
Schollege School & College Management System
====================================================`;
              downloadDocument(
                "Official_Academic_Transcript_Class12.txt",
                transcript,
              );
            }}
            className="border-none bg-[#0B0F17] hover:bg-slate-800 text-white font-normal text-base px-5 py-2.5 rounded-md flex items-center gap-2 shadow-md cursor-pointer transition shrink-0 self-start"
          >
            <i className="fi fi-rr-download text-base text-white" />
            Download Transcript
          </button>
        </div>

        {/* ── Summary KPIs ── */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "GPA",
              value: gpa,
              sub: "out of 5.00",
              color: "text-white",
              gradient: "bg-gradient-to-br from-emerald-500 to-teal-700",
            },
            {
              label: "Total Marks",
              value: `${totalObtained}`,
              sub: `out of ${totalFull}`,
              color: "text-white",
              gradient: "bg-gradient-to-br from-sky-500 to-blue-700",
            },
            {
              label: "Subjects Passed",
              value: `${passedCount}/${examResults.length}`,
              sub: "subjects",
              color: "text-white",
              gradient: "bg-gradient-to-br from-violet-500 to-purple-700",
            },
            {
              label: "Absent Papers",
              value: `${absentCount}`,
              sub: "paper(s)",
              color: "text-white",
              gradient:
                absentCount > 0
                  ? "bg-gradient-to-br from-rose-500 to-red-700"
                  : "bg-gradient-to-br from-emerald-500 to-green-700",
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className={`${kpi.gradient} rounded-md px-5 py-6 text-center shadow-lg`}
            >
              <p className="text-xs text-white/70 font-semibold uppercase tracking-wider">
                {kpi.label}
              </p>
              <p className={`text-4xl font-extrabold mt-1.5 ${kpi.color}`}>
                {kpi.value}
              </p>
              <p className="text-xs text-white/60 mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="bg-white border border-gray-200 rounded-md shadow-xs">
        <div className="flex items-center border-b border-gray-100 px-4 pt-4 gap-1">
          {(["marksheet", "distribution"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-bold px-4 py-2 rounded-md border-none cursor-pointer transition capitalize ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab === "marksheet"
                ? "📋 Marksheet Grid"
                : "📊 Mark Distribution"}
            </button>
          ))}

          {/* Term selector (only for marksheet tab) */}
          {activeTab === "marksheet" && (
            <div className="ml-auto">
              <CustomSelect
                options={termOptions}
                value={selectedTerm}
                onChange={(val) => setSelectedTerm(val)}
              />
            </div>
          )}
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="py-14 flex flex-col items-center justify-center">
              <Loader
                size="md"
                text="Loading exam marksheets from backend API..."
              />
            </div>
          ) : activeTab === "marksheet" ? (
            /* ── Marksheet Table ── */
            <div className="overflow-x-auto">
              <p className="text-[10px] text-gray-400 font-semibold mb-3">
                NCTB Grading Scale &nbsp;|&nbsp; A+ ≥ 80 &nbsp;·&nbsp; A ≥ 70
                &nbsp;·&nbsp; A- ≥ 60 &nbsp;·&nbsp; B ≥ 50 &nbsp;·&nbsp; C ≥ 40
                &nbsp;·&nbsp; D ≥ 33 &nbsp;·&nbsp; F &lt; 33
              </p>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                    <th className="p-3">#</th>
                    <th className="p-3">Code</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3 text-center">Full Marks</th>
                    <th className="p-3 text-center">Theory</th>
                    <th className="p-3 text-center">Practical</th>
                    <th className="p-3 text-center">Obtained</th>
                    <th className="p-3 text-center">Grade</th>
                    <th className="p-3 text-center">GPA</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  {examResults.map((res) => {
                    const { grade, gradePoint, status, badgeClass } =
                      getGradeAndPoint(res.marksObtained, res.isAbsent);
                    const isAbsent = res.isAbsent || res.marksObtained === null;
                    return (
                      <tr
                        key={res.serial}
                        className={`hover:bg-gray-50/70 transition ${isAbsent ? "opacity-60" : ""}`}
                      >
                        <td className="p-3 text-gray-400 font-bold text-[11px]">
                          {String(res.serial).padStart(2, "0")}
                        </td>
                        <td className="p-3">
                          <span className="bg-gray-100 text-gray-700 font-bold text-[10px] px-2 py-0.5 rounded-md">
                            {res.subjectCode}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-gray-900">
                          {res.subjectName}
                        </td>
                        <td className="p-3 text-center font-bold text-gray-700">
                          {res.fullMarks}
                        </td>
                        <td className="p-3 text-center text-gray-500">
                          {res.theoryMarks}
                        </td>
                        <td className="p-3 text-center text-gray-500">
                          {res.practicalMarks}
                        </td>
                        <td className="p-3 text-center font-bold">
                          {isAbsent ? (
                            <span className="text-gray-400 italic">Absent</span>
                          ) : (
                            <span className="text-gray-900">
                              {res.marksObtained} / 100
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`text-[11px] px-2.5 py-0.5 rounded-md ${badgeClass}`}
                          >
                            {grade}
                          </span>
                        </td>
                        <td className="p-3 text-center font-bold text-gray-800">
                          {gradePoint}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                              status === "PASSED"
                                ? "bg-emerald-100 text-emerald-800"
                                : status === "FAILED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Totals Footer */}
                <tfoot>
                  <tr className="bg-gray-900 text-white font-bold text-xs border-t-2 border-gray-700">
                    <td
                      colSpan={6}
                      className="p-3 text-right uppercase tracking-wider text-gray-400"
                    >
                      Grand Total &amp; GPA
                    </td>
                    <td className="p-3 text-center text-white">
                      {totalObtained} / {totalFull}
                    </td>
                    <td className="p-3 text-center" colSpan={2}>
                      <span className="text-emerald-400 font-extrabold text-sm">
                        GPA {gpa}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                          absentCount === 0 && parseFloat(gpa) >= 1.0
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-rose-500/20 text-rose-300"
                        }`}
                      >
                        {absentCount === 0 && parseFloat(gpa) >= 1.0
                          ? "PROMOTED"
                          : "REVIEW REQUIRED"}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            /* ── Mark Distribution Table ── */
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Mark Distribution Breakdown
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  NCTB / SCH standard mark allocation per examination category
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                      <th className="p-3">Assessment Category</th>
                      <th className="p-3 text-center">Full Marks</th>
                      <th className="p-3 text-center">Pass Mark</th>
                      <th className="p-3 text-center">Pass %</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                    {distribution.map((d, i) => (
                      <tr key={i} className="hover:bg-gray-50/70 transition">
                        <td className="p-3 font-semibold text-gray-900">
                          {d.category}
                        </td>
                        <td className="p-3 text-center">
                          <span className="bg-indigo-100 text-indigo-800 font-bold text-[11px] px-2.5 py-0.5 rounded-md">
                            {d.fullMarks}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="bg-amber-100 text-amber-800 font-bold text-[11px] px-2.5 py-0.5 rounded-md">
                            {d.passMark}
                          </span>
                        </td>
                        <td className="p-3 text-center font-bold text-gray-700">
                          {Math.round((d.passMark / d.fullMarks) * 100)}%
                        </td>
                        <td className="p-3 text-gray-500 max-w-[280px] leading-relaxed">
                          {d.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-900 text-white font-bold text-xs border-t-2 border-gray-700">
                      <td className="p-3 uppercase tracking-wider text-gray-400">
                        Total Per Subject
                      </td>
                      <td className="p-3 text-center text-white text-sm font-extrabold">
                        100
                      </td>
                      <td className="p-3 text-center text-amber-300 font-extrabold">
                        33
                      </td>
                      <td className="p-3 text-center text-gray-300">33%</td>
                      <td className="p-3 text-gray-400">
                        Minimum pass mark across all components combined
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Grade Scale Reference Table */}
              <div className="mt-6 border-t border-gray-100 pt-5">
                <div className="mb-3">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Grade Scale Reference Table
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Official National Curriculum & Textbook Board (NCTB) Grade
                    Point Scale & Evaluation Rates
                  </p>
                </div>
                <div className="overflow-x-auto rounded-md border border-gray-200">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-900 text-white font-bold uppercase text-[10px]">
                        <th className="p-3">Marks Range</th>
                        <th className="p-3 text-center">Letter Grade</th>
                        <th className="p-3 text-center">Grade Point (GP)</th>
                        <th className="p-3">Performance Rate / Description</th>
                        <th className="p-3 text-center">Academic Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                      {[
                        {
                          range: "80% – 100%",
                          grade: "A+",
                          gp: "5.00",
                          desc: "Outstanding / Exceptional Mastery",
                          badge: "bg-emerald-100 text-emerald-800",
                        },
                        {
                          range: "70% – 79%",
                          grade: "A",
                          gp: "4.00",
                          desc: "Excellent / High Standard",
                          badge: "bg-emerald-100 text-emerald-700",
                        },
                        {
                          range: "60% – 69%",
                          grade: "A-",
                          gp: "3.50",
                          desc: "Very Good / Above Average",
                          badge: "bg-blue-100 text-blue-800",
                        },
                        {
                          range: "50% – 59%",
                          grade: "B",
                          gp: "3.00",
                          desc: "Good / Satisfactory Standard",
                          badge: "bg-indigo-100 text-indigo-800",
                        },
                        {
                          range: "40% – 49%",
                          grade: "C",
                          gp: "2.00",
                          desc: "Acceptable / Basic Proficiency",
                          badge: "bg-amber-100 text-amber-800",
                        },
                        {
                          range: "33% – 39%",
                          grade: "D",
                          gp: "1.00",
                          desc: "Pass / Minimum Threshold",
                          badge: "bg-orange-100 text-orange-800",
                        },
                        {
                          range: "0% – 32%",
                          grade: "F",
                          gp: "0.00",
                          desc: "Fail / Needs Improvement",
                          badge: "bg-red-100 text-red-800",
                        },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50/80 transition">
                          <td className="p-3 font-bold text-gray-900">
                            {row.range}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`text-[11px] font-extrabold px-3 py-0.5 rounded-md ${row.badge}`}
                            >
                              {row.grade}
                            </span>
                          </td>
                          <td className="p-3 text-center font-bold text-gray-900">
                            {row.gp}
                          </td>
                          <td className="p-3 text-gray-700">{row.desc}</td>
                          <td className="p-3 text-center">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                row.grade === "F"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {row.grade === "F" ? "FAILED" : "PASSED"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
