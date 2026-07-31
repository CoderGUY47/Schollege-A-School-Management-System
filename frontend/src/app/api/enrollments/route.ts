import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole } from '@/lib/rbac';
import { z } from 'zod';

const createEnrollmentSchema = z.object({
  studentId: z.string().min(1, 'Student selection is required'),
  classId: z.string().min(1, 'Class selection is required'),
});

// GET /api/enrollments - List enrollments (Authenticated)
export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: { select: { id: true, name: true, email: true } },
        class: { select: { id: true, code: true, name: true } },
      },
      orderBy: { enrolledAt: 'desc' },
    });
    return NextResponse.json(enrollments);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch enrollments' }, { status: 500 });
  }
}

// POST /api/enrollments - Enroll a student (Admin only)
export async function POST(request: Request) {
  const { error } = await requireRole(['ADMIN']);
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = createEnrollmentSchema.parse(body);

    // Verify student user role
    const user = await prisma.user.findUnique({ where: { id: parsed.studentId } });
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'User is not a student' }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.create({
      data: parsed,
      include: {
        student: { select: { id: true, name: true, email: true } },
        class: { select: { id: true, code: true, name: true } },
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: err.errors }, { status: 400 });
    }
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Student is already enrolled in this class.' }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to create enrollment' }, { status: 500 });
  }
}
