using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SchollegeMS.Backend.Models
{
    public class User
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = "STUDENT"; // ADMIN, TEACHER, STUDENT

        /// <summary>For students: the course/class they belong to. Null for Admin/Teacher.</summary>
        public string? CourseId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public ICollection<Subject> TeachingSubjects { get; set; } = new List<Subject>();
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        public ICollection<Assignment> CreatedAssignments { get; set; } = new List<Assignment>();
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    }
}
