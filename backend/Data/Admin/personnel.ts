export interface EmployeeProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
  role: "TEACHER" | "EXAM_OFFICER" | "ACCOUNTANT" | "ADMIN" | "STAFF";
  isHOD?: boolean;
  assignedClass?: string;
  assignedSection?: string;
  isOnline: boolean;
  messages: { id: string; sender: string; text: string; time: string; isMe: boolean }[];
}

const maleAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
];

const femaleAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
];

export const DEPARTMENTS = [
  "Higher Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "ICT & Computer Science",
  "Bangla",
  "English",
  "Accounting & Finance",
] as const;

// 8 Main Department Heads (HODs do NOT teach any class)
const HOD_NAMES = [
  { name: "Prof. Dr. Sarah Jenkins", dept: "Higher Mathematics" },
  { name: "Prof. Dr. Robert Chen", dept: "Physics" },
  { name: "Prof. Dr. Maya Rahman", dept: "Chemistry" },
  { name: "Prof. Dr. Nusrat Jahan", dept: "Biology" },
  { name: "Prof. Eng. Alex Mercer", dept: "ICT & Computer Science" },
  { name: "Prof. Mrs. Farhana Begum", dept: "Bangla" },
  { name: "Prof. David Wilson", dept: "English" },
  { name: "Prof. Mr. Kazi Mahmud", dept: "Accounting & Finance" },
];

function generatePersonnel(): EmployeeProfile[] {
  const personnel: EmployeeProfile[] = [];

  // 1. Create the 8 HODs (Administrative & Department Heads - NO Class Teaching)
  HOD_NAMES.forEach((hod, i) => {
    personnel.push({
      id: `hod-${i + 1}`,
      name: hod.name,
      designation: "Head of Department (HOD) & Chair",
      department: hod.dept,
      email: `${hod.dept.toLowerCase().replace(/[^a-z]/g, "")}.hod@schollege.edu.bd`,
      phone: `+880 1711-${200100 + i}`,
      avatar: i % 2 === 0 ? femaleAvatars[i % femaleAvatars.length] : maleAvatars[i % maleAvatars.length],
      role: "TEACHER",
      isHOD: true,
      assignedClass: "NONE (Dept Head - Admin Only)",
      assignedSection: "NONE",
      isOnline: true,
      messages: [{ id: `hod-m-${i}`, sender: hod.name, text: `Department of ${hod.dept} faculty roster approved.`, time: "09:00 AM", isMe: false }],
    });
  });

  // 2. Generate 68 Active Teaching Faculty Members assigned to Class 1 to 12
  for (let i = 0; i < 68; i++) {
    const isFemale = i % 2 === 1;
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const targetClassNum = (i % 12) + 1; // Class 1 to 12
    const sectionLetter = String.fromCharCode(65 + (i % 3)); // Section A, B, C

    let designation = "Lecturer";
    if (targetClassNum >= 9) {
      designation = i % 2 === 0 ? "Assistant Professor" : "Senior Lecturer";
    } else if (targetClassNum >= 5) {
      designation = i % 2 === 0 ? "Senior Lecturer" : "Lecturer";
    }

    const firstName = isFemale
      ? ["Dr. Rida", "Ms. Anika", "Mrs. Sadia", "Dr. Sumaiya", "Ms. Fariha", "Mrs. Nusrat"][i % 6]
      : ["Dr. Tahmid", "Mr. Nafis", "Mr. Fahim", "Dr. Sajid", "Mr. Mahir", "Mr. Adnan"][i % 6];
    const lastName = ["Rahman", "Hasan", "Islam", "Chowdhury", "Ahmed", "Khan", "Kabir", "Haider"][i % 8];
    const name = `${firstName} ${lastName}`;

    personnel.push({
      id: `teacher-${i + 9}`,
      name,
      designation,
      department: dept,
      email: `teacher.${i + 1}@schollege.edu.bd`,
      phone: `+880 17${10 + (i % 89)}-${300000 + i * 1234}`,
      avatar: isFemale ? femaleAvatars[i % femaleAvatars.length] : maleAvatars[i % maleAvatars.length],
      role: "TEACHER",
      isHOD: false,
      assignedClass: `Class ${targetClassNum}`,
      assignedSection: `Section ${sectionLetter}`,
      isOnline: i % 2 === 0,
      messages: [{ id: `M-init-${i}`, sender: name, text: `Syllabus and routine set for Class ${targetClassNum} ${sectionLetter}.`, time: "11:30 AM", isMe: false }],
    });
  }

  return personnel;
}

export const PERSONNEL: EmployeeProfile[] = generatePersonnel();
export const SCH_PERSONNEL = PERSONNEL;
