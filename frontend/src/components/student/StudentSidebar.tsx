"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { signOut } from "@/lib/auth-client";
import Loader from "@/components/ui/Loader";

export default function StudentSidebar() {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Accordion Group Expand/Collapse States
  const [openAcademics, setOpenAcademics] = useState(true);
  const [openExams, setOpenExams] = useState(true);
  const [openCampus, setOpenCampus] = useState(true);

  const getActiveMenuFromPath = (path: string) => {
    if (path.includes("/student/courses")) return "COURSES";
    if (path.includes("/student/assignments")) return "ASSIGNMENTS";
    if (path.includes("/student/routine")) return "ROUTINE";
    if (path.includes("/student/exams")) return "EXAMS";
    if (path.includes("/student/attendance")) return "ATTENDANCE";
    if (path.includes("/student/fees")) return "FEES";
    if (path.includes("/student/notice")) return "NOTICE";
    if (path.includes("/student/profile")) return "PROFILE";
    return "DASHBOARD";
  };

  const activeMenu = getActiveMenuFromPath(pathname);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoggingOut(true);
    toast.info("Logging out of Student Portal...");

    setTimeout(async () => {
      try {
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
          document.cookie.split(";").forEach((c) => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(
                /=.*/,
                "=;expires=" + new Date().toUTCString() + ";path=/",
              );
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
    }, 1800);
  };

  return (
    <>
      {isLoggingOut && (
        <Loader
          fullScreen
          size="lg"
          text="Logging out of Schollege Portal..."
        />
      )}
      <aside className="w-60 bg-[#0B0F17] text-white flex flex-col justify-between p-4 shrink-0 shadow-2xl h-screen max-h-screen sticky top-0 left-0 overflow-y-auto z-40">
        <div className="space-y-6">
          {/* Logo & Brand Header */}
          <Link
            href="/"
            className="flex items-center gap-3 px-2 py-2 group cursor-pointer"
            title="Go to Main Homepage"
          >
            <Image
              src="/images/logo.png"
              alt="Schollege Logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-md object-cover shrink-0 bg-white group-hover:scale-105 transition-transform"
            />
            <div>
              <h1 className="text-base font-bold tracking-tight text-white group-hover:text-white/80 transition leading-none">
                Schollege
              </h1>
              <span className="text-[10px] font-semibold text-white/50 block mt-0.5 tracking-wider uppercase">
                Student Portal
              </span>
            </div>
          </Link>

          {/* Navigation Accordion Groups */}
          <nav className="space-y-3 text-xs font-semibold">
            {/* Dashboard Link */}
            <Link
              href="/student/dashboard"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition ${
                activeMenu === "DASHBOARD"
                  ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <i className="fi fi-rr-apps text-base"></i>
              <span>Dashboard</span>
            </Link>

            {/* ACCORDION 1: ACADEMICS & COURSES */}
            <div className="space-y-1">
              <button
                onClick={() => setOpenAcademics(!openAcademics)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white/80 transition cursor-pointer border-none bg-transparent"
              >
                <span>Academics & Courses</span>
                <i
                  className={`fi fi-rr-angle-small-down transition-transform duration-200 ${openAcademics ? "rotate-180" : ""}`}
                ></i>
              </button>

              {openAcademics && (
                <div className="space-y-1 pl-1 animate-in fade-in slide-in-from-top-1">
                  <Link
                    href="/student/courses"
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition ${
                      activeMenu === "COURSES"
                        ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <i className="fi fi-rr-book-alt text-sm"></i>
                    <span>My Courses</span>
                  </Link>

                  <Link
                    href="/student/assignments"
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition ${
                      activeMenu === "ASSIGNMENTS"
                        ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <i className="fi fi-rr-document text-sm"></i>
                    <span>Assignments</span>
                  </Link>

                  <Link
                    href="/student/routine"
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition ${
                      activeMenu === "ROUTINE"
                        ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <i className="fi fi-rr-time-twelve text-sm"></i>
                    <span>Class Routine</span>
                  </Link>
                </div>
              )}
            </div>

            {/* ACCORDION 2: EXAMS & ATTENDANCE */}
            <div className="space-y-1">
              <button
                onClick={() => setOpenExams(!openExams)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white/80 transition cursor-pointer border-none bg-transparent"
              >
                <span>Exams &</span>
                <i
                  className={`fi fi-rr-angle-small-down transition-transform duration-200 ${openExams ? "rotate-180" : ""}`}
                ></i>
              </button>

              {openExams && (
                <div className="space-y-1 pl-1 animate-in fade-in slide-in-from-top-1">
                  <Link
                    href="/student/exams"
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition ${
                      activeMenu === "EXAMS"
                        ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <i className="fi fi-rr-diploma text-sm"></i>
                    <span>Exams & Results</span>
                  </Link>

                  <Link
                    href="/student/attendance"
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition ${
                      activeMenu === "ATTENDANCE"
                        ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <i className="fi fi-rr-chart-user text-sm"></i>
                    <span>Attendance</span>
                  </Link>
                </div>
              )}
            </div>

            {/* ACCORDION 3: CAMPUS & ACCOUNT */}
            <div className="space-y-1">
              <button
                onClick={() => setOpenCampus(!openCampus)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white/80 transition cursor-pointer border-none bg-transparent"
              >
                <span>Accounts & Campus</span>
                <i
                  className={`fi fi-rr-angle-small-down transition-transform duration-200 ${openCampus ? "rotate-180" : ""}`}
                ></i>
              </button>

              {openCampus && (
                <div className="space-y-1 pl-1 animate-in fade-in slide-in-from-top-1">
                  <Link
                    href="/student/fees"
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition ${
                      activeMenu === "FEES"
                        ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <i className="fi fi-rr-credit-card text-sm"></i>
                    <span>Payment Ledger &amp; Dues</span>
                  </Link>

                  <Link
                    href="/student/notice"
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition ${
                      activeMenu === "NOTICE"
                        ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <i className="fi fi-rr-bell text-sm"></i>
                    <span>Notice Board</span>
                  </Link>

                  <Link
                    href="/student/profile"
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition ${
                      activeMenu === "PROFILE"
                        ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <i className="fi fi-rr-user text-sm"></i>
                    <span>My Profile</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Log Out Button */}
        <Link
          href="/login"
          onClick={handleLogout}
          className="w-full bg-white text-[#0B0F17] font-bold text-xs py-3 px-4 rounded-md flex items-center justify-between shadow-md hover:bg-gray-100 transition cursor-pointer mt-4"
        >
          <span>Log Out</span>
          <i className="fi fi-rr-sign-out-alt text-sm text-[#0B0F17]"></i>
        </Link>
      </aside>
    </>
  );
}
