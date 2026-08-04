using Microsoft.AspNetCore.Mvc;
using SchollegeMS.Backend.Models;
using System.Collections.Generic;

namespace SchollegeMS.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FinancialsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetFinancialOverview()
        {
            var summary = new FinancialSummary
            {
                TotalRevenue = "৳65,545,000",
                ClearedCollections = "৳51,291,266",
                OutstandingDues = "৳14,253,734",
                GrantsWaived = "৳3,200,000",

                // 500 Crore Development Fund (Collect Funding & Expense Funding)
                CollectFunding = "৳500 Crore",
                ExpenseFunding = "৳340 Crore",
                CollectFundingRaw = 5000000000,
                ExpenseFundingRaw = 3400000000,
                DevelopmentFundNotice = "৳500 Crore School & College Infrastructure & Digital Development Grant",

                MonthlyTrends = new List<MonthlyTrendPoint>
                {
                    new MonthlyTrendPoint { Month = "Jan", Income = 1850000, Expense = 1200000, PriorYearIncome = 1517000 },
                    new MonthlyTrendPoint { Month = "Feb", Income = 2100000, Expense = 1350000, PriorYearIncome = 1722000 },
                    new MonthlyTrendPoint { Month = "Mar", Income = 2400000, Expense = 1500000, PriorYearIncome = 1968000 },
                    new MonthlyTrendPoint { Month = "Apr", Income = 2200000, Expense = 1400000, PriorYearIncome = 1804000 },
                    new MonthlyTrendPoint { Month = "May", Income = 2650000, Expense = 1650000, PriorYearIncome = 2173000 },
                    new MonthlyTrendPoint { Month = "Jun", Income = 2800000, Expense = 1750000, PriorYearIncome = 2296000 },
                    new MonthlyTrendPoint { Month = "Jul", Income = 2500000, Expense = 1600000, PriorYearIncome = 2050000 },
                    new MonthlyTrendPoint { Month = "Aug", Income = 2900000, Expense = 1800000, PriorYearIncome = 2378000 },
                    new MonthlyTrendPoint { Month = "Sep", Income = 3100000, Expense = 1950000, PriorYearIncome = 2542000 },
                    new MonthlyTrendPoint { Month = "Oct", Income = 2950000, Expense = 1850000, PriorYearIncome = 2419000 },
                    new MonthlyTrendPoint { Month = "Nov", Income = 3200000, Expense = 2000000, PriorYearIncome = 2624000 },
                    new MonthlyTrendPoint { Month = "Dec", Income = 3450000, Expense = 2100000, PriorYearIncome = 2829000 }
                }
            };

            return Ok(new
            {
                summary,
                historicTimeline2025To2026 = summary.MonthlyTrends
            });
        }
    }
}
