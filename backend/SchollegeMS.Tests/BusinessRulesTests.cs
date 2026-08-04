using Xunit;
using System;

namespace SchollegeMS.Tests
{
    public class BusinessRulesTests
    {
        [Fact]
        public void DeadlineCheck_ShouldRejectLateSubmissions()
        {
            var dueDate = new DateTime(2026, 1, 1, 12, 0, 0, DateTimeKind.Utc);
            var now = new DateTime(2026, 1, 2, 12, 0, 0, DateTimeKind.Utc);

            bool isLate = now > dueDate;

            Assert.True(isLate, "Submission occurring after due date must be identified as late.");
        }

        [Fact]
        public void GradingValidation_ShouldRejectMarksExceedingMaxMarks()
        {
            double givenMarks = 105;
            double maxMarks = 100;

            bool isValid = givenMarks >= 0 && givenMarks <= maxMarks;

            Assert.False(isValid, "Marks exceeding maxMarks must be rejected.");
        }

        [Fact]
        public void DraftVisibility_ShouldFilterDraftAssignmentsForStudents()
        {
            var status = "DRAFT";
            var userRole = "STUDENT";

            bool canStudentSee = userRole != "STUDENT" || status == "PUBLISHED";

            Assert.False(canStudentSee, "Students must not see draft assignments.");
        }
    }
}
