import { NextResponse } from "next/server";
import {
  INITIAL_INVOICES,
  INITIAL_LEDGER,
  BANK_ACCOUNTS,
  SCHOLARSHIPS,
} from "@/lib/backend-fees";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "summary";

    if (type === "invoices") {
      return NextResponse.json({ invoices: INITIAL_INVOICES });
    }

    if (type === "ledger") {
      return NextResponse.json({ ledger: INITIAL_LEDGER });
    }

    if (type === "banks") {
      return NextResponse.json({ bankAccounts: BANK_ACCOUNTS });
    }

    if (type === "scholarships") {
      return NextResponse.json({ scholarships: SCHOLARSHIPS });
    }

    return NextResponse.json({
      invoices: INITIAL_INVOICES,
      ledger: INITIAL_LEDGER,
      bankAccounts: BANK_ACCOUNTS,
      scholarships: SCHOLARSHIPS,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch fee ledger data" },
      { status: 500 }
    );
  }
}
