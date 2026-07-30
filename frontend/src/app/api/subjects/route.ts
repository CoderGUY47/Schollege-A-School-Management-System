import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole } from '@/lib/rbac';
import { z } from 'zod';

const createSubjectSchema = z.object({
  code: z.string().min(2, 'Subject code must be at least 2 characters'),
  name: z.string().min(2, 'Subject name is required'),
  description: z.string().optional(),
  classId: z.string().min(1, 'Class selection is required'),
  teacherId: z.string().optional().nullable(),
});

// GET /api/subjects - List all subjects (Authenticated)
export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const subjects = await prisma.subject.findMany({
      include: {
        class: { select: { id: true, code: true, name: true } },
        teacher: { select: { id: true, name: true, email: true } },
        _count: { select: { assignments: true } },
      },
      orderBy: { code: 'asc' },
    });
    return NextResponse.json(subjects);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch subjects' }, { status: 500 });
  }
}

// POST /api/subjects - Create new subject (Admin only)
export async function POST(request: Request) {
  const { error } = await requireRole(['ADMIN']);
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = createSubjectSchema.parse(body);

    const existing = await prisma.subject.findUnique({
      where: { code: parsed.code },
    });
    if (existing) {
      return NextResponse.json({ error: `Subject code ${parsed.code} already exists` }, { status: 400 });
    }

    const subject = await prisma.subject.create({
      data: parsed,
      include: {
        class: true,
        teacher: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to create subject' }, { status: 500 });
  }
}
