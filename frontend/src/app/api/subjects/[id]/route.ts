import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';
import { z } from 'zod';

const updateSubjectSchema = z.object({
  teacherId: z.string().nullable().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireRole(['ADMIN']);
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateSubjectSchema.parse(body);

    const updated = await prisma.subject.update({
      where: { id },
      data: parsed,
      include: {
        class: true,
        teacher: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to update subject' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireRole(['ADMIN']);
  if (error) return error;

  const { id } = await params;

  try {
    await prisma.subject.delete({ where: { id } });
    return NextResponse.json({ message: 'Subject deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete subject' }, { status: 500 });
  }
}
