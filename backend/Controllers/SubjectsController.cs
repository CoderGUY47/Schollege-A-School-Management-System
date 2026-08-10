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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubjectById(string id)
        {
            var subject = await _db.Subjects
                .Include(s => s.Class)
                .Include(s => s.Teacher)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (subject == null) return NotFound(new { error = "Subject not found" });
            return Ok(subject);
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
            return CreatedAtAction(nameof(GetSubjectById), new { id = subject.Id }, subject);
        }

        public record UpdateSubjectDto(string Code, string Name, string ClassId, string? TeacherId, string? Description);

        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateSubject(string id, [FromBody] UpdateSubjectDto dto)
        {
            var subject = await _db.Subjects.FindAsync(id);
            if (subject == null) return NotFound(new { error = "Subject not found" });

            subject.Code = dto.Code;
            subject.Name = dto.Name;
            subject.ClassId = dto.ClassId;
            subject.TeacherId = dto.TeacherId;
            subject.Description = dto.Description;

            await _db.SaveChangesAsync();
            return Ok(subject);
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

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteSubject(string id)
        {
            var subject = await _db.Subjects.FindAsync(id);
            if (subject == null) return NotFound(new { error = "Subject not found" });

            _db.Subjects.Remove(subject);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Subject deleted successfully" });
        }
    }
}

