// ============================================================
// backend-fees.ts
// Authoritative payment ledger & fee invoices data store.
// Per AGENTS.md, data resides in frontend/src/lib/.
// ============================================================

export interface InvoiceItem {
  id: string;
  invoiceNo: string;
  title: string;
  term: string;
  category: "Tuition" | "Lab Fee" | "Exam Fee" | "Admission & Reg" | "Library & Misc";
  amount: number;
  waiverAmount: number;
  netPayable: number;
  dueDate: string;
  status: "UNPAID" | "PAID" | "OVERDUE" | "PARTIAL";
  paidDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  breakdown: { item: string; cost: number }[];
}

export interface LedgerTransaction {
  txId: string;
  date: string;
  description: string;
  invoiceRef: string;
  paymentMethod: "bKash" | "Nagad" | "Rocket" | "DBBL NexusPay" | "Bank Transfer" | "Card";
  creditAmount: number;
  debitAmount: number;
  balance: number;
  status: "COMPLETED" | "SETTLED" | "PENDING";
  receiptNo: string;
}

export interface BankAccountInfo {
  bankName: string;
  branch: string;
  accountName: string;
  accountNumber: string;
  routingNumber?: string;
  paymentCode?: string;
  type: "Bank" | "Mobile Banking";
}

export interface ScholarshipRecord {
  id: string;
  title: string;
  category: "Merit Waiver" | "Board Stipend" | "Financial Aid" | "Freedom Fighter Quota";
  discountPercentage: number;
  discountAmount: number;
  grantedBy: string;
  status: "ACTIVE" | "RENEWED" | "EXPIRED";
  validPeriod: string;
}

export const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: "INV-2026-08",
    invoiceNo: "SCH-INV-2026-008",
    title: "HSC Class 12 Mid-Term Tuition & Session Fee",
    term: "Mid-Term 2026",
    category: "Tuition",
    amount: 12500,
    waiverAmount: 1875, // 15% merit waiver
    netPayable: 10625,
    dueDate: "2026-08-25",
    status: "UNPAID",
    breakdown: [
      { item: "Monthly Tuition Fee (Jul - Aug)", cost: 8000 },
      { item: "Mid-Term Examination Fee", cost: 2500 },
      { item: "Library & Digital Resource Access", cost: 2000 },
    ],
  },
  {
    id: "INV-2026-05",
    invoiceNo: "SCH-INV-2026-005",
    title: "Science Stream Practical Lab & Development Fee",
    term: "Summer Term 2026",
    category: "Lab Fee",
    amount: 3500,
    waiverAmount: 525,
    netPayable: 2975,
    dueDate: "2026-05-15",
    status: "PAID",
    paidDate: "2026-05-10",
    paymentMethod: "bKash Merchant",
    transactionId: "BK9X72L90M",
    breakdown: [
      { item: "Physics Lab Apparatus & Reagents", cost: 1500 },
      { item: "Chemistry Lab Supplies", cost: 1200 },
      { item: "ICT Computer Lab & Fiber Network", cost: 800 },
    ],
  },
  {
    id: "INV-2026-01",
    invoiceNo: "SCH-INV-2026-001",
    title: "Class 12 Annual Admission & Registration Dues",
    term: "Academic Year 2026",
    category: "Admission & Reg",
    amount: 16500,
    waiverAmount: 2475,
    netPayable: 14025,
    dueDate: "2026-01-10",
    status: "PAID",
    paidDate: "2026-01-05",
    paymentMethod: "DBBL NexusPay",
    transactionId: "DBBL-8820491",
    breakdown: [
      { item: "Annual Registration & Board Fee", cost: 9500 },
      { item: "Student Welfare & Insurance", cost: 4000 },
      { item: "Sports & Co-Curricular Fund", cost: 3000 },
    ],
  },
];

export const INITIAL_LEDGER: LedgerTransaction[] = [
  {
    txId: "TXN-2026-003",
    date: "2026-05-10",
    description: "Payment for Science Lab & Development Fee (INV-2026-05)",
    invoiceRef: "SCH-INV-2026-005",
    paymentMethod: "bKash",
    creditAmount: 2975,
    debitAmount: 0,
    balance: 0,
    status: "COMPLETED",
    receiptNo: "RCP-2026-058",
  },
  {
    txId: "TXN-2026-002",
    date: "2026-01-05",
    description: "Payment for Class 12 Annual Admission & Reg (INV-2026-001)",
    invoiceRef: "SCH-INV-2026-001",
    paymentMethod: "DBBL NexusPay",
    creditAmount: 14025,
    debitAmount: 0,
    balance: 0,
    status: "COMPLETED",
    receiptNo: "RCP-2026-004",
  },
  {
    txId: "TXN-2025-012",
    date: "2025-11-20",
    description: "HSC 1st Year Final Examination Fee Settlement",
    invoiceRef: "SCH-INV-2025-012",
    paymentMethod: "Nagad",
    creditAmount: 4500,
    debitAmount: 0,
    balance: 0,
    status: "SETTLED",
    receiptNo: "RCP-2025-189",
  },
];

export const BANK_ACCOUNTS: BankAccountInfo[] = [
  {
    bankName: "Sonali Bank PLC",
    branch: "College Campus Branch, Dhaka",
    accountName: "Schollege MS General Fund Account",
    accountNumber: "4401-2009384-01",
    routingNumber: "200261902",
    type: "Bank",
  },
  {
    bankName: "Dutch-Bangla Bank PLC (DBBL)",
    branch: "Main Branch, Dhaka",
    accountName: "Schollege Student Fee Collection Account",
    accountNumber: "110-120-334510",
    routingNumber: "090261884",
    type: "Bank",
  },
  {
    bankName: "bKash Merchant Pay",
    branch: "Online Payment Gateway",
    accountName: "Schollege Official Merchant Account",
    accountNumber: "01700-000000",
    paymentCode: "Counter: 1 (Reference: Roll No)",
    type: "Mobile Banking",
  },
  {
    bankName: "Nagad Merchant",
    branch: "Online Payment Gateway",
    accountName: "Schollege Collection Portal",
    accountNumber: "01800-000000",
    paymentCode: "Merchant Pay Option",
    type: "Mobile Banking",
  },
];

export const SCHOLARSHIPS: ScholarshipRecord[] = [
  {
    id: "SCH-2026-01",
    title: "Schollege Principal's Academic Merit Distinction",
    category: "Merit Waiver",
    discountPercentage: 15,
    discountAmount: 1875,
    grantedBy: "Academic Governing Council",
    status: "ACTIVE",
    validPeriod: "2025–2026 Academic Session",
  },
  {
    id: "SCH-2025-04",
    title: "Dhaka Education Board Secondary Merit Stipend",
    category: "Board Stipend",
    discountPercentage: 10,
    discountAmount: 1200,
    grantedBy: "Ministry of Education, Bangladesh",
    status: "RENEWED",
    validPeriod: "HSC Session 2025–2027",
  },
];
