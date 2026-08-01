"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CustomSelect from "@/components/ui/CustomSelect";
import { downloadDocument } from "@/lib/download-utils";

interface CampusNotice {
  id: number;
  title: string;
  date: string;
  category: string;
  publisher: string;
  content: string;
  attachments: string[];
  urgent: boolean;
}

export default function StudentNoticeView() {
  const [filter, setFilter] = useState("ALL");
  const [notices, setNotices] = useState<CampusNotice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Accordion Expand/Collapse State
  const [expandedNoticeIds, setExpandedNoticeIds] = useState<number[]>([1]);

  const categoryOptions = [
    { value: "ALL", label: "All Categories" },
    { value: "EXAMS", label: "Exam Notices" },
    { value: "ACADEMIC", label: "Academic Announcements" },
    { value: "FEES", label: "Tuition & Fees" },
    { value: "HOLIDAY", label: "Holidays & Events" },
  ];

  useEffect(() => {
    const fetchNotices = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/notices?category=${filter}`);
        const data = await res.json();
        if (data.notices) {
          setNotices(data.notices);
        }
      } catch {
        toast.error("Failed to load notice board data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, [filter]);

  const toggleAccordion = (id: number) => {
    setExpandedNoticeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="space-y-6">
      {/* Header (rounded-md) */}
      <div className="bg-white p-6 rounded-md border-none shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Campus Notice Board & Accordions
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Official announcements from Principal, Faculty, and Exam Controller
          </p>
        </div>

        {/* Custom Category Dropdown Filter */}
        <div className="flex items-center gap-2">
          <CustomSelect
            options={categoryOptions}
            value={filter}
            onChange={(val) => setFilter(val)}
          />
        </div>
      </div>

      {/* Accordion Notice List */}
      {isLoading ? (
        <div className="bg-white p-8 rounded-md text-center text-xs text-gray-500 font-medium">
          Loading notice board announcements from backend API...
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => {
            const isOpen = expandedNoticeIds.includes(notice.id);

            return (
              <div
                key={notice.id}
                className={`rounded-md border-none transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-white shadow-md"
                    : "bg-white shadow-xs hover:shadow-sm"
                }`}
              >
                {/* Accordion Header Button */}
                <button
                  onClick={() => toggleAccordion(notice.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none border-none bg-transparent"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-black text-white font-bold text-[10px] px-3 py-1 rounded-md uppercase tracking-wider">
                      {notice.category}
                    </span>
                    {notice.urgent && (
                      <span className="bg-red-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-md animate-pulse">
                        URGENT
                      </span>
                    )}
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">
                      {notice.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-gray-400 font-medium hidden sm:inline-block">
                      {notice.date}
                    </span>
                    <div
                      className={`h-7 w-7 rounded-md flex items-center justify-center transition-all duration-200 ${
                        isOpen
                          ? "bg-black text-white rotate-180 shadow-xs"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      <i className="fi fi-rr-angle-small-down text-sm font-bold"></i>
                    </div>
                  </div>
                </button>

                {/* Accordion Collapsible Body */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-gray-100 text-xs text-gray-700 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <p className="leading-relaxed text-gray-600">
                      {notice.content}
                    </p>

                    {/* Attachments Section */}
                    {notice.attachments && notice.attachments.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <h4 className="font-bold text-gray-900">
                          Official Attachments
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {notice.attachments.map((file, fIdx) => (
                            <button
                              key={fIdx}
                              onClick={() => {
                                const attachmentText = `====================================================
SCHOLLEGE NOTICE ATTACHMENT: ${file}
====================================================
Notice Title: ${notice.title}
Published Date: ${notice.date}
Issuer: ${notice.publisher}

DOCUMENT BODY:
${notice.content}

Schollege School & College Management System
====================================================`;
                                downloadDocument(
                                  file.endsWith(".txt") || file.endsWith(".pdf")
                                    ? file
                                    : `${file}.txt`,
                                  attachmentText,
                                );
                              }}
                              className="flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-slate-100 border-none font-semibold text-gray-800 hover:bg-slate-200 transition cursor-pointer"
                            >
                              <i className="fi fi-rr-document text-indigo-600 text-xs"></i>
                              <span>{file}</span>
                              <i className="fi fi-rr-download text-xs text-gray-500"></i>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Publisher Footer */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-gray-400 text-[11px]">
                      <span>
                        Published by:{" "}
                        <strong className="text-gray-800">
                          {notice.publisher}
                        </strong>
                      </span>
                      <button
                        onClick={() => toast.info("Notice saved to bookmarks.")}
                        className="text-black font-semibold hover:underline cursor-pointer border-none bg-transparent"
                      >
                        Bookmark Notice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
