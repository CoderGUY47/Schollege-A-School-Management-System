import { PrismaClient } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";

const prisma = new PrismaClient();

async function main() {
  console.log(
    "🌱 Starting comprehensive Supabase database seeding for Schollege MS...",
  );

  // Hash passwords using Better-Auth scrypt hasher
  const adminPasswordHash = await hashPassword("Admin123!");
  const teacherPasswordHash = await hashPassword("Teacher123!");
  const studentPasswordHash = await hashPassword("Student123!");

  // 1. Create Multiple Users (Admins, Teachers, Students)
  const adminUsers = [
    {
      email: "admin@edu.bd",
      name: "System Administrator",
      role: "ADMIN",
      hash: adminPasswordHash,
    },
    {
      email: "dean@edu.bd",
      name: "Dean Dr. Marcus Vance",
      role: "ADMIN",
      hash: adminPasswordHash,
    },
  ];

  const teacherUsers = [
    {
      email: "teacher@edu.bd",
      name: "Prof. Sarah Jenkins",
      role: "TEACHER",
      hash: teacherPasswordHash,
    },
    {
      email: "t.roberts@edu.bd",
      name: "Dr. Alan Roberts",
      role: "TEACHER",
      hash: teacherPasswordHash,
    },
    {
      email: "m.chen@edu.bd",
      name: "Dr. Maya Chen",
      role: "TEACHER",
      hash: teacherPasswordHash,
    },
    {
      email: "d.wilson@edu.bd",
      name: "Prof. David Wilson",
      role: "TEACHER",
      hash: teacherPasswordHash,
    },
  ];

  const studentUsers = [
    {
      email: "student@edu.bd",
      name: "Aria Rahman",
      role: "STUDENT",
      hash: studentPasswordHash,
    },
    {
      email: "s.miller@edu.bd",
      name: "Sophia Miller",
      role: "STUDENT",
      hash: studentPasswordHash,
    },
    {
      email: "e.davis@edu.bd",
      name: "Ethan Davis",
      role: "STUDENT",
      hash: studentPasswordHash,
    },
    {
      email: "o.taylor@edu.bd",
      name: "Olivia Taylor",
      role: "STUDENT",
      hash: studentPasswordHash,
    },
    {
      email: "l.anderson@edu.bd",
      name: "Lucas Anderson",
      role: "STUDENT",
      hash: studentPasswordHash,
    },
    {
      email: "e.thomas@edu.bd",
      name: "Emma Thomas",
      role: "STUDENT",
      hash: studentPasswordHash,
    },
  ];

  const createdUsers: Record<string, any> = {};

  for (const u of [...adminUsers, ...teacherUsers, ...studentUsers]) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role },
      create: {
        email: u.email,
        name: u.name,
        role: u.role,
        accounts: {
          create: {
            accountId: u.email,
            providerId: "credential",
            password: u.hash,
          },
        },
      },
    });
    createdUsers[u.email] = user;
  }
  console.log(
    `✅ Seeded ${Object.keys(createdUsers).length} User Accounts into Supabase`,
  );

  // 2. Create Classes / Courses
  const classesData = [
    {
      code: "CS-101",
      name: "Introduction to Computer Science & Web Engineering",
      description:
        "Core principles of web systems, HTML, CSS, JavaScript, and database integration.",
    },
    {
      code: "MATH-201",
      name: "Advanced Multivariable Calculus & Linear Algebra",
      description:
        "Differential equations, vector calculus, matrix decompositions, and mathematical logic.",
    },
    {
      code: "ENG-102",
      name: "Software System Architecture & Cloud Engineering",
      description:
        "Distributed systems, microservices design, RESTful APIs, and cloud infrastructure.",
    },
    {
      code: "PHY-301",
      name: "Quantum Mechanics & Modern Physics",
      description:
        "Wave-particle duality, Schrödinger equation, quantum states, and atomic structures.",
    },
    {
      code: "DB-401",
      name: "Relational Database Management & SQL Optimization",
      description:
        "Advanced PostgreSQL indexing, query planning, normalization, and ACID transactions.",
    },
  ];

  const createdClasses: Record<string, any> = {};
  for (const c of classesData) {
    const cls = await prisma.classCourse.upsert({
      where: { code: c.code },
      update: { name: c.name, description: c.description },
      create: c,
    });
    createdClasses[c.code] = cls;
  }
  console.log("✅ Created 5 Classes/Courses");

  // 3. Create Subjects & Assign Teachers
  const subjectsData = [
    {
      code: "CS101-WEB",
      name: "Full-Stack Web Development",
      classCode: "CS-101",
      teacherEmail: "teacher@edu.bd",
    },
    {
      code: "CS101-PY",
      name: "Data Structures with Python",
      classCode: "CS-101",
      teacherEmail: "t.roberts@edu.bd",
    },
    {
      code: "MATH201-CALC",
      name: "Multivariable Calculus",
      classCode: "MATH-201",
      teacherEmail: "m.chen@edu.bd",
    },
    {
      code: "ENG102-ARCH",
      name: "Cloud Architecture & API Design",
      classCode: "ENG-102",
      teacherEmail: "d.wilson@edu.bd",
    },
    {
      code: "PHY301-QUANT",
      name: "Quantum Optics & Relativity",
      classCode: "PHY-301",
      teacherEmail: "t.roberts@edu.bd",
    },
    {
      code: "DB401-SQL",
      name: "Enterprise PostgreSQL Systems",
      classCode: "DB-401",
      teacherEmail: "d.wilson@edu.bd",
    },
  ];

  const createdSubjects: Record<string, any> = {};
  for (const s of subjectsData) {
    const teacherUser = createdUsers[s.teacherEmail];
    const classCourse = createdClasses[s.classCode];

    const sub = await prisma.subject.upsert({
      where: { code: s.code },
      update: { name: s.name, teacherId: teacherUser.id },
      create: {
        code: s.code,
        name: s.name,
        classId: classCourse.id,
        teacherId: teacherUser.id,
      },
    });
    createdSubjects[s.code] = sub;
  }
  console.log("✅ Created 6 Subjects with Assigned Teachers");

  // 4. Enroll Students into Classes
  const studentEmails = [
    "student@edu.bd",
    "s.miller@edu.bd",
    "e.davis@edu.bd",
    "o.taylor@edu.bd",
    "l.anderson@edu.bd",
    "e.thomas@edu.bd",
  ];
  const allClassCodes = ["CS-101", "MATH-201", "ENG-102", "PHY-301", "DB-401"];

  for (let i = 0; i < studentEmails.length; i++) {
    const studentUser = createdUsers[studentEmails[i]];
    const class1 = createdClasses[allClassCodes[i % allClassCodes.length]];
    const class2 =
      createdClasses[allClassCodes[(i + 1) % allClassCodes.length]];

    for (const cls of [class1, class2]) {
      await prisma.enrollment.upsert({
        where: {
          studentId_classId: {
            studentId: studentUser.id,
            classId: cls.id,
          },
        },
        update: {},
        create: {
          studentId: studentUser.id,
          classId: cls.id,
        },
      });
    }
  }
  console.log("✅ Enrolled 6 Students across 5 Classes");

  // 5. Seed Notice Board Notices into Supabase
  const notices = [
    {
      title: "Sports Day Announcement",
      description:
        "Annual intra-college sports tournament begins May 12, 2024. Register your team today!",
      category: "SPORTS",
    },
    {
      title: "Summer Break Start Date",
      description:
        "Summer break officially begins on May 25, 2024. All campus offices remain active.",
      category: "EVENT",
    },
    {
      title: "Fall Midterm Exam Schedule",
      description:
        "Midterm exam seating plans and date sheets published on the student portal.",
      category: "EXAM",
    },
    {
      title: "Science & Robotics Exhibition",
      description:
        "Join us at the main auditorium for student innovation project demos.",
      category: "GENERAL",
    },
  ];

  for (const n of notices) {
    await prisma.noticeBoard.create({ data: n });
  }
  console.log("✅ Seeded 4 Notice Board Announcements into Supabase");

  // 6. Seed 12-Month Financial into Supabase
  const monthlyFinancials = [
    { month: "Jan", income: 350000, expense: 200000 },
    { month: "Feb", income: 420000, expense: 250000 },
    { month: "Mar", income: 390000, expense: 210000 },
    { month: "Apr", income: 480000, expense: 280000 },
    { month: "May", income: 550000, expense: 300000 },
    { month: "Jun", income: 620000, expense: 350000 },
    { month: "Jul", income: 710000, expense: 400000 },
    { month: "Aug", income: 837000, expense: 500000 },
    { month: "Sep", income: 680000, expense: 320000 },
    { month: "Oct", income: 750000, expense: 380000 },
    { month: "Nov", income: 640000, expense: 310000 },
    { month: "Dec", income: 920000, expense: 450000 },
  ];

  for (const f of monthlyFinancials) {
    await prisma.financialTelemetry.create({ data: f });
  }
  console.log("✅ Seeded 12 Months Financial into Supabase");

  // 7. Seed Financial Transactions into Supabase
  const transactions = [
    {
      transactionId: "TXN-9021",
      payerName: "Aria Rahman",
      type: "Tuition Fee (Fall)",
      method: "bKash Online",
      amount: 450.0,
      status: "COMPLETED",
    },
    {
      transactionId: "TXN-9022",
      payerName: "Sophia Miller",
      type: "Lab & Library Fee",
      method: "Visa Card",
      amount: 120.0,
      status: "COMPLETED",
    },
    {
      transactionId: "TXN-9023",
      payerName: "Ethan Davis",
      type: "Admission Deposit",
      method: "Bank Transfer",
      amount: 850.0,
      status: "PENDING",
    },
    {
      transactionId: "TXN-9024",
      payerName: "Olivia Taylor",
      type: "Exam Form Fee",
      method: "Nagad Wallet",
      amount: 75.0,
      status: "COMPLETED",
    },
  ];

  for (const tx of transactions) {
    await prisma.financialTransaction.upsert({
      where: { transactionId: tx.transactionId },
      update: tx,
      create: tx,
    });
  }
  console.log("✅ Seeded Financial Transactions into Supabase");

  // 8. Seed Admin Tasks / To-Do List into Supabase
  const adminTodos = [
    { text: "Review CS-101 midterm assignment submissions", done: true },
    { text: "Publish schedule for Fall semester final exams", done: false },
    { text: "Assign Dr. Alan Roberts to Quantum Physics lab", done: false },
    { text: "Approve teacher attendance report for August", done: true },
  ];

  for (const t of adminTodos) {
    await prisma.adminTodo.create({ data: t });
  }
  console.log("✅ Seeded Admin To-Do List Tasks into Supabase");

  console.log(
    "🎉 Supabase Seeding Complete! All data objects are stored in the backend.",
  );
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
