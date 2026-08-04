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
            return CreatedAtAction(nameof(GetClasses), new { id = newClass.Id }, newClass);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteClass(string id)
        {
            var cls = await _db.Classes.FindAsync(id);
            if (cls == null) return NotFound();

            _db.Classes.Remove(cls);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Class deleted successfully" });
        }
    }
}
