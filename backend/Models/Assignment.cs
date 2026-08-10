using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchollegeMS.Backend.Models
{
    public class Assignment
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public int MaxMarks { get; set; } = 100;

        public DateTime Deadline { get; set; }

        // Alias kept for backward compat
        [NotMapped]
        public DateTime DueDate { get => Deadline; set => Deadline = value; }

        public string Status { get; set; } = "DRAFT"; // DRAFT, PUBLISHED

        public bool AllowResubmission { get; set; } = false;

        [Required]
        public string ClassId { get; set; } = string.Empty;
        [ForeignKey("ClassId")]
        public ClassCourse? Class { get; set; }

        [Required]
        public string SubjectId { get; set; } = string.Empty;
        [ForeignKey("SubjectId")]
        public Subject? Subject { get; set; }

        [Required]
        public string TeacherId { get; set; } = string.Empty;
        [ForeignKey("TeacherId")]
        public User? Teacher { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    }
}
