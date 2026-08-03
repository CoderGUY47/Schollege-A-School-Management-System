"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import TeacherSidebar from "@/components/teacher/TeacherSidebar";
import TeacherHeader from "@/components/teacher/TeacherHeader";

// ── Skeleton shown while each view chunk loads ────────────────────────────────
function ViewSkeleton({ title }: { title: string }) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero banner skeleton */}
      <div className="h-32 rounded-md bg-gray-200/80" />
      {/* KPI cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-md bg-gray-200/80" />
        ))}
      </div>
      {/* Content block skeleton */}
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
const TeacherOverviewView = dynamic(
  () => import("@/components/teacher/pages/TeacherOverviewView"),
  { loading: () => <ViewSkeleton title="Teacher Overview" />, ssr: false }
);

const TeacherAssignmentsView = dynamic(
  () => import("@/components/teacher/pages/TeacherAssignmentsView"),
  { loading: () => <ViewSkeleton title="Assignments" />, ssr: false }
);

const TeacherSubmissionsView = dynamic(
  () => import("@/components/teacher/pages/TeacherSubmissionsView"),
  { loading: () => <ViewSkeleton title="Submissions" />, ssr: false }
);

const TeacherClassesView = dynamic(
  () => import("@/components/teacher/pages/TeacherClassesView"),
  { loading: () => <ViewSkeleton title="Classes" />, ssr: false }
);

const TeacherProfileView = dynamic(
  () => import("@/components/teacher/pages/TeacherProfileView"),
  { loading: () => <ViewSkeleton title="Profile" />, ssr: false }
);

const TeacherFinanceView = dynamic(
  () => import("@/components/teacher/pages/TeacherFinanceView"),
  { loading: () => <ViewSkeleton title="Finance" />, ssr: false }
);

// ─────────────────────────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const pathname = usePathname();
  const [currentKey, setCurrentKey] = useState<string | null>(null);

  const getSectionFromPath = (path: string) => {
    if (path.includes("/teacher/assignments")) return { key: "ASSIGNMENTS", title: "Manage Course Assignments" };
    if (path.includes("/teacher/submissions")) return { key: "SUBMISSIONS", title: "Student Submissions & Grading" };
    if (path.includes("/teacher/classes"))     return { key: "CLASSES",     title: "Assigned Classes & Course Roster" };
    if (path.includes("/teacher/profile"))     return { key: "PROFILE",     title: "Teacher Profile & Digital ID" };
    if (path.includes("/teacher/finance"))     return { key: "FINANCE",     title: "Teacher Salary & Payment Ledger" };
    return { key: "DASHBOARD", title: "Teacher Overview & Portal" };
  };

  const { key, title } = getSectionFromPath(pathname);

  // Defer setting the key one tick so the skeleton renders first
  useEffect(() => {
    setCurrentKey(key);
  }, [key]);

  const renderActiveView = () => {
    switch (currentKey) {
      case "ASSIGNMENTS": return <TeacherAssignmentsView />;
      case "SUBMISSIONS": return <TeacherSubmissionsView />;
      case "CLASSES":     return <TeacherClassesView />;
      case "PROFILE":     return <TeacherProfileView />;
      case "FINANCE":     return <TeacherFinanceView />;
      case "DASHBOARD":
      default:            return <TeacherOverviewView />;
    }
  };

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-[#F9FAFE] font-outfit text-gray-900 antialiased">
      {/* Fixed Height Screen Teacher Sidebar Navigation */}
      <TeacherSidebar />

      {/* Main Content Workspace Area - Only Right Container Scrolls */}
      <div className="flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-y-auto">
        <TeacherHeader activeTitle={title} />

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
