import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';
import { z } from 'zod';

const updateUserSchema = z.object({
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).optional(),
  name: z.string().min(1).optional(),
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
    const parsed = updateUserSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: parsed,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to update user' }, { status: 500 });
  }
}
