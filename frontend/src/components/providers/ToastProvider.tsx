"use client";

import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer
        theme="dark"
        toastClassName="!bg-[#0B0F17] !text-white !rounded-md !border !border-slate-700 !shadow-2xl !font-outfit !p-3.5 !text-sm !font-normal"
        progressClassName="!bg-gradient-to-r !from-emerald-400 !to-indigo-500 !h-1"
        pauseOnHover
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
    </>
  );
}
