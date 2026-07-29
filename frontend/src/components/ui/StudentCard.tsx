"use client";

import React from "react";
import Image from "next/image";
import StudentAvatar from "@/components/student/StudentAvatar";
import QRCode from "react-qr-code";
import styled from "styled-components";

interface StudentCardProps {
  userName: string;
  studentGender?: "MALE" | "FEMALE";
  avatarIndex: number;
  onCycleAvatar: () => void;
  studentIdNumber?: string;
  classNameStr?: string;
  rollNo?: string;
  group?: string;
  bloodGroup?: string;
  phone?: string;
  guardianPhone?: string;
  avatarUrl?: string;
}

export default function StudentCard({
  userName,
  studentGender = "FEMALE",
  avatarUrl,
  avatarIndex,
  onCycleAvatar,
  studentIdNumber = "",
  classNameStr = "",
  rollNo = "",
  group = "",
  bloodGroup = "",
  phone = "",
  guardianPhone = "",
}: StudentCardProps) {
  // Extract roll badge number (e.g. "03" or "0003" from "261-12-0003" or "03")
  const rollBadge = rollNo.includes("-") ? rollNo.split("-").pop() || "" : rollNo;

  return (
    <StyledWrapper>
      <div className="ticket-canvas">
        <div className="ticket-wrapper">
          <div className="ticket">
            {/* MAIN SECTION (LEFT) */}
            <div className="t-main">
              <div className="t-content">
                {/* HEADER */}
                <div className="t-header">
                  <div className="t-logo">
                    <div className="t-logo-img">
                      <Image
                        src="/images/logo.png"
                        alt="Schollege Logo"
                        width={24}
                        height={24}
                        className="h-5 w-5 object-contain rounded-full"
                      />
                    </div>
                    <span>SCHOLLEGE</span>
                  </div>
                  <div className="t-type">IDENTITY CARD</div>
                </div>

                {/* CARD BODY: AVATAR & DETAILS */}
                <div className="t-body flex flex-row items-center gap-4">
                  {/* AVATAR + RECYCLE BUTTON */}
                  <div className="t-avatar-col flex flex-col items-center shrink-0">
                    <div className="relative">
                      <div className="rounded-full overflow-hidden border-2 border-indigo-400/50 shadow-lg h-24 w-24 flex items-center justify-center bg-[#2b2b36]">
                        <StudentAvatar
                          name={userName}
                          gender={studentGender}
                          avatarUrl={avatarUrl}
                          avatarIndex={avatarIndex}
                          sizeClassName="h-40 w-40"
                        />
                      </div>
                      <button
                        onClick={onCycleAvatar}
                        title="Cycle Avatar"
                        className="absolute top-1 -right-1 text-white hover:text-indigo-300 bg-transparent border-none p-1 cursor-pointer transition active:scale-95 flex items-center justify-center"
                      >
                        <i className="fi fi-br-refresh text-xs"></i>
                      </button>
                    </div>
                    <div className="text-center mt-2">
                      <div className="font-bold text-white text-sm leading-snug">{userName}</div>
                      <div className="text-[10px] text-indigo-300 flex items-center justify-center gap-1 mt-0.5 font-mono">
                        <i className="fi fi-rr-phone-call text-[9px]"></i>
                        <span>{phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* DETAILS GRID */}
                  <div className="t-details-col flex-1 grid grid-cols-2 gap-x-3 gap-y-2 text-sm pl-3 border-l border-white/10">
                    <div className="t-detail-item">
                      <span className="t-label">Student ID</span>
                      <span className="t-value font-mono">{studentIdNumber}</span>
                    </div>
                    <div className="t-detail-item">
                      <span className="t-label">Class & Sec</span>
                      <span className="t-value">{classNameStr}</span>
                    </div>
                    <div className="t-detail-item">
                      <span className="t-label">Roll No.</span>
                      <span className="t-value font-outfit text-white font-bold">{rollNo}</span>
                    </div>
                    <div className="t-detail-item">
                      <span className="t-label">Stream</span>
                      <span className="t-value text-indigo-300">{group}</span>
                    </div>
                    <div className="t-detail-item">
                      <span className="t-label">Blood Group</span>
                      <span className="t-value text-rose-400">{bloodGroup}</span>
                    </div>
                    <div className="t-detail-item">
                      <span className="t-label">Guardian</span>
                      <span className="t-value text-xs font-outfit text-white">{guardianPhone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* VERTICAL PERFORATION LINE */}
            <div className="t-perforation-v">
              <div className="t-perf-line-v" />
            </div>

            {/* STUB SECTION (RIGHT) */}
            <div className="t-stub">
              <div className="t-stub-header">
                <span className="t-stub-badge">VERIFIED ID</span>
              </div>

              <div className="t-qr-container">
                <QRCode
                  value={`${studentIdNumber}|${userName}|${classNameStr}|SCHOLLEGE`}
                  size={82}
                  bgColor="transparent"
                  fgColor="#ffffff"
                  level="M"
                  style={{ display: "block" }}
                />
                <div className="t-qr-sub">SCAN TO VERIFY</div>
              </div>

              <div className="t-admit">
                <div className="t-admit-text text-white">Roll No</div>
                <div className="t-admit-num text-white">{rollBadge}</div>
              </div>

              <div className="t-barcode-id text-white">{rollNo}-SCH</div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;

  .ticket-canvas {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5em 0;
  }

  .ticket-wrapper {
    --t-bg: #1e1e24;
    --t-bg-light: #2b2b36;
    --t-accent: #7c3aed;
    --t-accent-glow: rgba(124, 58, 237, 0.5);
    --t-text-main: #f8fafc;
    --t-text-muted: #94a3b8;
    font-size: 11px;
    perspective: 1000px;
    display: block;
    width: 100%;
  }

  .ticket {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: row;
    color: var(--t-text-main);
    font-family: "Space Grotesk", "Segoe UI", system-ui, sans-serif;
    box-shadow: none;
    background: transparent;
    filter: none;
    border-radius: 1em;
  }

  .ticket-wrapper:hover .ticket {
    transform: none;
    box-shadow: none;
  }

  .ticket::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 1em;
    pointer-events: none;
    background: linear-gradient(
      115deg,
      transparent 0%,
      transparent 40%,
      rgba(255, 255, 255, 0.1) 45%,
      rgba(255, 255, 255, 0.25) 50%,
      rgba(255, 255, 255, 0.1) 55%,
      transparent 60%,
      transparent 100%
    );
    z-index: 10;
    background-size: 250% 250%;
    background-position: 100% 100%;
    transition: background-position 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    mix-blend-mode: overlay;
  }

  .ticket-wrapper:hover .ticket::after {
    background-position: 0% 0%;
  }

  .t-main {
    flex: 1;
    padding: 1.6em 1.8em;
    position: relative;
    overflow: hidden;
    background: radial-gradient(
        circle at top right,
        transparent 0.9em,
        var(--t-bg) 0.95em
      ),
      radial-gradient(circle at bottom right, transparent 0.9em, var(--t-bg) 0.95em);
    background-size: 100% 51%;
    background-position:
      top right,
      bottom right;
    background-repeat: no-repeat;
    border-top-left-radius: 1em;
    border-bottom-left-radius: 1em;
  }

  .t-main::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(
        rgba(124, 58, 237, 0.12) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(124, 58, 237, 0.12) 1px, transparent 1px);
    background-size: 2em 2em;
    opacity: 0.6;
    z-index: 0;
    pointer-events: none;
    transform: perspective(500px) rotateX(20deg) scale(1.5);
    animation: grid-scroll 20s linear infinite;
  }

  @keyframes grid-scroll {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0 4em;
    }
  }

  .t-content {
    position: relative;
    z-index: 1;
  }

  .t-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.2em;
    padding-bottom: 0.8em;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .t-logo {
    display: flex;
    align-items: center;
    gap: 0.6em;
    font-weight: 900;
    font-size: 1.1em;
    letter-spacing: 0.05em;
    color: #fff;
  }

  .t-logo-img {
    height: 1.8em;
    width: 1.8em;
    border-radius: 50%;
    background: #fff;
    padding: 0.15em;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px var(--t-accent-glow);
  }

  .t-type {
    font-size: 0.7em;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.4);
    padding: 0.3em 0.8em;
    border-radius: 99em;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.12);
  }

  .t-label {
    font-size: 0.65em;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--t-text-muted);
    display: block;
  }

  .t-value {
    font-size: 1em;
    font-weight: 700;
    color: var(--t-text-main);
  }

  .t-perforation-v {
    width: 0;
    position: relative;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .t-perf-line-v {
    height: 75%;
    width: 0;
    border-left: 2px dashed rgba(255, 255, 255, 0.2);
  }

  .t-stub {
    width: 13.5em;
    flex-shrink: 0;
    padding: 1.6em 1.2em;
    background: radial-gradient(
        circle at top left,
        transparent 0.9em,
        var(--t-bg-light) 0.95em
      ),
      radial-gradient(
        circle at bottom left,
        transparent 0.9em,
        var(--t-bg-light) 0.95em
      );
    background-size: 100% 51%;
    background-position:
      top left,
      bottom left;
    background-repeat: no-repeat;
    border-top-right-radius: 1em;
    border-bottom-right-radius: 1em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;
  }

  .t-stub-header {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .t-stub-badge {
    font-size: 0.6em;
    font-weight: 800;
    letter-spacing: 0.15em;
    color: #ffffff;
    background: rgba(255, 255, 255, 0.12);
    padding: 0.2em 0.6em;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .t-qr-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4em;
    margin: 0.5em 0;
  }

  .t-qr-sub {
    font-size: 0.65em;
    font-weight: 800;
    letter-spacing: 0.15em;
    color: #ffffff;
  }

  .t-admit {
    text-align: center;
    margin-top: 0.2em;
  }

  .t-admit-text {
    font-size: 0.65em;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #ffffff;
  }

  .t-admit-num {
    font-size: 2.2em;
    font-weight: 900;
    line-height: 1;
    color: #ffffff;
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
  }

  .t-barcode-id {
    font-family: monospace;
    font-size: 0.65em;
    color: var(--t-text-muted);
    letter-spacing: 0.15em;
    text-align: center;
    margin-top: 0.4em;
  }

  .ticket-wrapper:active .ticket {
    transform: none;
  }

  .ticket-wrapper:active .t-stub {
    transform: none;
  }
`;
