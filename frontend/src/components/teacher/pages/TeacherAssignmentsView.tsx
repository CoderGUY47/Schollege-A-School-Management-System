"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import Loader from "@/components/ui/Loader";
import { useSession } from "@/lib/auth-client";

export interface AssignmentRecord {
  id: string;
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  maxMarks: number;
  description: string;
  status: "PUBLISHED" | "DRAFT";
  createdAt: string;
  authorEmail?: string;
}

export default function TeacherAssignmentsView() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "robert.chen@schollege.edu.bd";

  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<AssignmentRecord | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Physics II");
  const [className, setClassName] = useState("Class 12-A");
  const [dueDate, setDueDate] = useState("2026-08-15");
  const [maxMarks, setMaxMarks] = useState(100);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/assignments");
      if (res.ok) {
        const data = await res.json();
        // API returns Prisma-joined objects for subject & class — normalize to flat strings
        const normalized: AssignmentRecord[] = (Array.isArray(data) ? data : []).map((a: any) => ({
          id: a.id,
          title: a.title,
          description: a.description || "",
          // subject can be an object {id, code, name} or a plain string
          subject: typeof a.subject === "object" && a.subject !== null
            ? a.subject.name || a.subject.code || "Unknown Subject"
            : (a.subject || "Unknown Subject"),
          // class can be an object {id, code, name} or stored as className
          className: typeof a.class === "object" && a.class !== null
            ? a.class.name || a.class.code || "Unknown Class"
            : (a.className || a.class_name || "Unknown Class"),
          // dueDate may come as full ISO timestamp — trim to YYYY-MM-DD
          dueDate: a.dueDate
            ? new Date(a.dueDate).toISOString().slice(0, 10)
            : a.due_date || "",
          maxMarks: Number(a.maxMarks ?? a.max_marks ?? 100),
          status: a.status || "PUBLISHED",
          createdAt: a.createdAt || a.created_at || new Date().toISOString(),
          authorEmail: a.teacher?.email || a.authorEmail || "",
        }));
        setAssignments(normalized);
      }
    } catch (err) {
      console.error("Failed to load assignments:", err);
      toast.error("Failed to load assignments from backend API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingAssignment(null);
    setTitle("");
    setSubject("Physics II");
    setClassName("Class 12-A");
    setDueDate("2026-08-15");
    setMaxMarks(100);
    setDescription("");
    setStatus("PUBLISHED");
    setShowModal(true);
  };

  const handleOpenEditModal = (assignment: AssignmentRecord) => {
    setEditingAssignment(assignment);
    setTitle(assignment.title);
    setSubject(assignment.subject);
    setClassName(assignment.className);
    setDueDate(assignment.dueDate);
    setMaxMarks(assignment.maxMarks);
    setDescription(assignment.description);
    setStatus(assignment.status);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error("Please fill in assignment title and description");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingAssignment) {
        // Edit Assignment
        const res = await fetch("/api/assignments", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingAssignment.id,
            title,
            subject,
            className,
            dueDate,
            maxMarks: Number(maxMarks),
            description,
            status,
          }),
        });

        if (res.ok) {
          toast.success(`Assignment "${title}" updated successfully!`);
          setShowModal(false);
          fetchAssignments();
        } else {
          toast.error("Failed to update assignment");
        }
      } else {
        // Create Assignment
        const res = await fetch("/api/assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            subject,
            className,
            dueDate,
            maxMarks: Number(maxMarks),
            description,
            status,
            authorEmail: userEmail,
          }),
        });

        if (res.ok) {
          toast.success(`New Assignment "${title}" published!`);
          setShowModal(false);
          fetchAssignments();
        } else {
          toast.error("Failed to create assignment");
        }
      }
    } catch (err) {
      console.error("Error saving assignment:", err);
      toast.error("An error occurred while saving assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAssignment = async (id: string, titleStr: string) => {
    if (!window.confirm(`Are you sure you want to delete assignment "${titleStr}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/assignments?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(`Assignment "${titleStr}" removed`);
        fetchAssignments();
      } else {
        toast.error("Failed to delete assignment");
      }
    } catch (err) {
      console.error("Error deleting assignment:", err);
      toast.error("Error deleting assignment");
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center p-20 bg-white rounded-md border border-gray-500/30 shadow-md min-h-[360px] font-outfit">
        <Loader size="md" text="Loading course assignments & homework records..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-outfit">
      {/* ── Hero Banner ── */}
      <div className="bg-[#0B0F17] text-white p-6 md:p-8 rounded-md shadow-xl border border-gray-400/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-white/10 border border-white/20 text-white font-normal text-xs px-3 py-1 rounded-md uppercase tracking-wider">
              Faculty Coursework Management
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Assignments & Homework Manager
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
              Create, edit, publish, or delete course assignments. Assign tasks to specific classes and subjects with customized deadlines and grading criteria.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleOpenCreateModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-md text-base font-normal shadow-md transition cursor-pointer flex items-center gap-2 border-none"
            >
              <i className="fi fi-sr-plus text-base text-white" />
              <span>Create New Assignment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Assignments Container */}
      <div className="rounded-md border border-gray-400/50 bg-white p-6 shadow-inner space-y-5">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <i className="fi fi-sr-document text-indigo-600 text-sm" />
              Published & Draft Assignments ({assignments.length})
            </h3>
            <p className="text-sm text-gray-500 font-normal mt-0.5">
              Review assigned tasks, deadlines, max marks, and publication status
            </p>
          </div>
        </div>

        {/* Assignments Cards Grid */}
        {assignments.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm font-medium">
            No assignments created yet. Click "Create New Assignment" above to add one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {assignments.map((a) => (
              <div
                key={a.id}
                className="rounded-md border border-gray-300 bg-slate-50/50 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase">
                      {a.className} • {a.subject}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        a.status === "PUBLISHED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-gray-900 leading-snug">{a.title}</h4>
                  <p className="text-xs text-gray-600 font-normal line-clamp-3 leading-relaxed">
                    {a.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-200 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 font-normal">
                    <span className="flex items-center gap-1">
                      <i className="fi fi-rr-calendar text-gray-400 text-xs" />
                      Due: <strong>{a.dueDate}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fi fi-rr-star text-amber-500 text-xs" />
                      Max Marks: <strong>{a.maxMarks}</strong>
                    </span>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenEditModal(a)}
                      className="flex-1 py-2.5 rounded-md bg-black text-white hover:bg-slate-800 text-sm font-normal transition border-none cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <i className="fi fi-rr-edit text-xs text-white" /> Edit Task
                    </button>

                    <button
                      onClick={() => handleDeleteAssignment(a.id, a.title)}
                      className="px-3.5 py-2.5 rounded-md bg-rose-600 text-white hover:bg-rose-700 text-sm font-normal transition border-none cursor-pointer flex items-center justify-center"
                      title="Delete Assignment"
                    >
                      <i className="fi fi-rr-trash text-xs text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── CREATE / EDIT ASSIGNMENT MODAL ── */}
      {showModal && mounted && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-md bg-white p-6 shadow-2xl space-y-4 border border-gray-400/50 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto font-outfit">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <i className="fi fi-sr-document text-indigo-600 text-base" />
                <h3 className="text-base font-bold text-gray-900">
                  {editingAssignment ? "Edit Assignment Task" : "Create New Course Assignment"}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="h-8 w-8 rounded-md bg-slate-800 text-white hover:bg-black border-none cursor-pointer flex items-center justify-center transition"
              >
                <i className="fi fi-rr-cross text-xs text-white" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-bold text-gray-900 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Physics II: Electromagnetism Lab Report"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-gray-400/50 bg-slate-50 p-2.5 text-sm font-normal text-gray-900 focus:border-black focus:bg-white focus:outline-none shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-900 mb-1">Subject Course *</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-md border border-gray-400/50 bg-slate-50 p-2.5 text-sm font-normal text-gray-900 focus:border-black focus:bg-white focus:outline-none shadow-inner"
                  >
                    <option value="Physics II">Physics II</option>
                    <option value="Higher Mathematics">Higher Mathematics</option>
                    <option value="Chemistry I">Chemistry I</option>
                    <option value="ICT & Computer Lab">ICT & Computer Lab</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-1">Target Class *</label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full rounded-md border border-gray-400/50 bg-slate-50 p-2.5 text-sm font-normal text-gray-900 focus:border-black focus:bg-white focus:outline-none shadow-inner"
                  >
                    <option value="Class 12-A">Class 12-A</option>
                    <option value="Class 12-B">Class 12-B</option>
                    <option value="Class 11-A">Class 11-A</option>
                    <option value="Class 11-B">Class 11-B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-900 mb-1">Assignment Description & Instructions *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide detailed instructions, guidelines, and submission format for students..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border border-gray-400/50 bg-slate-50 p-2.5 text-sm font-normal text-gray-900 focus:border-black focus:bg-white focus:outline-none shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-900 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-md border border-gray-400/50 bg-slate-50 p-2.5 text-sm font-normal text-gray-900 focus:border-black focus:bg-white focus:outline-none shadow-inner"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-1">Max Marks *</label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={200}
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    className="w-full rounded-md border border-gray-400/50 bg-slate-50 p-2.5 text-sm font-normal text-gray-900 focus:border-black focus:bg-white focus:outline-none shadow-inner"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-1">Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full rounded-md border border-gray-400/50 bg-slate-50 p-2.5 text-sm font-normal text-gray-900 focus:border-black focus:bg-white focus:outline-none shadow-inner"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-md border-none bg-slate-800 px-5 py-2.5 text-base font-normal text-white hover:bg-slate-900 cursor-pointer transition shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md border-none bg-black px-6 py-2.5 text-base font-normal text-white hover:bg-black/90 cursor-pointer disabled:opacity-50 transition shadow-md"
                >
                  {isSubmitting ? "Saving..." : editingAssignment ? "Save Changes" : "Publish Assignment"}
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
