# 🎓 SCHOLLEGE — Complete School & College Management System

<p align="center">
  <img src="frontend/public/images/logo.png" alt="Schollege Logo" width="120" />
</p>

<p align="center">
  <strong>A modern, role-based School & College Management System built with Next.js 16, TypeScript, Tailwind CSS, BetterAuth, and Supabase PostgreSQL.</strong>
</p>

<p align="center">
  <a href="https://schollege-portal.vercel.app"><strong>🌐 Explore Live Production Deployment »</strong></a>
</p>

---

## 🌟 Key Features & Role Dashboards

### 👨‍🎓 1. Student Portal (`/student/dashboard`)
- **Academic Dashboard**: Real-time CGPA tracker, attendance percentage, pending homework count, and subject grades.
- **Class Routine & Schedule**: Interactive daily class timeline and room assignments.
- **Assignment Hub**: View assignments, upload submissions, and track teacher grade feedback.
- **Exams & Results**: Midterm, term-final, and quiz scorecards with performance breakdown.
- **Avatar Selector**: Choose from 15 custom avatars during registration or Google OAuth login.

### 👩‍🏫 2. Teacher / Faculty Portal (`/teacher/dashboard`)
- **Faculty Dashboard**: Class assignments overview, active student rosters, and upcoming lecture routines.
- **Assignment Builder**: Create and distribute assignments with custom due dates and grade weights.
- **Submission Grading Engine**: Review student homework submissions and award numerical scores with comments.
- **Student Roster Management**: Class-wise student lists with attendance tracking.

### 🏛️ 3. Admin Executive Portal (`/admin/dashboard`)
- **Executive Summary**: Real-time personnel summary cards (5,909+ Students, 60+ Faculty, 100+ Staff).
- **Financial Trend Graph**: Interactive revenue vs. expenditure charts with timeframe controls.
- **Academic Calendar**: Compact monthly calendar with campus event highlights.
- **Earnings Analytics & Revenue Breakdown**: Category-wise fee collection statistics (Tuition, Lab, Transport).
- **Campus Messages Inbox**: Live campus announcements and administrative notice stream.
- **Service Hubs**: Quick access to Academic, Campus, and Financial management modules.

---

## 🔑 Quick Demo Credentials

Try out the application instantly using the pre-configured 1-Click Quick Demo Sign-In buttons on the login page:

| Role | Email | Password | Quick Dashboard Route |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@schollege.edu.bd` | `admin123` | `/admin/dashboard` |
| **Teacher** | `teacher@schollege.edu.bd` | `teacher123` | `/teacher/dashboard` |
| **Student** | `student@schollege.edu.bd` | `student123` | `/student/dashboard` |

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Language**: TypeScript
- **Styling & UI**: Tailwind CSS, Outfit Typography, Flaticon UI Icons, FontAwesome 6
- **Charts & Visualizations**: Recharts
- **Authentication**: BetterAuth SDK + Google OAuth + Custom Quick Demo Sign-In
- **Backend & Database**: Supabase PostgreSQL + REST API Endpoints (`/api/...`) & `backend/Data/` Data Primary Store
- **Deployment**: Vercel Production Infrastructure

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/CoderGUY47/Schollege-A-School-Management-System.git
   cd Schollege-A-School-Management-System
   ```

2. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file inside `frontend/`:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   BETTER_AUTH_SECRET=your_better_auth_secret_here
   BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the portal.

---

## 📁 Repository Structure

```
Schollege-A-School-Management-System/
├── backend/                  # Backend Data Primary Store & Schemas
│   └── Data/                 # Personnel, Financials, Messages, Routine, Subjects
├── frontend/                 # Next.js 16 Application Codebase
│   ├── public/               # Static assets & avatar images (/images/avatars/...)
│   └── src/
│       ├── app/              # App Router Pages (/admin, /teacher, /student, /api)
│       ├── components/       # UI Components & Role Dashboards
│       └── lib/              # Auth & Supabase Client Utilities
├── README.md                 # Project Documentation
└── AGENTS.md                 # Development & Architecture Rules
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
