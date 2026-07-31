import { NextResponse } from "next/server";
import { SCH_NOTIFICATIONS } from "@/lib/backend-student";
import { createClient } from "@/lib/supabase/client";

export interface NotificationRecord {
  id: string;
  type:
    | "NOTICE"
    | "STUDENT"
    | "TEACHER"
    | "EXAM"
    | "FINANCE"
    | "ASSIGNMENT"
    | "SYSTEM";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  actionUrl?: string;
  scope?: "ALL" | "ROLE" | "USER";
  targetRole?: "ALL" | "STUDENT" | "TEACHER" | "ADMIN";
  recipientEmail?: string;
  senderName?: string;
}

// Global In-Memory Notification Store (Shared across API operations)
let inMemoryNotifications: NotificationRecord[] = [
  // ── 1. COMMON BROADCAST ANNOUNCEMENTS (Visible to ALL roles: Student, Teacher, Admin) ──
  {
    id: "cnotif-001",
    type: "NOTICE",
    title: "Annual Sports & Cultural Week Announcement",
    message:
      "Registration is officially open for the Schollege MS Annual Sports & Cultural Competition 2026 for all classes and faculty members.",
    timestamp: new Date().toISOString(),
    isRead: false,
    priority: "MEDIUM",
    scope: "ALL",
    targetRole: "ALL",
    actionUrl: "/student/notice",
    senderName: "Academic Directorate",
  },
  {
    id: "cnotif-002",
    type: "SYSTEM",
    title: "Campus Portal Maintenance Complete",
    message:
      "Schollege MS cloud infrastructure and database sync upgraded to v4.2. All features operational.",
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    isRead: true,
    priority: "LOW",
    scope: "ALL",
    targetRole: "ALL",
    senderName: "IT Operations",
  },
  {
    id: "cnotif-003",
    type: "NOTICE",
    title: "Independence Day Campus Holiday Notice",
    message:
      "The institution will remain closed on Wednesday for national holiday observance. Regular academic schedule resumes Thursday.",
    timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
    isRead: false,
    priority: "HIGH",
    scope: "ALL",
    targetRole: "ALL",
    senderName: "Principal Office",
  },

  // ── 2. TEACHER-SPECIFIC & PRIVATE NOTIFICATIONS ──
  {
    id: "tnotif-101",
    type: "ASSIGNMENT",
    title: "New Student Solution Submitted",
    message:
      "Aria Rahman (Class 12 Sec A) submitted Physics Lab Session 4 solution for evaluation.",
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    isRead: false,
    priority: "HIGH",
    scope: "USER",
    targetRole: "TEACHER",
    recipientEmail: "teacher@edu.bd",
    actionUrl: "/teacher/submissions",
    senderName: "Student Portal Engine",
  },
  {
    id: "tnotif-102",
    type: "TEACHER",
    title: "Faculty Profile Credentials Updated",
    message:
      "Your degree qualifications, specialization, and consultation hours were updated in the backend database.",
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    isRead: false,
    priority: "MEDIUM",
    scope: "USER",
    targetRole: "TEACHER",
    recipientEmail: "teacher@edu.bd",
    actionUrl: "/teacher/profile",
    senderName: "Faculty Records System",
  },
  {
    id: "tnotif-103",
    type: "NOTICE",
    title: "Term 1 Course Routine Published",
    message:
      "Classroom allocations for Class 12 Sec A (Room 304) and Physics Lab 01 are updated in the teacher portal.",
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    isRead: false,
    priority: "MEDIUM",
    scope: "ROLE",
    targetRole: "TEACHER",
    actionUrl: "/teacher/classes",
    senderName: "Academic Dean",
  },
  {
    id: "tnotif-104",
    type: "ASSIGNMENT",
    title: "New Student Solution Submitted",
    message:
      "Zayan Ahmed (Class 12 Sec B) submitted Higher Math Differential Equations assignment.",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    isRead: false,
    priority: "HIGH",
    scope: "USER",
    targetRole: "TEACHER",
    recipientEmail: "robert.chen@schollege.edu.bd",
    actionUrl: "/teacher/submissions",
    senderName: "Student Portal Engine",
  },

  // ── 3. STUDENT-SPECIFIC & PRIVATE NOTIFICATIONS ──
  {
    id: "snotif-201",
    type: "STUDENT",
    title: "Personal Profile Details Updated",
    message:
      "Your personal details and guardian emergency contacts were successfully saved to database.",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    isRead: false,
    priority: "MEDIUM",
    scope: "USER",
    targetRole: "STUDENT",
    recipientEmail: "aria.rahman.12a03@schollege.edu.bd",
    actionUrl: "/student/profile",
    senderName: "Student Identity System",
  },
  {
    id: "snotif-202",
    type: "FINANCE",
    title: "Tuition Fee Status: PAID",
    message:
      "Your Monthly Academic & Tuition Fee payment has been confirmed by the Admin Accounts office.",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    isRead: false,
    priority: "HIGH",
    scope: "USER",
    targetRole: "STUDENT",
    recipientEmail: "student@edu.bd",
    actionUrl: "/student/fees",
    senderName: "Accounts Office",
  },
  {
    id: "snotif-203",
    type: "EXAM",
    title: "HSC Mid-Term Results Published",
    message:
      "Term 1 Class 12 examination marksheets and GPA summaries are accessible online.",
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    isRead: false,
    priority: "URGENT",
    scope: "ROLE",
    targetRole: "STUDENT",
    actionUrl: "/student/exams",
    senderName: "Controller of Exams",
  },
];

// GET /api/notifications?role=ROLE&email=EMAIL
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = (searchParams.get("role") || "").toUpperCase();
    const email = (searchParams.get("email") || "").toLowerCase().trim();

    // ── Supabase-first: load persisted notifications & merge read states ──────
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          // Merge Supabase read-states into in-memory store
          const supabaseReadMap = new Map(
            data.map((n: any) => [n.id, n.is_read ?? n.isRead]),
          );
          inMemoryNotifications = inMemoryNotifications.map((n) =>
            supabaseReadMap.has(n.id)
              ? { ...n, isRead: supabaseReadMap.get(n.id) }
              : n,
          );
        }
      } catch (_) {
        // Supabase unavailable — continue with in-memory store
      }
    }

    // ── ADMIN ROLE: Sees ALL system notifications (Common broadcast + Student private + Teacher private + System events)
    if (role === "ADMIN") {
      const unreadCount = inMemoryNotifications.filter((n) => !n.isRead).length;
      return NextResponse.json({
        notifications: inMemoryNotifications,
        unreadCount,
        source: "ADMIN_FULL_SYSTEM_AUDIT",
      });
    }

    // ── TEACHER ROLE: Sees Common Broadcasts + Role-wide Teacher notices + Private notifications for this teacher's email
    if (role === "TEACHER") {
      const filteredTeacherNotifs = inMemoryNotifications.filter((n) => {
        // 1. Common broadcast notifications (targetRole === 'ALL' or scope === 'ALL')
        if (n.targetRole === "ALL" || n.scope === "ALL") return true;

        // 2. Role-wide notifications for TEACHER without specific recipient
        if (
          n.targetRole === "TEACHER" &&
          (!n.recipientEmail || n.scope === "ROLE")
        )
          return true;

        // 3. Private teacher notification matching user email (or default fallback for demo accounts)
        if (n.targetRole === "TEACHER" && n.recipientEmail) {
          const rec = n.recipientEmail.toLowerCase();
          return (
            rec === email ||
            email === "teacher@edu.bd" ||
            email === "robert.chen@schollege.edu.bd" ||
            rec === "teacher@edu.bd"
          );
        }

        return false;
      });

      const unreadCount = filteredTeacherNotifs.filter((n) => !n.isRead).length;
      return NextResponse.json({
        notifications: filteredTeacherNotifs,
        unreadCount,
        source: "TEACHER_NOTIFICATION_STORE",
      });
    }

    // ── STUDENT ROLE: Sees Common Broadcasts + Role-wide Student notices + Private notifications for this student's email
    if (role === "STUDENT") {
      const filteredStudentNotifs = inMemoryNotifications.filter((n) => {
        // 1. Common broadcast notifications (targetRole === 'ALL' or scope === 'ALL')
        if (n.targetRole === "ALL" || n.scope === "ALL") return true;

        // 2. Role-wide notifications for STUDENT without specific recipient
        if (
          n.targetRole === "STUDENT" &&
          (!n.recipientEmail || n.scope === "ROLE")
        )
          return true;

        // 3. Private student notification matching user email (or default fallback for demo accounts)
        if (n.targetRole === "STUDENT" && n.recipientEmail) {
          const rec = n.recipientEmail.toLowerCase();
          return (
            rec === email ||
            email === "student@edu.bd" ||
            email === "aria.rahman.12a03@schollege.edu.bd" ||
            rec === "student@edu.bd" ||
            rec === "aria.rahman.12a03@schollege.edu.bd"
          );
        }

        return false;
      });

      const unreadCount = filteredStudentNotifs.filter((n) => !n.isRead).length;
      return NextResponse.json({
        notifications: filteredStudentNotifs,
        unreadCount,
        source: "STUDENT_NOTIFICATION_STORE",
      });
    }

    // Fallback: Default common notifications
    const commonNotifs = inMemoryNotifications.filter(
      (n) => n.targetRole === "ALL" || n.scope === "ALL",
    );
    const unreadCount = commonNotifs.filter((n) => !n.isRead).length;

    return NextResponse.json({
      notifications: commonNotifs,
      unreadCount,
      source: "COMMON_BROADCAST_STORE",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

// POST /api/notifications - Generate a new role or recipient notification
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newNotif: NotificationRecord = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: body.type || "NOTICE",
      title: body.title || "Campus Notification",
      message: body.message || body.content || "",
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: body.priority || "MEDIUM",
      actionUrl: body.actionUrl || "",
      scope:
        body.scope ||
        (body.recipientEmail ? "USER" : body.targetRole ? "ROLE" : "ALL"),
      targetRole: body.targetRole || "ALL",
      recipientEmail: body.recipientEmail || undefined,
      senderName: body.senderName || "System Notification Engine",
    };

    inMemoryNotifications.unshift(newNotif);

    return NextResponse.json({
      success: true,
      notification: newNotif,
      totalCount: inMemoryNotifications.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create notification" },
      { status: 500 },
    );
  }
}

// PATCH /api/notifications - Mark notifications as read (persisted to Supabase)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const role = (body.role || "").toUpperCase();

    const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? createClient()
      : null;

    if (body.markAllRead) {
      // Update in-memory
      inMemoryNotifications = inMemoryNotifications.map((n) => {
        if (role === "STUDENT" && n.targetRole === "TEACHER") return n;
        if (role === "TEACHER" && n.targetRole === "STUDENT") return n;
        return { ...n, isRead: true };
      });

      // Persist to Supabase
      if (supabase) {
        const eligibleIds = inMemoryNotifications
          .filter((n) => n.isRead)
          .map((n) => n.id);
        if (eligibleIds.length > 0) {
          await supabase
            .from("notifications")
            .update({ is_read: true })
            .in("id", eligibleIds);
        }
      }
    } else if (body.id) {
      // Update in-memory
      inMemoryNotifications = inMemoryNotifications.map((n) =>
        n.id === body.id ? { ...n, isRead: true } : n,
      );

      // Persist single notification to Supabase
      if (supabase) {
        await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("id", body.id);
      }
    }

    const unreadCount = inMemoryNotifications.filter((n) => !n.isRead).length;

    return NextResponse.json({
      success: true,
      unreadCount,
      notifications: inMemoryNotifications,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update notification state" },
      { status: 500 },
    );
  }
}
