// ──────────────────────────────────────────────────────────────────────────────
// /api/messages/route.ts
// Campus Message Board API — GET, POST, DELETE
// ──────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

export const SCH_DEPARTMENTS = [
  "All Departments",
  "Higher Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "ICT & Computer Science",
  "Bangla",
  "English",
  "Accounting & Finance",
  "Economics",
  "Administration & Accounts",
];

// In-memory fallback for when Supabase is not configured
let inMemoryMessages: any[] = [];

// GET /api/messages — fetch all messages + department list
export async function GET() {
  try {
    const supabase = createClient();

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({
          messages: data,
          total: data.length,
          departments: SCH_DEPARTMENTS,
          source: "SUPABASE_POSTGRESQL",
        });
      }
    }

    return NextResponse.json({
      messages: inMemoryMessages,
      total: inMemoryMessages.length,
      departments: SCH_DEPARTMENTS,
      source: "BACKEND_DATA_STORE",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST /api/messages — send a new campus message
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.content?.trim() && !body.subject?.trim()) {
      return NextResponse.json(
        { error: "Message content or subject is required" },
        { status: 400 }
      );
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      subject: body.subject || "Campus Message",
      content: body.content || "",
      sender_name: body.senderName || body.sender_name || "System",
      sender_role: body.senderRole || body.sender_role || "ADMIN",
      sender_email: body.senderEmail || body.sender_email || "",
      department: body.department || "All Departments",
      target_role: body.targetRole || body.target_role || "ALL",
      priority: body.priority || "NORMAL",
      is_read: false,
      created_at: new Date().toISOString(),
    };

    const supabase = createClient();

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data, error } = await supabase
        .from("messages")
        .insert([{
          subject: newMessage.subject,
          content: newMessage.content,
          sender_name: newMessage.sender_name,
          sender_role: newMessage.sender_role,
          sender_email: newMessage.sender_email,
          department: newMessage.department,
          target_role: newMessage.target_role,
          priority: newMessage.priority,
          is_read: false,
        }])
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json(
          { success: true, message: data, source: "SUPABASE_POSTGRESQL" },
          { status: 201 }
        );
      }
    }

    // Fallback: store in memory
    inMemoryMessages.unshift(newMessage);

    return NextResponse.json(
      { success: true, message: newMessage, source: "BACKEND_DATA_STORE" },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to send message" },
      { status: 500 }
    );
  }
}

// DELETE /api/messages?id=<messageId> — remove a message
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Message id query parameter is required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (!error) {
        return NextResponse.json({ success: true, deletedId: id, source: "SUPABASE_POSTGRESQL" });
      }
    }

    // Fallback: remove from in-memory store
    const before = inMemoryMessages.length;
    inMemoryMessages = inMemoryMessages.filter((m) => m.id !== id);
    const deleted = inMemoryMessages.length < before;

    return NextResponse.json({
      success: deleted,
      deletedId: id,
      source: "BACKEND_DATA_STORE",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete message" },
      { status: 500 }
    );
  }
}
