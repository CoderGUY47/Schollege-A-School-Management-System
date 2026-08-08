'use client';

import React, { useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const role = (session?.user as any)?.role || 'STUDENT';
    if (role === 'ADMIN') {
      router.replace('/admin/dashboard');
    } else if (role === 'TEACHER') {
      router.replace('/teacher/dashboard');
    } else {
      router.replace('/student/dashboard');
    }
  }, [session, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-outfit">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin h-8 w-8 text-indigo-600 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs font-bold text-gray-600">Launching Dashboard...</span>
      </div>
    </div>
  );
}
