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

            // Seed Initial Demo Data
            var adminId = "user-admin-01";
            var teacherId = "user-teacher-01";
            var studentId = "user-student-01";

            var adminHash = BCrypt.Net.BCrypt.HashPassword("Admin123!");
            var teacherHash = BCrypt.Net.BCrypt.HashPassword("Teacher123!");
            var studentHash = BCrypt.Net.BCrypt.HashPassword("Student123!");

            modelBuilder.Entity<User>().HasData(
                new User { Id = adminId, Name = "System Administrator", Email = "admin@edu.bd", PasswordHash = adminHash, Role = "ADMIN" },
                new User { Id = teacherId, Name = "Prof. Sarah Jenkins", Email = "teacher@edu.bd", PasswordHash = teacherHash, Role = "TEACHER" },
                new User { Id = studentId, Name = "Aria Rahman", Email = "student@edu.bd", PasswordHash = studentHash, Role = "STUDENT" }
            );

            var csClassId = "class-cs101";
            modelBuilder.Entity<ClassCourse>().HasData(
                new ClassCourse { Id = csClassId, Code = "CS-101", Name = "Computer Science 101", Description = "Fundamentals of Programming and Web Development" }
            );

            var webSubId = "sub-web101";
            modelBuilder.Entity<Subject>().HasData(
                new Subject { Id = webSubId, Code = "CS101-WEB", Name = "Web Application Development", ClassId = csClassId, TeacherId = teacherId }
            );

            modelBuilder.Entity<Enrollment>().HasData(
                new Enrollment { Id = "en-01", StudentId = studentId, ClassId = csClassId }
            );
        }
    }
}
