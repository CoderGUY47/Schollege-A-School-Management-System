import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole } from '@/lib/rbac';
import { z } from 'zod';

const createClassSchema = z.object({
  code: z.string().min(2, 'Class code must be at least 2 characters'),
  name: z.string().min(2, 'Class name is required'),
  description: z.string().optional(),
});

// GET /api/classes - List all classes (Authenticated)
export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const classes = await prisma.classCourse.findMany({
      include: {
        subjects: {
          include: {
            teacher: { select: { id: true, name: true, email: true } },
          },
        },
        _count: {
          select: {
            enrollments: true,
            assignments: true,
          },
        },
      },
      orderBy: { code: 'asc' },
    });
    return NextResponse.json(classes);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch classes' }, { status: 500 });
  }
}

// POST /api/classes - Create new class (Admin only)
export async function POST(request: Request) {
  const { error } = await requireRole(['ADMIN']);
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = createClassSchema.parse(body);

    const existing = await prisma.classCourse.findUnique({
      where: { code: parsed.code },
    });
    if (existing) {
      return NextResponse.json({ error: `Class with code ${parsed.code} already exists.` }, { status: 400 });
    }

    const newClass = await prisma.classCourse.create({
      data: parsed,
    });
    return NextResponse.json(newClass, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to create class' }, { status: 500 });
  }
}
