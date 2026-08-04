# Schollege MS - ASP.NET Core 8 Web API (Backend)

This directory contains the production-grade **ASP.NET Core Web API** in C# for the Schollege MS Role-Based Assignment & Submission Management System.

---

## 🛠️ Architecture & Technologies

- **Framework**: ASP.NET Core 8 Web API (C#)
- **Database ORM**: Entity Framework Core 8 (`Microsoft.EntityFrameworkCore`)
- **Supported Databases**: SQLite (default local zero-config), PostgreSQL / Supabase (`Npgsql.EntityFrameworkCore.PostgreSQL`)
- **Authentication**: JWT Bearer Tokens (`Microsoft.AspNetCore.Authentication.JwtBearer`) & BCrypt password hashing.
- **Documentation**: Swagger / OpenAPI UI via Swashbuckle.
- **Testing**: xUnit test suite (`SchollegeMS.Tests/`).

---

## 🚀 How to Run the ASP.NET Core Backend

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or higher.

### 1. Build & Run API
```bash
cd backend
dotnet restore
dotnet run
```
The API server will launch at `http://localhost:5000` (or `https://localhost:5001`).

### 2. Swagger / OpenAPI Documentation
Once running, open Swagger UI in your browser at:
[http://localhost:5000/swagger](http://localhost:5000/swagger)

### 3. Database Seeding & Setup
The database schema (`schollege.db` SQLite file or Supabase PostgreSQL) is automatically created and seeded on initial startup with working credentials:
- **Admin**: `admin@edu.bd` / `Admin123!`
- **Teacher**: `teacher@edu.bd` / `Teacher123!`
- **Student**: `student@edu.bd` / `Student123!`

### 4. Running Unit Tests
Execute the C# unit test suite:
```bash
dotnet test
```
