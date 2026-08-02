"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "react-toastify";
import UserAvatar from "@/components/ui/UserAvatar";

interface TeacherHeaderProps {
  activeTitle: string;
}

export default function TeacherHeader({ activeTitle }: TeacherHeaderProps) {
  const { data: session } = useSession();
  const rawName = session?.user?.name;
  const userName =
    !rawName || rawName === "Alex Johnson" || rawName === "Teacher Account"
      ? "Dr. Robert Chen"
      : rawName;
  const userEmail = session?.user?.email || "robert.chen@schollege.edu.bd";

  const [teacherProfile, setTeacherProfile] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const panelRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fetch logged in teacher profile dynamically from database
  useEffect(() => {
    async function fetchTeacherProfile() {
      try {
        const res = await fetch(
          `/api/teachers?email=${encodeURIComponent(userEmail)}`,
        );
        if (res.ok) {
          const data = await res.json();
          if (data.teachers && data.teachers.length > 0) {
            // Only use an exact email match — never fall back to another teacher's record
            const exactMatch = data.teachers.find(
              (t: any) => t.email?.toLowerCase() === userEmail.toLowerCase(),
            );
            if (exactMatch) {
              setTeacherProfile(exactMatch);
            }
            // If no exact match, leave teacherProfile null — use session fallbacks below
          }
        }
      } catch (err) {
        console.error("Failed to fetch teacher profile for header:", err);
      }
    }
    fetchTeacherProfile();
  }, [userEmail]);

  // Fetch teacher notifications dynamically from /api/notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/notifications?role=TEACHER&email=${encodeURIComponent(userEmail)}`,
      );
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch teacher notifications:", err);
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

  // Close dropdown modals on outside click
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
        body: JSON.stringify({
          role: "TEACHER",
          email: userEmail,
          markAllRead: true,
        }),
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
      setUnreadCount((prev) => Math.max(0, prev - 1));
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    toast.info(`Searching teacher records & assignments for: "${searchQuery}"`);
  };

  const displayName = teacherProfile?.name || userName;
  const displayTeacherId = teacherProfile?.teacherIdNumber || "SCH-T-1001";
  const displayDept = teacherProfile?.department || "Physics";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-xs z-30 font-outfit">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-72">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <i className="fi fi-rr-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search assignments, student rosters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-md py-2 pl-9 pr-4 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-black transition"
          />
        </form>
      </div>

      {/* Right User & Notification Modal */}
      <div className="flex items-center gap-4">
        {/* Notifications Bell & Dropdown Modal */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="h-9 w-9 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 relative transition-colors cursor-pointer"
            aria-label="Teacher Notifications"
          >
            <i className="fi fi-rr-bell text-sm" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-[0.2px] min-w-[16px] h-[16px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notifOpen && (
            <div className="absolute right-0 top-11 w-[360px] bg-white rounded-md border border-gray-400/50 shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50/70">
                <div className="flex items-center gap-2">
                  <i className="fi fi-rr-bell text-xs text-indigo-600" />
                  <span className="text-xs font-bold text-gray-900">
                    Teacher Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] font-bold text-indigo-600 hover:underline border-none bg-transparent cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-700 border-none cursor-pointer"
                  >
                    <i className="fi fi-rr-cross text-[10px]" />
                  </button>
                </div>
              </div>

              <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100">
                {notifications.length > 0 ? (
                  notifications.map((n, idx) => (
                    <div
                      key={n.id || idx}
                      onClick={() => !n.isRead && markOneRead(n.id)}
                      className={`p-3.5 hover:bg-slate-50 transition cursor-pointer space-y-1 ${
                        !n.isRead ? "bg-indigo-50/40" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                          {n.scope === "ALL" || n.targetRole === "ALL"
                            ? "Campus Announcement"
                            : n.type || "Notification"}
                        </span>
                        {!n.isRead && (
                          <span className="h-2 w-2 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-gray-900">
                        {n.title}
                      </h4>
                      <p className="text-[11px] text-gray-600 font-normal leading-relaxed line-clamp-2">
                        {n.message || n.content}
                      </p>
                      {n.senderName && (
                        <span className="text-[9px] text-gray-400 block pt-0.5 font-normal">
                          From: {n.senderName}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-gray-400 font-medium">
                    No active teacher notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200" />

        {/* Teacher Profile & Menu Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-md hover:bg-gray-50 transition cursor-pointer border-none focus:outline-none"
          >
            <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-indigo-400/50 flex items-center justify-center bg-[#2b2b36] shrink-0 shadow-sm">
              <UserAvatar
                name={displayName}
                gender={teacherProfile?.gender || "MALE"}
                avatarUrl={
                  session?.user?.image ||
                  teacherProfile?.avatarUrl ||
                  "/images/avatars/avatar_02.svg"
                }
                sizeClassName="h-14 w-14"
              />
            </div>
            <div className="text-left hidden md:block">
              <span className="text-xs font-bold text-gray-900 block leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block leading-tight mt-0.5">
                {displayTeacherId} • Dept of {displayDept}
              </span>
            </div>
            <i className="fi fi-rr-angle-small-down text-gray-400 text-xs" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 top-12 w-60 bg-white rounded-md border border-gray-400/50 shadow-2xl z-50 py-2 space-y-1 font-outfit">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-bold text-gray-900 text-xs">{displayName}</p>
                <p className="text-[10px] text-gray-500 font-normal">
                  {userEmail}
                </p>
              </div>

              <Link
                href="/teacher/profile"
                className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-slate-50 flex items-center gap-2 transition"
                onClick={() => setProfileOpen(false)}
              >
                <i className="fi fi-rr-user text-xs text-indigo-600" />
                <span>My Teacher Profile & ID</span>
              </Link>

              <Link
                href="/teacher/assignments"
                className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-slate-50 flex items-center gap-2 transition"
                onClick={() => setProfileOpen(false)}
              >
                <i className="fi fi-rr-document text-xs text-indigo-600" />
                <span>Coursework & Assignments</span>
              </Link>

              <Link
                href="/teacher/classes"
                className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-slate-50 flex items-center gap-2 transition"
                onClick={() => setProfileOpen(false)}
              >
                <i className="fi fi-sr-users-alt text-xs text-indigo-600" />
                <span>Classroom Rosters</span>
              </Link>

              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-bold flex items-center justify-between transition cursor-pointer border-none"
                >
                  <span>Sign Out Teacher Portal</span>
                  <i className="fi fi-rr-sign-out-alt text-xs" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
