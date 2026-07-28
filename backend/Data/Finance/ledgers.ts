export interface PaymentRecord {
  id: string;
  studentName: string;
  studentId: string;
  department: string;
  amountPaid: string;
  dueAmount: string;
  paymentMethod: string;
  status: "Paid" | "Pending" | "Partial" | "Overdue" | "Waived";
  date: string;
}

export const SCH_FINANCIAL_LEDGERS: Record<string, PaymentRecord[]> = {
  spring2026: [
    { id: "INV-SP26-01", studentName: "Aria Rahman", studentId: "S-1001", department: "Computer Science & Eng", amountPaid: "৳48,500", dueAmount: "৳0", paymentMethod: "bKash", status: "Paid", date: "10 Jan 2026" },
    { id: "INV-SP26-02", studentName: "Tahmid Hasan", studentId: "S-1002", department: "Electrical Engineering", amountPaid: "৳25,000", dueAmount: "৳23,500", paymentMethod: "Nagad", status: "Pending", date: "12 Jan 2026" },
    { id: "INV-SP26-03", studentName: "Nafis Ahsan", studentId: "S-1003", department: "Business Administration", amountPaid: "৳0", dueAmount: "৳48,500", paymentMethod: "N/A", status: "Overdue", date: "05 Jan 2026" },
    { id: "INV-SP26-04", studentName: "Sadia Malik", studentId: "S-1004", department: "Textile Engineering", amountPaid: "৳48,500", dueAmount: "৳0", paymentMethod: "Dutch-Bangla Bank", status: "Paid", date: "15 Jan 2026" },
  ],
  summer2026: [
    { id: "INV-SM26-01", studentName: "Zayn Shahriar", studentId: "S-1005", department: "Architecture", amountPaid: "৳52,000", dueAmount: "৳0", paymentMethod: "Visa Card", status: "Paid", date: "02 May 2026" },
    { id: "INV-SM26-02", studentName: "Fahim Islam", studentId: "S-1006", department: "Computer Science & Eng", amountPaid: "৳20,000", dueAmount: "৳32,000", paymentMethod: "bKash", status: "Pending", date: "08 May 2026" },
  ],
  spring2025: [
    { id: "INV-SP25-01", studentName: "Sajid Chowdhury", studentId: "S-1007", department: "Pharmacy", amountPaid: "৳42,000", dueAmount: "৳0", paymentMethod: "Bank Transfer", status: "Paid", date: "14 Jan 2025" },
    { id: "INV-SP25-02", studentName: "Mahir Hossain", studentId: "S-1008", department: "Civil Engineering", amountPaid: "৳42,000", dueAmount: "৳0", paymentMethod: "Nagad", status: "Paid", date: "18 Jan 2025" },
  ],
  summer2025: [
    { id: "INV-SM25-01", studentName: "Wasif Sami", studentId: "S-1009", department: "Law & Justice", amountPaid: "৳44,000", dueAmount: "৳0", paymentMethod: "Dutch-Bangla Bank", status: "Paid", date: "11 May 2025" },
    { id: "INV-SM25-02", studentName: "Adnan Ahmed", studentId: "S-1010", department: "English Literature", amountPaid: "৳44,000", dueAmount: "৳0", paymentMethod: "bKash", status: "Paid", date: "15 May 2025" },
  ],
  fall2025: [
    { id: "INV-FL25-01", studentName: "Shakib Al Hasan", studentId: "S-1018", department: "Electrical Engineering", amountPaid: "৳45,000", dueAmount: "৳0", paymentMethod: "Bank Transfer", status: "Paid", date: "18 Sep 2025" },
    { id: "INV-FL25-02", studentName: "Tamim Iqbal", studentId: "S-1019", department: "Mathematics & Physics", amountPaid: "৳45,000", dueAmount: "৳0", paymentMethod: "bKash", status: "Waived", date: "20 Sep 2025" },
  ],
};
