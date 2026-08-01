"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Loader from "@/components/ui/Loader";
import { StudentRecord } from "@/lib/backend-student";
import { Badge } from "@/components/ui/badge";
import { downloadDocument } from "@/lib/download-utils";

// Dynamically import StudentCard from components/ui with SSR disabled for styled-components
const StudentCard = dynamic(() => import("@/components/ui/StudentCard"), {
  ssr: false,
  loading: () => (
    <div className="w-full flex items-center justify-center p-8 bg-white rounded-md border border-gray-500/30 shadow-md min-h-[220px]">
      <Loader />
    </div>
  ),
});

export default function StudentProfileView() {
  const { data: session } = useSession();
  const rawName = session?.user?.name;
  const userName =
    !rawName || rawName === "Alex Johnson" || rawName === "Student Account"
      ? "Aria Rahman"
      : rawName;
  const userEmail =
    session?.user?.email || "aria.rahman.12a03@schollege.edu.bd";

  const [profile, setProfile] = useState<StudentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarIndex, setAvatarIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("schollege_student_avatar_index");
      if (saved) setAvatarIndex(Number(saved));
    }
  }, []);

  const handleCycleAvatar = () => {
    setAvatarIndex((prev) => {
      const nextIndex = prev + 1;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "schollege_student_avatar_index",
          String(nextIndex),
        );
        window.dispatchEvent(
          new CustomEvent("student-avatar-changed", {
            detail: { avatarIndex: nextIndex },
          }),
        );
      }
      return nextIndex;
    });
  };

  // Form State for Editing
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    fatherName: "",
    fatherMobile: "",
    motherName: "",
    motherMobile: "",
    guardianPhone: "",
    bloodGroup: "",
    address: "House 42, Road 11, Banani, Dhaka",
  });

  // Asynchronously fetch logged-in student record from backend REST API
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/students?email=${encodeURIComponent(userEmail)}`,
        );
        if (res.ok) {
          const data = await res.json();
          let currentStudent: StudentRecord | null = null;
          if (data.students && data.students.length > 0) {
            currentStudent = data.students[0];
          } else {
            // If email query finds no match, fetch first student as demo
            const fallbackRes = await fetch(`/api/students?limit=1`);
            const fallbackData = await fallbackRes.json();
            if (fallbackData.students && fallbackData.students.length > 0) {
              currentStudent = fallbackData.students[0];
            }
          }

          if (currentStudent) {
            setProfile(currentStudent);
            setFormData({
              name: currentStudent.name,
              phone: currentStudent.phone,
              fatherName: currentStudent.fatherName,
              fatherMobile: currentStudent.fatherMobile,
              motherName: currentStudent.motherName,
              motherMobile: currentStudent.motherMobile,
              guardianPhone: currentStudent.guardianPhone,
              bloodGroup: currentStudent.bloodGroup,
              address: "House 42, Road 11, Banani, Dhaka",
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch student profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userEmail]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile?.email || userEmail,
          id: profile?.id,
          name: formData.name,
          phone: formData.phone,
          fatherName: formData.fatherName,
          fatherMobile: formData.fatherMobile,
          motherName: formData.motherName,
          motherMobile: formData.motherMobile,
          guardianPhone: formData.guardianPhone,
          bloodGroup: formData.bloodGroup,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.student) {
          setProfile((prev) => ({ ...prev, ...result.student }));
        }
        setIsEditing(false);
        toast.success("Personal details updated and saved successfully!");

        // Trigger role/recipient-scoped notification
        await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "STUDENT",
            title: "Student Profile Details Updated",
            message: `Personal details and emergency contact for ${formData.name} were updated in database.`,
            targetRole: "STUDENT",
            recipientEmail: userEmail,
            senderName: "Student Portal Engine",
          }),
        });
      } else {
        toast.error("Failed to update profile details.");
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
      toast.error("An error occurred while saving profile changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadCard = () => {
    const cardText = `====================================================
SCHOLLEGE DIGITAL STUDENT IDENTITY CARD
====================================================
Student Name: ${displayName}
Student ID: ${displayStudentId}
Roll Number: ${displayRollNo}
Class & Section: ${displayClassSec}
Academic Group: ${displayGroup}
Blood Group: ${displayBloodGroup}
Guardian Contact: ${displayGuardianPhone}
Tuition Clearance: ${isTuitionPaid ? "PAID IN FULL" : "DUE"}
Attendance Rate: ${attendanceRate}

Institution: Schollege MS Campus
Academic Year: 2026
====================================================`;
    downloadDocument(`Student_ID_Card_${displayStudentId}.txt`, cardText);
  };

  const handleDownloadCV = () => {
    const cvText = `====================================================
SCHOLLEGE EDUCATIONAL INSTITUTION - STUDENT CV
====================================================
NAME: ${displayName}
STUDENT ID: ${displayStudentId}
ROLL NUMBER: ${displayRollNo}
CLASS & SECTION: ${displayClassSec}
ACADEMIC GROUP: ${displayGroup}
EMAIL: ${displayEmail}
PHONE: ${displayPhone}

----------------------------------------------------
FAMILY & GUARDIAN DETAILS
----------------------------------------------------
Father's Name: ${displayFatherName} (${displayFatherMobile})
Mother's Name: ${displayMotherName} (${displayMotherMobile})
Blood Group: ${displayBloodGroup}

----------------------------------------------------
ACADEMIC STANDING & PERFORMANCE
----------------------------------------------------
Attendance Rate: ${attendanceRate}
Tuition Status: ${isTuitionPaid ? "PAID IN FULL" : "DUE"}

Generated on: ${new Date().toLocaleString()}
Schollege School & College Management System
====================================================`;
    downloadDocument(
      `${displayName.replace(/[^a-zA-Z0-9]/g, "_")}_CV.txt`,
      cvText,
    );
  };

  const displayName = isEditing ? formData.name : profile?.name || userName;
  const displayEmail = profile?.email || userEmail;
  const displayPhone = isEditing
    ? formData.phone
    : profile?.phone || "+880 1712-345678";
  const displayFatherName = isEditing
    ? formData.fatherName
    : profile?.fatherName || "Mr. Tariq Rahman";
  const displayMotherName = isEditing
    ? formData.motherName
    : profile?.motherName || "Mrs. Nasrin Rahman";
  const displayFatherMobile = isEditing
    ? formData.fatherMobile
    : profile?.fatherMobile || "+880 1711-345678";
  const displayMotherMobile = isEditing
    ? formData.motherMobile
    : profile?.motherMobile || "+880 1819-876543";
  const displayGuardianPhone = isEditing
    ? formData.guardianPhone
    : profile?.guardianPhone || "+880 1819-876543";
  const displayBloodGroup = isEditing
    ? formData.bloodGroup
    : profile?.bloodGroup || "O +ve";
  const displayStudentId = profile?.studentIdNumber || "SCH-2026-1024";
  const displayClassSec = profile
    ? `${profile.className} - ${profile.sectionName}`
    : "Class 12 - Sec A";
  const displayRollNo = profile?.rollNo || "261-12-0003";
  const displayGroup = profile?.group || "Science";
  const displayGender = profile?.gender || "FEMALE";
  const isTuitionPaid = profile?.tuitionStatus === "PAID";
  const attendanceRate = profile?.attendanceRate || "96.4%";

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center p-20 bg-white rounded-md border border-gray-500/30 shadow-md min-h-[360px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-4 font-outfit">
      {/* Header Banner (rounded-md) */}
      <div className="bg-white p-5 rounded-md border border-gray-500/30 shadow-none flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i className="fi fi-sr-portrait text-indigo-600 text-base"></i>
            Student Profile & Digital Identity Card
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Official Schollege MS Student Credentials
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadCV}
            className="border-none bg-emerald-600 hover:bg-emerald-700 text-white font-normal text-base px-4 py-2 rounded-md flex items-center gap-1.5 shadow-sm cursor-pointer transition"
          >
            <i className="fi fi-rr-download text-base text-white"></i>
            Download Student CV (PDF)
          </button>
          <button
            onClick={handleDownloadCard}
            className="border-none bg-black hover:bg-gray-800 text-white font-normal text-base px-4 py-2 rounded-md flex items-center gap-1.5 shadow-sm cursor-pointer transition"
          >
            <i className="fi fi-rr-download text-base text-white"></i>
            Download ID Card (PDF)
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-5 items-start">
        {/* STUDENT IDENTITY CARD (w-[40%] - Fully Dynamic Backend Data) */}
        <div className="w-full xl:w-[40%] flex justify-center">
          <StudentCard
            userName={displayName}
            studentGender={displayGender}
            avatarUrl={session?.user?.image || profile?.avatarUrl}
            avatarIndex={avatarIndex}
            onCycleAvatar={handleCycleAvatar}
            studentIdNumber={displayStudentId}
            classNameStr={displayClassSec}
            rollNo={displayRollNo}
            group={displayGroup}
            bloodGroup={displayBloodGroup}
            phone={displayPhone}
            guardianPhone={displayGuardianPhone}
          />
        </div>

        {/* Detailed Profile Info (Icons Perfectly Aligned Center with Field Labels) */}
        <div className="w-full xl:w-[60%] space-y-4">
          <div className="bg-white rounded-md p-5 border border-gray-500/30 shadow-md space-y-4">
            {/* Header with Title, Toggle Edit & Sleek Redesigned Badges */}
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

              {/* Sleek Redesigned Status Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Active Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-50/80 px-2.5 py-1 text-xs font-bold text-emerald-700 shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  Active
                </div>

                {/* Present Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/40 bg-indigo-50/80 px-2.5 py-1 text-xs font-bold text-indigo-700 shadow-xs">
                  <i className="fi fi-rr-user-check text-[11px]"></i>
                  Present ({attendanceRate})
                </div>

                {/* Tuition Badge */}
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold shadow-xs ${
                    isTuitionPaid
                      ? "border-emerald-500/40 bg-emerald-50/80 text-emerald-700"
                      : "border-amber-500/40 bg-amber-50/80 text-amber-700"
                  }`}
                >
                  <i
                    className={`fi ${isTuitionPaid ? "fi-rr-badge-dollar" : "fi-rr-time-fast"} text-[11px]`}
                  ></i>
                  {isTuitionPaid ? "Tuition Paid" : "Tuition Due"}
                </div>
              </div>
            </div>

            {/* Form Layout with Icons Perfectly Centered with Title Labels */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              {/* Section 1: Academic & Institutional Credentials */}
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
                        value={displayEmail}
                        className="w-full bg-transparent text-base font-normal text-gray-900 focus:outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Student ID */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-id-badge text-gray-400 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">Student ID Number</span>
                    </label>
                    <div className="rounded-md border border-gray-500/30 bg-gray-50/70 shadow-inner flex items-center px-2.5 py-1.5 opacity-80">
                      <input
                        type="text"
                        readOnly
                        value={displayStudentId}
                        className="w-full bg-transparent text-base font-outfit font-normal text-gray-900 focus:outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Roll Number */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-document text-gray-400 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">Roll Number</span>
                    </label>
                    <div className="rounded-md border border-gray-500/30 bg-gray-50/70 shadow-inner flex items-center px-2.5 py-1.5 opacity-80">
                      <input
                        type="text"
                        readOnly
                        value={displayRollNo}
                        className="w-full bg-transparent text-base font-outfit font-normal text-gray-900 focus:outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Class & Section */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-book-alt text-gray-400 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">Class & Section</span>
                    </label>
                    <div className="rounded-md border border-gray-500/30 bg-gray-50/70 shadow-inner flex items-center px-2.5 py-1.5 opacity-80">
                      <input
                        type="text"
                        readOnly
                        value={displayClassSec}
                        className="w-full bg-transparent text-base font-normal text-gray-900 focus:outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Academic Stream */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-bulb text-indigo-500 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">Academic Stream</span>
                    </label>
                    <div className="rounded-md border border-gray-500/30 bg-gray-50/70 shadow-inner flex items-center px-2.5 py-1.5 opacity-80">
                      <input
                        type="text"
                        readOnly
                        value={displayGroup}
                        className="w-full bg-transparent text-base font-normal text-indigo-700 focus:outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Personal & Contacts */}
              <div className="pt-1 space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <i className="fi fi-sr-user text-indigo-600"></i>
                  Personal & Contact
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Student Phone */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-phone-call text-gray-400 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">Student Phone</span>
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
                        className="w-full bg-transparent text-base font-outfit font-normal text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Blood Group */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-heart text-rose-500 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">Blood Group</span>
                    </label>
                    <div
                      className={`rounded-md border border-gray-500/30 shadow-inner flex items-center px-2.5 py-1.5 transition ${
                        isEditing ? "bg-white" : "bg-rose-50/60"
                      }`}
                    >
                      <input
                        type="text"
                        readOnly={!isEditing}
                        value={formData.bloodGroup}
                        onChange={(e) =>
                          handleInputChange("bloodGroup", e.target.value)
                        }
                        className="w-full bg-transparent text-base font-normal text-rose-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-venus-mars text-gray-400 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">Gender</span>
                    </label>
                    <div className="rounded-md border border-gray-500/30 bg-gray-50/70 shadow-inner flex items-center px-2.5 py-1.5 opacity-80">
                      <input
                        type="text"
                        readOnly
                        value={displayGender}
                        className="w-full bg-transparent text-base font-normal text-gray-900 focus:outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Residential Address */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-marker text-gray-400 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">Residential Address</span>
                    </label>
                    <div
                      className={`rounded-md border border-gray-500/30 shadow-inner flex items-center px-2.5 py-1.5 transition ${
                        isEditing ? "bg-white" : "bg-gray-50/70"
                      }`}
                    >
                      <input
                        type="text"
                        readOnly={!isEditing}
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="w-full bg-transparent text-base font-normal text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Guardian Details */}
              <div className="pt-1 space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <i className="fi fi-sr-users-alt text-indigo-600"></i>
                  Guardian & Family Contact
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Father's Name */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-user text-gray-400 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">Father's Name</span>
                    </label>
                    <div
                      className={`rounded-md border border-gray-500/30 shadow-inner flex items-center px-2.5 py-1.5 transition ${
                        isEditing ? "bg-white" : "bg-gray-50/70"
                      }`}
                    >
                      <input
                        type="text"
                        readOnly={!isEditing}
                        value={formData.fatherName}
                        onChange={(e) =>
                          handleInputChange("fatherName", e.target.value)
                        }
                        className="w-full bg-transparent text-base font-normal text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Father's Mobile */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-smartphone text-gray-400 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">Father's Mobile</span>
                    </label>
                    <div
                      className={`rounded-md border border-gray-500/30 shadow-inner flex items-center px-2.5 py-1.5 transition ${
                        isEditing ? "bg-white" : "bg-gray-50/70"
                      }`}
                    >
                      <input
                        type="text"
                        readOnly={!isEditing}
                        value={formData.fatherMobile}
                        onChange={(e) =>
                          handleInputChange("fatherMobile", e.target.value)
                        }
                        className="w-full bg-transparent text-base font-outfit font-normal text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Mother's Name */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-user text-gray-400 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">Mother's Name</span>
                    </label>
                    <div
                      className={`rounded-md border border-gray-500/30 shadow-inner flex items-center px-2.5 py-1.5 transition ${
                        isEditing ? "bg-white" : "bg-gray-50/70"
                      }`}
                    >
                      <input
                        type="text"
                        readOnly={!isEditing}
                        value={formData.motherName}
                        onChange={(e) =>
                          handleInputChange("motherName", e.target.value)
                        }
                        className="w-full bg-transparent text-base font-normal text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Mother's Mobile */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-smartphone text-gray-400 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">Mother's Mobile</span>
                    </label>
                    <div
                      className={`rounded-md border border-gray-500/30 shadow-inner flex items-center px-2.5 py-1.5 transition ${
                        isEditing ? "bg-white" : "bg-gray-50/70"
                      }`}
                    >
                      <input
                        type="text"
                        readOnly={!isEditing}
                        value={formData.motherMobile}
                        onChange={(e) =>
                          handleInputChange("motherMobile", e.target.value)
                        }
                        className="w-full bg-transparent text-base font-outfit font-normal text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Guardian Emergency Contact */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 leading-none">
                      <i className="fi fi-rr-shield-exclamation text-amber-500 text-xs flex items-center justify-center leading-none"></i>
                      <span className="leading-none">
                        Guardian Emergency Contact
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
                        value={formData.guardianPhone}
                        onChange={(e) =>
                          handleInputChange("guardianPhone", e.target.value)
                        }
                        className="w-full bg-transparent text-base font-outfit font-normal text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Footer Actions: Edit / Save / Cancel */}
              <div className="pt-3 border-t border-gray-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                  <i className="fi fi-rr-shield-check text-emerald-600 text-sm"></i>
                  Last Verification:{" "}
                  <strong className="text-gray-900">Aug 01, 2026</strong>
                </span>

                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-black hover:bg-gray-800 text-white font-bold text-xs px-4 py-2 rounded-md border-none cursor-pointer shadow-sm flex items-center gap-1.5 transition"
                    >
                      <i className="fi fi-rr-edit text-xs"></i>
                      Edit Personal Details
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          if (profile) {
                            setFormData({
                              name: profile.name,
                              phone: profile.phone,
                              fatherName: profile.fatherName,
                              fatherMobile: profile.fatherMobile,
                              motherName: profile.motherName,
                              motherMobile: profile.motherMobile,
                              guardianPhone: profile.guardianPhone,
                              bloodGroup: profile.bloodGroup,
                              address: "House 42, Road 11, Banani, Dhaka",
                            });
                          }
                        }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs px-4 py-2 rounded-md border-none cursor-pointer transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-md border-none cursor-pointer shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
                      >
                        <i className="fi fi-rr-check text-xs"></i>
                        {saving ? "Saving..." : "Save Updated Info"}
                      </button>
                    </>
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
