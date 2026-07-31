"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import StudentAvatar from "@/components/student/StudentAvatar";
import { StudentRecord } from "@/lib/backend-student";

type NotificationType =
  | "STUDENT"
  | "TEACHER"
  | "EXAM"
  | "FINANCE"
  | "SYSTEM"
  | "NOTICE"
  | "ASSIGNMENT";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  actionUrl?: string;
}

const TYPE_CONFIG: Record<
  NotificationType,
  { iconClass: string; bg: string; color: string }
> = {
  STUDENT: {
    iconClass: "fi fi-rr-user",
    bg: "bg-indigo-50",
    color: "text-indigo-600",
  },
  TEACHER: {
    iconClass: "fi fi-rr-graduation-cap",
    bg: "bg-emerald-50",
    color: "text-emerald-600",
  },
  EXAM: {
    iconClass: "fi fi-rr-file-edit",
    bg: "bg-rose-50",
    color: "text-rose-600",
  },
  FINANCE: {
    iconClass: "fi fi-rr-badge-dollar",
    bg: "bg-amber-50",
    color: "text-amber-600",
  },
  SYSTEM: {
    iconClass: "fi fi-rr-server",
    bg: "bg-gray-100",
    color: "text-gray-700",
  },
  NOTICE: {
    iconClass: "fi fi-rr-bullhorn",
    bg: "bg-blue-50",
    color: "text-blue-600",
  },
  ASSIGNMENT: {
    iconClass: "fi fi-rr-clipboard-list",
    bg: "bg-purple-50",
    color: "text-purple-600",
  },
};

const PRIORITY_DOT: Record<string, string> = {
  URGENT: "bg-rose-500",
  HIGH: "bg-amber-500",
  MEDIUM: "bg-indigo-500",
  LOW: "bg-gray-400",
};

function formatRelativeTime(timestamp: string) {
  const timeMs = new Date(timestamp).getTime();
  if (isNaN(timeMs)) return timestamp;
  const diff = Math.floor((Date.now() - timeMs) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface StudentHeaderProps {
  studentName?: string;
  studentId?: string;
  activeTitle?: string;
}

export default function StudentHeader({
  studentName: defaultName = "Aria Rahman",
  studentId: defaultId = "SCH-2026-1024",
}: StudentHeaderProps) {
  const { data: session } = useSession();
  const rawName = session?.user?.name;
  const userName =
    !rawName || rawName === "Alex Johnson" || rawName === "Student Account"
      ? defaultName
      : rawName;
  const userEmail =
    session?.user?.email || "aria.rahman.12a03@schollege.edu.bd";

  const [studentProfile, setStudentProfile] = useState<StudentRecord | null>(
    null,
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatarIndex, setAvatarIndex] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Listen to live avatar cycling events from StudentCard / StudentProfileView
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("schollege_student_avatar_index");
      if (saved) setAvatarIndex(Number(saved));

      const handleAvatarChanged = (e: any) => {
        if (e.detail && typeof e.detail.avatarIndex === "number") {
          setAvatarIndex(e.detail.avatarIndex);
        }
      };

      window.addEventListener("student-avatar-changed", handleAvatarChanged);
      return () =>
        window.removeEventListener(
          "student-avatar-changed",
          handleAvatarChanged,
        );
    }
  }, []);

  // Asynchronously fetch logged in student profile details
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(
          `/api/students?email=${encodeURIComponent(userEmail)}`,
        );
        if (res.ok) {
          const data = await res.json();
          if (data.students && data.students.length > 0) {
            setStudentProfile(data.students[0]);
          } else {
            const fallbackRes = await fetch(`/api/students?limit=1`);
            const fallbackData = await fallbackRes.json();
            if (fallbackData.students && fallbackData.students.length > 0) {
              setStudentProfile(fallbackData.students[0]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch student profile for header:", err);
      }
    }
    fetchProfile();
  }, [userEmail]);

  // Fetch student notifications from /api/notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/notifications?role=STUDENT&email=${encodeURIComponent(userEmail)}`,
      );
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch student notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10_000);
    const handleUpdated = () => fetchNotifications();
    window.addEventListener("notification-updated", handleUpdated);
    return () => {
      clearInterval(interval);
      window.removeEventListener("notification-updated", handleUpdated);
    };
  }, [fetchNotifications]);

  // Close notification panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const markOneRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const handleLogout = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }
      await signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  const displayName = studentProfile?.name || userName;
  const displayStudentId = studentProfile?.studentIdNumber || defaultId;
  const displayGender = studentProfile?.gender || "FEMALE";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-xs z-30 font-outfit">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-72">
        <div className="relative w-full">
          <i className="fi fi-rr-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input
            type="text"
            placeholder="Search courses, exams, notices..."
            className="w-full bg-gray-50 border border-gray-200 rounded-md py-2 pl-9 pr-4 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white"
          />
        </div>
      </div>

      {/* Right User & Notification Modal */}
      <div className="flex items-center gap-4">
        {/* Student Notification Bell & Dropdown Modal */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="h-9 w-9 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 relative transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <i className="fi fi-rr-bell text-sm"></i>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-[0.2px] min-w-[16px] h-[16px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow-sm">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Student Notification Dropdown Modal */}
          {notifOpen && (
            <div className="absolute right-0 top-11 w-[360px] bg-white rounded-md border border-gray-200 shadow-xl z-50 overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50/70">
                <div className="flex items-center gap-2">
                  <i className="fi fi-rr-bell text-xs text-indigo-600"></i>
                  <span className="text-xs font-bold text-gray-900">
                    Student Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-[10px] font-bold text-gray-600 hover:text-black px-2 py-1 rounded-md hover:bg-gray-200/60 transition-colors border-none cursor-pointer"
                    >
                      <i className="fi fi-rr-check-double text-[10px]"></i>
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-gray-200/60 text-gray-400 hover:text-gray-700 transition-colors border-none cursor-pointer"
                  >
                    <i className="fi fi-rr-cross text-[10px]"></i>
                  </button>
                </div>
              </div>

              {/* Notification Items List */}
              <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100">
                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="h-5 w-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-10 text-center text-xs text-gray-400 font-medium">
                    No new student notifications
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.NOTICE;
                    return (
                      <div
                        key={notif.id}
                        className={`flex gap-3 px-4 py-3 hover:bg-gray-50/80 cursor-pointer transition-colors ${
                          !notif.isRead ? "bg-indigo-50/30 font-medium" : ""
                        }`}
                        onClick={() => {
                          if (!notif.isRead) markOneRead(notif.id);
                          if (notif.actionUrl) {
                            setNotifOpen(false);
                            window.location.href = notif.actionUrl;
                          }
                        }}
                      >
                        {/* Icon Badge */}
                        <div
                          className={`h-8 w-8 rounded-md ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5 border border-gray-200/50`}
                        >
                          <i
                            className={`${cfg.iconClass} text-xs ${cfg.color}`}
                          ></i>
                        </div>

                        {/* Text Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-xs font-bold leading-snug ${notif.isRead ? "text-gray-700" : "text-gray-900"} line-clamp-1`}
                            >
                              {notif.title}
                            </p>
                            <div className="flex items-center gap-1 shrink-0">
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[notif.priority] || "bg-gray-400"}`}
                              />
                              {!notif.isRead && (
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                              )}
                            </div>
                          </div>
                          <p className="text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-2 mt-0.5">
                            {notif.message}
                          </p>
                          <span className="text-[9px] text-gray-400 font-semibold mt-1 block">
                            {formatRelativeTime(notif.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 px-4 py-2.5 bg-gray-50/70">
                <Link
                  href="/student/notice"
                  onClick={() => setNotifOpen(false)}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors block"
                >
                  View all campus announcements →
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200" />

        {/* Student Profile & Menu Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-md hover:bg-gray-50 transition cursor-pointer border-none focus:outline-none"
          >
            {/* Dynamic SVG Avatar matching Student Profile Card */}
            <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-indigo-400/50 flex items-center justify-center bg-[#2b2b36] shrink-0 shadow-sm">
              <StudentAvatar
                name={displayName}
                gender={displayGender}
                avatarUrl={session?.user?.image || studentProfile?.avatarUrl}
                avatarIndex={avatarIndex}
                sizeClassName="h-14 w-14"
              />
            </div>

            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-gray-900 block leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-gray-400 font-semibold block">
                ID: #{displayStudentId}
              </span>
            </div>
          </button>

          {/* Profile Dropdown Panel */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl border border-gray-200 py-1.5 z-50 text-xs font-outfit">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="font-extrabold text-gray-900">{displayName}</p>
                <p className="text-[10px] text-gray-500 truncate">
                  {userEmail}
                </p>
              </div>
              <Link
                href="/student/profile"
                onClick={() => setProfileOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-semibold"
              >
                My Profile & ID Card
              </Link>
              <Link
                href="/student/routine"
                onClick={() => setProfileOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-semibold"
              >
                Class Routine
              </Link>
              <Link
                href="/student/fees"
                onClick={() => setProfileOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-semibold"
              >
                Tuition & Fees
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-bold flex items-center justify-between transition cursor-pointer border-none"
              >
                <span>Log Out</span>
                <i className="fi fi-rr-sign-out-alt text-xs"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
