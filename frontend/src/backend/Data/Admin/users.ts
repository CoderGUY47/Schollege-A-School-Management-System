export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN" | "PARENT";
  department?: string;
  studentIdNumber?: string;
  status: "ACTIVE" | "INACTIVE";
}

export const SCH_DEFAULT_TEACHERS: UserItem[] = Array.from({ length: 100 }, (_, i) => {
  const depts = [
    "Higher Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "ICT & Computer Science",
    "Bangla",
    "English",
    "Accounting & Finance",
    "Economics",
  ];
  return {
    id: `tch-${i + 1}`,
    name: `Faculty Member #${i + 1}`,
    email: `teacher${i + 1}@schollege.edu.bd`,
    role: "TEACHER",
    department: depts[i % depts.length],
    status: "ACTIVE",
  };
});

export const SCH_DEFAULT_ADMIN_STUDENTS: UserItem[] = Array.from({ length: 70 }, (_, i) => {
  return {
    id: `std-${i + 1}`,
    name: `Student Record #${i + 1}`,
    email: `student${i + 1}@schollege.edu.bd`,
    role: "STUDENT",
    studentIdNumber: `SCH-2026-${1000 + i}`,
    status: "ACTIVE",
  };
});
