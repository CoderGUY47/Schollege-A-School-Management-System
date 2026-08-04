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

            var assignments = await query.OrderBy(a => a.DueDate).ToListAsync();
            return Ok(assignments);
        }

        public record CreateAssignmentDto(string Title, string Description, int MaxMarks, DateTime DueDate, string Status, string ClassId, string SubjectId);

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
                DueDate = dto.DueDate,
                Status = string.IsNullOrEmpty(dto.Status) ? "DRAFT" : dto.Status.ToUpper(),
                ClassId = dto.ClassId,
                SubjectId = dto.SubjectId,
                TeacherId = teacherId
            };

            _db.Assignments.Add(assignment);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAssignments), new { id = assignment.Id }, assignment);
        }

        public record UpdateStatusDto(string Status);

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "TEACHER,ADMIN")]
        public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateStatusDto dto)
        {
            var assignment = await _db.Assignments.FindAsync(id);
            if (assignment == null) return NotFound();

            assignment.Status = dto.Status.ToUpper();
            await _db.SaveChangesAsync();
            return Ok(assignment);
        }
    }
}
