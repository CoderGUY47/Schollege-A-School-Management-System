import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { z } from 'zod';

const updateAssignmentSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  maxMarks: z.number().min(1).optional(),
  dueDate: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  classId: z.string().optional(),
  subjectId: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAuth();
  if (error || !session) return error;

  const { id } = await params;

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        class: true,
        subject: true,
        teacher: { select: { id: true, name: true, email: true } },
        submissions: {
          include: {
            student: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    const role = (session.user as any).role || 'STUDENT';
    if (role === 'STUDENT' && assignment.status === 'DRAFT') {
      return NextResponse.json({ error: 'Forbidden. Draft assignment is not available to students.' }, { status: 403 });
    }

    return NextResponse.json(assignment);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch assignment' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAuth();
  if (error || !session) return error;

  const role = (session.user as any).role || 'STUDENT';
  if (role !== 'TEACHER' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden. Only Teachers and Admins can update assignments.' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.assignment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    if (role === 'TEACHER' && existing.teacherId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden. You can only modify your own assignments.' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateAssignmentSchema.parse(body);

    const dataToUpdate: any = { ...parsed };
    if (parsed.dueDate) {
      dataToUpdate.dueDate = new Date(parsed.dueDate);
    }

    const updated = await prisma.assignment.update({
      where: { id },
      data: dataToUpdate,
      include: {
        class: true,
        subject: true,
        teacher: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to update assignment' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAuth();
  if (error || !session) return error;

  const role = (session.user as any).role || 'STUDENT';
  if (role !== 'TEACHER' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden. Only Teachers and Admins can delete assignments.' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.assignment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    if (role === 'TEACHER' && existing.teacherId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden. You can only delete your own assignments.' }, { status: 403 });
    }

    await prisma.assignment.delete({ where: { id } });
    return NextResponse.json({ message: 'Assignment deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete assignment' }, { status: 500 });
  }
}
