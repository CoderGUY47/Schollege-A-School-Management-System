using Microsoft.EntityFrameworkCore;
using SchollegeMS.Backend.Models;
using BCrypt.Net;
using System;

namespace SchollegeMS.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<ClassCourse> Classes => Set<ClassCourse>();
        public DbSet<Subject> Subjects => Set<Subject>();
        public DbSet<Enrollment> Enrollments => Set<Enrollment>();
        public DbSet<Assignment> Assignments => Set<Assignment>();
        public DbSet<Submission> Submissions => Set<Submission>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Composite Unique Constraints
            modelBuilder.Entity<Enrollment>()
                .HasIndex(e => new { e.StudentId, e.ClassId })
                .IsUnique();

            modelBuilder.Entity<Submission>()
                .HasIndex(s => new { s.AssignmentId, s.StudentId })
                .IsUnique();

            // ── Seed Demo Data (per OnnoRokom assignment brief) ──────────────────
            var adminId   = "user-admin-01";
            var teacherId = "user-teacher-01";
            var studentId = "user-student-01";

            var adminHash   = BCrypt.Net.BCrypt.HashPassword("Admin123!");
            var teacherHash = BCrypt.Net.BCrypt.HashPassword("Teacher123!");
            var studentHash = BCrypt.Net.BCrypt.HashPassword("Student123!");

            var csClassId = "class-cs101";
            var webSubId  = "sub-web101";

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = adminId, Name = "System Administrator",
                    Email = "admin@demo.com", PasswordHash = adminHash,
                    Role = "ADMIN"
                },
                new User
                {
                    Id = teacherId, Name = "Prof. Sarah Jenkins",
                    Email = "teacher@demo.com", PasswordHash = teacherHash,
                    Role = "TEACHER"
                },
                new User
                {
                    Id = studentId, Name = "Aria Rahman",
                    Email = "student@demo.com", PasswordHash = studentHash,
                    Role = "STUDENT", CourseId = csClassId
                }
            );

            modelBuilder.Entity<ClassCourse>().HasData(
                new ClassCourse
                {
                    Id = csClassId, Code = "CLASS-10-SCI",
                    Name = "Class 10 — Science",
                    Description = "Secondary Science curriculum"
                }
            );

            modelBuilder.Entity<Subject>().HasData(
                new Subject
                {
                    Id = webSubId, Code = "MATH-101",
                    Name = "Mathematics", ClassId = csClassId,
                    TeacherId = teacherId
                }
            );

            modelBuilder.Entity<Enrollment>().HasData(
                new Enrollment { Id = "en-01", StudentId = studentId, ClassId = csClassId }
            );

            // Seed a published assignment so evaluator can test the full workflow
            var assignmentDeadline = new DateTime(2026, 8, 14, 23, 59, 59, DateTimeKind.Utc);
            modelBuilder.Entity<Assignment>().HasData(
                new Assignment
                {
                    Id              = "asg-seed-01",
                    Title           = "Algebra Practice",
                    Description     = "Complete problems 1–20 from Chapter 5 on linear equations and inequalities. Show all working steps.",
                    Deadline        = assignmentDeadline,
                    MaxMarks        = 20,
                    Status          = "PUBLISHED",
                    AllowResubmission = true,
                    ClassId         = csClassId,
                    SubjectId       = webSubId,
                    TeacherId       = teacherId,
                    CreatedAt       = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }

