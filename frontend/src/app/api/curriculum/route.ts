import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import { SCH_CURRICULUM } from "@/lib/backend-student";

// GET /api/curriculum?className=Class 12
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const className = searchParams.get("className");

    const supabase = createClient();

    // Query Supabase PostgreSQL Table if available
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      let query = supabase.from("curriculum_subjects").select("*");
      if (className) {
        query = query.eq("class_name", className);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Group subjects by group_name
        const grouped: Record<string, any[]> = {};
        data.forEach((item: any) => {
          const grp = item.group_name || "DEFAULT";
          if (!grouped[grp]) grouped[grp] = [];
          grouped[grp].push({
            code: item.code,
            name: item.name,
            category: item.category,
            fullMarks: item.full_marks,
            theoryMarks: item.theory_marks,
            practicalMarks: item.practical_marks,
            creditHours: item.credit_hours,
          });
        });

        return NextResponse.json({
          className: className || "All Classes",
          groups: Object.keys(grouped).filter((g) => g !== "DEFAULT"),
          subjects: grouped,
          source: "SUPABASE_POSTGRESQL",
        });
      }
    }

    // Fallback to Backend Data Store
    if (className && SCH_CURRICULUM[className]) {
      return NextResponse.json(SCH_CURRICULUM[className]);
    }

    return NextResponse.json(SCH_CURRICULUM);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch curriculum data from backend" },
      { status: 500 }
    );
  }
}
