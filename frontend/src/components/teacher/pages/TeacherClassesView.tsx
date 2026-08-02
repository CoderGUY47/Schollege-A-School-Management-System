"use client";

import React, { useState, useEffect } from "react";
import Loader from "@/components/ui/Loader";

export default function TeacherClassesView() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      setLoading(true);
      try {
        const res = await fetch("/api/classes");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) setClasses(data);
        }
      } catch (err) {
        console.error("Error loading classes:", err);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    }
    fetchClasses();
  }, []);

  const defaultRoster = [
    { code: "CLASS-12A", name: "Class 12 Section A", room: "Room 304", subject: "Physics II (Electromagnetism)", studentsCount: 42 },
    { code: "CLASS-12B", name: "Class 12 Section B", room: "Physics Lab 01", subject: "Physics Lab IV", studentsCount: 40 },
    { code: "CLASS-11A", name: "Class 11 Section A", room: "Room 201", subject: "General Physics", studentsCount: 45 },
    { code: "CLASS-11B", name: "Class 11 Section B", room: "Room 202", subject: "Applied Thermodynamics", studentsCount: 44 },
  ];

  return (
    <div className="space-y-6 font-outfit">
      {/* Header Banner */}
      <div className="rounded-md bg-[#0B0F17] p-6 md:p-8 text-white shadow-inner border border-gray-400/50 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="bg-white/10 text-white font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
            Teacher Assigned Roster
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Assigned Classes & Course Rosters
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
            Inspect your assigned academic sections, classroom allocations, course subjects, and student headcount.
          </p>
        </div>
      </div>

      {/* Roster Cards Grid */}
      <div className="rounded-md border border-gray-400/50 bg-white p-6 shadow-inner space-y-5">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <i className="fi fi-sr-users-alt text-indigo-600 text-sm" />
              Assigned Sections (4)
            </h3>
            <p className="text-sm text-gray-500 font-normal mt-0.5">
              Current academic semester class assignments
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center bg-white rounded-md border border-gray-400/50 shadow-inner flex items-center justify-center">
            <Loader size="md" text="Loading assigned class rosters..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {defaultRoster.map((r, idx) => (
              <div
                key={idx}
                className="rounded-md border border-gray-400/50 bg-white p-5 shadow-inner space-y-3 flex flex-col justify-between hover:border-gray-500 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-black/5 px-2.5 py-1 text-xs font-bold text-black uppercase tracking-wider border border-gray-300/40">
                      {r.code}
                    </span>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                      {r.studentsCount} Students Enrolled
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-gray-900">{r.name}</h4>
                  <p className="text-sm font-normal text-gray-600">Course Subject: <strong className="font-bold text-gray-900">{r.subject}</strong></p>
                </div>

                <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 font-normal">
                  <span className="flex items-center gap-1 font-bold text-gray-800">
                    <i className="fi fi-sr-marker text-xs text-gray-500" /> Location: {r.room}
                  </span>
                  <span className="text-indigo-600 font-bold">Active Section</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
