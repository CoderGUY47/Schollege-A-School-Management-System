import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole } from '@/lib/rbac';
import { z } from 'zod';

const createAssignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  maxMarks: z.number().min(1, 'Max marks must be greater than 0'),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid due date format',
  }),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  classId: z.string().min(1, 'Class selection is required'),
  subjectId: z.string().min(1, 'Subject selection is required'),
});

// GET /api/assignments - Role-based assignments list
export async function GET() {
  const { error, session } = await requireAuth();
  if (error || !session) return error;

  const role = (session.user as any).role || 'STUDENT';
  const userId = session.user.id;

  try {
    let whereCondition: any = {};

    if (role === 'STUDENT') {
      // Find classes student is enrolled in
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: userId },
        select: { classId: true },
      });
      const enrolledClassIds = enrollments.map((e) => e.classId);

      // Students can only see PUBLISHED assignments for their enrolled classes
      whereCondition = {
        status: 'PUBLISHED',
        classId: { in: enrolledClassIds },
      };
    } else if (role === 'TEACHER') {
      // Teachers see assignments they created or assigned to their subjects
      whereCondition = {
        OR: [
          { teacherId: userId },
          { subject: { teacherId: userId } },
        ],
      };
    } // ADMIN sees all (whereCondition = {})

    const assignments = await prisma.assignment.findMany({
      where: whereCondition,
      include: {
        class: { select: { id: true, code: true, name: true } },
        subject: { select: { id: true, code: true, name: true } },
        teacher: { select: { id: true, name: true, email: true } },
        submissions: role === 'STUDENT' ? {
          where: { studentId: userId },
          select: {
            id: true,
            submittedAt: true,
            status: true,
            marks: true,
            feedback: true,
          },
        } : {
          select: {
            id: true,
            studentId: true,
            status: true,
            marks: true,
            submittedAt: true,
          },
        },
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json(assignments);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch assignments' }, { status: 500 });
  }
}

// POST /api/assignments - Create assignment (Teacher only)
export async function POST(request: Request) {
  const { error, session } = await requireRole(['TEACHER', 'ADMIN']);
  if (error || !session) return error;

  try {
    const body = await request.json();
    const parsed = createAssignmentSchema.parse(body);

    const assignment = await prisma.assignment.create({
      data: {
        title: parsed.title,
        description: parsed.description,
        maxMarks: parsed.maxMarks,
        dueDate: new Date(parsed.dueDate),
        status: parsed.status,
        classId: parsed.classId,
        subjectId: parsed.subjectId,
        teacherId: session.user.id,
      },
      include: {
        class: { select: { id: true, code: true, name: true } },
        subject: { select: { id: true, code: true, name: true } },
        teacher: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to create assignment' }, { status: 500 });
  }
}
