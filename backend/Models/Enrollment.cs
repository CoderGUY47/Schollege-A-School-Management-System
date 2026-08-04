using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchollegeMS.Backend.Models
{
    public class Enrollment
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string StudentId { get; set; } = string.Empty;
        [ForeignKey("StudentId")]
        public User? Student { get; set; }

        [Required]
        public string ClassId { get; set; } = string.Empty;
        [ForeignKey("ClassId")]
        public ClassCourse? Class { get; set; }

        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
    }
}
