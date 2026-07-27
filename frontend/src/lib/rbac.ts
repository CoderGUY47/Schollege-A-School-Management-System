import { auth } from './auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export async function getCurrentUserSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireAuth() {
  const session = await getCurrentUserSession();
  if (!session || !session.user) {
    return { error: NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 }), session: null };
  }
  return { error: null, session };
}

export async function requireRole(allowedRoles: UserRole[]) {
  const { error, session } = await requireAuth();
  if (error || !session) return { error, session: null };

  const userRole = (session.user as any).role || 'STUDENT';

  if (!allowedRoles.includes(userRole as UserRole)) {
    return {
      error: NextResponse.json(
        { error: `Forbidden. Requires one of roles: ${allowedRoles.join(', ')}` },
        { status: 403 }
      ),
      session: null,
    };
  }

  return { error: null, session };
}
