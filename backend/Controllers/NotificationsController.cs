using Microsoft.AspNetCore.Mvc;
using SchollegeMS.Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SchollegeMS.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private static readonly List<NotificationItem> Notifications = new()
        {
            new NotificationItem
            {
                Id = "notif-001",
                Type = "EXAM",
                Title = "Final Exam Schedule Published",
                Message = "HSC Final Examination timetable for 2026 has been approved and published. 342 students registered.",
                Timestamp = DateTime.UtcNow.AddMinutes(-5),
                IsRead = false,
                Priority = "URGENT",
                ActionUrl = "/admin/calendar"
            },
            new NotificationItem
            {
                Id = "notif-002",
                Type = "FINANCE",
                Title = "Monthly Fee Collection Report",
                Message = "July 2026 fee collection completed. 4,82,500 BDT collected from 193 students. 12 payments pending.",
                Timestamp = DateTime.UtcNow.AddMinutes(-22),
                IsRead = false,
                Priority = "HIGH",
                ActionUrl = "/admin/finance"
            },
            new NotificationItem
            {
                Id = "notif-003",
                Type = "STUDENT",
                Title = "New Admission Request",
                Message = "Farhan Hossain (Class XI, Science) submitted admission form. Documents under verification.",
                Timestamp = DateTime.UtcNow.AddMinutes(-45),
                IsRead = false,
                Priority = "MEDIUM",
                ActionUrl = "/admin/students",
                ActorName = "Farhan Hossain",
                Avatar = "https://i.pravatar.cc/40?img=12"
            },
            new NotificationItem
            {
                Id = "notif-004",
                Type = "TEACHER",
                Title = "Leave Request Pending",
                Message = "Prof. Ayesha Sultana (Physics) submitted a medical leave request for Aug 8-12, 2026.",
                Timestamp = DateTime.UtcNow.AddMinutes(-90),
                IsRead = false,
                Priority = "MEDIUM",
                ActionUrl = "/admin/teachers",
                ActorName = "Prof. Ayesha Sultana",
                Avatar = "https://i.pravatar.cc/40?img=5"
            },
            new NotificationItem
            {
                Id = "notif-005",
                Type = "NOTICE",
                Title = "Notice Board Updated",
                Message = "Annual Sports Day notice has been posted. Event scheduled for August 20, 2026.",
                Timestamp = DateTime.UtcNow.AddMinutes(-132),
                IsRead = true,
                Priority = "LOW",
                ActionUrl = "/admin/notice"
            }
        };

        [HttpGet]
        public IActionResult GetNotifications([FromQuery] bool unread = false, [FromQuery] int? limit = null)
        {
            var query = unread ? Notifications.Where(n => !n.IsRead) : Notifications;
            if (limit.HasValue) query = query.Take(limit.Value);

            var list = query.ToList();
            var unreadCount = Notifications.Count(n => !n.IsRead);

            return Ok(new
            {
                notifications = list,
                total = Notifications.Count,
                unreadCount
            });
        }

        public class MarkReadRequest
        {
            public string? Id { get; set; }
            public bool MarkAllRead { get; set; }
        }

        [HttpPatch]
        public IActionResult MarkAsRead([FromBody] MarkReadRequest request)
        {
            if (request.MarkAllRead)
            {
                foreach (var n in Notifications) n.IsRead = true;
                return Ok(new { success = true, message = "All notifications marked as read" });
            }

            if (!string.IsNullOrEmpty(request.Id))
            {
                var notif = Notifications.FirstOrDefault(n => n.Id == request.Id);
                if (notif != null)
                {
                    notif.IsRead = true;
                    return Ok(new { success = true, notification = notif });
                }
                return NotFound(new { success = false, error = "Notification not found" });
            }

            return BadRequest(new { success = false, error = "Invalid request" });
        }
    }
}
