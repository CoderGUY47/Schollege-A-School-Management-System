import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole } from '@/lib/rbac';
import { z } from 'zod';

const createSubmissionSchema = z.object({
  assignmentId: z.string().min(1, 'Assignment ID is required'),
  content: z.string().min(5, 'Submission content must be at least 5 characters'),
  fileUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
});

// GET /api/submissions - List submissions by role
export async function GET(request: Request) {
  const { error, session } = await requireAuth();
  if (error || !session) return error;

  const role = (session.user as any).role || 'STUDENT';
  const userId = session.user.id;

  const { searchParams } = new URL(request.url);
  const assignmentIdFilter = searchParams.get('assignmentId');

  try {
    let whereCondition: any = {};

    if (assignmentIdFilter) {
      whereCondition.assignmentId = assignmentIdFilter;
    }

    if (role === 'STUDENT') {
      whereCondition.studentId = userId;
    } else if (role === 'TEACHER') {
      whereCondition.assignment = {
        OR: [
          { teacherId: userId },
          { subject: { teacherId: userId } },
        ],
      };
    } // ADMIN sees all

    const submissions = await prisma.submission.findMany({
      where: whereCondition,
      include: {
        student: { select: { id: true, name: true, email: true } },
        assignment: {
          select: {
            id: true,
            title: true,
            maxMarks: true,
            dueDate: true,
            class: { select: { code: true, name: true } },
            subject: { select: { code: true, name: true } },
          },
        },
        gradedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json(submissions);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch submissions' }, { status: 500 });
  }
}

// POST /api/submissions - Submit answer (Student only)
export async function POST(request: Request) {
  const { error, session } = await requireRole(['STUDENT']);
  if (error || !session) return error;

  const studentId = session.user.id;

  try {
    const body = await request.json();
    const parsed = createSubmissionSchema.parse(body);

    // 1. Fetch assignment details
    const assignment = await prisma.assignment.findUnique({
      where: { id: parsed.assignmentId },
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found.' }, { status: 404 });
    }

    if (assignment.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Cannot submit to a draft assignment.' }, { status: 400 });
    }

    // 2. Check Deadline Rule
    const now = new Date();
    if (now > new Date(assignment.dueDate)) {
      return NextResponse.json({ error: 'Submission deadline has passed. Late submissions are not allowed.' }, { status: 400 });
    }

    // 3. Check Enrollment Rule
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_classId: {
          studentId,
          classId: assignment.classId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Forbidden. You are not enrolled in the class for this assignment.' }, { status: 403 });
    }

    // 4. Create or Update Submission
    const submission = await prisma.submission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId: parsed.assignmentId,
          studentId,
        },
      },
      update: {
        content: parsed.content,
        fileUrl: parsed.fileUrl || null,
        submittedAt: new Date(),
        status: 'SUBMITTED',
      },
      create: {
        assignmentId: parsed.assignmentId,
        studentId,
        content: parsed.content,
        fileUrl: parsed.fileUrl || null,
        status: 'SUBMITTED',
      },
      include: {
        assignment: { select: { id: true, title: true, maxMarks: true } },
        student: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to submit assignment' }, { status: 500 });
  }
}
