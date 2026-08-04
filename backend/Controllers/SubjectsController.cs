using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchollegeMS.Backend.Data;
using SchollegeMS.Backend.Models;

namespace SchollegeMS.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SubjectsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public SubjectsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetSubjects()
        {
            var subjects = await _db.Subjects
                .Include(s => s.Class)
                .Include(s => s.Teacher)
                .ToListAsync();
            return Ok(subjects);
        }

        public record CreateSubjectDto(string Code, string Name, string ClassId, string? TeacherId, string? Description);

        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CreateSubject([FromBody] CreateSubjectDto dto)
        {
            if (await _db.Subjects.AnyAsync(s => s.Code == dto.Code))
            {
                return BadRequest(new { error = $"Subject code {dto.Code} already exists" });
            }

            var subject = new Subject
            {
                Code = dto.Code,
                Name = dto.Name,
                ClassId = dto.ClassId,
                TeacherId = dto.TeacherId,
                Description = dto.Description
            };

            _db.Subjects.Add(subject);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSubjects), new { id = subject.Id }, subject);
        }

        public record AssignTeacherDto(string TeacherId);

        [HttpPatch("{id}/assign-teacher")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> AssignTeacher(string id, [FromBody] AssignTeacherDto dto)
        {
            var subject = await _db.Subjects.FindAsync(id);
            if (subject == null) return NotFound();

            subject.TeacherId = dto.TeacherId;
            await _db.SaveChangesAsync();
            return Ok(subject);
        }
    }
}
