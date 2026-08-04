using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchollegeMS.Backend.Models
{
    public class Subject
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string Code { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public string ClassId { get; set; } = string.Empty;
        [ForeignKey("ClassId")]
        public ClassCourse? Class { get; set; }

        public string? TeacherId { get; set; }
        [ForeignKey("TeacherId")]
        public User? Teacher { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    }
}
