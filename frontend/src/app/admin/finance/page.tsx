'use client';

import React, { useEffect } from 'react';
import AdminDashboard from '@/components/AdminDashboard';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function AdminFinancePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace('/login');
      } else {
        const role = (session.user as any).role || 'STUDENT';
        if (role !== 'ADMIN') {
          router.replace(`/${role.toLowerCase()}/dashboard`);
        }
      }
    }
  }, [session, isPending, router]);

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <i className="fi fi-rr-spinner text-indigo-600 text-2xl animate-spin" />
          <span className="text-xs font-bold text-gray-600">Verifying Admin Permissions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F9]">
      <AdminDashboard />
    </div>
  );
}
