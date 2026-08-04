using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchollegeMS.Backend.Data;

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
                .Select(u => new { u.Id, u.Name, u.Email, u.Role, u.CreatedAt })
                .ToListAsync();
            return Ok(users);
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
    }
}
