import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireRole(['ADMIN']);
  if (error) return error;

  const { id } = await params;

  try {
    await prisma.classCourse.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Class deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete class' }, { status: 500 });
  }
}
