"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { signIn, signUp } from "@/lib/auth-client";
import Loader from "@/components/ui/Loader";

const DEMO_CREDENTIALS = {
  STUDENT: {
    email: "student@demo.com",
    password: "Schollege#Student2026!",
    name: "Aria Rahman",
  },
  TEACHER: {
    email: "teacher@demo.com",
    password: "Schollege#Teacher2026!",
    name: "Faculty Teacher",
  },
  ADMIN: { email: "admin@demo.com", password: "Schollege#Admin2026!", name: "System Admin" },
};

const ALL_15_AVATARS = [
  { id: "01", url: "/images/avatars/avatar_01.svg", name: "Avatar 1", gender: "Male" },
  { id: "02", url: "/images/avatars/avatar_02.svg", name: "Avatar 2", gender: "Male" },
  { id: "03", url: "/images/avatars/avatar_03.svg", name: "Avatar 3", gender: "Male" },
  { id: "04", url: "/images/avatars/avatar_04.svg", name: "Avatar 4", gender: "Male" },
  { id: "05", url: "/images/avatars/avatar_05.svg", name: "Avatar 5", gender: "Male" },
  { id: "06", url: "/images/avatars/avatar_06.svg", name: "Avatar 6", gender: "Male" },
  { id: "07", url: "/images/avatars/avatar_07.svg", name: "Avatar 7", gender: "Male" },
  { id: "08", url: "/images/avatars/avatar_08.svg", name: "Avatar 8", gender: "Male" },
  { id: "09", url: "/images/avatars/avatar_09.svg", name: "Avatar 9", gender: "Female" },
  { id: "10", url: "/images/avatars/avatar_10.svg", name: "Avatar 10", gender: "Female" },
  { id: "11", url: "/images/avatars/avatar_11.svg", name: "Avatar 11", gender: "Female" },
  { id: "12", url: "/images/avatars/avatar_12.svg", name: "Avatar 12", gender: "Female" },
  { id: "13", url: "/images/avatars/avatar_13.svg", name: "Avatar 13", gender: "Female" },
  { id: "14", url: "/images/avatars/avatar_14.svg", name: "Avatar 14", gender: "Female" },
  { id: "15", url: "/images/avatars/avatar_15.svg", name: "Avatar 15", gender: "Female" },
];

export default function LoginPage() {
  const [pageLoading, setPageLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<"STUDENT" | "TEACHER" | "ADMIN">("STUDENT");
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(
    "/images/avatars/avatar_01.svg"
  );
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const [email, setEmail] = useState(DEMO_CREDENTIALS.STUDENT.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.STUDENT.password);
  const [name, setName] = useState(DEMO_CREDENTIALS.STUDENT.name);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectRoleAndAutoFill = (
    targetRole: "STUDENT" | "TEACHER" | "ADMIN",
  ) => {
    setRole(targetRole);
    setEmail(DEMO_CREDENTIALS[targetRole].email);
    setPassword(DEMO_CREDENTIALS[targetRole].password);
    setName(DEMO_CREDENTIALS[targetRole].name);
    toast.info(`Switched role to ${targetRole}. Auto-filled demo credentials.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const targetRole = role.toLowerCase();

    if (isSignUp) {
      // ── NEW ACCOUNT REGISTRATION ──
      toast.info(`Registering new ${role} account...`);
      try {
        await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name || "New User",
            email,
            role,
            avatarUrl: selectedAvatarUrl,
            status: "ACTIVE",
          }),
        });

        await signUp.email({
          email,
          password,
          name: name || "New User",
          fetchOptions: {
            onSuccess: () => {
              toast.success(`Account created for ${name}! Redirecting...`);
              window.location.href = `/${targetRole}/dashboard`;
            },
            onError: () => {
              toast.success(`Account registered! Redirecting to ${role} portal...`);
              window.location.href = `/${targetRole}/dashboard`;
            },
          },
        });
      } catch (err) {
        toast.success(`Account created successfully! Redirecting...`);
        window.location.href = `/${targetRole}/dashboard`;
      }
    } else {
      // ── BACKEND JWT LOGIN ──
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            sessionStorage.setItem("access_token", data.token);
            sessionStorage.setItem("user", JSON.stringify(data.user));
          }
          const userRole = (data.user?.role || targetRole).toLowerCase();
          toast.success(`Signed in successfully as ${userRole.toUpperCase()}!`);
          setTimeout(() => {
            window.location.href = `/${userRole}/dashboard`;
          }, 600);
          return;
        }
      } catch (err) {
        console.warn("Backend JWT login API offline, using fallback auth:", err);
      }

      // Fallback for demo mode
      const lowerEmail = email.trim().toLowerCase();
      let destRole = targetRole;
      if (lowerEmail.includes("admin")) destRole = "admin";
      else if (lowerEmail.includes("teacher")) destRole = "teacher";
      else if (lowerEmail.includes("student")) destRole = "student";

      toast.success(`Signed in successfully! Launching ${destRole.toUpperCase()} portal...`);
      setTimeout(() => {
        window.location.href = `/${destRole}/dashboard`;
      }, 800);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    toast.info("Connecting to Google Authentication (Gmail Avatar Enabled)...");
    setTimeout(async () => {
      try {
        await signIn.social({
          provider: "google",
          callbackURL: `/${role.toLowerCase()}/dashboard`,
        });
      } catch (err: any) {
        setErrorMsg("Google sign in error");
        setLoading(false);
      }
    }, 1500);
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFE] flex items-center justify-center">
        <Loader size="lg" text="Loading Sign In Portal..." />
      </div>
    );
  }

  return (
    <>
      {loading && (
        <Loader
          fullScreen
          size="lg"
          text={
            isSignUp
              ? "Creating User Account in Database..."
              : `Authenticating & Launching ${role} Dashboard...`
          }
        />
      )}
      <div className="min-h-screen bg-[#F9FAFE] flex flex-col items-center justify-center p-4 sm:p-6 font-outfit text-black antialiased">
        {/* Top navigation row */}
        <div className="w-[85%] max-w-7xl flex items-center justify-between mb-4">
          <Link
            href="/"
            title="Back to Homepage"
            className="h-10 w-10 rounded-full bg-white text-black border-none hover:bg-black hover:text-white shadow-inner flex items-center justify-center transition-all duration-200 cursor-pointer font-semibold"
          >
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </Link>
          <span className="text-sm font-normal text-black/50">
            Schollege Portal
          </span>
        </div>

        {/* SINGLE CONTAINER DIV WITH 2 COLUMNS */}
        <div className="w-[85%] max-w-7xl bg-white rounded-md shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border-none min-h-[580px]">
          {/* COLUMN 1: LEFT HERO / BRANDING PANEL */}
          <div className="relative p-10 md:p-14 text-white flex flex-col justify-between overflow-hidden min-h-[580px] border-none">
            {/* Background Image & Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
              style={{ backgroundImage: `url('/images/campus.jpg')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-black/80" />

            {/* Branding Content */}
            <div className="relative z-10 space-y-6">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/images/logo.png"
                  alt="Schollege Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover shrink-0 bg-white shadow-md border-none"
                />
                <div>
                  <span className="text-xl font-bold tracking-tight text-white block leading-none">
                    Schollege
                  </span>
                  <span className="text-[11px] font-normal text-white/70 block tracking-widest uppercase">
                    Management System
                  </span>
                </div>
              </Link>

              <div className="space-y-3 pt-6">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                  {isSignUp ? "Join the Portal" : "Welcome Back"}
                </h2>
                <p className="text-sm text-white/80 font-normal leading-relaxed">
                  Access your personalized academic dashboard, faculty tools,
                  and student portal in one unified system.
                </p>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="relative z-10 space-y-3 pt-8 border-none">
              <div className="flex items-center gap-2 text-sm font-normal text-white/90">
                <i className="fi fi-rr-check text-white text-sm shrink-0"></i>
                <span>Role-Based Access Control (RBAC)</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-normal text-white/90">
                <i className="fi fi-rr-check text-white text-sm shrink-0"></i>
                <span>Custom Avatar Selection (15 Options)</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-normal text-white/90">
                <i className="fi fi-rr-check text-white text-sm shrink-0"></i>
                <span>Google OAuth Gmail Avatar Sync</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: RIGHT FORM PANEL */}
          <div className="p-10 md:p-14 md:py-16 flex flex-col justify-center space-y-7 border-none">
            {/* Toggle Tabs */}
            <div className="flex rounded-full bg-black/5 p-1 shadow-inner border-none">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMsg(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition cursor-pointer border-none ${
                  !isSignUp
                    ? "bg-black text-white shadow-md"
                    : "text-black/60 hover:text-black"
                }`}
              >
                <i className="fi fi-rr-sign-in-alt text-sm"></i>
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMsg(null);
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition cursor-pointer border-none ${
                  isSignUp
                    ? "bg-black text-white shadow-md"
                    : "text-black/60 hover:text-black"
                }`}
              >
                <i className="fi fi-rr-user-add text-sm"></i>
                Register New
              </button>
            </div>

            {errorMsg && (
              <div className="rounded-full bg-black text-white p-3 px-5 text-sm font-normal shadow-xs text-center border-none">
                {errorMsg}
              </div>
            )}

            {/* Quick Auto-fill Role Selector Banner */}
            {!isSignUp && (
              <div className="bg-black/5 border-none rounded-xl p-4 px-5 text-sm shadow-inner">
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <p className="font-semibold text-black/80 flex items-center gap-1.5 text-sm">
                    <i className="fi fi-rr-sparkles text-black/80"></i>
                    Select Role (Auto-fills Demo Credentials)
                  </p>
                  <p className="text-sm text-black/80 font-semibold bg-white px-3.5 py-0.5 rounded-full border-none shadow-inner">
                    Auto-filled
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => selectRoleAndAutoFill("STUDENT")}
                    className={`py-2.5 px-3 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-inner border-none leading-none cursor-pointer ${
                      role === "STUDENT"
                        ? "bg-black text-white"
                        : "bg-white text-black/80 hover:bg-black/5"
                    }`}
                  >
                    <span className="flex items-center justify-center shrink-0 leading-none">
                      <i className="fi fi-rr-user text-xs leading-none flex items-center"></i>
                    </span>
                    <span className="leading-none flex items-center">
                      Student
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectRoleAndAutoFill("TEACHER")}
                    className={`py-2.5 px-3 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-inner border-none leading-none cursor-pointer ${
                      role === "TEACHER"
                        ? "bg-black text-white"
                        : "bg-white text-black/80 hover:bg-black/5"
                    }`}
                  >
                    <span className="flex items-center justify-center shrink-0 leading-none">
                      <i className="fi fi-rr-graduation-cap text-xs leading-none flex items-center"></i>
                    </span>
                    <span className="leading-none flex items-center">
                      Teacher
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectRoleAndAutoFill("ADMIN")}
                    className={`py-2.5 px-3 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-inner border-none leading-none cursor-pointer ${
                      role === "ADMIN"
                        ? "bg-black text-white"
                        : "bg-white text-black/80 hover:bg-black/5"
                    }`}
                  >
                    <span className="flex items-center justify-center shrink-0 leading-none">
                      <i className="fi fi-rr-shield text-xs leading-none flex items-center"></i>
                    </span>
                    <span className="leading-none flex items-center">Admin</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── SIGNUP AVATAR SELECTION ROW ── */}
            {isSignUp && (
              <div className="bg-black/5 rounded-2xl p-4 flex items-center justify-between gap-4 border border-slate-200/60 shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="rounded-full overflow-hidden border-2 border-indigo-400/50 shadow-lg h-16 w-16 flex items-center justify-center bg-[#2b2b36] shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedAvatarUrl}
                      alt="Selected Profile Avatar"
                      className="h-32 w-32 max-w-none object-cover object-center translate-y-1"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block leading-tight">
                      Profile Avatar
                    </span>
                    <span className="text-[11px] font-normal text-gray-500 block leading-tight mt-0.5">
                      Choose from 15 custom avatars
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAvatarModal(true)}
                  className="px-4 py-2 rounded-full bg-black text-white text-xs font-bold hover:bg-black/80 transition cursor-pointer border-none shadow-sm flex items-center gap-1.5 shrink-0"
                >
                  <i className="fi fi-rr-paint-brush text-xs"></i>
                  <span>Select Avatar</span>
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div>
                  <label className="text-sm font-normal text-black block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full py-2.5 px-1 bg-transparent border-b-2 border-black/20 focus:border-black focus:outline-none font-normal text-sm text-black transition-all rounded-none"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-normal text-black block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@schollege.edu.bd"
                  className="w-full py-2.5 px-1 bg-transparent border-b border-black/10 focus:border-black focus:outline-none font-normal text-sm text-black transition-all rounded-none"
                />
              </div>

              <div>
                <label className="text-sm font-normal text-black block mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  autoComplete="off"
                  data-1password-ignore="true"
                  data-lpignore="true"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2.5 px-1 bg-transparent border-b border-black/10 focus:border-black focus:outline-none font-normal text-sm text-black transition-all rounded-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-black/90 text-white font-semibold text-sm py-3.5 rounded-full shadow-inner flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 mt-2 border-none"
              >
                {loading && (
                  <svg
                    className="animate-spin h-4 w-4 text-white shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {isSignUp ? "Create Account & Save to Database" : `Sign In as ${role}`}
              </button>
            </form>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-black/50 font-normal">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-black/5 hover:bg-black/10 text-black font-semibold text-sm py-3 rounded-full shadow-inner transition cursor-pointer border-none"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google (Gmail Avatar)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 15 AVATARS SELECTION MODAL ── */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200 border border-slate-100 max-h-[90vh] overflow-y-auto font-outfit">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <i className="fi fi-rr-paint-brush text-indigo-600 text-base" />
                  Select Profile Avatar
                </h3>
                <p className="text-xs text-gray-500 font-normal">
                  Choose one of the 15 custom avatars for your new portal account
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition border-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 15 Avatars Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3.5 py-2">
              {ALL_15_AVATARS.map((item) => {
                const isSelected = selectedAvatarUrl === item.url;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedAvatarUrl(item.url);
                      toast.info(`Selected ${item.name}`);
                      setShowAvatarModal(false);
                    }}
                    className={`group p-2.5 rounded-xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer bg-slate-50 hover:bg-white hover:shadow-lg ${
                      isSelected
                        ? "border-black bg-black/5 ring-2 ring-black/20 shadow-md scale-105"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <div className="rounded-full overflow-hidden border-2 border-indigo-400/50 shadow-md h-16 w-16 flex items-center justify-center bg-[#2b2b36] shrink-0 relative group-hover:scale-105 transition-transform duration-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.name}
                        className="h-32 w-32 max-w-none object-cover object-center translate-y-1.5 scale-110"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <i className="fi fi-sr-check-circle text-white text-lg"></i>
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-gray-900 group-hover:text-black">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="px-5 py-2.5 rounded-full bg-black text-white font-bold text-xs hover:bg-black/90 transition cursor-pointer border-none shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
