"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import UserAvatar from "@/components/ui/UserAvatar";
import Loader from "@/components/ui/Loader";
import { downloadDocument } from "@/lib/download-utils";

export default function TeacherProfileView() {
  const { data: session } = useSession();
  const rawName = session?.user?.name;
  const userName =
    !rawName || rawName === "Alex Johnson" || rawName === "Teacher Account"
      ? "Prof. Sarah Jenkins"
      : rawName;
  const userEmail = session?.user?.email || "teacher@edu.bd";

  const [teacherProfile, setTeacherProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "Prof. Sarah Jenkins",
    phone: "+880 1711-203948",
    qualification: "Ph.D. in Applied Physics (DU)",
    specialization: "Electromagnetism & Quantum Physics",
    officeHours: "Sun-Thu • 02:30 PM - 04:00 PM",
  });

  // Fetch teacher profile dynamically from backend database
  useEffect(() => {
    async function fetchTeacherProfile() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/teachers?email=${encodeURIComponent(userEmail)}`,
        );
        if (res.ok) {
          const data = await res.json();
          if (data.teachers && data.teachers.length > 0) {
            const profile = data.teachers[0];
            setTeacherProfile(profile);
            setFormData({
              name: profile.name || userName || "Prof. Sarah Jenkins",
              phone: profile.phone || "+880 1711-203948",
              qualification:
                profile.qualification || "Ph.D. in Applied Physics (DU)",
              specialization:
                profile.subjectSpecialization ||
                "Electromagnetism & Quantum Physics",
              officeHours:
                profile.officeHours || "Sun-Thu • 02:30 PM - 04:00 PM",
            });
          }
        }
      } catch (err) {
        console.error(
          "Failed to fetch teacher profile from backend database:",
          err,
        );
      } finally {
        setLoading(false);
      }
    }
    fetchTeacherProfile();
  }, [userEmail, userName]);

  const displayName = formData.name || teacherProfile?.name || userName;
  const displayTeacherId = teacherProfile?.teacherIdNumber || "SCH-T-1001";
  const displayDesignation =
    teacherProfile?.designation || "Senior Professor & HOD";
  const displayDept = teacherProfile?.department || "Physics";
  const displayPhone =
    formData.phone || teacherProfile?.phone || "+880 1711-203948";
  const displayYear = teacherProfile?.joiningYear || 2012;
  const displayQualification =
    formData.qualification ||
    teacherProfile?.qualification ||
    "Ph.D. in Applied Physics (DU)";
  const displaySpecialization =
    formData.specialization ||
    teacherProfile?.subjectSpecialization ||
    "Electromagnetism & Quantum Physics";

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        email: userEmail,
        id: teacherProfile?.id,
        name: formData.name,
        phone: formData.phone,
        qualification: formData.qualification,
        subjectSpecialization: formData.specialization,
        officeHours: formData.officeHours,
      };

      const res = await fetch("/api/teachers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setTeacherProfile((prev: any) => ({ ...prev, ...data.teacher }));
        setIsEditing(false);
        toast.success(
          "Teacher profile updated dynamically in backend database!",
        );

        // Trigger role/recipient-scoped notification
        await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "TEACHER",
            title: "Teacher Profile Credentials Updated",
            message: `Profile details and consultation schedule for ${formData.name} were saved to backend database.`,
            targetRole: "TEACHER",
            recipientEmail: userEmail,
            senderName: "Faculty System Engine",
          }),
        });
      } else {
        toast.error("Failed to update teacher record in backend database");
      }
    } catch (err) {
      console.error("Error saving teacher profile to backend:", err);
      toast.error("An error occurred while saving profile changes");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center p-20 bg-white rounded-md border border-gray-500/30 shadow-md min-h-[360px] font-outfit">
        <Loader size="md" text="Loading teacher profile & credentials..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-outfit">
      {/* Header Banner */}
      <div className="rounded-md bg-[#0B0F17] p-6 md:p-8 text-white shadow-inner border border-gray-400/50 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="bg-white/10 text-white font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
            Teacher Profile & Dynamic Database Records
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Teacher Digital ID & Personal
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
            All records are synchronized dynamically with backend database
            endpoints. Updates reflect immediately across the teacher portal.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Teacher Digital ID Card */}
        <div className="lg:col-span-5 rounded-md border border-gray-400/50 bg-white p-6 shadow-inner space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="text-xs font-bold uppercase text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                Verified Teacher ID
              </span>
              <span className="text-xs font-bold text-gray-500">
                Academic Year 2026
              </span>
            </div>

            <div className="text-center space-y-3 py-4">
              <div className="rounded-full overflow-hidden border-2 border-indigo-400/50 shadow-lg h-24 w-24 flex items-center justify-center bg-[#2b2b36] mx-auto shrink-0">
                <UserAvatar
                  name={displayName}
                  gender={teacherProfile?.gender || "MALE"}
                  avatarUrl={
                    session?.user?.image ||
                    teacherProfile?.avatarUrl ||
                    "/images/avatars/avatar_02.svg"
                  }
                  sizeClassName="h-40 w-40"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {displayName}
                </h3>
                <p className="text-sm font-bold text-emerald-600">
                  {displayDesignation}
                </p>
                <span className="text-xs text-gray-500 block mt-0.5">
                  Department of {displayDept}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm border-t border-gray-200 pt-4 font-normal">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-gray-500">Teacher ID Number:</span>
                <strong className="font-bold text-gray-900">
                  {displayTeacherId}
                </strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-gray-500">Email Address:</span>
                <strong className="font-bold text-gray-900">{userEmail}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-gray-500">Phone Contact:</span>
                <strong className="font-bold text-gray-900">
                  {displayPhone}
                </strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Joining Year:</span>
                <strong className="font-bold text-gray-900">
                  {displayYear} ({new Date().getFullYear() - displayYear} Years
                  Service)
                </strong>
              </div>
            </div>
          </div>

          <div className="pt-3 space-y-2">
            <button
              onClick={() => {
                const cvContent = `====================================================
SCHOLLEGE EDUCATIONAL INSTITUTION - FACULTY CV
====================================================

NAME: ${displayName}
DESIGNATION: ${displayDesignation}
DEPARTMENT: Department of ${displayDept}
TEACHER ID: ${displayTeacherId}
EMAIL: ${userEmail}
PHONE: ${displayPhone}

----------------------------------------------------
ACADEMIC QUALIFICATION & SPECIALIZATION
----------------------------------------------------
Qualification: ${displayQualification}
Subject Specialization: ${displaySpecialization}
Office Hours: ${formData.officeHours}
Joining Year: ${displayYear} (${new Date().getFullYear() - displayYear} Years Service)

----------------------------------------------------
FACULTY SUMMARY & RESPONSIBILITIES
----------------------------------------------------
- Senior Faculty Member and Department Head at Schollege MS.
- Responsible for Advanced Physics lectures, laboratory experiments, and coursework evaluations.
- Active participant in educational administration, curriculum design, and student mentoring.

Generated automatically on: ${new Date().toLocaleString()}
Schollege School & College Management System
====================================================`;
                downloadDocument(
                  `${displayName.replace(/[^a-zA-Z0-9]/g, "_")}_CV.txt`,
                  cvContent,
                );
              }}
              className="w-full py-2.5 rounded-md bg-black text-white hover:bg-slate-800 text-base font-normal flex items-center justify-center gap-2 shadow-md cursor-pointer transition border-none"
            >
              <i className="fi fi-rr-download text-base text-white" />
              <span>Download Academic CV (PDF)</span>
            </button>
            <span className="w-full py-2.5 rounded-md bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 shadow-inner">
              <i className="fi fi-sr-shield-check text-xs text-emerald-600" />{" "}
              Verified Backend Database Record
            </span>
          </div>
        </div>

        {/* Right Column: Detailed Personal Info & Academic Credentials (Identical Styling to Student Profile) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-md p-5 border border-gray-500/30 shadow-md space-y-4">
            {/* Header with Title & Status Badges (Matches Student Profile) */}
            <div className="border-b border-gray-500/30 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900">
                    Personal Details
                  </h3>
                  {isEditing && (
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-gray-500/30 px-2 py-0.5 rounded-md uppercase">
                      Editing Mode
                    </span>
                  )}
                </div>
              </div>

              {/* Status Badges (Matches Student Profile) */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-50/80 px-2.5 py-1 text-xs font-bold text-emerald-700 shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  Active
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/40 bg-indigo-50/80 px-2.5 py-1 text-xs font-bold text-indigo-700 shadow-xs">
                  <i className="fi fi-rr-user-check text-[11px]"></i>
                  Verified HOD
                </div>
              </div>
            </div>

            {/* Form Layout with Icons Perfectly Centered with Title Labels (Exact Student Profile Structure) */}
            <form onSubmit={handleSaveProfile} className="space-y-2">
              {/* Section 1: Academic & Institutional Info */}
              <div className="space-y-2">
                <h4 className="text-xs mb-4 font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <i className="fi fi-sr-graduation-cap text-indigo-600"></i>
                  Academic & Institutional Info
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-user text-gray-400 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">Full Name</span>
                    </label>
                    <div
                      className={`rounded-md border border-gray-500/30 shadow-inner flex items-center px-2.5 py-1.5 transition ${
                        isEditing ? "bg-white" : "bg-gray-50/70"
                      }`}
                    >
                      <input
                        type="text"
                        readOnly={!isEditing}
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full bg-transparent text-base font-normal text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Institutional Email */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-envelope text-gray-400 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">Institutional Email</span>
                    </label>
                    <div className="rounded-md border border-gray-500/30 bg-gray-50/70 shadow-inner flex items-center px-2.5 py-1.5 opacity-80">
                      <input
                        type="email"
                        readOnly
                        value={userEmail}
                        className="w-full bg-transparent text-base font-normal text-gray-900 focus:outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Teacher ID */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-id-badge text-gray-400 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">Teacher ID Number</span>
                    </label>
                    <div className="rounded-md border border-gray-500/30 bg-gray-50/70 shadow-inner flex items-center px-2.5 py-1.5 opacity-80">
                      <input
                        type="text"
                        readOnly
                        value={displayTeacherId}
                        className="w-full bg-transparent text-base font-normal text-gray-900 focus:outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Department & Designation */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-book-alt text-gray-400 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">
                        Department & Designation
                      </span>
                    </label>
                    <div className="rounded-md border border-gray-500/30 bg-gray-50/70 shadow-inner flex items-center px-2.5 py-1.5 opacity-80">
                      <input
                        type="text"
                        readOnly
                        value={`${displayDept} • ${displayDesignation}`}
                        className="w-full bg-transparent text-base font-normal text-gray-900 focus:outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Personal & Contact Details */}
              <div className="pt-1 space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <i className="fi fi-sr-user text-indigo-600"></i>
                  Personal & Contact
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Phone Contact */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-phone-call text-gray-400 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">Teacher Phone</span>
                    </label>
                    <div
                      className={`rounded-md border border-gray-500/30 shadow-inner flex items-center px-2.5 py-1.5 transition ${
                        isEditing ? "bg-white" : "bg-gray-50/70"
                      }`}
                    >
                      <input
                        type="text"
                        readOnly={!isEditing}
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full bg-transparent text-base font-normal text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Educational Qualification */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-sr-graduation-cap text-gray-400 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">
                        Highest Degree Qualification
                      </span>
                    </label>
                    <div
                      className={`rounded-md border border-gray-500/30 shadow-inner flex items-center px-2.5 py-1.5 transition ${
                        isEditing ? "bg-white" : "bg-gray-50/70"
                      }`}
                    >
                      <input
                        type="text"
                        readOnly={!isEditing}
                        value={formData.qualification}
                        onChange={(e) =>
                          handleInputChange("qualification", e.target.value)
                        }
                        className="w-full bg-transparent text-base font-normal text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Subject Specialization */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-bulb text-indigo-500 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">
                        Subject Specialization
                      </span>
                    </label>
                    <div
                      className={`rounded-md border border-gray-500/30 shadow-inner flex items-center px-2.5 py-1.5 transition ${
                        isEditing ? "bg-white" : "bg-gray-50/70"
                      }`}
                    >
                      <input
                        type="text"
                        readOnly={!isEditing}
                        value={formData.specialization}
                        onChange={(e) =>
                          handleInputChange("specialization", e.target.value)
                        }
                        className="w-full bg-transparent text-base font-normal text-indigo-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Office Consultation Hours */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-time-twelve text-gray-400 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">
                        Office Consultation Hours
                      </span>
                    </label>
                    <div
                      className={`rounded-md border border-gray-500/30 shadow-inner flex items-center px-2.5 py-1.5 transition ${
                        isEditing ? "bg-white" : "bg-gray-50/70"
                      }`}
                    >
                      <input
                        type="text"
                        readOnly={!isEditing}
                        value={formData.officeHours}
                        onChange={(e) =>
                          handleInputChange("officeHours", e.target.value)
                        }
                        className="w-full bg-transparent text-base font-normal text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Action Bar: Edit Details / Save / Cancel Button */}
              <div className="pt-4 border-t border-gray-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-gray-500 font-normal">
                  {isEditing
                    ? "Click 'Save Changes' to update backend database"
                    : "Teacher profile details stored in database"}
                </span>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-5 py-2.5 rounded-md bg-slate-800 text-white hover:bg-slate-900 text-base font-normal transition cursor-pointer border-none shadow-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-md bg-black text-white font-normal text-base hover:bg-black/90 transition shadow-md border-none cursor-pointer disabled:opacity-50 flex items-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <i className="fi fi-rr-spinner animate-spin text-sm"></i>
                            <span>Saving to Database...</span>
                          </>
                        ) : (
                          <span>Save Changes to Database</span>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 rounded-md bg-black text-white font-normal text-base hover:bg-black/90 transition shadow-md border-none cursor-pointer flex items-center gap-2"
                    >
                      <i className="fi fi-rr-edit text-sm"></i>
                      <span>Edit Details</span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
