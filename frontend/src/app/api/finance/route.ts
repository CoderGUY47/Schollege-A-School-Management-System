// ──────────────────────────────────────────────────────────────────────────────
// /api/finance/route.ts
// Unified Financial Data API — merges former /api/finance + /api/financials
// Supports ?type=timeline | sessions | summary | all (default: all)
// ──────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import {
  SCH_FINANCIAL_TIMELINE,
  SCH_HISTORIC_TIMELINE,
  FinancialTimelineItem,
  HistoricTimelineItem,
} from "@backend/Data/Finance/finance";
import {
  SCH_SESSION_BREAKDOWNS,
  SCH_FINANCIAL_SUMMARY,
  SessionBreakdown,
  FinancialSummary,
} from "@backend/Data/Finance/financials";

export type { FinancialTimelineItem, HistoricTimelineItem, SessionBreakdown, FinancialSummary };

// GET /api/finance?type=timeline|sessions|summary|all
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";

    const supabase = createClient();

    // ── type=timeline: income/expense bar chart data ──────────────────────────
    if (type === "timeline") {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const { data, error } = await supabase
          .from("financial_telemetry")
          .select("*")
          .order("year", { ascending: true });
        if (!error && data && data.length > 0) {
          return NextResponse.json({
            financialData: data,
            historicTimeline2025To2026: SCH_HISTORIC_TIMELINE,
            source: "SUPABASE_POSTGRESQL",
          });
        }
      }
      return NextResponse.json({
        financialData: SCH_FINANCIAL_TIMELINE,
        historicTimeline2025To2026: SCH_HISTORIC_TIMELINE,
        source: "BACKEND_DATA_STORE",
      });
    }

    // ── type=sessions: session-level fee collection breakdowns ─────────────────
    if (type === "sessions") {
      return NextResponse.json({
        sessionBreakdowns: SCH_SESSION_BREAKDOWNS,
        summary: SCH_FINANCIAL_SUMMARY,
        source: "BACKEND_DATA_STORE",
      });
    }

    // ── type=summary: top-level financial KPIs ────────────────────────────────
    if (type === "summary") {
      return NextResponse.json({
        summary: SCH_FINANCIAL_SUMMARY,
        source: "BACKEND_DATA_STORE",
      });
    }

    // ── type=all (default): everything in one response ────────────────────────
    let financialData: FinancialTimelineItem[] = SCH_FINANCIAL_TIMELINE;

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data, error } = await supabase
        .from("financial_telemetry")
        .select("*")
        .order("year", { ascending: true });
      if (!error && data && data.length > 0) {
        financialData = data;
      }
    }

    return NextResponse.json({
      financialData,
      historicTimeline2025To2026: SCH_HISTORIC_TIMELINE,
      sessionBreakdowns: SCH_SESSION_BREAKDOWNS,
      summary: SCH_FINANCIAL_SUMMARY,
      source: financialData === SCH_FINANCIAL_TIMELINE ? "BACKEND_DATA_STORE" : "SUPABASE_POSTGRESQL",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch financial data" },
      { status: 500 }
    );
  }
}
