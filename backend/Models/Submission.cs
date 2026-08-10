using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchollegeMS.Backend.Models
{
    public class Submission
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string AssignmentId { get; set; } = string.Empty;
        [ForeignKey("AssignmentId")]
        public Assignment? Assignment { get; set; }

        [Required]
        public string StudentId { get; set; } = string.Empty;
        [ForeignKey("StudentId")]
        public User? Student { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public string? FileUrl { get; set; }

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public string Status { get; set; } = "SUBMITTED"; // SUBMITTED, GRADED, RESUBMITTED

        public double? Marks { get; set; }

        public string? Feedback { get; set; }

        public DateTime? GradedAt { get; set; }

        public string? GradedById { get; set; }
        [ForeignKey("GradedById")]
        public User? GradedBy { get; set; }
    }
}
