export interface FinancialTimelineItem {
  id: string;
  month: string;
  income: number;
  expense: number;
  year: number;
  createdAt?: string;
}

export interface HistoricTimelineItem {
  month: string;
  Collected: number;
  Dues: number;
  isFinished: boolean;
}

export const SCH_FINANCIAL_TIMELINE: FinancialTimelineItem[] = [
  { id: "fin-01", month: "Jan", income: 350000, expense: 200000, year: 2026 },
  { id: "fin-02", month: "Feb", income: 420000, expense: 250000, year: 2026 },
  { id: "fin-03", month: "Mar", income: 390000, expense: 210000, year: 2026 },
  { id: "fin-04", month: "Apr", income: 480000, expense: 280000, year: 2026 },
  { id: "fin-05", month: "May", income: 550000, expense: 300000, year: 2026 },
  { id: "fin-06", month: "Jun", income: 620000, expense: 350000, year: 2026 },
  { id: "fin-07", month: "Jul", income: 710000, expense: 400000, year: 2026 },
  { id: "fin-08", month: "Aug", income: 837000, expense: 500000, year: 2026 },
  { id: "fin-09", month: "Sep", income: 680000, expense: 320000, year: 2026 },
  { id: "fin-10", month: "Oct", income: 750000, expense: 380000, year: 2026 },
  { id: "fin-11", month: "Nov", income: 640000, expense: 310000, year: 2026 },
  { id: "fin-12", month: "Dec", income: 920000, expense: 450000, year: 2026 },
];

export const SCH_HISTORIC_TIMELINE: HistoricTimelineItem[] = [
  { month: "Jan 25", Collected: 2450000, Dues: 550000, isFinished: true },
  { month: "Feb 25", Collected: 2800000, Dues: 400000, isFinished: true },
  { month: "Mar 25", Collected: 3100000, Dues: 350000, isFinished: true },
  { month: "Apr 25", Collected: 2600000, Dues: 300000, isFinished: true },
  { month: "May 25", Collected: 2900000, Dues: 450000, isFinished: true },
  { month: "Jun 25", Collected: 3200000, Dues: 380000, isFinished: true },
  { month: "Jul 25", Collected: 2750000, Dues: 320000, isFinished: true },
  { month: "Aug 25", Collected: 3050000, Dues: 410000, isFinished: true },
  { month: "Sep 25", Collected: 3400000, Dues: 500000, isFinished: true },
  { month: "Oct 25", Collected: 3150000, Dues: 420000, isFinished: true },
  { month: "Nov 25", Collected: 3500000, Dues: 480000, isFinished: true },
  { month: "Dec 25", Collected: 3800000, Dues: 520000, isFinished: true },
  { month: "Jan 26", Collected: 2850000, Dues: 650000, isFinished: true },
  { month: "Feb 26", Collected: 3100000, Dues: 450000, isFinished: true },
];
