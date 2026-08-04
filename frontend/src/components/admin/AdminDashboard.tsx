"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import CustomSelect from "@/components/ui/CustomSelect";
import { PERSONNEL } from "@backend/Data/Admin/personnel";

// ── Skeleton while view chunk downloads ───────────────────────────────────────
function ViewSkeleton({ title }: { title: string }) {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-32 rounded-md bg-gray-200/80" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-md bg-gray-200/80" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 rounded-md bg-gray-200/80" />
        <div className="h-64 rounded-md bg-gray-200/80" />
      </div>
      <p className="text-xs text-gray-400 text-center font-normal">Loading {title}…</p>
    </div>
  );
}

// ── Lazy-load every admin view ────────────────────────────────────────────────
const AdminOverviewView  = dynamic(() => import("@/components/admin/AdminOverviewView"),  { loading: () => <ViewSkeleton title="Overview" />,  ssr: false });
const AdminTeachersView  = dynamic(() => import("@/components/admin/AdminTeachersView"),  { loading: () => <ViewSkeleton title="Teachers" />,  ssr: false });
const AdminStudentsView  = dynamic(() => import("@/components/admin/AdminStudentsView"),  { loading: () => <ViewSkeleton title="Students" />,  ssr: false });
const AdminFinanceView   = dynamic(() => import("@/components/admin/AdminFinanceView"),   { loading: () => <ViewSkeleton title="Finance" />,   ssr: false });
const AdminCalendarView  = dynamic(() => import("@/components/admin/AdminCalendarView"),  { loading: () => <ViewSkeleton title="Calendar" />,  ssr: false });
const AdminNoticeView    = dynamic(() => import("@/components/admin/AdminNoticeView"),    { loading: () => <ViewSkeleton title="Notice" />,    ssr: false });
const AdminMessageView   = dynamic(() => import("@/components/admin/AdminMessageView"),   { loading: () => <ViewSkeleton title="Messages" />,  ssr: false });
const AdminSettingsView  = dynamic(() => import("@/components/admin/AdminSettingsView"),  { loading: () => <ViewSkeleton title="Settings" />,  ssr: false });

// 12 Months Full Fallback Data
const defaultMonthlyTrends = [
  { month: "Jan", Income: 1850000, Expense: 1200000 },
  { month: "Feb", Income: 2100000, Expense: 1350000 },
  { month: "Mar", Income: 2400000, Expense: 1500000 },
  { month: "Apr", Income: 2200000, Expense: 1400000 },
  { month: "May", Income: 2650000, Expense: 1650000 },
  { month: "Jun", Income: 2800000, Expense: 1750000 },
  { month: "Jul", Income: 2500000, Expense: 1600000 },
  { month: "Aug", Income: 2900000, Expense: 1800000 },
  { month: "Sep", Income: 3100000, Expense: 1950000 },
  { month: "Oct", Income: 2950000, Expense: 1850000 },
  { month: "Nov", Income: 3200000, Expense: 2000000 },
  { month: "Dec", Income: 3450000, Expense: 2100000 },
];

const defaultTeachers = PERSONNEL.map((p) => ({
  id: p.id,
  name: p.name,
  email: p.email,
  role: "TEACHER",
  department: p.department,
  designation: p.designation,
  isHOD: p.isHOD,
  assignedClass: p.assignedClass,
  assignedSection: p.assignedSection,
  createdAt: new Date().toISOString(),
}));

const defaultStudents = Array.from({ length: 70 }, (_, i) => {
  const sampleNames = [
    'Aria Rahman', 'Sophia Miller', 'Ethan Davis', 'Olivia Taylor', 'Lucas Anderson', 'Emma Thomas',
    'Nafis Ahsan', 'Tahmid Hasan', 'Ayesha Siddiqua', 'Sajid Islam', 'Rida Fariha', 'Zayn Malik',
    'Sadia Afreen', 'Fahim Shahriar', 'Tanvir Anjum', 'Mahir Chowdhury', 'Kazi Arman', 'Sumaiya Khan'
  ];
  return {
    id: `student-${i + 1}`,
    name: `${sampleNames[i % sampleNames.length]} (S-${1001 + i})`,
    email: `student${i + 1}@edu.bd`,
    role: 'STUDENT',
    class_name: `Batch 2026 - Sec ${String.fromCharCode(65 + (i % 4))}`,
    createdAt: new Date().toISOString(),
  };
});

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const getActiveMenuFromPath = (path: string) => {
    if (path.includes("/admin/teacher")) return "TEACHERS";
    if (path.includes("/admin/student")) return "STUDENTS";
    if (path.includes("/admin/finance")) return "FINANCE";
    if (path.includes("/admin/calendar")) return "CALENDAR";
    if (path.includes("/admin/message")) return "MESSAGES";
    if (path.includes("/admin/notice")) return "NOTICE";
    if (path.includes("/admin/attendance")) return "ATTENDANCE";
    if (path.includes("/admin/exams")) return "EXAMS";
    if (path.includes("/admin/todo")) return "TODO";
    if (path.includes("/admin/settings")) return "SETTINGS";
    return "DASHBOARD";
  };

  const activeMenu = getActiveMenuFromPath(pathname);

  const [users, setUsers] = useState<any[]>([...defaultTeachers, ...defaultStudents]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedMonth, setSelectedMonth] = useState("Aug");
  const [selectedYear, setSelectedYear] = useState("2026");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalRole, setModalRole] = useState<"TEACHER" | "STUDENT">("TEACHER");
  const [editingUser, setEditingUser] = useState<any | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formClass, setFormClass] = useState("");

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, cRes, sRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/classes"),
        fetch("/api/subjects"),
      ]);

      if (uRes.ok) {
        const data = await uRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setUsers(data);
        }
      }
      if (cRes.ok) setClasses(await cRes.json());
      if (sRes.ok) setSubjects(await sRes.json());
    } catch (err: any) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = (targetRole: "TEACHER" | "STUDENT") => {
    setModalRole(targetRole);
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormPassword("DefaultPass123!");
    setFormDepartment("Computer Science & ICT (CSE)");
    setFormClass("Batch 2026 - Sec A");
    setShowAddModal(true);
  };

  const handleOpenEditModal = (user: any) => {
    setModalRole(user.role);
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword("");
    setFormDepartment(user.department || "Computer Science");
    setFormClass(user.class_name || "Batch 2026 - Sec A");
    setShowAddModal(true);
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User record deleted successfully.");
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: formName, email: formEmail, department: formDepartment, class_name: formClass }
            : u
        )
      );
      toast.success(`${modalRole} profile updated successfully!`);
    } else {
      const newUser = {
        id: `user-${Date.now()}`,
        name: formName,
        email: formEmail,
        role: modalRole,
        department: formDepartment,
        class_name: formClass,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [newUser, ...prev]);
      toast.success(`New ${modalRole} registered successfully!`);
    }
    setShowAddModal(false);
  };

  if (!mounted) return null;

  const handleAssignTeacherClass = (teacherId: string, assignedClass: string, assignedSection: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === teacherId ? { ...u, assignedClass, assignedSection } : u
      )
    );
  };

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-[#F9FAFE] font-outfit text-gray-900 antialiased">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-y-auto">
        <AdminHeader activeMenu={activeMenu} />

        <main className="p-6 md:p-8 flex-1 space-y-8">
          <Suspense fallback={<ViewSkeleton title={activeMenu.charAt(0) + activeMenu.slice(1).toLowerCase()} />}>
            <div className="animate-fade-in">
              {activeMenu === "DASHBOARD" && (
                <AdminOverviewView
                  users={users}
                  classes={classes}
                  subjects={subjects}
                  monthlyTrends={defaultMonthlyTrends}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  selectedYear={selectedYear}
                  setSelectedYear={setSelectedYear}
                />
              )}

              {activeMenu === "TEACHERS" && (
                <AdminTeachersView
                  users={users}
                  onAddTeacher={() => handleOpenAddModal("TEACHER")}
                  onEditTeacher={handleOpenEditModal}
                  onDeleteTeacher={handleDeleteUser}
                  onAssignTeacherClass={handleAssignTeacherClass}
                />
              )}

              {activeMenu === "STUDENTS" && (
                <AdminStudentsView
                  users={users}
                  onAddStudent={() => handleOpenAddModal("STUDENT")}
                  onEditStudent={handleOpenEditModal}
                  onDeleteStudent={handleDeleteUser}
                />
              )}

              {activeMenu === "FINANCE"  && <AdminFinanceView />}
              {activeMenu === "CALENDAR" && <AdminCalendarView />}
              {activeMenu === "NOTICE"   && <AdminNoticeView />}
              {activeMenu === "MESSAGES" && <AdminMessageView />}
              {activeMenu === "SETTINGS" && <AdminSettingsView />}
            </div>
          </Suspense>
        </main>
      </div>


      {/* USER CREATION & EDIT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingUser ? `Edit ${modalRole}` : `Add New ${modalRole}`}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-900 font-bold transition text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Alan Roberts"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@edu.bd"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:outline-none text-xs"
                />
              </div>

              {modalRole === "TEACHER" ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Department / Faculty
                  </label>
                  <input
                    type="text"
                    required
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:outline-none text-xs"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Class / Section
                  </label>
                  <input
                    type="text"
                    required
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:outline-none text-xs"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-black font-bold text-white hover:bg-black/90 cursor-pointer border-none shadow-sm"
                >
                  {editingUser ? "Update Record" : "Save & Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
