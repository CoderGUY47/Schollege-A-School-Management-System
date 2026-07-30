import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

export interface TeacherRecord {
  id: string;
  teacherIdNumber: string;
  name: string;
  designation: string;
  department: string;
  subjectSpecialization: string;
  assignedClass: string;
  assignedSection: string;
  gender: "MALE" | "FEMALE";
  email: string;
  phone: string;
  joiningYear: number;
  qualification: string;
  status: "ACTIVE" | "ON_LEAVE" | "INACTIVE";
  avatarInitials: string;
  avatarUrl: string;
  officeHours?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  address?: string;
}

export const SCH_TEACHERS: TeacherRecord[] = [
  {
    id: "tch-101",
    teacherIdNumber: "SCH-T-1001",
    name: "Dr. Robert Chen",
    designation: "Senior Professor & HOD",
    department: "Physics",
    subjectSpecialization: "Electromagnetism & Quantum Physics",
    assignedClass: "Class 12",
    assignedSection: "Section A",
    gender: "MALE",
    email: "robert.chen@schollege.edu.bd",
    phone: "+880 1711-203948",
    joiningYear: 2012,
    qualification: "Ph.D. in Applied Physics (DU)",
    status: "ACTIVE",
    avatarInitials: "RC",
    avatarUrl: "/images/avatars/avatar_02.svg",
    officeHours: "Sun-Thu • 02:30 PM - 04:00 PM",
    bloodGroup: "B+",
    emergencyContact: "+880 1711-203948",
    address: "Mirpur DOHS, Dhaka",
  },
  {
    id: "tch-102",
    teacherIdNumber: "SCH-T-1002",
    name: "Prof. Sarah Jenkins",
    designation: "Associate Professor",
    department: "Higher Mathematics",
    subjectSpecialization: "Calculus & Linear Algebra",
    assignedClass: "Class 12",
    assignedSection: "Section B",
    gender: "FEMALE",
    email: "sarah.jenkins@schollege.edu.bd",
    phone: "+880 1819-482019",
    joiningYear: 2015,
    qualification: "M.Sc. in Pure Mathematics (BUET)",
    status: "ACTIVE",
    avatarInitials: "SJ",
    avatarUrl: "/images/avatars/avatar_09.svg",
    officeHours: "Sun-Thu • 02:30 PM - 04:00 PM",
    bloodGroup: "O+",
    emergencyContact: "+880 1819-482019",
    address: "Dhanmondi R/A, Dhaka",
  },
  {
    id: "tch-103",
    teacherIdNumber: "SCH-T-1003",
    name: "Dr. Michael Vance",
    designation: "Assistant Professor",
    department: "Chemistry",
    subjectSpecialization: "Organic Chemistry & Biochemistry",
    assignedClass: "Class 11",
    assignedSection: "Section A",
    gender: "MALE",
    email: "michael.vance@schollege.edu.bd",
    phone: "+880 1912-394820",
    joiningYear: 2018,
    qualification: "Ph.D. in Chemistry (JU)",
    status: "ACTIVE",
    avatarInitials: "MV",
    avatarUrl: "/images/avatars/avatar_03.svg",
    officeHours: "Sun-Thu • 01:30 PM - 03:00 PM",
    bloodGroup: "A+",
    emergencyContact: "+880 1912-394820",
    address: "Uttara Sector 4, Dhaka",
  },
  {
    id: "tch-104",
    teacherIdNumber: "SCH-T-1004",
    name: "Eng. Alex Mercer",
    designation: "Lecturer & Lab Coordinator",
    department: "ICT & Computer Science",
    subjectSpecialization: "Data Structures & Python Programming",
    assignedClass: "Class 12",
    assignedSection: "Section C",
    gender: "MALE",
    email: "alex.mercer@schollege.edu.bd",
    phone: "+880 1610-293847",
    joiningYear: 2020,
    qualification: "B.Sc. in CSE (BUET)",
    status: "ACTIVE",
    avatarInitials: "AM",
    avatarUrl: "/images/avatars/avatar_04.svg",
    officeHours: "Sun-Thu • 03:00 PM - 04:30 PM",
    bloodGroup: "O+",
    emergencyContact: "+880 1610-293847",
    address: "Banani, Dhaka",
  },
  {
    id: "tch-105",
    teacherIdNumber: "SCH-T-1005",
    name: "Dr. Amanda Hayes",
    designation: "Senior Professor",
    department: "Biology",
    subjectSpecialization: "Cellular Biology & Genetics",
    assignedClass: "Class 11",
    assignedSection: "Section B",
    gender: "FEMALE",
    email: "amanda.hayes@schollege.edu.bd",
    phone: "+880 1715-920192",
    joiningYear: 2014,
    qualification: "Ph.D. in Biotechnology (DU)",
    status: "ACTIVE",
    avatarInitials: "AH",
    avatarUrl: "/images/avatars/avatar_10.svg",
    officeHours: "Sun-Thu • 02:00 PM - 03:30 PM",
    bloodGroup: "AB+",
    emergencyContact: "+880 1715-920192",
    address: "Gulshan 2, Dhaka",
  },
];

// In-memory mutable teachers store seeded from backend data
let inMemoryTeachers: TeacherRecord[] = [...SCH_TEACHERS];


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const search = searchParams.get("search")?.toLowerCase();
    const email = searchParams.get("email")?.toLowerCase();

    const supabase = createClient();

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      let query = supabase.from("teachers").select("*");
      if (email) {
        query = query.ilike("email", email);
      }
      if (department && department !== "ALL") {
        query = query.eq("department", department);
      }
      if (search) {
        query = query.or(`name.ilike.%${search}%,teacher_id_number.ilike.%${search}%,department.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const mapped: TeacherRecord[] = data.map((t: any) => ({
          id: t.id,
          teacherIdNumber: t.teacher_id_number || t.teacherIdNumber || "SCH-T-1001",
          name: t.name,
          designation: t.designation || "Senior Professor",
          department: t.department || "Physics",
          subjectSpecialization: t.subject_specialization || t.subjectSpecialization || "Electromagnetism",
          assignedClass: t.assigned_class || t.assignedClass || "Class 12",
          assignedSection: t.assigned_section || t.assignedSection || "Section A",
          gender: t.gender || "MALE",
          email: t.email,
          phone: t.phone || "+880 1711-200102",
          joiningYear: t.joining_year || t.joiningYear || 2012,
          qualification: t.qualification || "Ph.D. in Theoretical Physics",
          status: t.status || "ACTIVE",
          avatarInitials: t.avatar_initials || t.name.charAt(0),
          avatarUrl: t.avatar_url || t.avatarUrl || (t.gender === "FEMALE" ? "/images/avatars/avatar_09.svg" : "/images/avatars/avatar_02.svg"),
          officeHours: t.office_hours || t.officeHours || "Sun-Thu • 02:30 PM - 04:00 PM",
          bloodGroup: t.blood_group || t.bloodGroup || "O+",
          emergencyContact: t.emergency_contact || t.emergencyContact || t.phone,
          address: t.address || "Dhaka, Bangladesh",
        }));

        return NextResponse.json({
          teachers: mapped,
          source: "SUPABASE_POSTGRESQL",
        });
      }
    }

    let filtered = [...inMemoryTeachers];

    if (email) {
      const match = filtered.filter((t) => t.email.toLowerCase() === email.toLowerCase());
      // Only use an exact email match — never synthesize from another teacher's data
      filtered = match;
    }
    if (department && department !== "ALL") {
      filtered = filtered.filter((t) => t.department.toLowerCase() === department.toLowerCase());
    }
    if (search) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(search) ||
          t.teacherIdNumber.toLowerCase().includes(search) ||
          t.department.toLowerCase().includes(search) ||
          t.email.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      teachers: filtered,
      source: "BACKEND_DATA_STORE",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch teacher records from backend" },
      { status: 500 }
    );
  }
}

// PUT /api/teachers - Update teacher profile details dynamically in backend memory & Supabase
export async function PUT(request: Request) {
  try {
    const updatedData: Partial<TeacherRecord> = await request.json();
    if (!updatedData.email && !updatedData.id) {
      return NextResponse.json({ error: "Missing teacher email or id parameter" }, { status: 400 });
    }

    const index = inMemoryTeachers.findIndex(
      (t) =>
        (updatedData.email && t.email.toLowerCase() === updatedData.email.toLowerCase()) ||
        (updatedData.id && t.id === updatedData.id)
    );

    if (index !== -1) {
      inMemoryTeachers[index] = { ...inMemoryTeachers[index], ...updatedData };
    } else if (updatedData.email) {
      const newRecord: TeacherRecord = {
        id: updatedData.id || `TCH-${Date.now()}`,
        teacherIdNumber: updatedData.teacherIdNumber || "SCH-T-1099",
        name: updatedData.name || "Faculty Member",
        designation: updatedData.designation || "Senior Professor",
        department: updatedData.department || "Physics",
        subjectSpecialization: updatedData.subjectSpecialization || "Curriculum Supervision",
        assignedClass: updatedData.assignedClass || "Class 12",
        assignedSection: updatedData.assignedSection || "Section A",
        gender: updatedData.gender || "MALE",
        email: updatedData.email,
        phone: updatedData.phone || "+880 1711-000000",
        joiningYear: updatedData.joiningYear || 2018,
        qualification: updatedData.qualification || "Ph.D. in Science",
        status: updatedData.status || "ACTIVE",
        avatarInitials: (updatedData.name || "FM").split(" ").map((n) => n[0]).join("").slice(0, 2),
        avatarUrl: updatedData.avatarUrl || "/images/avatars/avatar_02.svg",
        officeHours: updatedData.officeHours || "Sun-Thu • 02:30 PM - 04:00 PM",
        ...updatedData,
      };
      inMemoryTeachers.push(newRecord);
    }

    // Try Supabase update if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = createClient();
      await supabase
        .from("teachers")
        .upsert({
          email: updatedData.email,
          name: updatedData.name,
          phone: updatedData.phone,
          qualification: updatedData.qualification,
          subject_specialization: updatedData.subjectSpecialization,
          office_hours: updatedData.officeHours,
          department: updatedData.department,
          designation: updatedData.designation,
          assigned_class: updatedData.assignedClass,
          assigned_section: updatedData.assignedSection,
          avatar_url: updatedData.avatarUrl,
        }, { onConflict: "email" });
    }

    const resultTeacher = index !== -1 ? inMemoryTeachers[index] : updatedData;

    return NextResponse.json({
      success: true,
      message: "Teacher profile record updated successfully in backend database",
      teacher: resultTeacher,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update teacher record in backend database" },
      { status: 500 }
    );
  }
}
