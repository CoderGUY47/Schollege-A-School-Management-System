// ──────────────────────────────────────────────────────────────────────────────
// /api/financials/route.ts — DEPRECATED REDIRECT
// This endpoint has been merged into /api/finance?type=all
// Kept as a thin proxy to avoid breaking any existing callers.
// ──────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";

  // Resolve correct base URL for server-side fetch in all environments
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/finance?type=${type}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json({ ...data, _deprecated: "Use /api/finance instead" });
}
