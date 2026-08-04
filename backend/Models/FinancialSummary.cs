using System;
using System.Collections.Generic;

namespace SchollegeMS.Backend.Models
{
    public class FinancialSummary
    {
        public string TotalRevenue { get; set; } = "৳65,545,000";
        public string ClearedCollections { get; set; } = "৳51,291,266";
        public string OutstandingDues { get; set; } = "৳14,253,734";
        public string GrantsWaived { get; set; } = "৳3,200,000";

        // School & College Development Funding (500 Crore Fund)
        public string CollectFunding { get; set; } = "৳500 Crore";
        public string ExpenseFunding { get; set; } = "৳340 Crore";
        public long CollectFundingRaw { get; set; } = 5000000000;
        public long ExpenseFundingRaw { get; set; } = 3400000000;
        public string DevelopmentFundNotice { get; set; } = "৳500 Crore School & College Infrastructure & Digital Development Grant";

        public List<MonthlyTrendPoint> MonthlyTrends { get; set; } = new();
    }

    public class MonthlyTrendPoint
    {
        public string Month { get; set; } = string.Empty;
        public decimal Income { get; set; }
        public decimal Expense { get; set; }
        public decimal PriorYearIncome { get; set; }
        public bool IsFinished { get; set; } = true;
    }
}
