import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN" | "PARENT";
  department?: string;
  studentIdNumber?: string;
  status: "ACTIVE" | "INACTIVE";
  avatarUrl?: string;
}

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

export const SCH_DEFAULT_TEACHERS: UserItem[] = Array.from({ length: 100 }, (_, i) => ({
  id: `tch-${i + 1}`,
  name: `Faculty Member #${i + 1}`,
  email: `teacher${i + 1}@schollege.edu.bd`,
  role: "TEACHER",
  department: depts[i % depts.length],
  status: "ACTIVE",
}));

export const SCH_DEFAULT_ADMIN_STUDENTS: UserItem[] = Array.from({ length: 70 }, (_, i) => ({
  id: `std-${i + 1}`,
  name: `Student Record #${i + 1}`,
  email: `student${i + 1}@schollege.edu.bd`,
  role: "STUDENT",
  studentIdNumber: `SCH-2026-${1000 + i}`,
  status: "ACTIVE",
}));

let inMemoryRegisteredUsers: UserItem[] = [];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search")?.toLowerCase();

    const supabase = createClient();

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      let query = supabase.from("user").select("*");
      if (role && role !== "ALL") {
        query = query.eq("role", role);
      }
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return NextResponse.json({
          users: [...inMemoryRegisteredUsers, ...data],
          source: "SUPABASE_POSTGRESQL",
        });
      }
    }

    let allUsers = [...inMemoryRegisteredUsers, ...SCH_DEFAULT_TEACHERS, ...SCH_DEFAULT_ADMIN_STUDENTS];
    if (role && role !== "ALL") {
      allUsers = allUsers.filter((u) => u.role === role);
    }
    if (search) {
      allUsers = allUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      users: allUsers,
      source: "BACKEND_DATA_STORE",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch users from backend" },
      { status: 500 }
    );
  }
}

// POST /api/users - Store newly registered user in backend database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role, department, studentIdNumber, avatarUrl } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const newUser: UserItem = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: role || "STUDENT",
      department: department || "General",
      studentIdNumber: studentIdNumber || `SCH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "ACTIVE",
      avatarUrl: avatarUrl || "/images/avatars/avatar_01.svg",
    };

    const supabase = createClient();
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data, error } = await supabase.from("user").insert([newUser]).select();
      if (!error && data && data.length > 0) {
        return NextResponse.json({ user: data[0], source: "SUPABASE_POSTGRESQL" }, { status: 201 });
      }
    }

    inMemoryRegisteredUsers.unshift(newUser);
    return NextResponse.json({ user: newUser, source: "BACKEND_DATA_STORE" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create user in backend database" },
      { status: 500 }
    );
  }
}
