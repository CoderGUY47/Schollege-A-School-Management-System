"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface RoutineItem {
  time: string;
  subject: string;
  teacher: string;
  room: string;
  isLive?: boolean;
}

export default function StudentRoutineView() {
  const [routineData, setRoutineData] = useState<Record<string, RoutineItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>("ALL");

  // Accordion open state (by default Thursday is open)
  const [openDays, setOpenDays] = useState<string[]>(["Thursday", "Sunday", "Monday"]);

  useEffect(() => {
    const fetchRoutine = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/routine");
        const data = await res.json();
        if (data.routine) {
          setRoutineData(data.routine);
        }
      } catch {
        toast.error("Failed to load class routine from backend API");
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };

    fetchRoutine();
  }, []);

  const toggleDayAccordion = (day: string) => {
    setOpenDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const dayList = Object.keys(routineData);

  const filteredEntries = Object.entries(routineData).filter(([day]) => {
    if (selectedDayFilter === "ALL") return true;
    if (selectedDayFilter === "TODAY") return day === "Thursday";
    return day === selectedDayFilter;
  });

  return (
    <div className="space-y-6 font-outfit">
      {/* Redesigned Hero Header with shadow-inner & border-gray-400/50 */}
      <div className="rounded-md bg-[#0B0F17] p-6 md:p-8 text-white shadow-inner border border-gray-400/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-white/10 text-white font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                Class 12-A • Science Department
              </span>
              <span className="bg-emerald-500 text-white font-bold text-xs px-3 py-1 rounded-md uppercase">
                Active Session 2026
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Weekly Class Routine & Timetable
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
              View daily period schedules, classroom locations, instructor designations, and live active session indicators.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => setOpenDays(Object.keys(routineData))}
              className="text-sm font-bold bg-white text-[#0B0F17] hover:bg-slate-100 px-4 py-2.5 rounded-md border-none cursor-pointer shadow-inner transition"
            >
              Expand All
            </button>
            <button
              onClick={() => setOpenDays([])}
              className="text-sm font-bold bg-white/15 text-white hover:bg-white/25 px-4 py-2.5 rounded-md border-none cursor-pointer transition"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Main Container with shadow-inner & border border-gray-400/50 */}
      <div className="rounded-md border border-gray-400/50 bg-white p-6 shadow-inner space-y-5">
        
        {/* Day Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <i className="fi fi-sr-calendar text-indigo-600 text-sm" />
              Class Timetable Schedule
            </h2>
            <p className="text-sm text-gray-500 font-normal mt-0.5">
              Filter by day or inspect full weekly period breakdown
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedDayFilter("ALL")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition border cursor-pointer ${
                selectedDayFilter === "ALL"
                  ? "bg-black text-white border-black shadow-inner"
                  : "bg-slate-50 text-gray-700 border-gray-300 hover:bg-slate-100"
              }`}
            >
              All Days ({dayList.length})
            </button>

            <button
              onClick={() => setSelectedDayFilter("TODAY")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition border cursor-pointer ${
                selectedDayFilter === "TODAY"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-inner"
                  : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
              }`}
            >
              Today (Thursday)
            </button>

            {dayList.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDayFilter(day)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition border cursor-pointer ${
                  selectedDayFilter === day
                    ? "bg-black text-white border-black shadow-inner"
                    : "bg-slate-50 text-gray-700 border-gray-300 hover:bg-slate-100"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="py-12 text-center text-sm font-bold text-gray-500 bg-slate-50 rounded-md border border-gray-400/50 shadow-inner flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-indigo-600 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading...</span>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500 bg-slate-50 rounded-md border border-dashed border-gray-400/50 shadow-inner">
            <i className="fi fi-sr-calendar text-3xl text-gray-400 block mb-2" />
            No scheduled classes found for the selected filter.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map(([day, classes]) => {
              const isOpen = openDays.includes(day) || selectedDayFilter !== "ALL";

              return (
                <div
                  key={day}
                  className={`rounded-md border border-gray-400/50 transition-all duration-200 overflow-hidden shadow-inner ${
                    isOpen ? "bg-white" : "bg-white"
                  }`}
                >
                  {/* Day Accordion Header */}
                  <button
                    onClick={() => toggleDayAccordion(day)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer select-none bg-slate-50/80 hover:bg-slate-100/80 transition border-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-md bg-black text-white font-bold text-xs flex items-center justify-center shadow-inner">
                        {day.substring(0, 3)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{day} Timetable</h3>
                        <p className="text-xs text-gray-500 font-normal">{classes.length} Scheduled Periods</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {classes.some((c) => c.isLive) && (
                        <span className="text-xs font-bold bg-emerald-500 text-white px-2.5 py-0.5 rounded-md animate-pulse">
                          LIVE TODAY
                        </span>
                      )}
                      <div
                        className={`h-7 w-7 rounded-md flex items-center justify-center transition-all duration-200 ${
                          isOpen
                            ? "bg-black text-white rotate-180 shadow-inner"
                            : "bg-slate-200 text-gray-900 hover:bg-slate-300"
                        }`}
                      >
                        <i className="fi fi-rr-angle-small-down text-sm font-bold" />
                      </div>
                    </div>
                  </button>

                  {/* Collapsible Period Cards */}
                  {isOpen && (
                    <div className="p-5 space-y-3 border-t border-gray-200 bg-slate-50/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classes.map((item, idx) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-md border border-gray-400/50 flex flex-col justify-between space-y-3 transition shadow-inner ${
                              item.isLive
                                ? "bg-black text-white border-black"
                                : "bg-white text-gray-900"
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`h-7 w-7 rounded-md font-bold text-xs flex items-center justify-center ${
                                    item.isLive ? "bg-white text-black font-extrabold" : "bg-black text-white"
                                  }`}
                                >
                                  0{idx + 1}
                                </span>
                                {item.isLive ? (
                                  <span className="text-xs font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-md">
                                    ACTIVE NOW
                                  </span>
                                ) : (
                                  <span className="text-xs font-normal text-gray-400">
                                    Period {idx + 1}
                                  </span>
                                )}
                              </div>

                              <div>
                                <h4 className="text-sm font-bold leading-snug">{item.subject}</h4>
                                <p className={`text-xs mt-1 font-normal ${item.isLive ? "text-slate-300" : "text-gray-500"}`}>
                                  Instructor: {item.teacher}
                                </p>
                              </div>
                            </div>

                            <div className={`pt-3 border-t text-xs flex items-center justify-between font-normal ${
                              item.isLive ? "border-white/20 text-slate-200" : "border-gray-200 text-gray-600"
                            }`}>
                              <span className="flex items-center gap-1 font-bold">
                                <i className="fi fi-sr-time-twelve text-xs" /> {item.time}
                              </span>
                              <span className={`font-bold px-2 py-0.5 rounded-md ${
                                item.isLive ? "bg-white/20 text-white" : "bg-slate-100 text-gray-800"
                              }`}>
                                {item.room}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
