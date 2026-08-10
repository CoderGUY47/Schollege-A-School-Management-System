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
    public class ClassesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ClassesController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetClasses()
        {
            var classes = await _db.Classes
                .Include(c => c.Subjects)
                .Include(c => c.Enrollments)
                .ToListAsync();
            return Ok(classes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetClassById(string id)
        {
            var cls = await _db.Classes
                .Include(c => c.Subjects)
                .Include(c => c.Enrollments)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cls == null) return NotFound(new { error = "Class not found" });
            return Ok(cls);
        }

        public record CreateClassDto(string Code, string Name, string? Description);

        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CreateClass([FromBody] CreateClassDto dto)
        {
            if (await _db.Classes.AnyAsync(c => c.Code == dto.Code))
            {
                return BadRequest(new { error = $"Class code {dto.Code} already exists." });
            }

            var newClass = new ClassCourse
            {
                Code = dto.Code,
                Name = dto.Name,
                Description = dto.Description
            };

            _db.Classes.Add(newClass);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetClassById), new { id = newClass.Id }, newClass);
        }

        public record UpdateClassDto(string Code, string Name, string? Description);

        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateClass(string id, [FromBody] UpdateClassDto dto)
        {
            var cls = await _db.Classes.FindAsync(id);
            if (cls == null) return NotFound(new { error = "Class not found" });

            cls.Code = dto.Code;
            cls.Name = dto.Name;
            cls.Description = dto.Description;

            await _db.SaveChangesAsync();
            return Ok(cls);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteClass(string id)
        {
            var cls = await _db.Classes.FindAsync(id);
            if (cls == null) return NotFound(new { error = "Class not found" });

            _db.Classes.Remove(cls);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Class deleted successfully" });
        }
    }
}

