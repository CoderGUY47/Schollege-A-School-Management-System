"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useSession, signOut } from "@/lib/auth-client";
import Loader from "@/components/ui/Loader";
import UserAvatar from "@/components/ui/UserAvatar";

export default function TeacherSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const rawName = session?.user?.name;
  const userName =
    !rawName || rawName === "Alex Johnson" || rawName === "Teacher Account"
      ? "Dr. Robert Chen"
      : rawName;
  const userEmail = session?.user?.email || "robert.chen@schollege.edu.bd";

  const [teacherProfile, setTeacherProfile] = useState<any | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Accordion Group Expand/Collapse States
  const [openCoursework, setOpenCoursework] = useState(true);
  const [openAcademic, setOpenAcademic] = useState(true);
  const [openProfile, setOpenProfile] = useState(true);

  useEffect(() => {
    async function fetchTeacherProfile() {
      try {
        const res = await fetch(`/api/teachers?email=${encodeURIComponent(userEmail)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.teachers && data.teachers.length > 0) {
            setTeacherProfile(data.teachers[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch teacher profile for sidebar:", err);
      }
    }
    fetchTeacherProfile();
  }, [userEmail]);

  const getActiveMenuFromPath = (path: string) => {
    if (path.includes("/teacher/assignments")) return "ASSIGNMENTS";
    if (path.includes("/teacher/submissions")) return "SUBMISSIONS";
    if (path.includes("/teacher/classes")) return "CLASSES";
    if (path.includes("/teacher/profile")) return "PROFILE";
    if (path.includes("/teacher/finance")) return "FINANCE";
    return "DASHBOARD";
  };

  const activeMenu = getActiveMenuFromPath(pathname);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoggingOut(true);
    toast.info("Logging out of Teacher Portal...");

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
    }, 1200);
  };

  const displayName = teacherProfile?.name || userName;
  const displayDesignation = teacherProfile?.designation || "Senior Professor & HOD";

  return (
    <>
      {isLoggingOut && <Loader fullScreen size="lg" text="Logging out of Schollege Portal..." />}
      <aside className="w-64 bg-[#0B0F17] text-white flex flex-col justify-between p-4 shrink-0 font-outfit h-screen max-h-screen sticky top-0 left-0 border-r border-white/10 z-40 overflow-y-auto">
        <div className="space-y-6">
          {/* Brand Header */}
          <Link
            href="/teacher/dashboard"
            className="flex items-center gap-3 px-2 py-1 group"
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
              <span className="text-[10px] font-semibold text-emerald-400 block mt-0.5 tracking-wider uppercase">
                Teacher Portal
              </span>
            </div>
          </Link>

          {/* Navigation Accordion Groups */}
          <nav className="space-y-3 text-xs font-semibold">
            {/* Dashboard Overview */}
            <Link
              href="/teacher/dashboard"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition ${
                activeMenu === "DASHBOARD"
                  ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <i className="fi fi-rr-apps text-base" />
              <span>Overview</span>
            </Link>

            {/* ACCORDION 1: COURSEWORK & ASSIGNMENTS */}
            <div className="space-y-1">
              <button
                onClick={() => setOpenCoursework(!openCoursework)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white/80 transition cursor-pointer border-none bg-transparent"
              >
                <span>Coursework & Grading</span>
                <i className={`fi fi-rr-angle-small-down transition-transform duration-200 ${openCoursework ? "rotate-180" : ""}`} />
              </button>

              {openCoursework && (
                <div className="space-y-1 pl-2">
                  <Link
                    href="/teacher/assignments"
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition ${
                      activeMenu === "ASSIGNMENTS"
                        ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <i className="fi fi-rr-document text-base" />
                    <span>Assignments</span>
                  </Link>

                  <Link
                    href="/teacher/submissions"
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition ${
                      activeMenu === "SUBMISSIONS"
                        ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <i className="fi fi-rr-diploma text-base" />
                    <span>Submissions & Grading</span>
                  </Link>
                </div>
              )}
            </div>

            {/* ACCORDION 2: CLASSES & ACADEMICS */}
            <div className="space-y-1">
              <button
                onClick={() => setOpenAcademic(!openAcademic)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white/80 transition cursor-pointer border-none bg-transparent"
              >
                <span>Classroom & Routine</span>
                <i className={`fi fi-rr-angle-small-down transition-transform duration-200 ${openAcademic ? "rotate-180" : ""}`} />
              </button>

              {openAcademic && (
                <div className="space-y-1 pl-2">
                  <Link
                    href="/teacher/classes"
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition ${
                      activeMenu === "CLASSES"
                        ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <i className="fi fi-sr-users-alt text-base" />
                    <span>Assigned Classes</span>
                  </Link>
                </div>
              )}
            </div>

            {/* ACCORDION 3: PROFILE & ACCOUNT */}
            <div className="space-y-1">
              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white/80 transition cursor-pointer border-none bg-transparent"
              >
                <span>Account & Profile</span>
                <i className={`fi fi-rr-angle-small-down transition-transform duration-200 ${openProfile ? "rotate-180" : ""}`} />
              </button>

              {openProfile && (
                <div className="space-y-1 pl-2">
                  <Link
                    href="/teacher/profile"
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition ${
                      activeMenu === "PROFILE"
                        ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <i className="fi fi-rr-user text-base" />
                    <span>Teacher Profile & ID</span>
                  </Link>

                  <Link
                    href="/teacher/finance"
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition ${
                      activeMenu === "FINANCE"
                        ? "bg-white text-[#0B0F17] font-bold shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <i className="fi fi-rr-credit-card text-base" />
                    <span>Salary & Payment Ledger</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Footer & Logout Button */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1 bg-white/5 rounded-md p-2">
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
            <div className="truncate">
              <span className="text-xs font-bold text-white block truncate">{displayName}</span>
              <span className="text-[10px] text-emerald-400 font-bold block truncate">{displayDesignation}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white font-bold text-xs transition cursor-pointer border border-rose-500/30"
          >
            <i className="fi fi-rr-sign-out-alt text-xs" />
            <span>Sign Out Portal</span>
          </button>
        </div>
      </aside>
    </>
  );
}
