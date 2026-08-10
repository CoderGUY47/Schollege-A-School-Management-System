"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/lib/auth-client";

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
  avatar?: string;
  actorName?: string;
}

const TYPE_CONFIG: Record<
  NotificationType,
  { iconClass: string; bg: string; color: string }
> = {
  STUDENT: { iconClass: "fi fi-rr-users", bg: "bg-black/5", color: "text-black" },
  TEACHER: { iconClass: "fi fi-rr-graduation-cap", bg: "bg-black/5", color: "text-black" },
  EXAM: { iconClass: "fi fi-rr-file-edit", bg: "bg-black/5", color: "text-black" },
  FINANCE: { iconClass: "fi fi-rr-money-bill-wave", bg: "bg-black/5", color: "text-black" },
  SYSTEM: { iconClass: "fi fi-rr-server", bg: "bg-black/5", color: "text-black" },
  NOTICE: { iconClass: "fi fi-rr-bullhorn", bg: "bg-black/5", color: "text-black" },
  ASSIGNMENT: { iconClass: "fi fi-rr-clipboard-list", bg: "bg-black/5", color: "text-black" },
};

const PRIORITY_DOT: Record<string, string> = {
  URGENT: "bg-black",
  HIGH: "bg-black/80",
  MEDIUM: "bg-black/60",
  LOW: "bg-black/30",
};

function formatRelativeTime(timestamp: string) {
  const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function AdminHeader({ activeMenu }: { activeMenu?: string } = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleProfileLogout = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
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

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const markOneRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  return (
    <header className="px-6 py-4 md:px-8 bg-white border-b border-slate-200/80 flex items-center justify-between gap-4 shrink-0 shadow-xs z-30 font-outfit">
      {/* Left: Page title / brand */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-slate-800 tracking-tight">
          Admin Dashboard
        </span>
        <span className="text-slate-300">·</span>
        <span className="text-xs text-slate-400 font-medium">
          {new Date().toLocaleDateString("en-BD", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Bell with Notification Panel */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="h-9 w-9 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 relative transition-colors"
            aria-label="Notifications"
          >
            <i className="fi fi-rr-bell text-sm"></i>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow-sm">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Panel */}
          {open && (
            <div className="absolute right-0 top-11 w-90 bg-white rounded-xl border border-slate-200 shadow-2xl shadow-slate-200/80 z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2">
                  <i className="fi fi-rr-bell text-xs text-slate-600"></i>
                  <span className="text-xs font-bold text-slate-800">Notifications</span>
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
                      className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      <i className="fi fi-rr-check-double text-[10px]"></i>
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <i className="fi fi-rr-cross text-[10px]"></i>
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="max-h-105 overflow-y-auto divide-y divide-slate-50">
                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="h-5 w-5 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-400 font-medium">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const cfg = TYPE_CONFIG[notif.type];
                    return (
                      <div
                        key={notif.id}
                        className={`flex gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${!notif.isRead ? "bg-blue-50/40" : ""}`}
                        onClick={() => {
                          if (!notif.isRead) markOneRead(notif.id);
                          if (notif.actionUrl) {
                            setOpen(false);
                            window.location.href = notif.actionUrl;
                          }
                        }}
                      >
                        {/* Icon */}
                        <div className={`h-8 w-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <i className={`${cfg.iconClass} text-xs ${cfg.color}`}></i>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-xs font-bold leading-snug ${notif.isRead ? "text-slate-600" : "text-slate-900"} line-clamp-1`}>
                              {notif.title}
                            </p>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[notif.priority]}`} />
                              {!notif.isRead && (
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              )}
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed line-clamp-2 mt-0.5">
                            {notif.message}
                          </p>
                          <span className="text-[9px] text-slate-300 font-semibold mt-1 block">
                            {formatRelativeTime(notif.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50">
                <Link
                  href="/admin/notice"
                  onClick={() => setOpen(false)}
                  className="text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  View all announcements →
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200" />

        {/* Admin Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-3 cursor-pointer group focus:outline-none"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-black group-hover:text-black/80 transition">Nabila A.</div>
              <div className="text-[10px] font-semibold text-black/60">Admin Officer</div>
            </div>
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              alt="Admin Profile"
              width={36}
              height={36}
              className="h-9 w-9 rounded-md object-cover border border-gray-200 shadow-sm group-hover:ring-2 group-hover:ring-black transition"
            />
          </button>

          {/* Profile Dropdown Panel */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl border border-slate-100 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="font-extrabold text-black">Nabila A.</p>
                <p className="text-[10px] text-black/60">admin@schollege.edu.bd</p>
              </div>
              <Link
                href="/admin/settings"
                onClick={() => setProfileOpen(false)}
                className="block px-4 py-2 text-black/80 hover:bg-black/5 hover:text-black font-semibold"
              >
                Settings & Account
              </Link>
              <button
                onClick={handleProfileLogout}
                className="w-full text-left px-4 py-2 text-black hover:bg-black/5 font-extrabold flex items-center justify-between transition cursor-pointer"
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
