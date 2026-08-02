"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import StudentSidebar from "@/components/student/StudentSidebar";
import StudentHeader from "@/components/student/StudentHeader";

// ── Skeleton shown while each view chunk loads ────────────────────────────────
function ViewSkeleton({ title }: { title: string }) {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-32 rounded-md bg-gray-200/80" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-md bg-gray-200/80" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 rounded-md bg-gray-200/80" />
        <div className="h-64 rounded-md bg-gray-200/80" />
      </div>
      <p className="text-xs text-gray-400 text-center font-normal">
        Loading {title}…
      </p>
    </div>
  );
}

// ── Lazy-load every view — only the active chunk is fetched ───────────────────
const StudentOverviewView = dynamic(
  () => import("@/components/student/pages/StudentOverviewView"),
  { loading: () => <ViewSkeleton title="Student Overview" />, ssr: false }
);
const StudentCoursesView = dynamic(
  () => import("@/components/student/pages/StudentCoursesView"),
  { loading: () => <ViewSkeleton title="Courses" />, ssr: false }
);
const StudentAssignmentsView = dynamic(
  () => import("@/components/student/pages/StudentAssignmentsView"),
  { loading: () => <ViewSkeleton title="Assignments" />, ssr: false }
);
const StudentRoutineView = dynamic(
  () => import("@/components/student/pages/StudentRoutineView"),
  { loading: () => <ViewSkeleton title="Routine" />, ssr: false }
);
const StudentExamsView = dynamic(
  () => import("@/components/student/pages/StudentExamsView"),
  { loading: () => <ViewSkeleton title="Exams & Results" />, ssr: false }
);
const StudentAttendanceView = dynamic(
  () => import("@/components/student/pages/StudentAttendanceView"),
  { loading: () => <ViewSkeleton title="Attendance" />, ssr: false }
);
const StudentFeesView = dynamic(
  () => import("@/components/student/pages/StudentFeesView"),
  { loading: () => <ViewSkeleton title="Fees & Payments" />, ssr: false }
);
const StudentNoticeView = dynamic(
  () => import("@/components/student/pages/StudentNoticeView"),
  { loading: () => <ViewSkeleton title="Notice Board" />, ssr: false }
);
const StudentProfileView = dynamic(
  () => import("@/components/student/pages/StudentProfileView"),
  { loading: () => <ViewSkeleton title="Profile" />, ssr: false }
);

// ─────────────────────────────────────────────────────────────────────────────

export default function StudentDashboard() {
  const pathname = usePathname();
  const [currentKey, setCurrentKey] = useState<string | null>(null);

  const getSectionFromPath = (path: string) => {
    if (path.includes("/student/courses"))     return { key: "COURSES",     title: "My Courses" };
    if (path.includes("/student/assignments")) return { key: "ASSIGNMENTS", title: "Assignments & Coursework" };
    if (path.includes("/student/routine"))     return { key: "ROUTINE",     title: "Class Routine & Timetable" };
    if (path.includes("/student/exams"))       return { key: "EXAMS",       title: "Exams & Results" };
    if (path.includes("/student/attendance"))  return { key: "ATTENDANCE",  title: "Attendance" };
    if (path.includes("/student/fees"))        return { key: "FEES",        title: "Payment Ledger & Financial Dues" };
    if (path.includes("/student/notice"))      return { key: "NOTICE",      title: "Campus Notice Board" };
    if (path.includes("/student/profile"))     return { key: "PROFILE",     title: "Student Profile & Digital ID" };
    return { key: "DASHBOARD", title: "Student & Portal" };
  };

  const { key, title } = getSectionFromPath(pathname);

  useEffect(() => {
    setCurrentKey(key);
  }, [key]);

  const renderActiveView = () => {
    switch (currentKey) {
      case "COURSES":     return <StudentCoursesView />;
      case "ASSIGNMENTS": return <StudentAssignmentsView />;
      case "ROUTINE":     return <StudentRoutineView />;
      case "EXAMS":       return <StudentExamsView />;
      case "ATTENDANCE":  return <StudentAttendanceView />;
      case "FEES":        return <StudentFeesView />;
      case "NOTICE":      return <StudentNoticeView />;
      case "PROFILE":     return <StudentProfileView />;
      case "DASHBOARD":
      default:            return <StudentOverviewView />;
    }
  };

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-[#F9FAFE] font-outfit text-gray-900 antialiased">
      <StudentSidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-y-auto">
        <StudentHeader activeTitle={title} />
        <main className="p-6 md:p-8 flex-1 relative">
          <Suspense fallback={<ViewSkeleton title={title} />}>
            <div className="animate-fade-in">
              {renderActiveView()}
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
