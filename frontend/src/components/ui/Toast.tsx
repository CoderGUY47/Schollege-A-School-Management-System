"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Render Stack */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col space-y-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold border transition-all duration-300 animate-slide-in ${
              toast.type === "success"
                ? "bg-[#0B0F17] text-white border-black/20"
                : toast.type === "error"
                ? "bg-red-950 text-red-200 border-red-800"
                : "bg-gray-900 text-white border-gray-700"
            }`}
          >
            <i
              className={`text-sm shrink-0 ${
                toast.type === "success"
                  ? "fi fi-rr-check-circle text-emerald-400"
                  : toast.type === "error"
                  ? "fi fi-rr-cross-circle text-red-400"
                  : "fi fi-rr-info text-blue-400"
              }`}
            ></i>
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-white/60 hover:text-white transition"
            >
              <i className="fi fi-rr-cross text-[10px]"></i>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if provider is not present
    return {
      showToast: (msg: string, type: "success" | "error" | "info" = "success") => {
        console.log(`[Toast ${type}]: ${msg}`);
      },
    };
  }
  return context;
}
