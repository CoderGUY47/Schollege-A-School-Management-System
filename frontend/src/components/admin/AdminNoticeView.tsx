"use client";

import React, { useState, useEffect } from "react";

import CustomSelect from "@/components/ui/CustomSelect";
import { toast } from "react-toastify";
import Loader from "@/components/ui/Loader";

interface Notice {
  id: string;
  title: string;
  category: "URGENT" | "ACADEMIC" | "EVENT" | "GENERAL" | "EXAM" | "SPORTS";
  audience: "ALL" | "TEACHERS" | "STUDENTS";
  description: string;
  date: string;
  author: string;
  isPinned: boolean;
}

export default function AdminNoticeView() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<Notice["category"]>("ACADEMIC");
  const [newAudience, setNewAudience] = useState<Notice["audience"]>("ALL");

  useEffect(() => {
    fetchBackendNotices();
  }, []);

  const fetchBackendNotices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notices");
      if (res.ok) {
        const data = await res.json();
        if (data.notices) {
          setNotices(data.notices);
        } else if (Array.isArray(data)) {
          setNotices(
            data.map((n: any) => ({
              id: n.id,
              title: n.title,
              category: n.category || "GENERAL",
              audience: "ALL",
              description: n.description || n.content || "",
              date: n.createdAt ? new Date(n.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "06 Aug 2026",
              author: n.author || "Admin Office",
              isPinned: !!n.isPinned,
            }))
          );
        }
      }
    } catch (e) {
      console.error("Failed to fetch notices:", e);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "URGENT":
        return <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1"><i className="fi fi-rr-exclamation text-xs"></i> Urgent</span>;
      case "EXAM":
        return <span className="bg-purple-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1"><i className="fi fi-rr-sparkles text-xs"></i> Exam</span>;
      case "ACADEMIC":
        return <span className="bg-indigo-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1"><i className="fi fi-rr-sparkles text-xs"></i> Academic</span>;
      case "EVENT":
        return <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1"><i className="fi fi-rr-bullhorn text-xs"></i> Event</span>;
      case "SPORTS":
        return <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">Sports</span>;
      default:
        return <span className="bg-slate-700 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">General</span>;
    }
  };

  const getSideBadgeClass = (category: string) => {
    switch (category) {
      case "EXAM":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "EVENT":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "SPORTS":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "URGENT":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newContent,
          category: newCategory,
          audience: newAudience,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.notices) {
          setNotices(data.notices);
        } else if (data.notice) {
          setNotices([data.notice, ...notices]);
        }
      }
      toast.success("Notice circular published successfully!");
    } catch (e) {
      console.error(e);
      const fallbackObj: Notice = {
        id: `NTC-${Date.now()}`,
        title: newTitle,
        category: newCategory,
        audience: newAudience,
        description: newContent,
        date: "06 Aug 2026",
        author: "Admin Office",
        isPinned: false,
      };
      setNotices([fallbackObj, ...notices]);
      toast.success("Notice circular published successfully!");
    } finally {
      setShowAddModal(false);
      setNewTitle("");
      setNewContent("");
    }
  };

  const filteredNotices = notices.filter((ntc) => {
    const matchesSearch =
      ntc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ntc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || ntc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* 1ST ROW: RADIANT GRADIENT HERO HEADER */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 p-7 text-white shadow-xl border border-orange-400/20">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 h-64 w-64 rounded-full bg-rose-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="bg-amber-300 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                Official Bulletins
              </span>
              <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur">
                Campus Notices
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3 tracking-tight">
              Notice Board & Announcements
            </h2>
            <p className="text-xs text-amber-100 mt-1.5 max-w-xl leading-relaxed">
              Broadcast academic notices, urgent circulars, exam dates, and campus events to all students and faculty.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4.5 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <i className="fi fi-rr-plus text-xs"></i> Publish New Notice
            </button>
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS & SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition ${
              selectedCategory === "ALL"
                ? "bg-slate-900 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Notices
          </button>
          <button
            onClick={() => setSelectedCategory("URGENT")}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition ${
              selectedCategory === "URGENT"
                ? "bg-rose-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Urgent Only
          </button>
          <button
            onClick={() => setSelectedCategory("ACADEMIC")}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition ${
              selectedCategory === "ACADEMIC"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Academic
          </button>
          <button
            onClick={() => setSelectedCategory("EVENT")}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition ${
              selectedCategory === "EVENT"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Events
          </button>
        </div>

        <div className="relative w-full md:w-64 flex items-center">
          <i className="fi fi-rr-search absolute left-3 text-slate-400 text-xs"></i>
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* MAIN TWO-COLUMN CONTENT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 60% COLUMN (lg:col-span-7): MAIN NOTICE LISTING FEED */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center flex flex-col items-center justify-center gap-2 shadow-sm min-h-[220px]">
              <Loader size="md" text="Loading notices from Schollege database..." />
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400 text-xs shadow-sm">
              No notices match your search criteria.
            </div>
          ) : (
            filteredNotices.map((ntc) => (
              <div
                key={ntc.id}
                className={`p-6 rounded-xl bg-white border transition shadow-sm hover:shadow-md ${
                  ntc.isPinned
                    ? "border-amber-300 bg-gradient-to-r from-amber-50/40 via-white to-white"
                    : "border-slate-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    {ntc.isPinned && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 border border-amber-200">
                        <i className="fi fi-rr-marker text-amber-600 text-xs"></i> Pinned
                      </span>
                    )}
                    {getCategoryBadge(ntc.category)}
                    <span className="text-xs font-bold text-slate-500">Target: {ntc.audience || "ALL"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
                    <span className="flex items-center gap-1">
                      <i className="fi fi-rr-clock text-slate-400 text-xs"></i> {ntc.date}
                    </span>
                    <span>•</span>
                    <span className="text-slate-700 font-extrabold">{ntc.author || "Admin Office"}</span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 mt-3">{ntc.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{ntc.description}</p>
              </div>
            ))
          )}
        </div>

        {/* RIGHT 40% COLUMN (lg:col-span-5): DYNAMIC BACKEND NOTICE BOARD ANNOUNCEMENTS SIDEBAR */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <i className="fi fi-rr-bell text-amber-500 text-sm"></i> Notice Board Announcements
            </h3>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              {notices.length} Backend Items
            </span>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {loading ? (
              <div className="text-center py-10 text-slate-400 text-xs">Fetching backend announcements...</div>
            ) : notices.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">No backend announcements found.</div>
            ) : (
              notices.map((item) => (
                <div
                  key={`side-${item.id}`}
                  className="p-4 rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50/70 to-white shadow-sm space-y-2 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${getSideBadgeClass(item.category)}`}>
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      Posted on {item.date}
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 leading-snug">{item.title}</h4>
                  <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 pt-1">
                    <i className="fi fi-rr-users text-slate-400 text-xs shrink-0"></i>
                    <span>Posted by {item.author || "Admin Office"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* CREATE NOTICE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md max-w-lg w-full p-6 shadow-2xl space-y-4 border-none animate-in fade-in-90">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Publish New Campus Notice
            </h3>
            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Notice Headline</label>
                <input
                  type="text"
                  placeholder="Enter notice title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full py-2 px-1 bg-transparent border-b-2 border-slate-200 focus:border-indigo-600 focus:outline-none font-semibold text-xs text-slate-800 transition-all rounded-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <CustomSelect
                    options={[
                      { value: "URGENT", label: "Urgent" },
                      { value: "ACADEMIC", label: "Academic" },
                      { value: "EXAM", label: "Exam" },
                      { value: "EVENT", label: "Event" },
                      { value: "GENERAL", label: "General" },
                    ]}
                    value={newCategory}
                    onChange={(val: any) => setNewCategory(val)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Audience</label>
                  <CustomSelect
                    options={[
                      { value: "ALL", label: "All Campus" },
                      { value: "TEACHERS", label: "Teachers Only" },
                      { value: "STUDENTS", label: "Students Only" },
                    ]}
                    value={newAudience}
                    onChange={(val: any) => setNewAudience(val)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Notice Content</label>
                <textarea
                  rows={4}
                  placeholder="Enter notice details"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-2 rounded-md bg-slate-50 border-none shadow-xs text-xs text-slate-800 focus:outline-none focus:bg-white focus:shadow-md transition-all"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-md text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition"
                >
                  Publish Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
