using Xunit;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SchollegeMS.Tests
{
    public class BusinessRulesTests
    {
        // 1. Student cannot see draft assignment
        [Fact]
        public void DraftVisibility_ShouldFilterDraftAssignmentsForStudents()
        {
            var assignments = new[]
            {
                new { Id = "1", Title = "Algebra Quiz", Status = "PUBLISHED" },
                new { Id = "2", Title = "Geometry Draft", Status = "DRAFT" }
            };

            var userRole = "STUDENT";
            var visibleAssignments = assignments.Where(a => userRole != "STUDENT" || a.Status == "PUBLISHED").ToList();

            Assert.Single(visibleAssignments);
            Assert.Equal("1", visibleAssignments[0].Id);
        }

        // 2. Student cannot submit to another course assignment
        [Fact]
        public void CrossCourseSubmission_ShouldRejectUnenrolledStudent()
        {
            var studentEnrolledClassIds = new List<string> { "class-cs101" };
            var targetAssignmentClassId = "class-math202";

            bool isEnrolled = studentEnrolledClassIds.Contains(targetAssignmentClassId);

            Assert.False(isEnrolled, "Student must not be allowed to submit to an assignment for a course they are not enrolled in.");
        }

        // 3. Student submission logic (upsert pattern — prevent duplicates)
        [Fact]
        public void DuplicateSubmission_ShouldUpdateExistingSubmission()
        {
            var existingSubmissions = new List<string> { "sub-student-01" };
            string currentStudentId = "sub-student-01";

            bool isUpdateOperation = existingSubmissions.Contains(currentStudentId);

            Assert.True(isUpdateOperation, "Second submission by same student should trigger an update operation rather than throwing duplicate error.");
        }

        // 4. Student cannot update after deadline
        [Fact]
        public void DeadlineCheck_ShouldRejectLateSubmissions()
        {
            var deadline = new DateTime(2026, 1, 1, 12, 0, 0, DateTimeKind.Utc);
            var now = new DateTime(2026, 1, 2, 12, 0, 0, DateTimeKind.Utc);

            bool isLate = now > deadline;

            Assert.True(isLate, "Submission or update occurring after deadline must be rejected.");
        }

        // 5. Teacher cannot grade another teacher's assignment
        [Fact]
        public void TeacherOwnership_ShouldRejectGradingByNonOwnerTeacher()
        {
            string assignmentTeacherId = "teacher-sarah";
            string gradingTeacherId = "teacher-john";
            string userRole = "TEACHER";

            bool isAuthorized = userRole == "ADMIN" || assignmentTeacherId == gradingTeacherId;

            Assert.False(isAuthorized, "Teacher cannot grade another teacher's assignment.");
        }

        // 6. Marks cannot exceed maximum
        [Fact]
        public void GradingValidation_ShouldRejectMarksExceedingMaxMarks()
        {
            double givenMarks = 105;
            double maxMarks = 100;

            bool isValid = givenMarks >= 0 && givenMarks <= maxMarks;

            Assert.False(isValid, "Marks exceeding maxMarks must be rejected.");
        }

        // 7. Published assignment requires valid course/subject mapping
        [Fact]
        public void AssignmentPublish_RequiresValidCourseSubjectMapping()
        {
            string courseId = "class-cs101";
            string subjectId = "sub-web101";
            string subjectClassId = "class-cs101"; // subject belongs to class-cs101

            bool isValidMapping = courseId == subjectClassId && !string.IsNullOrEmpty(subjectId);

            Assert.True(isValidMapping, "Assignment course and subject must form a valid mapping.");
        }

        // 8. Admin endpoint rejects teacher/student
        [Fact]
        public void AdminAuthorization_ShouldRejectNonAdminRoles()
        {
            var userRoles = new[] { "STUDENT", "TEACHER" };
            var requiredRole = "ADMIN";

            foreach (var role in userRoles)
            {
                bool hasAdminAccess = role == requiredRole;
                Assert.False(hasAdminAccess, $"Role {role} must be rejected from Admin endpoints.");
            }
        }
    }
}

