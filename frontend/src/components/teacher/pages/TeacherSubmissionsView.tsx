"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import Loader from "@/components/ui/Loader";
import { pushNotification } from "@/lib/download-utils";

export interface SubmissionRecord {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentName: string;
  studentRoll: string;
  className: string;
  submittedAt: string;
  fileUrl?: string;
  gradeMarks?: number;
  maxMarks: number;
  feedback?: string;
  status: "GRADED" | "SUBMITTED" | "NEEDS_REVISION";
}

export default function TeacherSubmissionsView() {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeSub, setActiveSub] = useState<SubmissionRecord | null>(null);

  // Grading Form
  const [gradeMarks, setGradeMarks] = useState<number | "">("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<"GRADED" | "SUBMITTED" | "NEEDS_REVISION">("GRADED");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error("Failed to load submissions:", err);
      toast.error("Failed to load submissions from API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleOpenGradeModal = (sub: SubmissionRecord) => {
    setActiveSub(sub);
    setGradeMarks(sub.gradeMarks !== undefined ? sub.gradeMarks : 85);
    setFeedback(sub.feedback || "Well presented calculations. Good understanding of core concepts.");
    setStatus(sub.status || "GRADED");
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSub) return;

    if (gradeMarks === "" || Number(gradeMarks) < 0 || Number(gradeMarks) > activeSub.maxMarks) {
      toast.error(`Please enter valid grade marks (0 - ${activeSub.maxMarks})`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeSub.id,
          gradeMarks: Number(gradeMarks),
          feedback,
          status,
        }),
      });

      if (res.ok) {
        toast.success(`Grade saved for ${activeSub.studentName} (${gradeMarks}/${activeSub.maxMarks})!`);
        pushNotification(
          "Submission Grade Saved",
          `Evaluated assignment solution for ${activeSub.studentName}: Marks ${gradeMarks}/${activeSub.maxMarks}.`,
          "ASSIGNMENT",
          "TEACHER"
        );
        setActiveSub(null);
        fetchSubmissions();
      } else {
        toast.error("Failed to update submission grade");
      }
    } catch (err) {
      console.error("Error grading submission:", err);
      toast.error("An error occurred while grading submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center p-20 bg-white rounded-md border border-gray-500/30 shadow-md min-h-[360px] font-outfit">
        <Loader size="md" text="Loading student assignment submissions..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-outfit">
      {/* Hero Header */}
      <div className="bg-[#0B0F17] text-white p-6 md:p-8 rounded-md shadow-xl border border-gray-400/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-white/10 border border-white/20 text-white font-normal text-xs px-3 py-1 rounded-md uppercase tracking-wider">
              Student Submissions Evaluation
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Assignment Submissions & Grading Queue
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
              Review submitted student homework, examine uploaded PDFs/files, assign marks out of maximum points, and provide constructive feedback.
            </p>
          </div>
        </div>
      </div>

      {/* Submissions Table Container */}
      <div className="rounded-md border border-gray-400/50 bg-white p-6 shadow-inner space-y-5">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <i className="fi fi-sr-check-circle text-indigo-600 text-sm" />
              Student Submissions ({submissions.length})
            </h3>
            <p className="text-sm text-gray-500 font-normal mt-0.5">
              List of student homework responses awaiting or completed evaluation
            </p>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm font-medium">
            No submissions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-normal">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-50 text-gray-700 font-bold uppercase text-[11px]">
                  <th className="p-3">Student Name & Roll</th>
                  <th className="p-3">Assignment & Class</th>
                  <th className="p-3">Submitted Date</th>
                  <th className="p-3 text-center">Score / Max</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3">
                      <span className="font-bold text-gray-900 block">{s.studentName}</span>
                      <span className="text-[10px] text-gray-500 block">Roll: {s.studentRoll}</span>
                    </td>

                    <td className="p-3">
                      <span className="font-bold text-gray-900 block">{s.assignmentTitle}</span>
                      <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block">
                        {s.className}
                      </span>
                    </td>

                    <td className="p-3 text-gray-600 font-medium">{s.submittedAt}</td>

                    <td className="p-3 text-center">
                      {s.gradeMarks !== undefined ? (
                        <span className="font-bold text-emerald-600 text-sm">
                          {s.gradeMarks} / {s.maxMarks}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-normal">Not Graded</span>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[10px] font-bold ${
                          s.status === "GRADED"
                            ? "bg-purple-100 text-purple-800"
                            : s.status === "NEEDS_REVISION"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-900 animate-pulse"
                        }`}
                      >
                        <i className={`fi ${s.status === "GRADED" ? "fi-sr-check-circle" : "fi-sr-time-twelve"} text-xs`} />
                        {s.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleOpenGradeModal(s)}
                        className="px-4 py-2 rounded-md bg-black text-white hover:bg-slate-800 text-sm font-normal transition border-none cursor-pointer shadow-sm"
                      >
                        {s.status === "GRADED" ? "Edit Grade" : "Grade & Review"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── GRADE SUBMISSION MODAL ── */}
      {activeSub && mounted && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-md bg-white p-6 shadow-2xl space-y-4 border border-gray-400/50 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto font-outfit">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <i className="fi fi-sr-check-circle text-emerald-600 text-base" />
                <h3 className="text-base font-bold text-gray-900">
                  Grade Student Submission
                </h3>
              </div>
              <button
                onClick={() => setActiveSub(null)}
                className="h-8 w-8 rounded-md bg-slate-800 text-white hover:bg-black border-none cursor-pointer flex items-center justify-center transition"
              >
                <i className="fi fi-rr-cross text-xs text-white" />
              </button>
            </div>

            {/* Submission Metadata */}
            <div className="p-3.5 rounded-md bg-slate-50 border border-gray-300 space-y-1 text-xs font-normal">
              <p><strong>Student:</strong> {activeSub.studentName} ({activeSub.studentRoll})</p>
              <p><strong>Assignment:</strong> {activeSub.assignmentTitle} ({activeSub.className})</p>
              <p><strong>Submitted Date:</strong> {activeSub.submittedAt}</p>
              {activeSub.fileUrl && (
                <p className="pt-1">
                  <a
                    href={activeSub.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <i className="fi fi-rr-file-pdf text-xs" /> View Attached Student Submission File
                  </a>
                </p>
              )}
            </div>

            {/* Grading Form */}
            <form onSubmit={handleGradeSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-900 mb-1">Marks Assigned * (Max: {activeSub.maxMarks})</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={activeSub.maxMarks}
                    value={gradeMarks}
                    onChange={(e) => setGradeMarks(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full rounded-md border border-gray-400/50 bg-slate-50 p-2.5 text-sm font-normal text-gray-900 focus:border-black focus:bg-white focus:outline-none shadow-inner"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-1">Evaluation Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full rounded-md border border-gray-400/50 bg-slate-50 p-2.5 text-sm font-normal text-gray-900 focus:border-black focus:bg-white focus:outline-none shadow-inner"
                  >
                    <option value="GRADED">GRADED & APPROVED</option>
                    <option value="NEEDS_REVISION">NEEDS REVISION</option>
                    <option value="SUBMITTED">PENDING REVIEW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-900 mb-1">Teacher Feedback & Review Comments</label>
                <textarea
                  rows={3}
                  placeholder="Type constructive feedback, grading rationale, or areas of improvement for the student..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full rounded-md border border-gray-400/50 bg-slate-50 p-3 text-sm font-normal text-gray-900 focus:border-black focus:bg-white focus:outline-none shadow-inner"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveSub(null)}
                  className="rounded-md border-none bg-slate-800 px-5 py-2.5 text-base font-normal text-white hover:bg-slate-900 cursor-pointer transition shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md border-none bg-black px-6 py-2.5 text-base font-normal text-white hover:bg-black/90 cursor-pointer disabled:opacity-50 transition shadow-md"
                >
                  {isSubmitting ? "Saving Grade..." : "Submit Grade & Feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
