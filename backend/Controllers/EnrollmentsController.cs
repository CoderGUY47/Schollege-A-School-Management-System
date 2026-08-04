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
    public class EnrollmentsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public EnrollmentsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetEnrollments()
        {
            var enrollments = await _db.Enrollments
                .Include(e => e.Student)
                .Include(e => e.Class)
                .ToListAsync();
            return Ok(enrollments);
        }

        public record CreateEnrollmentDto(string StudentId, string ClassId);

        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> EnrollStudent([FromBody] CreateEnrollmentDto dto)
        {
            if (await _db.Enrollments.AnyAsync(e => e.StudentId == dto.StudentId && e.ClassId == dto.ClassId))
            {
                return BadRequest(new { error = "Student is already enrolled in this class." });
            }

            var enrollment = new Enrollment
            {
                StudentId = dto.StudentId,
                ClassId = dto.ClassId
            };

            _db.Enrollments.Add(enrollment);
            await _db.SaveChangesAsync();
            return Ok(enrollment);
        }
    }
}
