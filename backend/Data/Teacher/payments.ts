export interface TeacherPaymentLedgerRecord {
  id: string;
  teacherId: string;
  teacherEmail: string;
  teacherName: string;
  date: string;
  type: "SALARY" | "ALLOWANCE" | "EXPENSE" | "BONUS";
  description: string;
  category: string;
  creditAmount: number; // Money received from school (Salary / Allowance)
  debitAmount: number;  // Out-of-pocket spent by teacher
  status: "PAID" | "APPROVED" | "PENDING" | "REIMBURSED";
  paymentMethod: string;
  referenceNo: string;
}

export interface TeacherFinancialTelemetry {
  teacherId: string;
  teacherEmail: string;
  teacherName: string;
  designation: string;
  department: string;
  bankName: string;
  bankAccountNo: string;
  tinNumber: string;
  payGrade: string;
  monthlyBaseSalary: number;
  houseRentAllowance: number;
  medicalAllowance: number;
  totalSalaryReceived: number;
  totalAllowances: number;
  totalExpensesSpent: number;
  netDisbursedBalance: number;
  monthlyTrend: Array<{
    month: string;
    SalaryCredited: number;
    ExpensesSpent: number;
  }>;
  ledger: TeacherPaymentLedgerRecord[];
}

export const TEACHER_PAYMENTS_DATABASE: Record<string, TeacherFinancialTelemetry> = {
  "robert.chen@schollege.edu.bd": {
    teacherId: "SCH-FAC-1002",
    teacherEmail: "robert.chen@schollege.edu.bd",
    teacherName: "Dr. Robert Chen",
    designation: "Head of Department (HOD) & Chair",
    department: "Physics",
    bankName: "Sonali Bank PLC",
    bankAccountNo: "A/C 4402-991823-01",
    tinNumber: "TIN-8891-2039-441",
    payGrade: "Grade 4 Senior Professor",
    monthlyBaseSalary: 85000,
    houseRentAllowance: 25000,
    medicalAllowance: 5000,
    totalSalaryReceived: 680000,
    totalAllowances: 67500,
    totalExpensesSpent: 12200,
    netDisbursedBalance: 735300,
    monthlyTrend: [
      { month: "Jan 26", SalaryCredited: 85000, ExpensesSpent: 2100 },
      { month: "Feb 26", SalaryCredited: 85000, ExpensesSpent: 3400 },
      { month: "Mar 26", SalaryCredited: 85000, ExpensesSpent: 1800 },
      { month: "Apr 26", SalaryCredited: 85000, ExpensesSpent: 4200 },
      { month: "May 26", SalaryCredited: 127500, ExpensesSpent: 2900 },
      { month: "Jun 26", SalaryCredited: 110000, ExpensesSpent: 3700 },
      { month: "Jul 26", SalaryCredited: 85000, ExpensesSpent: 4800 },
      { month: "Aug 26", SalaryCredited: 85000, ExpensesSpent: 1200 },
    ],
    ledger: [
      {
        id: "TXN-T-801",
        teacherId: "SCH-FAC-1002",
        teacherEmail: "robert.chen@schollege.edu.bd",
        teacherName: "Dr. Robert Chen",
        date: "2026-08-01",
        type: "SALARY",
        description: "Monthly Base Salary & House Rent Allowance Disbursed (August 2026)",
        category: "Faculty Payroll",
        creditAmount: 85000,
        debitAmount: 0,
        status: "PAID",
        paymentMethod: "EFT / Sonali Bank",
        referenceNo: "PAY-2026-08-1001",
      },
      {
        id: "TXN-T-802",
        teacherId: "SCH-FAC-1002",
        teacherEmail: "robert.chen@schollege.edu.bd",
        teacherName: "Dr. Robert Chen",
        date: "2026-07-28",
        type: "EXPENSE",
        description: "Out-of-pocket Physics Lab Session 4 Equipment & Multimeter Sensors",
        category: "Lab Equipment & Supplies",
        creditAmount: 0,
        debitAmount: 4800,
        status: "REIMBURSED",
        paymentMethod: "bKash / Reimbursement",
        referenceNo: "EXP-2026-07-442",
      },
      {
        id: "TXN-T-803",
        teacherId: "SCH-FAC-1002",
        teacherEmail: "robert.chen@schollege.edu.bd",
        teacherName: "Dr. Robert Chen",
        date: "2026-07-01",
        type: "SALARY",
        description: "Monthly Base Salary & Performance Allowance Disbursed (July 2026)",
        category: "Faculty Payroll",
        creditAmount: 85000,
        debitAmount: 0,
        status: "PAID",
        paymentMethod: "EFT / Sonali Bank",
        referenceNo: "PAY-2026-07-1001",
      },
      {
        id: "TXN-T-804",
        teacherId: "SCH-FAC-1002",
        teacherEmail: "robert.chen@schollege.edu.bd",
        teacherName: "Dr. Robert Chen",
        date: "2026-06-25",
        type: "ALLOWANCE",
        description: "Annual Academic Research & International Seminar Grant",
        category: "Research Grant",
        creditAmount: 25000,
        debitAmount: 0,
        status: "PAID",
        paymentMethod: "Direct Bank Transfer",
        referenceNo: "GRT-2026-06-99",
      },
      {
        id: "TXN-T-805",
        teacherId: "SCH-FAC-1002",
        teacherEmail: "robert.chen@schollege.edu.bd",
        teacherName: "Dr. Robert Chen",
        date: "2026-06-12",
        type: "EXPENSE",
        description: "Quantum Electromagnetism Reference Textbooks & IEEE Subscription",
        category: "Books & Subscriptions",
        creditAmount: 0,
        debitAmount: 3700,
        status: "REIMBURSED",
        paymentMethod: "Credit Card / Reimbursement",
        referenceNo: "EXP-2026-06-118",
      },
      {
        id: "TXN-T-806",
        teacherId: "SCH-FAC-1002",
        teacherEmail: "robert.chen@schollege.edu.bd",
        teacherName: "Dr. Robert Chen",
        date: "2026-06-01",
        type: "SALARY",
        description: "Monthly Base Salary Disbursed (June 2026)",
        category: "Faculty Payroll",
        creditAmount: 85000,
        debitAmount: 0,
        status: "PAID",
        paymentMethod: "EFT / Sonali Bank",
        referenceNo: "PAY-2026-06-1001",
      },
      {
        id: "TXN-T-807",
        teacherId: "SCH-FAC-1002",
        teacherEmail: "robert.chen@schollege.edu.bd",
        teacherName: "Dr. Robert Chen",
        date: "2026-05-18",
        type: "BONUS",
        description: "Eid-ul-Adha Special Festival Allowance",
        category: "Festival Bonus",
        creditAmount: 42500,
        debitAmount: 0,
        status: "PAID",
        paymentMethod: "EFT / Sonali Bank",
        referenceNo: "BON-2026-05-301",
      },
    ],
  },
  "teacher@edu.bd": {
    teacherId: "SCH-FAC-1001",
    teacherEmail: "teacher@edu.bd",
    teacherName: "Prof. Dr. Sarah Jenkins",
    designation: "Head of Department (HOD) & Chair",
    department: "Higher Mathematics",
    bankName: "Sonali Bank PLC",
    bankAccountNo: "A/C 4402-110298-05",
    tinNumber: "TIN-9921-3048-112",
    payGrade: "Grade 3 Senior Professor & Dept Chair",
    monthlyBaseSalary: 95000,
    houseRentAllowance: 30000,
    medicalAllowance: 6000,
    totalSalaryReceived: 760000,
    totalAllowances: 85000,
    totalExpensesSpent: 14500,
    netDisbursedBalance: 830500,
    monthlyTrend: [
      { month: "Jan 26", SalaryCredited: 95000, ExpensesSpent: 2800 },
      { month: "Feb 26", SalaryCredited: 95000, ExpensesSpent: 3100 },
      { month: "Mar 26", SalaryCredited: 95000, ExpensesSpent: 1500 },
      { month: "Apr 26", SalaryCredited: 95000, ExpensesSpent: 4900 },
      { month: "May 26", SalaryCredited: 142500, ExpensesSpent: 2200 },
      { month: "Jun 26", SalaryCredited: 125000, ExpensesSpent: 3900 },
      { month: "Jul 26", SalaryCredited: 95000, ExpensesSpent: 5100 },
      { month: "Aug 26", SalaryCredited: 95000, ExpensesSpent: 1400 },
    ],
    ledger: [
      {
        id: "TXN-T-901",
        teacherId: "SCH-FAC-1001",
        teacherEmail: "teacher@edu.bd",
        teacherName: "Prof. Dr. Sarah Jenkins",
        date: "2026-08-01",
        type: "SALARY",
        description: "Monthly Base Salary & Department Chair Allowance Disbursed (August 2026)",
        category: "Faculty Payroll",
        creditAmount: 95000,
        debitAmount: 0,
        status: "PAID",
        paymentMethod: "EFT / Sonali Bank",
        referenceNo: "PAY-2026-08-2001",
      },
      {
        id: "TXN-T-902",
        teacherId: "SCH-FAC-1001",
        teacherEmail: "teacher@edu.bd",
        teacherName: "Prof. Dr. Sarah Jenkins",
        date: "2026-07-22",
        type: "EXPENSE",
        description: "Advanced Calculus & Linear Algebra International Journal Publication Fee",
        category: "Research & Publication",
        creditAmount: 0,
        debitAmount: 5100,
        status: "REIMBURSED",
        paymentMethod: "Credit Card / Reimbursement",
        referenceNo: "EXP-2026-07-881",
      },
      {
        id: "TXN-T-903",
        teacherId: "SCH-FAC-1001",
        teacherEmail: "teacher@edu.bd",
        teacherName: "Prof. Dr. Sarah Jenkins",
        date: "2026-07-01",
        type: "SALARY",
        description: "Monthly Base Salary Disbursed (July 2026)",
        category: "Faculty Payroll",
        creditAmount: 95000,
        debitAmount: 0,
        status: "PAID",
        paymentMethod: "EFT / Sonali Bank",
        referenceNo: "PAY-2026-07-2001",
      },
    ],
  },
};
