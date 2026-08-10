using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchollegeMS.Backend.Data;
using SchollegeMS.Backend.Models;
using System.Security.Claims;

namespace SchollegeMS.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SubmissionsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public SubmissionsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetSubmissions()
        {
            var userRole = User.FindFirstValue(ClaimTypes.Role) ?? "STUDENT";
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

            IQueryable<Submission> query = _db.Submissions
                .Include(s => s.Student)
                .Include(s => s.Assignment);

            if (userRole == "STUDENT")
            {
                query = query.Where(s => s.StudentId == userId);
            }
            else if (userRole == "TEACHER")
            {
                query = query.Where(s => s.Assignment!.TeacherId == userId || s.Assignment!.Subject!.TeacherId == userId);
            }

            var submissions = await query.OrderByDescending(s => s.SubmittedAt).ToListAsync();
            return Ok(submissions);
        }

        public record CreateSubmissionDto(string AssignmentId, string Content, string? FileUrl);

        [HttpPost]
        [Authorize(Roles = "STUDENT")]
        public async Task<IActionResult> SubmitAnswer([FromBody] CreateSubmissionDto dto)
        {
            var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

            var assignment = await _db.Assignments.FindAsync(dto.AssignmentId);
            if (assignment == null) return NotFound(new { error = "Assignment not found." });

            if (assignment.Status != "PUBLISHED")
            {
                return BadRequest(new { error = "Cannot submit to a draft assignment." });
            }

            // Cross-Course Business Rule: Student must be enrolled in the assignment's class
            var isEnrolled = await _db.Enrollments.AnyAsync(e => e.StudentId == studentId && e.ClassId == assignment.ClassId);
            if (!isEnrolled)
            {
                return Forbid();
            }

            // Deadline Check Business Rule
            if (DateTime.UtcNow > assignment.Deadline)
            {
                return BadRequest(new { error = "Submission deadline has passed. Late submissions are not allowed." });
            }

            var submission = await _db.Submissions
                .FirstOrDefaultAsync(s => s.AssignmentId == dto.AssignmentId && s.StudentId == studentId);

            if (submission == null)
            {
                submission = new Submission
                {
                    AssignmentId = dto.AssignmentId,
                    StudentId = studentId,
                    Content = dto.Content,
                    FileUrl = dto.FileUrl,
                    SubmittedAt = DateTime.UtcNow,
                    Status = "SUBMITTED"
                };
                _db.Submissions.Add(submission);
            }
            else
            {
                submission.Content = dto.Content;
                submission.FileUrl = dto.FileUrl;
                submission.UpdatedAt = DateTime.UtcNow;
                submission.Status = "SUBMITTED";
            }

            await _db.SaveChangesAsync();
            return Ok(submission);
        }

        public record UpdateSubmissionDto(string Content, string? FileUrl);

        [HttpPut("{id}")]
        [Authorize(Roles = "STUDENT")]
        public async Task<IActionResult> UpdateSubmission(string id, [FromBody] UpdateSubmissionDto dto)
        {
            var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

            var submission = await _db.Submissions
                .Include(s => s.Assignment)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (submission == null) return NotFound(new { error = "Submission not found." });

            if (submission.StudentId != studentId)
            {
                return Forbid();
            }

            if (DateTime.UtcNow > submission.Assignment!.Deadline)
            {
                return BadRequest(new { error = "Submission deadline has passed. Late updates are not allowed." });
            }

            submission.Content = dto.Content;
            submission.FileUrl = dto.FileUrl;
            submission.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(submission);
        }

        public record GradeSubmissionDto(double Marks, string? Feedback);

        [HttpPost("{id}/grade")]
        [HttpPatch("{id}/grade")]
        [Authorize(Roles = "TEACHER,ADMIN")]
        public async Task<IActionResult> GradeSubmission(string id, [FromBody] GradeSubmissionDto dto)
        {
            var teacherId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";
            var userRole = User.FindFirstValue(ClaimTypes.Role) ?? "";

            var submission = await _db.Submissions
                .Include(s => s.Assignment)
                .ThenInclude(a => a!.Subject)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (submission == null) return NotFound(new { error = "Submission not found." });

            // Teacher Ownership Rule: Only the assigning teacher or subject teacher can grade
            if (userRole == "TEACHER")
            {
                bool isOwner = submission.Assignment!.TeacherId == teacherId ||
                               (submission.Assignment.Subject != null && submission.Assignment.Subject.TeacherId == teacherId);
                if (!isOwner)
                {
                    return Forbid();
                }
            }

            // MaxMarks Boundary Validation Rule
            if (dto.Marks < 0 || dto.Marks > submission.Assignment!.MaxMarks)
            {
                return BadRequest(new { error = $"Marks ({dto.Marks}) must be between 0 and maximum marks ({submission.Assignment.MaxMarks})." });
            }

            submission.Marks = dto.Marks;
            submission.Feedback = dto.Feedback;
            submission.Status = "GRADED";
            submission.GradedAt = DateTime.UtcNow;
            submission.GradedById = teacherId;

            await _db.SaveChangesAsync();
            return Ok(submission);
        }
    }
}

