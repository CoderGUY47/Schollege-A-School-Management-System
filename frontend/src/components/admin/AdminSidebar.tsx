"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { signOut } from "@/lib/auth-client";
import Loader from "@/components/ui/Loader";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getActiveMenuFromPath = (path: string) => {
    if (path.includes("/admin/teachers")) return "TEACHERS";
    if (path.includes("/admin/students")) return "STUDENTS";
    if (path.includes("/admin/finance")) return "FINANCE";
    if (path.includes("/admin/calendar")) return "CALENDAR";
    if (path.includes("/admin/messages")) return "MESSAGES";
    if (path.includes("/admin/notice")) return "NOTICE";
    if (path.includes("/admin/attendance")) return "ATTENDANCE";
    if (path.includes("/admin/exams")) return "EXAMS";
    if (path.includes("/admin/todo")) return "TODO";
    if (path.includes("/admin/settings")) return "SETTINGS";
    return "DASHBOARD";
  };

  const activeMenu = getActiveMenuFromPath(pathname);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoggingOut(true);
    toast.info("Logging out of Schollege Portal...");

    setTimeout(async () => {
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
    }, 3000);
  };

  return (
    <>
      {isLoggingOut && <Loader fullScreen size="lg" text="Logging out of Schollege Portal..." />}
      <aside className="w-60 bg-[#0B0F17] text-white flex flex-col justify-between p-4 shrink-0 shadow-2xl h-screen max-h-screen sticky top-0 left-0 overflow-y-auto z-40">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3 px-2 py-2 group cursor-pointer" title="Go to Main Homepage">
            <Image
              src="/images/logo.png"
              alt="Schollege Logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover shrink-0 bg-white group-hover:scale-105 transition-transform"
            />
            <h1 className="text-lg font-bold tracking-tight text-white group-hover:text-white/80 transition">
              Schollege
            </h1>
          </Link>

          <nav className="space-y-1.5 text-xs font-semibold">
            <Link
              href="/admin/dashboard"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition ${
                activeMenu === "DASHBOARD"
                  ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <i className="fi fi-rr-apps text-base"></i>
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/teachers"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition ${
                activeMenu === "TEACHERS"
                  ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <i className="fi fi-rr-graduation-cap text-base"></i>
              <span>Teachers</span>
            </Link>

            <Link
              href="/admin/students"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition ${
                activeMenu === "STUDENTS"
                  ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <i className="fi fi-rr-users text-base"></i>
              <span>Students</span>
            </Link>

            <Link
              href="/admin/finance"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition ${
                activeMenu === "FINANCE"
                  ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <i className="fi fi-rr-money-bill-wave text-base"></i>
              <span>Finance</span>
            </Link>

            <Link
              href="/admin/calendar"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition ${
                activeMenu === "CALENDAR"
                  ? "bg-[#FFFFFF] text-[#0B0F17] font-bold shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <i className="fi fi-rr-calendar text-base"></i>
              <span>Calendar</span>
            </Link>

            <Link
              href="/admin/notice"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition ${
                activeMenu === "NOTICE"
                  ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <i className="fi fi-rr-bell text-base"></i>
              <span>Notice Board</span>
            </Link>

            <Link
              href="/admin/messages"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition ${
                activeMenu === "MESSAGES"
                  ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <i className="fi fi-rr-comment-alt text-base"></i>
              <span>Message</span>
            </Link>

            <Link
              href="/admin/settings"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition ${
                activeMenu === "SETTINGS"
                  ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <i className="fi fi-rr-settings text-base"></i>
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        <Link
          href="/login"
          onClick={handleLogout}
          className="w-full bg-white text-[#0B0F17] font-bold text-xs py-3 px-4 rounded-md flex items-center justify-between shadow-md hover:bg-gray-100 transition cursor-pointer"
        >
          <span>Log Out</span>
          <i className="fi fi-rr-sign-out-alt text-sm text-[#0B0F17]"></i>
        </Link>
      </aside>
    </>
  );
}
