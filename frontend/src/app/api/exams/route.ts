import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import { SCH_EXAM_RESULTS, SCH_MARK_DISTRIBUTION } from "@/lib/backend-exams";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get("term") || "Mid-Term Exam 2026";
    const type = searchParams.get("type"); // "distribution" returns mark breakdown table

    // Return mark distribution table
    if (type === "distribution") {
      return NextResponse.json({
        distribution: SCH_MARK_DISTRIBUTION,
        source: "BACKEND_DATA_STORE",
      });
    }

    const supabase = createClient();

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data, error } = await supabase
        .from("exam_results")
        .select("*")
        .eq("term_name", term);

      if (!error && data && data.length > 0) {
        return NextResponse.json({
          term,
          results: data,
          source: "SUPABASE_POSTGRESQL",
        });
      }
    }

    const results = SCH_EXAM_RESULTS[term] || SCH_EXAM_RESULTS["Mid-Term Exam 2026"];

    return NextResponse.json({
      term,
      results,
      source: "BACKEND_DATA_STORE",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch exam results" },
      { status: 500 }
    );
  }
}
