import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import { SCH_STUDENTS, SCH_CLASSES, StudentRecord } from "@/lib/backend-student";

let inMemoryStudents: StudentRecord[] = [...SCH_STUDENTS];

// GET /api/students
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const className = searchParams.get("className");
    const sectionName = searchParams.get("sectionName");
    const group = searchParams.get("group");
    const email = searchParams.get("email")?.toLowerCase();
    const search = searchParams.get("search")?.toLowerCase();
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);

    const supabase = createClient();

    // Try Supabase PostgreSQL Query
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      let query = supabase.from("students").select("*", { count: "exact" });

      if (email) {
        if (email === "student@edu.bd") {
          query = query.or(`email.eq.student@edu.bd,email.eq.aria.rahman.12a03@schollege.edu.bd`);
        } else {
          query = query.eq("email", email);
        }
      }
      if (className && className !== "ALL") {
        query = query.eq("class_name", className);
      }
      if (sectionName && sectionName !== "ALL") {
        query = query.eq("section_name", sectionName);
      }
      if (group && group !== "ALL") {
        query = query.eq("group_name", group);
      }
      if (search) {
        query = query.or(`name.ilike.%${search}%,student_id_number.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const fromIndex = (page - 1) * limit;
      const toIndex = fromIndex + limit - 1;
      const { data, count, error } = await query.range(fromIndex, toIndex);

      if (!error && data && data.length > 0) {
        const mappedStudents: StudentRecord[] = data.map((s: any) => ({
          id: s.id,
          studentIdNumber: s.student_id_number,
          rollNo: s.roll_no,
          name: s.name,
          className: s.class_name,
          sectionName: s.section_name,
          group: s.group_name || "General",
          gender: s.gender || "MALE",
          email: s.email,
          phone: s.phone,
          fatherName: s.father_name,
          motherName: s.mother_name,
          fatherMobile: s.father_mobile || "",
          motherMobile: s.mother_mobile || "",
          guardianPhone: s.guardian_phone,
          bloodGroup: s.blood_group,
          gpa: Number(s.gpa),
          attendanceRate: s.attendance_rate,
          tuitionStatus: s.tuition_status,
          avatarInitials: s.avatar_initials || s.name.charAt(0),
        }));

        const totalCount = count || mappedStudents.length;
        const totalPages = Math.ceil(totalCount / limit) || 1;

        return NextResponse.json({
          students: mappedStudents,
          meta: {
            totalCount,
            totalPages,
            currentPage: page,
            pageSize: limit,
            source: "SUPABASE_POSTGRESQL",
          },
        });
      }
    }

    // Fallback to Backend Data Store
    let filtered = [...inMemoryStudents];

    if (email) {
      filtered = filtered.filter(
        (s) =>
          s.email.toLowerCase() === email ||
          ((email === "student@edu.bd" || email === "aria.rahman.12a03@schollege.edu.bd") &&
            (s.email.toLowerCase() === "aria.rahman.12a03@schollege.edu.bd" || s.email.toLowerCase() === "student@edu.bd"))
      );
    }
    if (className && className !== "ALL") {
      filtered = filtered.filter((s) => s.className.toLowerCase() === className.toLowerCase());
    }
    if (sectionName && sectionName !== "ALL") {
      filtered = filtered.filter((s) => s.sectionName.toLowerCase() === sectionName.toLowerCase());
    }
    if (group && group !== "ALL") {
      filtered = filtered.filter((s) => s.group.toLowerCase() === group.toLowerCase());
    }
    if (search) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.studentIdNumber.toLowerCase().includes(search) ||
          s.email.toLowerCase().includes(search) ||
          String(s.rollNo).includes(search)
      );
    }

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedStudents = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      students: paginatedStudents,
      meta: {
        totalCount,
        totalPages,
        currentPage: page,
        pageSize: limit,
        source: "BACKEND_DATA_STORE",
        classes: SCH_CLASSES.map((c) => ({ className: c.className, sections: c.sections.map((s) => s.sectionName) })),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch student records from backend" },
      { status: 500 }
    );
  }
}

// PUT /api/students - Update student details in backend memory & Supabase
export async function PUT(request: Request) {
  try {
    const updatedData: Partial<StudentRecord> = await request.json();
    if (!updatedData.email && !updatedData.id) {
      return NextResponse.json({ error: "Missing student email or id" }, { status: 400 });
    }

    const index = inMemoryStudents.findIndex(
      (s) =>
        (updatedData.email && s.email.toLowerCase() === updatedData.email.toLowerCase()) ||
        (updatedData.id && s.id === updatedData.id)
    );

    if (index !== -1) {
      inMemoryStudents[index] = { ...inMemoryStudents[index], ...updatedData };
    }

    // Try Supabase update if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = createClient();
      await supabase
        .from("students")
        .update({
          name: updatedData.name,
          phone: updatedData.phone,
          father_name: updatedData.fatherName,
          father_mobile: updatedData.fatherMobile,
          mother_name: updatedData.motherName,
          mother_mobile: updatedData.motherMobile,
          guardian_phone: updatedData.guardianPhone,
          blood_group: updatedData.bloodGroup,
        })
        .eq("email", updatedData.email);
    }

    return NextResponse.json({
      success: true,
      message: "Student record updated successfully",
      student: index !== -1 ? inMemoryStudents[index] : updatedData,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update student record" },
      { status: 500 }
    );
  }
}
