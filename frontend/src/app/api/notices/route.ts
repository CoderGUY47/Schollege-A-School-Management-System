import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import { SCH_NOTICES } from "@/lib/backend-student";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const supabase = createClient();

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      let query = supabase.from("notices").select("*");
      if (category && category !== "ALL") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return NextResponse.json({
          notices: data,
          source: "SUPABASE_POSTGRESQL",
        });
      }
    }

    let filtered = [...SCH_NOTICES];
    if (category && category !== "ALL") {
      filtered = filtered.filter((n) => n.category === category);
    }

    return NextResponse.json({
      notices: filtered,
      source: "BACKEND_DATA_STORE",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch notices" },
      { status: 500 }
    );
  }
}
