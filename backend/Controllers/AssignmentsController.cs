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
    public class AssignmentsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AssignmentsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAssignments()
        {
            var userRole = User.FindFirstValue(ClaimTypes.Role) ?? "STUDENT";
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

            IQueryable<Assignment> query = _db.Assignments
                .Include(a => a.Class)
                .Include(a => a.Subject)
                .Include(a => a.Teacher);

            if (userRole == "STUDENT")
            {
                var enrolledClassIds = await _db.Enrollments
                    .Where(e => e.StudentId == userId)
                    .Select(e => e.ClassId)
                    .ToListAsync();

                query = query.Where(a => a.Status == "PUBLISHED" && enrolledClassIds.Contains(a.ClassId));
            }
            else if (userRole == "TEACHER")
            {
                query = query.Where(a => a.TeacherId == userId || a.Subject!.TeacherId == userId);
            }

            var assignments = await query.OrderBy(a => a.Deadline).ToListAsync();
            return Ok(assignments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAssignmentById(string id)
        {
            var userRole = User.FindFirstValue(ClaimTypes.Role) ?? "STUDENT";
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

            var assignment = await _db.Assignments
                .Include(a => a.Class)
                .Include(a => a.Subject)
                .Include(a => a.Teacher)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (assignment == null) return NotFound(new { error = "Assignment not found." });

            if (userRole == "STUDENT")
            {
                if (assignment.Status != "PUBLISHED")
                    return Forbid();

                var isEnrolled = await _db.Enrollments.AnyAsync(e => e.StudentId == userId && e.ClassId == assignment.ClassId);
                if (!isEnrolled) return Forbid();
            }
            else if (userRole == "TEACHER" && assignment.TeacherId != userId && assignment.Subject?.TeacherId != userId)
            {
                return Forbid();
            }

            return Ok(assignment);
        }

        public record CreateAssignmentDto(
            string Title, 
            string Description, 
            int MaxMarks, 
            DateTime DueDate, 
            string Status, 
            string ClassId, 
            string SubjectId, 
            bool AllowResubmission = false);

        [HttpPost]
        [Authorize(Roles = "TEACHER,ADMIN")]
        public async Task<IActionResult> CreateAssignment([FromBody] CreateAssignmentDto dto)
        {
            var teacherId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

            var assignment = new Assignment
            {
                Title = dto.Title,
                Description = dto.Description,
                MaxMarks = dto.MaxMarks,
                Deadline = dto.DueDate,
                Status = string.IsNullOrEmpty(dto.Status) ? "DRAFT" : dto.Status.ToUpper(),
                AllowResubmission = dto.AllowResubmission,
                ClassId = dto.ClassId,
                SubjectId = dto.SubjectId,
                TeacherId = teacherId
            };

            _db.Assignments.Add(assignment);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAssignmentById), new { id = assignment.Id }, assignment);
        }

        public record UpdateAssignmentDto(
            string Title, 
            string Description, 
            int MaxMarks, 
            DateTime DueDate, 
            string Status, 
            string ClassId, 
            string SubjectId, 
            bool AllowResubmission);

        [HttpPut("{id}")]
        [Authorize(Roles = "TEACHER,ADMIN")]
        public async Task<IActionResult> UpdateAssignment(string id, [FromBody] UpdateAssignmentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";
            var userRole = User.FindFirstValue(ClaimTypes.Role) ?? "";

            var assignment = await _db.Assignments.FindAsync(id);
            if (assignment == null) return NotFound(new { error = "Assignment not found." });

            if (userRole == "TEACHER" && assignment.TeacherId != userId)
            {
                return Forbid();
            }

            assignment.Title = dto.Title;
            assignment.Description = dto.Description;
            assignment.MaxMarks = dto.MaxMarks;
            assignment.Deadline = dto.DueDate;
            assignment.Status = dto.Status.ToUpper();
            assignment.AllowResubmission = dto.AllowResubmission;
            assignment.ClassId = dto.ClassId;
            assignment.SubjectId = dto.SubjectId;

            await _db.SaveChangesAsync();
            return Ok(assignment);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "TEACHER,ADMIN")]
        public async Task<IActionResult> DeleteAssignment(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";
            var userRole = User.FindFirstValue(ClaimTypes.Role) ?? "";

            var assignment = await _db.Assignments.FindAsync(id);
            if (assignment == null) return NotFound(new { error = "Assignment not found." });

            if (userRole == "TEACHER" && assignment.TeacherId != userId)
            {
                return Forbid();
            }

            _db.Assignments.Remove(assignment);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Assignment deleted successfully." });
        }

        public record UpdateStatusDto(string Status);

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "TEACHER,ADMIN")]
        public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateStatusDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";
            var userRole = User.FindFirstValue(ClaimTypes.Role) ?? "";

            var assignment = await _db.Assignments.FindAsync(id);
            if (assignment == null) return NotFound(new { error = "Assignment not found." });

            if (userRole == "TEACHER" && assignment.TeacherId != userId)
            {
                return Forbid();
            }

            assignment.Status = dto.Status.ToUpper();
            await _db.SaveChangesAsync();
            return Ok(assignment);
        }

        [HttpGet("{id}/submissions")]
        [Authorize(Roles = "TEACHER,ADMIN")]
        public async Task<IActionResult> GetSubmissionsForAssignment(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";
            var userRole = User.FindFirstValue(ClaimTypes.Role) ?? "";

            var assignment = await _db.Assignments.FindAsync(id);
            if (assignment == null) return NotFound(new { error = "Assignment not found." });

            if (userRole == "TEACHER" && assignment.TeacherId != userId)
            {
                return Forbid();
            }

            var submissions = await _db.Submissions
                .Include(s => s.Student)
                .Where(s => s.AssignmentId == id)
                .OrderByDescending(s => s.SubmittedAt)
                .ToListAsync();

            return Ok(submissions);
        }
    }
}

