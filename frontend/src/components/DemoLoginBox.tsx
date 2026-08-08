'use client';

import React, { useState } from 'react';
import { signIn } from '@/lib/auth-client';

interface DemoLoginBoxProps {
  onSuccess?: () => void;
}

export default function DemoLoginBox({ onSuccess }: DemoLoginBoxProps) {
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDemoSignIn = async (role: string, email: string, password: string) => {
    setLoadingRole(role);
    setErrorMsg(null);

    const targetRole = role.toLowerCase();
    setTimeout(() => {
      if (onSuccess) onSuccess();
      window.location.href = `/${targetRole}/dashboard`;
    }, 600);
  };

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/80 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="fi fi-rr-sparkles text-indigo-600 animate-pulse text-base"></i>
          <h3 className="font-bold text-gray-900">1-Click Demo Sign In</h3>
        </div>
        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
          Quick Access
        </span>
      </div>

      <p className="mb-4 text-xs text-gray-600">
        Click button to demo credentials:
      </p>

      {errorMsg && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Admin Button */}
        <button
          type="button"
          disabled={loadingRole !== null}
          onClick={() => handleDemoSignIn('ADMIN', 'admin@edu.bd', 'Admin123!')}
          className="group relative flex flex-col items-start rounded-xl border border-purple-200 bg-white p-3 text-left transition hover:border-purple-400 hover:shadow-md disabled:opacity-50"
        >
          <div className="flex w-full items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-100 px-2 py-1 text-xs font-bold text-purple-800">
              <i className="fi fi-rr-shield text-xs"></i>
              Admin
            </span>
            {loadingRole === 'ADMIN' && (
              <svg className="animate-spin h-3.5 w-3.5 text-purple-600 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
          </div>
          <div className="mt-2 text-xs font-semibold text-gray-900">admin@edu.bd</div>
          <div className="text-[11px] text-gray-500">Password: Admin123!</div>
        </button>

        {/* Teacher Button */}
        <button
          type="button"
          disabled={loadingRole !== null}
          onClick={() => handleDemoSignIn('TEACHER', 'teacher@edu.bd', 'Teacher123!')}
          className="group relative flex flex-col items-start rounded-xl border border-blue-200 bg-white p-3 text-left transition hover:border-blue-400 hover:shadow-md disabled:opacity-50"
        >
          <div className="flex w-full items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-100 px-2 py-1 text-xs font-bold text-blue-800">
              <i className="fi fi-rr-graduation-cap text-xs"></i>
              Teacher
            </span>
            {loadingRole === 'TEACHER' && (
              <svg className="animate-spin h-3.5 w-3.5 text-blue-600 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
          </div>
          <div className="mt-2 text-xs font-semibold text-gray-900">teacher@edu.bd</div>
          <div className="text-[11px] text-gray-500">Password: Teacher123!</div>
        </button>

        {/* Student Button */}
        <button
          type="button"
          disabled={loadingRole !== null}
          onClick={() => handleDemoSignIn('STUDENT', 'student@edu.bd', 'Student123!')}
          className="group relative flex flex-col items-start rounded-xl border border-emerald-200 bg-white p-3 text-left transition hover:border-emerald-400 hover:shadow-md disabled:opacity-50"
        >
          <div className="flex w-full items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800">
              <i className="fi fi-rr-user text-xs"></i>
              Student
            </span>
            {loadingRole === 'STUDENT' && (
              <svg className="animate-spin h-3.5 w-3.5 text-emerald-600 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
          </div>
          <div className="mt-2 text-xs font-semibold text-gray-900">student@edu.bd</div>
          <div className="text-[11px] text-gray-500">Password: Student123!</div>
        </button>
      </div>
    </div>
  );
}
