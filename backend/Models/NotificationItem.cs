using System;

namespace SchollegeMS.Backend.Models
{
    public class NotificationItem
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = "SYSTEM"; // STUDENT, TEACHER, EXAM, FINANCE, SYSTEM, NOTICE, ASSIGNMENT
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;
        public string Priority { get; set; } = "MEDIUM"; // LOW, MEDIUM, HIGH, URGENT
        public string? ActionUrl { get; set; }
        public string? Avatar { get; set; }
        public string? ActorName { get; set; }
    }
}
