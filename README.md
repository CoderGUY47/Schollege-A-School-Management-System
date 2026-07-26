# Schollege MS — School & College Management System

> 🔗 **Repository**: [github.com/CoderGUY47/Schollege-A-School-Management-System](https://github.com/CoderGUY47/Schollege-A-School-Management-System)

---

## 💡 Vision

> _"Every student deserves to walk into university life without fear."_

Many school and college students feel anxious and lost when they first encounter a university portal — the dashboards, the role-based systems, the course management interfaces all feel unfamiliar and overwhelming.

**Schollege MS was built to change that.**

The goal is to expose students early to the exact kind of UI and workflow they will face in real university portals — role-based access control (RBAC), course management, assignment submission, grade tracking, and admin systems — so that by the time they step into university, the technology feels **second nature, not a barrier**.

---

## 🚀 Project Spotlight

**Schollege MS** is an enterprise-grade, full-stack School & College Management and Academic Platform designed for educational institutions. It delivers a role-based portal for **Administrators**, **Teachers**, and **Students**, streamlining academic operations — including course enrollments, digital student ID generation, assignment publishing workflows, automated deadline locking, submission grading, fee tracking, and real-time campus notifications.

---

### 🛠️ Technologies & Platforms Used

| Layer               | Stack                                                                                             |
| :------------------ | :------------------------------------------------------------------------------------------------ |
| **Frontend**        | Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS v4, Styled-Components, Recharts      |
| **Backend / API**   | ASP.NET Core 8 Web API (C#) + Next.js Server Route Handlers, OpenAPI / Swagger (`/api/docs`)      |
| **Database & ORM**  | PostgreSQL (Supabase) / SQLite (local fallback) via Prisma ORM & EF Core 8                        |
| **Auth & Security** | Better-Auth — OAuth 2.0 (Google), BCrypt password hashing, session management, 1-click demo login |
| **Testing**         | Vitest (RBAC guards, deadline locking, grading bounds) + xUnit (C# backend API tests)             |

---

### 👨‍💻 What Was Personally Built

- **End-to-End Multi-Role Architecture** — Designed and implemented RBAC matrix for Admin, Teacher, and Student roles with protected middleware routing.
- **Student & Digital ID Generator** — Interactive student portal with dynamic SVG avatar cycling, digital ID card ticket canvas, QR code generation, GPA analytics, and attendance.
- **Assignment & Grading Engine** — Teacher workflow for create/draft/publish/evaluate submissions with strict mark validation (`0 ≤ marks ≤ maxMarks`) and constructive feedback.
- **Role-Filtered Notification System** — Real-time notification engine with priority indicators, unread badges, and bulk "mark as read" actions.
- **Strict Backend Data Primacy Architecture** — Clean separation where the frontend is a pure UI layer powered by RESTful API endpoints (`/api/students`, `/api/notifications`, `/api/assignments`).

---

### 🧩 Technical Challenges & Problems Solved

- **Cross-Navigation Identity Sync** — Fixed session hydration edge-cases that caused fallback user state mismatches across nested dashboard views (e.g., Notice Board → Profile). Enforced session sanitization and backend email alias resolution.
- **Automated Deadline Locking** — Server-side timestamp validation that auto-locks student submission editing once the assignment due date passes.
- **Database Agnosticism** — Standardized Prisma ORM and EF Core migrations to switch seamlessly between cloud PostgreSQL (Supabase) and zero-config SQLite for local development.

---

### ✅ Project Status

**Fully functional & evaluator-ready** — Includes 1-Click Demo Logins for instant role testing.

| Role           | Email            | Password      |
| :------------- | :--------------- | :------------ |
| 👑 **Admin**   | `admin@edu.bd`   | `Admin123!`   |
| 👨‍🏫 **Teacher** | `teacher@edu.bd` | `Teacher123!` |
| 🎓 **Student** | `student@edu.bd` | `Student123!` |

---

## 📋 Full Documentation

## 🌟 Demo Credentials

Quick 1-Click login buttons are available on the sign-in page for immediate evaluator testing:

| Role           | Email Address    | Password      | Privileges                                                                                            |
| :------------- | :--------------- | :------------ | :---------------------------------------------------------------------------------------------------- |
| 👑 **Admin**   | `admin@edu.bd`   | `Admin123!`   | Manage Users, Roles, Classes, Subjects, Teacher Assignments, & Enrollments                            |
| 👨‍🏫 **Teacher** | `teacher@edu.bd` | `Teacher123!` | Create/Edit Assignments, Draft/Publish Toggles, Review Submissions, & Grade with Feedback             |
| 🎓 **Student** | `student@edu.bd` | `Student123!` | View Enrolled Assignments, Submit Answers & Repo Links, Edit Submissions Before Deadline, View Grades |

---

## 🎯 Features & Role Matrix

### 1. 🛡️ Admin Role

- **User & Role Management**: View all registered accounts, change user roles (`ADMIN`, `TEACHER`, `STUDENT`).
- **Class / Course Setup**: Create classes (e.g. `CS-101`, `MATH-201`) with code and description.
- **Subject & Teacher Assignment**: Create subjects within classes and assign designated teachers.
- **Student Enrollment**: Enroll students into specific classes.
- **System**: Monitor total users, active classes, subjects, assignments, and submission count.

### 2. 👨‍🏫 Teacher Role

- **Assignment Management**: Create, edit, and delete assignments with title, description, max marks, and due date.
- **Publishing Workflow**: Toggle assignment status between `DRAFT` (hidden from students) and `PUBLISHED` (visible to enrolled students).
- **Submissions Review Desk**: Inspect student submitted text and attachment links.
- **Grading & Feedback Engine**: Input numerical marks (validated strictly against `0 <= marks <= maxMarks`), write constructive feedback, and mark status as `GRADED`.

### 3. 🎓 Student Role

- **Enrolled Coursework Feed**: View published assignments for classes the student is enrolled in.
- **Deadline Indicators**: Real-time status badges (`PENDING`, `SUBMITTED`, `GRADED`, `OVERDUE`).
- **Answer Submission**: Submit text solutions and attachment links (e.g. GitHub repositories or Cloud links).
- **Submission Editing**: Edit answer before the due date deadline. Post-deadline editing is automatically locked.
- **Report & Feedback View**: View assigned marks, grade percentages, and teacher comments.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons, React Hook Form.
- **Backend / REST API**: Next.js Server Route Handlers, TypeScript, OpenAPI / Swagger UI (`/api/docs`).
- **Database & ORM**: PostgreSQL (Supabase Compatible) / SQLite (Zero-config local fallback) via Prisma ORM.
- **Authentication**: **Better-Auth** supporting Email/Password, Google OAuth2, and instant 1-Click Demo Login.
- **Testing**: Vitest with `jsdom` testing business logic, deadline lock rules, grading bounds, and RBAC guards.

---

## 📁 Project Structure

```
schollege-ms/
├── backend/                     # ASP.NET Core 8 Web API (C#)
│   ├── Controllers/             # RESTful API Controllers (Auth, Users, Classes, Subjects, Submissions)
│   ├── Data/                    # EF Core DbContext & Seed Data Configuration
│   ├── Models/                  # C# Domain Models (User, ClassCourse, Subject, Assignment, Submission)
│   ├── SchollegeMS.Tests/       # C# xUnit Test Suite
│   ├── Program.cs               # Web API Bootstrap, JWT Auth, Swagger & CORS Configuration
│   └── SchollegeMS.Backend.csproj
├── frontend/                    # Next.js 16 (TypeScript) Web Application & API Route Handlers
│   ├── prisma/                  # Prisma Database Models & Seeding
│   ├── src/
│   │   ├── app/                 # Next.js App Router (Dashboard, Login, REST APIs, Swagger UI)
│   │   ├── components/          # React Components (Admin, Teacher, Student Portals, Demo Login)
│   │   └── lib/                 # Better-Auth, Prisma Client, RBAC Security Guards
│   ├── tests/                   # Vitest Automated Test Suite
│   └── package.json
└── README.md
```

---

## 🚀 Quick Setup Instructions (Local Run)

### Prerequisites

- Node.js `v18+` or `v22+` installed.

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd schollege-ms/frontend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

_(The default `.env` is configured out-of-the-box with local zero-config database `DATABASE_URL="file:./dev.db"`)_.

### 3. Database Push & Seeding

To initialize the database schema and populate demo credentials:

```bash
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Supabase PostgreSQL Setup (Optional Cloud Setup)

To use **Supabase PostgreSQL** instead of local SQLite:

1. Create a project on [Supabase](https://supabase.com/).
2. Copy your PostgreSQL Connection String under **Project Settings -> Database**.
3. Update `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"
   ```
4. Update `provider = "postgresql"` in `prisma/schema.prisma`.
5. Run migrations:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

---

## 🧪 Running Unit Tests

Execute the Vitest test suite to verify business rules:

```bash
npm run test
```

**Tested Rules Include**:

- ✅ **RBAC Authorization**: Verify non-teachers cannot create assignments and non-students cannot submit answers.
- ✅ **Submission Deadline Lock**: Verify submissions after `dueDate` are rejected.
- ✅ **Grading Constraints**: Verify teacher marks cannot exceed `maxMarks` or be negative.
- ✅ **Draft Visibility**: Verify draft assignments remain hidden from students until published.

---

## 📚 Interactive Swagger / OpenAPI Documentation

Access the interactive API Documentation live at:
[http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## 📌 Documented Assumptions & Known Limitations

1. **Tech Stack Choice**: Next.js App Router full-stack architecture with Prisma ORM was selected to seamlessly integrate **Supabase PostgreSQL** and **Better-Auth** while ensuring 100% platform portability across platforms.
2. **Attachment Links**: Students can submit text solutions alongside external file URL links (e.g., GitHub repo links or Cloud storage URLs).
3. **Draft Mode**: Draft assignments are explicitly restricted to Teachers/Admins until toggled to `PUBLISHED`.
