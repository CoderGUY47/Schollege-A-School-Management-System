"use client";

import React, { useState } from "react";
import Link from "next/link";

export function CompactMonthCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 1)); // August 2026
  const [selectedDay, setSelectedDay] = useState<number>(6); // Default 6th

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarGrid = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarGrid.push({
      day: daysInPrevMonth - i,
      currentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarGrid.push({
      day: d,
      currentMonth: true,
    });
  }

  // Next month leading days to complete 35 slots
  const remaining = 35 - calendarGrid.length;
  for (let n = 1; n <= Math.max(0, remaining); n++) {
    calendarGrid.push({
      day: n,
      currentMonth: false,
    });
  }

  return (
    <div className="w-full bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between relative overflow-hidden h-full min-h-[350px]">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i
            className="fi fi-rr-calendar text-indigo-600 text-sm"
            aria-hidden="true"
          />
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h4>
            <span className="text-[9px] font-bold text-slate-400 block">
              Academic & Event Calendar
            </span>
          </div>
        </div>

        {/* Month Nav Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setCurrentDate(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() - 1,
                  1
                )
              )
            }
            className="h-6 w-6 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center text-slate-500 transition"
            title="Previous Month"
          >
            <i className="fi fi-rr-angle-small-left text-xs"></i>
          </button>
          <button
            onClick={() =>
              setCurrentDate(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1,
                  1
                )
              )
            }
            className="h-6 w-6 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center text-slate-500 transition"
            title="Next Month"
          >
            <i className="fi fi-rr-angle-small-right text-xs"></i>
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 text-center text-[10px] font-extrabold text-slate-400 border-b border-slate-100 pb-1.5">
        <span className="text-rose-500">SUN</span>
        <span>MON</span>
        <span>TUE</span>
        <span>WED</span>
        <span>THU</span>
        <span className="text-emerald-600">FRI</span>
        <span className="text-emerald-600">SAT</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
        {calendarGrid.slice(0, 35).map((item, idx) => {
          const isToday = selectedDay === item.day && item.currentMonth;
          const isHoliday =
            [14, 21, 26].includes(item.day) && item.currentMonth;
          const isExam = [6, 15, 28].includes(item.day) && item.currentMonth;
          const isEvent =
            [10, 18, 24].includes(item.day) && item.currentMonth;

          let tileStyle = "hover:bg-slate-100 text-slate-700";
          if (isToday) {
            tileStyle =
              "bg-gradient-to-br from-rose-500 to-pink-600 text-white font-extrabold shadow-sm shadow-rose-200";
          } else if (isHoliday) {
            tileStyle =
              "bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-200 hover:bg-emerald-100";
          } else if (isExam) {
            tileStyle =
              "bg-amber-50 text-amber-700 font-extrabold border border-amber-200 hover:bg-amber-100";
          } else if (isEvent) {
            tileStyle =
              "bg-purple-50 text-purple-700 font-extrabold border border-purple-200 hover:bg-purple-100";
          } else if (!item.currentMonth) {
            tileStyle = "text-slate-300 pointer-events-none";
          }

          return (
            <div
              key={idx}
              onClick={() => item.currentMonth && setSelectedDay(item.day)}
              className={`h-7 w-7 rounded-md flex flex-col items-center justify-center mx-auto cursor-pointer text-[11px] relative transition-all ${tileStyle}`}
            >
              <span>{item.day}</span>

              {/* Event Indicator Dot */}
              {!isToday && item.currentMonth && (
                <span className="flex gap-0.5 absolute bottom-0.5">
                  {isHoliday && (
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                  )}
                  {isExam && (
                    <span className="h-1 w-1 rounded-full bg-amber-500" />
                  )}
                  {isEvent && (
                    <span className="h-1 w-1 rounded-full bg-purple-500" />
                  )}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Mini Colorful Legend */}
      <div className="flex items-center justify-between text-[9px] font-bold px-1 py-1 bg-slate-50 rounded-md border border-slate-100">
        <span className="flex items-center gap-1 text-rose-600">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Today
        </span>
        <span className="flex items-center gap-1 text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Holiday
        </span>
        <span className="flex items-center gap-1 text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Exam
        </span>
        <span className="flex items-center gap-1 text-purple-700">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Event
        </span>
      </div>

      {/* Gradient Manage Calendar Button */}
      <Link
        href="/admin/calendar"
        className="flex items-center justify-center gap-2 w-full text-[11px] font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 rounded-md shadow-md shadow-indigo-100 transition"
      >
        <i className="fi fi-rr-calendar-check text-xs" aria-hidden="true" />
        <span>Manage Full Calendar</span>
      </Link>
    </div>
  );
}
