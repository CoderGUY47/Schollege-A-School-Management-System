"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Loader from "@/components/ui/Loader";
import { SCH_PERSONNEL, EmployeeProfile } from "@backend/Data/Admin/personnel";

const professorNames = [
  'Prof. Jahangir Kabir', 'Prof. Shamim Ara', 'Prof. Tanvir Ahmed', 'Prof. Mahmud Hassan', 'Prof. Kamal Hossain',
  'Prof. Rashedul Haque', 'Prof. Imran Khan', 'Prof. Ainun Nishat', 'Prof. Zafar Iqbal', 'Prof. Maksud Kamal'
];

const doctorNames = [
  'Dr. Anisur Rahman', 'Dr. Farhana Yasmin', 'Dr. Rokeya Begum', 'Dr. Nusrat Chowdhury', 'Dr. Selina Akhtar', 'Dr. Mehedi Hasan'
];

const businessGiantNames = [
  'Sabur Khan', 'Ayman Sadiq', 'Syed Almas Kabir', 'Rubana Huq'
];

const businessGiantDesignations = [
  'Distinguished Business Fellow & Guest Chair',
  'EdTech & Innovation Industry Chair',
  'Tech Industry Executive Chair',
  'Industrial Leadership Fellow'
];

const baseBanglaNames = [
  'Tanvir Hasan', 'Ayesha Siddiqua', 'Nafis Ahsan', 'Sajid Islam', 'Rida Fariha', 'Zayn Malik',
  'Sadia Afreen', 'Fahim Shahriar', 'Tanvir Anjum', 'Mahir Chowdhury', 'Kazi Arman', 'Sumaiya Khan',
  'Nabil Mahmud', 'Tasnim Zara', 'Adnan Sami', 'Sanjida Akter', 'Rayhan Ahmed', 'Miftahul Jannat',
  'Wasif Hossain', 'Anika Tabassum', 'Shakib Al Hasan', 'Tamim Iqbal', 'Mushfiqur Rahim', 'Mustafizur Rahman',
  'Liton Das', 'Soumya Sarkar', 'Mehidy Hasan Miraz', 'Taskin Ahmed', 'Shoriful Islam', 'Towhid Hridoy',
  'Afif Hossain', 'Sabbir Rahman', 'Rubel Hossain', 'Taijul Islam', 'Nasum Ahmed', 'Ebadot Hossain',
  'Mosaddek Hossain', 'Najmul Hossain Shanto', 'Hasan Mahmud', 'Tanzim Hasan Sakib', 'Rishad Hossain',
  'Jaker Ali Anik', 'Shamim Hossain Patwary', 'Sharmin Sultana', 'Nigar Sultana Joty', 'Fargana Hoque',
  'Nahida Akter', 'Salma Khatun', 'Rumana Ahmed', 'Jahanara Alam', 'Ritu Moni', 'Sobhana Mostary',
  'Marufa Akter', 'Rabeya Khan', 'Sultana Khatun', 'Dilara Akter', 'Fahima Khatun', 'Shorna Akter'
];

const departmentsList = [
  'Computer Science & ICT (CSE)',
  'Electrical & Robotics Lab (EEE)',
  'Business Studies & BBA',
  'Dental Science Foundation',
  'Pharmacy & Biotech Foundation',
  'General Medicine & First Aid',
  'Food & Nutrition Science',
  'Physics & Astronomy',
  'Chemistry & Chemical Tech',
  'Mathematics & Applied Logic'
];

const maleAvatars = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
];

const femaleAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=256',
];

// Generate 76 Faculty Teachers (76 Teachers + 17 Finance + 10 Exam Officers = EXACTLY 103 TOTAL PERSONNEL)
const initialTeachers76: EmployeeProfile[] = Array.from({ length: 76 }, (_, i) => {
  let name = "";
  let designation = "";

  if (i < 10) {
    name = professorNames[i];
    designation = "Professor & Senior Chair";
  } else if (i < 16) {
    name = doctorNames[i - 10];
    designation = "Doctorate (PhD / Senior Fellow)";
  } else if (i < 20) {
    name = businessGiantNames[i - 16];
    designation = businessGiantDesignations[i - 16];
  } else {
    const rawName = baseBanglaNames[(i - 20) % baseBanglaNames.length];
    const prefix = i % 2 === 0 ? "Md." : "Mst.";
    name = `${prefix} ${rawName}`;
    designation = i % 3 === 0 ? "Assistant Professor" : i % 3 === 1 ? "Senior Lecturer" : "Lecturer";
  }

  const dept = departmentsList[i % departmentsList.length];

  return {
    id: `teacher-${i + 1}`,
    name: name,
    designation: designation,
    department: dept,
    email: `teacher${i + 1}@schollege.edu.bd`,
    phone: `+880 17${10 + (i % 89)}-${300000 + i * 1234}`,
    avatar: i % 2 === 0 ? maleAvatars[i % maleAvatars.length] : femaleAvatars[i % femaleAvatars.length],
    role: "TEACHER",
    isOnline: i % 2 === 0,
    messages: [{ id: `M-init-${i}`, sender: name, text: "Course syllabus and routines uploaded.", time: "02:00 PM", isMe: false }],
  };
});

const initialExaminers10: EmployeeProfile[] = initialTeachers76.slice(0, 10).map((t, idx) => ({
  ...t,
  id: `exam-controller-${idx + 1}`,
  designation: `${t.designation} & Senior Examiner`,
  role: "EXAM_OFFICER",
}));

const financeMaleNames = [
  'Md. Rafiqul Islam', 'Md. Tanvir Ahmed', 'Kazi Arman Hossain', 'Md. Shahadat Hossain',
  'Md. Abul Bashar', 'Md. Kamrul Hasan', 'Md. Zahidul Islam', 'Md. Nazmul Huda',
  'Md. Tariqul Islam', 'Md. Asaduzzaman', 'Md. Mahbubur Rahman', 'Md. Jahangir Alam'
];

const financeFemaleNames = [
  'Sharmin Akter', 'Nusrat Jahan', 'Farhana Fariha', 'Sadia Sultana', 'Tasnim Zara'
];

const initialFinance17: EmployeeProfile[] = [
  ...financeMaleNames.map((name, i) => ({
    id: `fin-m-${i + 1}`,
    name: name,
    designation: "Senior Finance Officer",
    department: "Accounts & Payroll",
    email: `finance.male${i + 1}@schollege.edu.bd`,
    phone: `+880 15${10 + i}-400${i * 11}`,
    avatar: maleAvatars[i % maleAvatars.length],
    role: "ACCOUNTANT" as const,
    isOnline: i % 2 === 0,
    messages: [{ id: `M-fin-m-${i}`, sender: name, text: "Financial ledger reconciliation complete.", time: "09:15 AM", isMe: false }],
  })),
  ...financeFemaleNames.map((name, i) => ({
    id: `fin-f-${i + 1}`,
    name: name,
    designation: "Accounts Specialist",
    department: "Accounts & Payroll",
    email: `finance.female${i + 1}@schollege.edu.bd`,
    phone: `+880 18${20 + i}-500${i * 22}`,
    avatar: femaleAvatars[i % femaleAvatars.length],
    role: "ACCOUNTANT" as const,
    isOnline: i % 2 === 1,
    messages: [{ id: `M-fin-f-${i}`, sender: name, text: "Tuition collection portal synced.", time: "11:45 AM", isMe: false }],
  })),
];

const fallback103Personnel: EmployeeProfile[] = SCH_PERSONNEL;

export default function AdminMessageView() {
  const [employees, setEmployees] = useState<EmployeeProfile[]>(fallback103Personnel);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeEmployee, setActiveEmployee] = useState<EmployeeProfile | null>(null);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  // Pagination State (12 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    fetchBackendMessages();
  }, []);

  const fetchBackendMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        if (data.employees && data.employees.length > 0) {
          setEmployees(data.employees);
        }
      }
    } catch (e) {
      console.error("Error fetching messages from backend:", e);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: EmployeeProfile["role"]) => {
    switch (role) {
      case "TEACHER":
        return <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-md">Faculty Teacher</span>;
      case "ACCOUNTANT":
        return <span className="bg-amber-600 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-md">Accounts & Finance</span>;
      case "EXAM_OFFICER":
        return <span className="bg-rose-600 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-md">Examiner</span>;
      case "STAFF":
        return <span className="bg-indigo-600 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-md">Staff Employee</span>;
    }
  };

  const getHeaderBg = (role: EmployeeProfile["role"]) => {
    switch (role) {
      case "TEACHER":
        return "bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900";
      case "ACCOUNTANT":
        return "bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900";
      case "EXAM_OFFICER":
        return "bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900";
      default:
        return "bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeEmployee) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: activeEmployee.id,
          text: messageText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.employee) {
          setActiveEmployee(data.employee);
        }
        if (data.employees) {
          setEmployees(data.employees);
        }
      }
    } catch (e) {
      console.error("Error posting message to backend:", e);
    } finally {
      setMessageText("");
      setSending(false);
    }
  };

  const teachersCount = employees.filter((e) => e.role === "TEACHER").length;
  const financeCount = employees.filter((e) => e.role === "ACCOUNTANT").length;
  const examCount = employees.filter((e) => e.role === "EXAM_OFFICER").length;

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "ALL" || emp.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* RADIANT GRADIENT HERO HEADER */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 p-7 text-white shadow-xl border border-indigo-500/20">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                Campus Directory
              </span>
              <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur">
                Faculty & Staff
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3 tracking-tight">
              Teacher & Employee Directory
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 max-w-xl leading-relaxed">
              Browse profiles for teachers, finance staff, and examiners with phone contacts, emails, and direct messaging chat modal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg backdrop-blur">
              Total Cards: {employees.length}
            </span>
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS WITH COUNTERS & SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => { setSelectedRole("ALL"); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${
              selectedRole === "ALL"
                ? "bg-slate-900 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Personnel <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black">({employees.length})</span>
          </button>

          <button
            onClick={() => { setSelectedRole("TEACHER"); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${
              selectedRole === "TEACHER"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            20 Teachers & Professors <span className="bg-black/20 px-2 py-0.5 rounded-full text-[10px] font-black">({teachersCount})</span>
          </button>

          <button
            onClick={() => { setSelectedRole("ACCOUNTANT"); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${
              selectedRole === "ACCOUNTANT"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Accounts & Finance <span className="bg-black/20 px-2 py-0.5 rounded-full text-[10px] font-black">({financeCount})</span>
          </button>

          <button
            onClick={() => { setSelectedRole("EXAM_OFFICER"); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${
              selectedRole === "EXAM_OFFICER"
                ? "bg-rose-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Exam Control <span className="bg-black/20 px-2 py-0.5 rounded-full text-[10px] font-black">({examCount})</span>
          </button>
        </div>

        <div className="relative w-full md:w-64 flex items-center">
          <i className="fi fi-rr-search absolute left-3 text-slate-400 text-xs"></i>
          <input
            type="text"
            placeholder="Search name, dept, or email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader size="md" text="Loading Staff & Teacher Portal..." />
        </div>
      ) : (() => {
        const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
        const currentCards = filteredEmployees.slice((currentPage - 1) * pageSize, currentPage * pageSize);

        return (
          <div className="space-y-6">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {currentCards.map((emp, idx) => {
                const globalIndex = (currentPage - 1) * pageSize + idx + 1;
                const formattedSL = String(globalIndex).padStart(3, '0');

                return (
                  <div
                    key={emp.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group"
                  >
                    {/* Top Banner & Badges Aligned in Lime Marked Banner Header */}
                    <div>
                      <div className={`h-16 relative p-3.5 flex items-center justify-between ${getHeaderBg(emp.role)}`}>
                        {/* Space placeholder on left for overlapping avatar */}
                        <div className="w-14" />

                        {/* Both Badges aligned inside header top band (lime green area marked by user) */}
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-950/80 text-white font-mono text-[10px] font-black px-3 py-1.5 rounded-full border border-slate-700/50 shadow-md">
                            SL# {formattedSL}
                          </span>
                          {getRoleBadge(emp.role)}
                        </div>
                      </div>

                      <div className="px-5 pt-0 relative pb-3 border-b border-slate-100">
                        {/* Avatar Image overlapping header band */}
                        <div className="relative -mt-9 mb-3 inline-block">
                          <div className="h-16 w-16 rounded-full bg-white border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
                            {emp.avatar.startsWith('http') ? (
                              <Image
                                src={emp.avatar}
                                alt={emp.name}
                                width={64}
                                height={64}
                                className="h-full w-full object-cover rounded-full"
                              />
                            ) : (
                              <span className="text-3xl">{emp.avatar}</span>
                            )}
                          </div>
                          {emp.isOnline && (
                            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                          )}
                        </div>

                        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-teal-600 transition">
                          {emp.name}
                        </h3>
                        <p className="text-xs font-bold text-slate-700 mt-0.5">{emp.designation}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                          <i className="fi fi-rr-building text-slate-400 text-xs"></i> {emp.department}
                        </p>
                      </div>
                    </div>

                    {/* Contact Info & Action Buttons */}
                    <div className="p-4 bg-slate-50/50 space-y-3">
                      {/* Phone & Email Info */}
                      <div className="space-y-1.5 text-[11px] text-slate-600">
                        <div className="flex items-center gap-2">
                          <i className="fi fi-rr-phone-call text-teal-600 shrink-0 text-xs"></i>
                          <span className="font-mono font-medium">{emp.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fi fi-rr-envelope text-indigo-600 shrink-0 text-xs"></i>
                          <span className="truncate">{emp.email}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60">
                        <a
                          href={`tel:${emp.phone}`}
                          className="flex items-center justify-center py-2 px-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-teal-600 transition shadow-2xs"
                          title="Call Phone"
                        >
                          <i className="fi fi-rr-phone-call text-xs"></i>
                        </a>
                        <a
                          href={`mailto:${emp.email}`}
                          className="flex items-center justify-center py-2 px-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition shadow-2xs"
                          title="Send Email"
                        >
                          <i className="fi fi-rr-envelope text-xs"></i>
                        </a>
                        <button
                          onClick={() => setActiveEmployee(emp)}
                          className="flex items-center justify-center py-2 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
                          title="Open Live Chat"
                        >
                          <i className="fi fi-rr-comment-alt text-xs"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 pt-4 bg-white px-4 py-3 rounded-xl shadow-xs">
                <div className="text-xs text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-800">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                  <span className="font-bold text-slate-800">
                    {Math.min(currentPage * pageSize, filteredEmployees.length)}
                  </span>{" "}
                  of <span className="font-bold text-slate-800">{filteredEmployees.length}</span> personnel
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-extrabold text-slate-700 px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* LIVE MESSAGING MODAL */}
      {activeEmployee && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col h-[520px] animate-in fade-in-90">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={activeEmployee.avatar}
                    alt={activeEmployee.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover border-2 border-white/20"
                  />
                  {activeEmployee.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">{activeEmployee.name}</h3>
                  <p className="text-[11px] text-slate-300 font-medium">
                    {activeEmployee.designation} • {activeEmployee.department}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveEmployee(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition flex items-center justify-center"
              >
                <i className="fi fi-rr-cross text-xs"></i>
              </button>
            </div>

            {/* Chat Body Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3">
              {activeEmployee.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                      msg.isMe
                        ? "bg-slate-900 text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span
                      className={`text-[9px] block mt-1 ${
                        msg.isMe ? "text-slate-400 text-right" : "text-slate-400"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Footer Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Write message to ${activeEmployee.name}...`}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 border border-transparent"
              />
              <button
                type="submit"
                disabled={sending || !messageText.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition shadow-sm flex items-center justify-center"
              >
                {sending ? <i className="fi fi-rr-spinner animate-spin text-xs"></i> : <i className="fi fi-rr-paper-plane text-xs"></i>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
