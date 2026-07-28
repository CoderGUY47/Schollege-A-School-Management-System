// ──────────────────────────────────────────────────────────────────────────────
// backend/Data/Finance/financials.ts
// Session Breakdown & Ledger Data for Admin Finance Dashboard
// ──────────────────────────────────────────────────────────────────────────────

export interface SessionLedgerRecord {
  id: string;
  studentName: string;
  studentId: string;
  department: string;
  amountPaid: string;
  dueAmount: string;
  paymentMethod: string;
  status: "Paid" | "Partial" | "Pending" | "Waived";
  date: string;
}

export interface SessionStatusRatio {
  name: string;
  value: number;
  color: string;
}

export interface SessionBreakdown {
  name: string;
  shortName: string;
  badge: string;
  icon: string;
  enrolled: string;
  collected: string;
  hasData: boolean;
  ledger: SessionLedgerRecord[];
  statusRatio: SessionStatusRatio[];
}

export interface FinancialSummary {
  totalRevenue: string;
  clearedCollections: string;
  outstandingDues: string;
  grantsWaived: string;
  collectFunding: string;
  expenseFunding: string;
  collectFundingRaw: number;
  expenseFundingRaw: number;
  developmentFundNotice: string;
}

// ── Session Ledgers ──────────────────────────────────────────────────────────

export const SPRING_2025_LEDGER: SessionLedgerRecord[] = [
  { id: "INV-SP25-01", studentName: "Tanvir Hasan", studentId: "S-1001", department: "Computer Science", amountPaid: "৳40,000", dueAmount: "৳0", paymentMethod: "bKash", status: "Paid", date: "15 Jan 2025" },
  { id: "INV-SP25-02", studentName: "Ayesha Siddiqua", studentId: "S-1002", department: "Software Engineering", amountPaid: "৳40,000", dueAmount: "৳0", paymentMethod: "Nagad", status: "Paid", date: "18 Jan 2025" },
  { id: "INV-SP25-03", studentName: "Nafis Ahsan", studentId: "S-1003", department: "Electrical Engineering", amountPaid: "৳20,000", dueAmount: "৳20,000", paymentMethod: "Bank Transfer", status: "Partial", date: "20 Jan 2025" },
];

export const SUMMER_2025_LEDGER: SessionLedgerRecord[] = [
  { id: "INV-SM25-01", studentName: "Sumaiya Khan", studentId: "S-1009", department: "Computer Science", amountPaid: "৳38,000", dueAmount: "৳0", paymentMethod: "bKash", status: "Paid", date: "10 May 2025" },
  { id: "INV-SM25-02", studentName: "Nabil Mahmud", studentId: "S-1010", department: "Data Science", amountPaid: "৳38,000", dueAmount: "৳0", paymentMethod: "Card", status: "Paid", date: "12 May 2025" },
];

export const FALL_2025_LEDGER: SessionLedgerRecord[] = [
  { id: "INV-FL25-01", studentName: "Shakib Al Hasan", studentId: "S-1018", department: "Electrical Engineering", amountPaid: "৳45,000", dueAmount: "৳0", paymentMethod: "Bank Transfer", status: "Paid", date: "18 Sep 2025" },
  { id: "INV-FL25-02", studentName: "Tamim Iqbal", studentId: "S-1019", department: "Mathematics & Physics", amountPaid: "৳45,000", dueAmount: "৳0", paymentMethod: "bKash", status: "Waived", date: "20 Sep 2025" },
];

export const SPRING_2026_LEDGER: SessionLedgerRecord[] = [
  { id: "INV-SP-101", studentName: "Tanvir Hasan", studentId: "S-1001", department: "Computer Science", amountPaid: "৳45,000", dueAmount: "৳0", paymentMethod: "bKash", status: "Paid", date: "15 Jan 2026" },
  { id: "INV-SP-102", studentName: "Ayesha Siddiqua", studentId: "S-1002", department: "Software Engineering", amountPaid: "৳30,000", dueAmount: "৳15,000", paymentMethod: "Nagad", status: "Partial", date: "18 Jan 2026" },
  { id: "INV-SP-103", studentName: "Nafis Ahsan", studentId: "S-1003", department: "Electrical Engineering", amountPaid: "৳45,000", dueAmount: "৳0", paymentMethod: "Bank Transfer", status: "Paid", date: "20 Jan 2026" },
  { id: "INV-SP-104", studentName: "Sajid Islam", studentId: "S-1004", department: "Data Science", amountPaid: "৳0", dueAmount: "৳45,000", paymentMethod: "bKash", status: "Pending", date: "22 Jan 2026" },
  { id: "INV-SP-105", studentName: "Rida Fariha", studentId: "S-1005", department: "Mathematics & Physics", amountPaid: "৳45,000", dueAmount: "৳0", paymentMethod: "Card", status: "Waived", date: "25 Jan 2026" },
];

export const SUMMER_2026_LEDGER: SessionLedgerRecord[] = [
  { id: "INV-SM-201", studentName: "Sumaiya Khan", studentId: "S-1009", department: "Computer Science", amountPaid: "৳42,000", dueAmount: "৳0", paymentMethod: "bKash", status: "Paid", date: "10 May 2026" },
  { id: "INV-SM-202", studentName: "Nabil Mahmud", studentId: "S-1010", department: "Data Science", amountPaid: "৳42,000", dueAmount: "৳0", paymentMethod: "Card", status: "Paid", date: "12 May 2026" },
  { id: "INV-SM-203", studentName: "Tasnim Zara", studentId: "S-1011", department: "Software Engineering", amountPaid: "৳20,000", dueAmount: "৳22,000", paymentMethod: "Nagad", status: "Partial", date: "15 May 2026" },
];

// ── Session Breakdowns ────────────────────────────────────────────────────────

export const SCH_SESSION_BREAKDOWNS: Record<string, SessionBreakdown> = {
  SPRING_2026: {
    name: "Spring 2026 Academic Session",
    shortName: "Spring 2026",
    badge: "Jan - Apr 2026",
    icon: "🌸",
    enrolled: "5,909",
    collected: "৳9,850,000",
    hasData: true,
    ledger: SPRING_2026_LEDGER,
    statusRatio: [
      { name: "Paid In Full", value: 60, color: "#10B981" },
      { name: "Partial Payment", value: 25, color: "#F59E0B" },
      { name: "Pending Dues", value: 10, color: "#EF4444" },
      { name: "Scholarship / Grant", value: 5, color: "#6366F1" },
    ],
  },
  SUMMER_2026: {
    name: "Summer 2026 Academic Session",
    shortName: "Summer 2026",
    badge: "May - Aug 2026",
    icon: "☀️",
    enrolled: "4,850",
    collected: "৳8,200,000",
    hasData: true,
    ledger: SUMMER_2026_LEDGER,
    statusRatio: [
      { name: "Paid In Full", value: 65, color: "#10B981" },
      { name: "Partial Payment", value: 20, color: "#F59E0B" },
      { name: "Pending Dues", value: 10, color: "#EF4444" },
      { name: "Scholarship / Grant", value: 5, color: "#6366F1" },
    ],
  },
  FALL_2026: {
    name: "Fall 2026 Academic Session",
    shortName: "Fall 2026",
    badge: "Sep - Dec 2026",
    icon: "🍂",
    enrolled: "0",
    collected: "৳0",
    hasData: false,
    ledger: [],
    statusRatio: [
      { name: "Paid In Full", value: 0, color: "#10B981" },
      { name: "Partial Payment", value: 0, color: "#F59E0B" },
      { name: "Pending Dues", value: 0, color: "#EF4444" },
      { name: "Scholarship / Grant", value: 0, color: "#6366F1" },
    ],
  },
  SPRING_2025: {
    name: "Spring 2025 Academic Session",
    shortName: "Spring 2025",
    badge: "Jan - Apr 2025",
    icon: "🌸",
    enrolled: "5,420",
    collected: "৳8,950,000",
    hasData: true,
    ledger: SPRING_2025_LEDGER,
    statusRatio: [
      { name: "Paid In Full", value: 75, color: "#10B981" },
      { name: "Partial Payment", value: 15, color: "#F59E0B" },
      { name: "Pending Dues", value: 5, color: "#EF4444" },
      { name: "Scholarship / Grant", value: 5, color: "#6366F1" },
    ],
  },
  SUMMER_2025: {
    name: "Summer 2025 Academic Session",
    shortName: "Summer 2025",
    badge: "May - Aug 2025",
    icon: "☀️",
    enrolled: "4,600",
    collected: "৳7,800,000",
    hasData: true,
    ledger: SUMMER_2025_LEDGER,
    statusRatio: [
      { name: "Paid In Full", value: 80, color: "#10B981" },
      { name: "Partial Payment", value: 12, color: "#F59E0B" },
      { name: "Pending Dues", value: 5, color: "#EF4444" },
      { name: "Scholarship / Grant", value: 3, color: "#6366F1" },
    ],
  },
  FALL_2025: {
    name: "Fall 2025 Academic Session",
    shortName: "Fall 2025",
    badge: "Sep - Dec 2025",
    icon: "🍂",
    enrolled: "5,800",
    collected: "৳10,200,000",
    hasData: true,
    ledger: FALL_2025_LEDGER,
    statusRatio: [
      { name: "Paid In Full", value: 82, color: "#10B981" },
      { name: "Partial Payment", value: 10, color: "#F59E0B" },
      { name: "Pending Dues", value: 5, color: "#EF4444" },
      { name: "Scholarship / Grant", value: 3, color: "#6366F1" },
    ],
  },
};

// ── Financial Summary ─────────────────────────────────────────────────────────

export const SCH_FINANCIAL_SUMMARY: FinancialSummary = {
  totalRevenue: "৳65,545,000",
  clearedCollections: "৳51,291,266",
  outstandingDues: "৳14,253,734",
  grantsWaived: "৳3,200,000",
  collectFunding: "৳500 Crore",
  expenseFunding: "৳340 Crore",
  collectFundingRaw: 5000000000,
  expenseFundingRaw: 3400000000,
  developmentFundNotice: "৳500 Crore School & College Infrastructure & Digital Development Grant",
};
