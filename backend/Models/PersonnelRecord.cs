using System;

namespace SchollegeMS.Backend.Models
{
    public class PersonnelRecord
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Gender { get; set; } = "Male"; // Male, Female
        public string Role { get; set; } = "Teacher"; // Teacher, Finance, Examiner
        public string RoleBadge { get; set; } = "Faculty Teacher"; // Faculty Teacher, Accounts & Finance, Examiner
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public string Status { get; set; } = "Active";
    }
}
