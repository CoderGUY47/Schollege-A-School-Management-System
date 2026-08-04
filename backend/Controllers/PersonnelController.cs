using Microsoft.AspNetCore.Mvc;
using SchollegeMS.Backend.Models;
using System.Collections.Generic;
using System.Linq;

namespace SchollegeMS.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonnelController : ControllerBase
    {
        private static readonly List<PersonnelRecord> PersonnelDataset = GeneratePersonnelDataset();

        private static List<PersonnelRecord> GeneratePersonnelDataset()
        {
            var list = new List<PersonnelRecord>();

            // 1. Generate 76 Faculty Teachers
            for (int i = 1; i <= 76; i++)
            {
                bool isMale = (i % 2 != 0); // 44 Male, 32 Female
                list.Add(new PersonnelRecord
                {
                    Id = $"FAC-T{100 + i}",
                    Name = isMale ? $"Faculty Male Prof. {i}" : $"Faculty Female Dr. {i}",
                    Designation = i % 3 == 0 ? "Department Head" : (i % 2 == 0 ? "Associate Professor" : "Assistant Professor"),
                    Department = (i % 5) switch
                    {
                        0 => "Computer Science",
                        1 => "Software Engineering",
                        2 => "Electrical Engineering",
                        3 => "Mathematics & Physics",
                        _ => "Data Science & AI"
                    },
                    Gender = isMale ? "Male" : "Female",
                    Role = "Teacher",
                    RoleBadge = "Faculty Teacher",
                    Email = $"teacher{i}@edu.bd",
                    Phone = $"+880 1711-{100000 + i}",
                    Avatar = $"https://i.pravatar.cc/150?img={(i % 70) + 1}",
                    Status = "Active"
                });
            }

            // 2. Generate 17 Accounts & Finance Personnel (12 Male, 5 Female)
            for (int i = 1; i <= 17; i++)
            {
                bool isMale = i <= 12; // 12 Male, 5 Female
                list.Add(new PersonnelRecord
                {
                    Id = $"FIN-A{200 + i}",
                    Name = isMale ? $"Finance Male Officer {i}" : $"Finance Female Officer {i}",
                    Designation = i == 1 ? "Chief Accounts Officer" : (i <= 5 ? "Senior Financial Analyst" : "Accounts Executive"),
                    Department = "Accounts & Finance",
                    Gender = isMale ? "Male" : "Female",
                    Role = "Finance",
                    RoleBadge = "Accounts & Finance",
                    Email = $"finance{i}@edu.bd",
                    Phone = $"+880 1819-{200000 + i}",
                    Avatar = $"https://i.pravatar.cc/150?img={(i % 50) + 10}",
                    Status = "Active"
                });
            }

            // 3. Generate 10 Exam Officers (Faculty with Examiner Role)
            for (int i = 1; i <= 10; i++)
            {
                list.Add(new PersonnelRecord
                {
                    Id = $"EXM-E{300 + i}",
                    Name = $"Examiner Officer {i}",
                    Designation = "Senior Faculty Examiner",
                    Department = "Exam Controller Office",
                    Gender = i % 2 == 0 ? "Male" : "Female",
                    Role = "Examiner",
                    RoleBadge = "Examiner",
                    Email = $"examiner{i}@edu.bd",
                    Phone = $"+880 1912-{300000 + i}",
                    Avatar = $"https://i.pravatar.cc/150?img={(i % 40) + 20}",
                    Status = "Active"
                });
            }

            return list;
        }

        [HttpGet]
        public IActionResult GetPersonnel([FromQuery] string? role = null)
        {
            var result = string.IsNullOrEmpty(role) || role == "ALL"
                ? PersonnelDataset
                : PersonnelDataset.Where(p => p.Role.Equals(role, System.StringComparison.OrdinalIgnoreCase)).ToList();

            var counts = new
            {
                Total = PersonnelDataset.Count, // 103
                Teachers = PersonnelDataset.Count(p => p.Role == "Teacher"), // 76
                Finance = PersonnelDataset.Count(p => p.Role == "Finance"), // 17
                Examiners = PersonnelDataset.Count(p => p.Role == "Examiner") // 10
            };

            return Ok(new
            {
                personnel = result,
                counts
            });
        }
    }
}
