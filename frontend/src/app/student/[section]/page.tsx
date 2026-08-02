'use client';

import React, { useEffect } from 'react';
import StudentDashboard from '@/components/StudentDashboard';
import Loader from '@/components/ui/Loader';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function StudentSectionPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace('/login');
      } else {
        const role = (session.user as any).role || 'STUDENT';
        if (role !== 'STUDENT') {
          router.replace(`/${role.toLowerCase()}/dashboard`);
        }
      }
    }
  }, [session, isPending, router]);

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFE]">
        <Loader size="lg" text="Loading Student Portal..." />
      </div>
    );
  }

  return <StudentDashboard />;
}
