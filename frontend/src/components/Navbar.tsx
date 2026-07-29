'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';

export default function Navbar() {
  const { data: session, isPending } = useSession();

  const role = (session?.user as any)?.role || 'STUDENT';

  const roleBadgeColor =
    role === 'ADMIN'
      ? 'bg-purple-100 text-purple-800 border-purple-300'
      : role === 'TEACHER'
      ? 'bg-blue-100 text-blue-800 border-blue-300'
      : 'bg-emerald-100 text-emerald-800 border-emerald-300';

  const roleIconClass = role === 'ADMIN' ? 'fi fi-rr-shield' : role === 'TEACHER' ? 'fi fi-rr-graduation-cap' : 'fi fi-rr-user';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-200">
            <i className="fi fi-rr-book-alt text-lg"></i>
          </div>
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Schollege MS
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <a
            href="/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 sm:flex"
          >
            <i className="fi fi-rr-file-edit text-indigo-500"></i>
            API Docs (Swagger)
          </a>

          {!isPending && session?.user ? (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-semibold text-gray-900">{session.user.name}</div>
                <div className="text-xs text-gray-500">{session.user.email}</div>
              </div>

              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${roleBadgeColor}`}>
                <i className={`${roleIconClass} text-xs`}></i>
                {role}
              </span>

              <button
                onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = '/login'; } } })}
                className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                title="Sign out"
              >
                <i className="fi fi-rr-sign-out-alt"></i>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
