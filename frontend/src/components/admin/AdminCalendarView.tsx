"use client";

import React, { useState } from "react";


interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  category: "EXAM" | "HOLIDAY" | "MEETING" | "EVENT" | "GOVT_HOLIDAY";
  participants: string;
  isBdGovtHoliday?: boolean;
}

import { SCH_CALENDAR_HOLIDAYS } from "@backend/Data/Admin/holidays";

const bdGovtHolidays: CalendarEvent[] = [
  ...SCH_CALENDAR_HOLIDAYS.map((h) => ({
    id: h.id,
    title: h.title,
    date: h.date,
    time: "All Day",
    location: "National Monument & Campus",
    category: "GOVT_HOLIDAY" as const,
    participants: "BD National Holiday",
    isBdGovtHoliday: true,
  })),
  { id: "EVT-102", title: "Faculty Board Academic Senate", date: "2026-08-20", time: "02:00 PM - 04:30 PM", location: "Conference Room A", category: "MEETING", participants: "Department Heads & Admin" },
  { id: "EVT-103", title: "Annual Tech Innovation Fest 2026", date: "2026-08-28", time: "10:00 AM - 06:00 PM", location: "Auditorium & Grounds", category: "EVENT", participants: "Open Campus" },
  { id: "EVT-104", title: "Mid-Term Examinations (Spring 2025)", date: "2025-08-20", time: "09:00 AM - 04:00 PM", location: "Main Hall", category: "EXAM", participants: "Batch 2025 Students" },
];

export default function AdminCalendarView() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 1)); // Aug 2026 default
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDateStr, setEventDateStr] = useState("2026-08-20");
  const [eventCategory, setEventCategory] = useState<CalendarEvent["category"]>("EVENT");
  const [eventsList, setEventsList] = useState<CalendarEvent[]>(bdGovtHolidays);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  // Calculate grid metrics for selected year and month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon...

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const offsetArray = Array.from({ length: startDayOfWeek }, (_, i) => i);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleYearChange = (newYear: number) => {
    setCurrentDate(new Date(newYear, month, 1));
  };

  const handleMonthChange = (newMonth: number) => {
    setCurrentDate(new Date(year, newMonth, 1));
  };

  const getCategoryBadge = (category: CalendarEvent["category"]) => {
    switch (category) {
      case "GOVT_HOLIDAY":
        return (
          <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <i className="fi fi-rr-flag text-xs"></i> BD Govt Holiday
          </span>
        );
      case "EXAM":
        return <span className="bg-purple-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">Exam</span>;
      case "HOLIDAY":
        return <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">Holiday</span>;
      case "MEETING":
        return <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">Meeting</span>;
      case "EVENT":
        return <span className="bg-amber-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">Campus Event</span>;
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle) return;
    const newEvt: CalendarEvent = {
      id: `EVT-${Date.now()}`,
      title: eventTitle,
      date: eventDateStr,
      time: "10:00 AM - 01:00 PM",
      location: "Auditorium Hall B",
      category: eventCategory,
      participants: "All Enrolled Students",
      isBdGovtHoliday: eventCategory === "GOVT_HOLIDAY",
    };
    setEventsList([newEvt, ...eventsList]);
    setEventTitle("");
    setShowAddModal(false);
  };

  // Filter events for sidebar list
  const filteredEvents = eventsList.filter((evt) => {
    const matchesCategory = selectedCategory === "ALL" || evt.category === selectedCategory;
    return matchesCategory;
  });

  const yearOptions = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-6">
      {/* RADIANT GRADIENT HERO HEADER */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-7 text-white shadow-xl border border-purple-500/20">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="bg-purple-600 text-white font-extrabold text-xs px-3.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
                Academic Calendar
              </span>
              <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur">
                {monthName} {year}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3 tracking-tight">
              Campus Schedule & Event Manager
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 max-w-xl leading-relaxed">
              Navigate past, present, and future years seamlessly. Integrated with official Bangladeshi Government holidays, exams, and campus activities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-all"
            >
              <i className="fi fi-rr-plus text-xs"></i> Schedule New Event
            </button>
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS & YEAR SELECTOR BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedCategory === "ALL"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Events ({eventsList.length})
          </button>
          <button
            onClick={() => setSelectedCategory("GOVT_HOLIDAY")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              selectedCategory === "GOVT_HOLIDAY"
                ? "bg-red-600 text-white shadow-sm"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            <i className="fi fi-rr-flag text-xs"></i> Govt Holidays
          </button>
          <button
            onClick={() => setSelectedCategory("EXAM")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedCategory === "EXAM"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-purple-50 text-purple-700 hover:bg-purple-100"
            }`}
          >
            Exams
          </button>
          <button
            onClick={() => setSelectedCategory("HOLIDAY")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedCategory === "HOLIDAY"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            Holidays
          </button>
          <button
            onClick={() => setSelectedCategory("MEETING")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedCategory === "MEETING"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            Meetings
          </button>
        </div>

        {/* Year Dropdown & Month Navigation */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500">Jump Year:</span>
            <select
              value={year}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y} {y === 2026 ? "(Current Academic Year)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* MAIN CALENDAR GRID & EVENTS SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Custom Calendar Month Schedule Matrix */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <i className="fi fi-rr-calendar text-purple-600 text-base"></i> {monthName} {year} Schedule Matrix
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition"
                title="Previous Month"
              >
                <i className="fi fi-rr-angle-left text-xs"></i> Prev
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition"
                title="Next Month"
              >
                Next <i className="fi fi-rr-angle-right text-xs"></i>
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Offset empty days for starting weekday */}
            {offsetArray.map((i) => (
              <div key={`offset-${i}`} className="h-20 bg-slate-50/50 rounded-lg border border-slate-100/50 opacity-40" />
            ))}

            {daysArray.map((day) => {
              const formattedDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const matchedEvents = eventsList.filter((e) => e.date === formattedDateStr);
              const isToday = year === 2026 && month === 7 && day === 6;

              return (
                <div
                  key={day}
                  className={`h-20 p-2 rounded-lg border flex flex-col justify-between transition ${
                    isToday
                      ? "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-300 shadow-sm"
                      : matchedEvents.some((e) => e.isBdGovtHoliday)
                      ? "bg-rose-50/60 border-rose-200 shadow-sm hover:border-rose-300"
                      : matchedEvents.length > 0
                      ? "bg-white border-purple-200 shadow-sm hover:border-purple-300"
                      : "bg-white border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white h-5 w-5 rounded-full flex items-center justify-center text-[10px]"
                          : "text-slate-700"
                      }`}
                    >
                      {day}
                    </span>
                    {matchedEvents.length > 0 && (
                      <span className={`h-2 w-2 rounded-full ${matchedEvents.some((e) => e.isBdGovtHoliday) ? "bg-rose-600 animate-pulse" : "bg-purple-500"}`} />
                    )}
                  </div>

                  {matchedEvents.length > 0 && (
                    <div className="space-y-1">
                      {matchedEvents.slice(0, 1).map((e) => (
                        <div
                          key={e.id}
                          className={`text-[9px] font-extrabold truncate px-1.5 py-0.5 rounded ${
                            e.isBdGovtHoliday
                              ? "bg-rose-600 text-white shadow-sm"
                              : "bg-purple-100 text-purple-800 border border-purple-200"
                          }`}
                        >
                          {e.isBdGovtHoliday ? "🇧🇩 Govt Holiday" : e.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Upcoming Event Cards & BD Govt Holidays */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <i className="fi fi-rr-sparkles text-amber-500 text-sm"></i> Upcoming Events ({filteredEvents.length})
            </h3>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No events scheduled for the selected category.
              </div>
            ) : (
              filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className={`p-4 rounded-xl border shadow-sm space-y-2 hover:shadow-md transition ${
                    evt.isBdGovtHoliday
                      ? "bg-gradient-to-br from-rose-50 to-red-50/50 border-rose-200"
                      : "bg-gradient-to-br from-white to-slate-50/50 border-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {getCategoryBadge(evt.category)}
                    <span className="text-[10px] font-bold text-slate-500 font-mono">{evt.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{evt.title}</h4>
                  <div className="space-y-1 text-[11px] text-slate-500 pt-1">
                    <div className="flex items-center gap-1.5">
                      <i className="fi fi-rr-clock text-slate-400 text-xs shrink-0"></i> {evt.time}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <i className="fi fi-rr-marker text-slate-400 text-xs shrink-0"></i> {evt.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <i className="fi fi-rr-users text-slate-400 text-xs shrink-0"></i> {evt.participants}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* CREATE EVENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in-90">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Schedule New Campus Event / BD Holiday
            </h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Event Title</label>
                <input
                  type="text"
                  placeholder="Mid-Term Physics Exam"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Event Category</label>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value as CalendarEvent["category"])}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 font-bold"
                >
                  <option value="EVENT">Campus Event</option>
                  <option value="EXAM">Exam</option>
                  <option value="GOVT_HOLIDAY">🇧🇩 BD Govt Holiday</option>
                  <option value="MEETING">Meeting</option>
                  <option value="HOLIDAY">Campus Holiday</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Event Date</label>
                <input
                  type="date"
                  value={eventDateStr}
                  onChange={(e) => setEventDateStr(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
