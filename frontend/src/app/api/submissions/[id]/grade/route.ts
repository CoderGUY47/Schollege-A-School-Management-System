import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';
import { z } from 'zod';

const gradeSchema = z.object({
  marks: z.number().min(0, 'Marks cannot be negative'),
  feedback: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireRole(['TEACHER', 'ADMIN']);
  if (error || !session) return error;

  const { id } = await params;
  const teacherId = session.user.id;

  try {
    const body = await request.json();
    const parsed = gradeSchema.parse(body);

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: { assignment: true },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Validate marks against assignment maxMarks
    if (parsed.marks > submission.assignment.maxMarks) {
      return NextResponse.json(
        { error: `Marks (${parsed.marks}) cannot exceed maximum marks (${submission.assignment.maxMarks})` },
        { status: 400 }
      );
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id },
      data: {
        marks: parsed.marks,
        feedback: parsed.feedback || null,
        status: 'GRADED',
        gradedAt: new Date(),
        gradedById: teacherId,
      },
      include: {
        student: { select: { id: true, name: true, email: true } },
        assignment: { select: { id: true, title: true, maxMarks: true } },
        gradedBy: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(updatedSubmission);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to grade submission' }, { status: 500 });
  }
}
