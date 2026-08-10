using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchollegeMS.Backend.Data;
using SchollegeMS.Backend.Models;

namespace SchollegeMS.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "ADMIN")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public UsersController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _db.Users
                .Select(u => new { u.Id, u.Name, u.Email, u.Role, u.CourseId, u.CreatedAt })
                .ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound(new { error = "User not found" });
            return Ok(new { user.Id, user.Name, user.Email, user.Role, user.CourseId, user.CreatedAt });
        }

        public record CreateUserRequest(string Name, string Email, string Password, string Role, string? CourseId);

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest(new { error = "Email address is already registered." });
            }

            var hash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = hash,
                Role = string.IsNullOrEmpty(dto.Role) ? "STUDENT" : dto.Role.ToUpper(),
                CourseId = dto.CourseId
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, new { user.Id, user.Name, user.Email, user.Role, user.CourseId });
        }

        public record UpdateUserRequest(string Name, string Email, string Role, string? CourseId);

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserRequest dto)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound(new { error = "User not found" });

            user.Name = dto.Name;
            user.Email = dto.Email;
            user.Role = dto.Role.ToUpper();
            user.CourseId = dto.CourseId;

            await _db.SaveChangesAsync();
            return Ok(new { user.Id, user.Name, user.Email, user.Role, user.CourseId });
        }

        public record UpdateRoleDto(string Role);

        [HttpPatch("{id}/role")]
        public async Task<IActionResult> UpdateRole(string id, [FromBody] UpdateRoleDto dto)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound(new { error = "User not found" });

            user.Role = dto.Role.ToUpper();
            await _db.SaveChangesAsync();
            return Ok(new { user.Id, user.Name, user.Email, user.Role });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound(new { error = "User not found" });

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return Ok(new { message = "User deleted successfully." });
        }
    }
}

