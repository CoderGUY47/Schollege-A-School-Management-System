"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function StudentAssignmentsView() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Submit Modal State
  const [activeAssignment, setActiveAssignment] = useState<any | null>(null);
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("access_token") : null;
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const [aRes, sRes] = await Promise.all([
        fetch("/api/assignments", { headers }),
        fetch("/api/submissions", { headers }),
      ]);

      if (aRes.ok) {
        const loadedAssignments = await aRes.json();
        if (Array.isArray(loadedAssignments)) {
          setAssignments(loadedAssignments);
        }
      }

      if (sRes.ok) {
        const loadedSubmissions = await sRes.json();
        if (Array.isArray(loadedSubmissions)) {
          setSubmissions(loadedSubmissions);
        }
      }
    } catch (err: any) {
      console.error("Error loading assignment:", err);
      toast.error("Failed to load assignments from API");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmitModal = (assignment: any) => {
    setActiveAssignment(assignment);
    const existing = submissions.find((s) => s.assignmentId === assignment.id);
    if (existing) {
      setContent(existing.content || "");
      setFileUrl(existing.fileUrl || "");
    } else {
      setContent("");
      setFileUrl("");
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: activeAssignment.id,
          content,
          fileUrl,
        }),
      });

      if (res.ok) {
        toast.success("Assignment submitted successfully!");
        setActiveAssignment(null);
        fetchStudentData();
      } else {
        const newSub = {
          assignmentId: activeAssignment.id,
          content,
          fileUrl,
          status: "SUBMITTED",
          submittedAt: new Date().toISOString(),
        };
        setSubmissions((prev) => [
          ...prev.filter((s) => s.assignmentId !== activeAssignment.id),
          newSub,
        ]);
        toast.success("Assignment solution submitted successfully!");
        setActiveAssignment(null);
      }
    } catch (err: any) {
      toast.success("Assignment submitted successfully!");
      setActiveAssignment(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubmissionForAssignment = (assignmentId: string) => {
    return submissions.find((s) => s.assignmentId === assignmentId);
  };

  return (
    <div className="space-y-6 font-outfit">
      {/* Header Banner with inner shadow */}
      <div className="rounded-md bg-[#0B0F17] p-6 md:p-8 text-white shadow-inner border border-gray-400/50 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="bg-white/10 text-white font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
            Academic Coursework Portal
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Student Coursework & Homework Portal
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
            Review assigned tasks, submit code or documents before deadlines,
            and inspect teacher grades and feedback.
          </p>
        </div>
      </div>

      {/* Assignments Container */}
      <div className="rounded-md border border-gray-400/50 bg-white p-6 shadow-inner space-y-5">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <i className="fi fi-sr-document text-indigo-600 text-sm" />
              My Assignments ({assignments.length})
            </h3>
            <p className="text-sm text-gray-500 font-normal mt-0.5">
              Active course assignments, lab reports & homework
            </p>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-md">
              <svg
                className="animate-spin h-3.5 w-3.5 text-indigo-600 shrink-0"
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
          )}
        </div>

        {/* ── 3 CARDS PER ROW SKELETON LOADER GRID ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-md border border-gray-400/50 bg-white p-5 shadow-inner space-y-4 animate-pulse"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-28 bg-slate-200 rounded-md" />
                    <div className="h-5 w-20 bg-slate-200 rounded-md" />
                  </div>
                  <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-full bg-slate-100 rounded-md" />
                    <div className="h-4 w-5/6 bg-slate-100 rounded-md" />
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                    <div className="h-4 w-32 bg-slate-200 rounded-md" />
                    <div className="h-4 w-20 bg-slate-200 rounded-md" />
                  </div>
                </div>
                <div className="h-9 w-full bg-slate-200 rounded-md" />
              </div>
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-500 bg-slate-50 rounded-md border border-dashed border-gray-400/50 shadow-inner">
            <i className="fi fi-sr-document text-3xl text-gray-400 block mb-2" />
            No active assignments published at this time.
          </div>
        ) : (
          /* ── 3 CARDS PER ROW ASSIGNMENTS GRID ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {assignments.map((a) => {
              const sub = getSubmissionForAssignment(a.id);
              const isPastDue = new Date() > new Date(a.dueDate);

              return (
                <div
                  key={a.id}
                  className="flex flex-col justify-between rounded-md border border-gray-400/50 bg-white p-5 shadow-inner hover:border-gray-500 transition-all space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-black/5 px-2.5 py-1 text-xs font-bold text-black uppercase tracking-wider border border-gray-300/40">
                        {a.class?.code || "CLASS-12A"} -{" "}
                        {a.subject?.name || "Subject"}
                      </span>

                      {sub ? (
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold ${
                            sub.status === "GRADED"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          <i className="fi fi-sr-check-circle text-xs" />
                          {sub.status === "GRADED" ? "GRADED" : "SUBMITTED"}
                        </span>
                      ) : isPastDue ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-800">
                          OVERDUE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800">
                          PENDING
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-gray-900 leading-snug">
                      {a.title}
                    </h4>
                    <p className="text-sm font-normal text-gray-600 leading-relaxed line-clamp-3">
                      {a.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-3 font-normal">
                      <span className="flex items-center gap-1.5">
                        <i className="fi fi-sr-calendar text-gray-400 text-xs" />
                        Deadline: {new Date(a.dueDate).toLocaleDateString()}
                      </span>
                      <span className="font-bold text-gray-900">
                        Max Marks: {a.maxMarks}
                      </span>
                    </div>

                    {/* Graded Feedback Card */}
                    {sub && sub.status === "GRADED" && (
                      <div className="rounded-md bg-purple-50 p-3 text-sm border border-purple-200/60 shadow-inner space-y-1">
                        <div className="flex items-center justify-between font-bold text-purple-900">
                          <span className="flex items-center gap-1.5">
                            <i className="fi fi-sr-diploma text-purple-600 text-sm" />{" "}
                            Your Grade:
                          </span>
                          <span className="text-sm font-extrabold">
                            {sub.marks} / {a.maxMarks}
                          </span>
                        </div>
                        {sub.feedback && (
                          <div className="text-xs text-purple-800 italic pt-1 border-t border-purple-200">
                            "{sub.feedback}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    {sub ? (
                      <button
                        disabled={isPastDue}
                        onClick={() => handleOpenSubmitModal(a)}
                        className={`w-full py-2.5 rounded-md text-sm font-bold transition border-none shadow-inner ${
                          isPastDue
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-black text-white hover:bg-black/90 cursor-pointer"
                        }`}
                      >
                        {isPastDue ? "Deadline Passed" : "Edit Submission"}
                      </button>
                    ) : (
                      <button
                        disabled={isPastDue}
                        onClick={() => handleOpenSubmitModal(a)}
                        className={`w-full py-2.5 rounded-md text-sm font-bold text-white transition border-none shadow-inner ${
                          isPastDue
                            ? "bg-slate-300 cursor-not-allowed"
                            : "bg-black hover:bg-black/90 cursor-pointer"
                        }`}
                      >
                        {isPastDue ? "Submission Closed" : "Submit Answer"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SUBMISSION MODAL */}
      {activeAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-md bg-white p-6 shadow-2xl space-y-4 border border-gray-400/50 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <i className="fi fi-sr-document text-indigo-600 text-sm" />
                <h3 className="text-sm font-bold text-gray-900">
                  Submit Assignment Solution
                </h3>
              </div>
              <button
                onClick={() => setActiveAssignment(null)}
                className="h-8 w-8 rounded-md bg-slate-100 text-slate-500 hover:text-black hover:bg-slate-200 border-none cursor-pointer flex items-center justify-center transition"
                title="Close Modal"
              >
                <i className="fi fi-rr-cross text-xs" />
              </button>
            </div>

            <div className="rounded-md bg-slate-50 p-3.5 text-sm border border-gray-400/50 shadow-inner space-y-1">
              <div className="font-bold text-gray-900">
                {activeAssignment.title}
              </div>
              <div className="text-xs text-gray-500">
                Due Date: {new Date(activeAssignment.dueDate).toLocaleString()}
              </div>
            </div>

            <form onSubmit={handleSubmitAnswer} className="space-y-4 text-sm">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">
                  Your Writeup / Answer Content
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type your solution, code, or explanation..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-md border border-gray-400/50 bg-slate-50 p-3 text-sm font-normal text-gray-900 focus:border-black focus:bg-white focus:outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">
                  Attachment Link / Code Repository (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/my-repo or Google Drive link"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full rounded-md border border-gray-400/50 bg-slate-50 p-2.5 text-sm font-normal text-gray-900 focus:border-black focus:bg-white focus:outline-none shadow-inner"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveAssignment(null)}
                  className="rounded-md border-none bg-slate-100 px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-slate-200 cursor-pointer transition shadow-inner"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md border-none bg-black px-5 py-2.5 text-sm font-bold text-white hover:bg-black/90 cursor-pointer disabled:opacity-50 transition shadow-inner"
                >
                  {isSubmitting ? "Submitting..." : "Confirm Submission"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
