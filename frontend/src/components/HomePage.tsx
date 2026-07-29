'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Loader from '@/components/ui/Loader';

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center">
        <Loader size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col justify-between font-outfit text-white antialiased selection:bg-white selection:text-black bg-[url('/images/campus.jpg')] bg-cover bg-center bg-fixed">
      {/* Dark Black Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xs z-0" />

      {/* 1. FLOATING TOP NAVBAR WITH WHITE GLASSMORPHISM */}
      <header className="relative z-50 sticky top-4 w-[92%] max-w-7xl mx-auto mt-4">
        <div className="bg-white/20 backdrop-blur-xl border-none rounded-full shadow-none px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/images/logo.png"
              alt="Schollege Logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover shrink-0 bg-white"
            />
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-tight">
                Schollege
              </span>
              <span className="text-[8px] font-bold text-white/80 block tracking-widest uppercase">
                School Management System
              </span>
            </div>
          </Link>

          {/* Nav Pills Bar in Center */}
          <nav className="hidden md:flex items-center gap-1.5 bg-white/20 backdrop-blur-md p-1 rounded-full border-none shadow-none text-sm font-normal text-white">
            <Link
              href="/login"
              className="px-5 py-2 rounded-full hover:bg-white/30 hover:text-white transition-colors duration-200 flex items-center gap-2 font-normal text-sm"
            >
              <i className="fi fi-rr-user text-sm"></i>
              <span>Login</span>
            </Link>
            <Link
              href="/login?tab=signup"
              className="px-5 py-2 rounded-full hover:bg-white/30 hover:text-white transition-colors duration-200 flex items-center gap-2 font-normal text-sm"
            >
              <i className="fi fi-rr-user-add text-sm"></i>
              <span>Register</span>
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-bold text-white hover:text-white/80 px-3.5 py-2 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              href="/login?tab=signup"
              className="bg-white hover:bg-white/90 text-black font-bold text-xs px-5 py-2.5 rounded-full shadow-none transition-colors duration-200 cursor-pointer flex items-center gap-2"
            >
              <span>Get Started</span>
              <i className="fi fi-rr-arrow-right text-xs"></i>
            </Link>
          </div>
        </div>
      </header>

      {/* CENTERED HERO / WELCOME SECTION */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-6 py-12 w-full flex flex-col items-center justify-center">
        <section className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-4xl py-6 my-auto">
          {/* Welcome Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-bold tracking-wider uppercase border-none">
            <i className="fi fi-rr-sparkles text-white text-xs"></i>
            <span>Welcome to Schollege</span>
          </div>

          {/* Welcome Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight max-w-3xl">
            Modern School & Campus Management System
          </h1>

          {/* Subtitle / Description */}
          <p className="text-sm md:text-base text-white/80 max-w-2xl font-normal leading-relaxed">
            Built on university-grade management standards, Schollege provides clear academic tracking, course tools, and simple administrative workflows so students and teachers can learn and work smoothly without stress or fear.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/login?tab=signup"
              className="bg-white hover:bg-white/90 text-black font-bold text-xs px-7 py-3.5 rounded-full shadow-none flex items-center gap-2.5 transition-colors duration-200 cursor-pointer"
            >
              <i className="fi fi-rr-rocket-lunch text-sm"></i>
              <span>Get Started for Free</span>
            </Link>

            <Link
              href="/admin/dashboard"
              className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-7 py-3.5 rounded-full border-none shadow-none transition-colors duration-200 cursor-pointer flex items-center gap-2 backdrop-blur-md"
            >
              <i className="fi fi-rr-play text-white text-sm"></i>
              <span>Watch Demo / Admin</span>
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 bg-black/90 text-white/80 text-xs py-4 border-none mt-auto backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <p className="font-normal text-sm text-white/80 tracking-wide">© 2026 Schollege Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
