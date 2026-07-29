"use client";

import React, { useState, useRef, useEffect } from "react";

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  alignRight?: boolean;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select option",
  className = "",
  buttonClassName = "",
  alignRight = true,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button (rounded-md border-none) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center justify-between gap-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 border-none font-bold text-gray-900 transition-all rounded-md text-xs cursor-pointer shadow-xs focus:outline-none ${
          isOpen ? "bg-gray-200" : ""
        } ${buttonClassName}`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <i
          className={`fi fi-rr-angle-small-down text-gray-600 transition-transform duration-200 text-xs ${
            isOpen ? "rotate-180 text-black font-bold" : ""
          }`}
        />
      </button>

      {/* Floating Popover Dropdown Panel (rounded-md border-none) */}
      {isOpen && (
        <div
          className={`absolute z-[999] mt-2 w-48 bg-white rounded-md shadow-2xl border-none p-1.5 text-xs animate-in fade-in slide-in-from-top-2 duration-150 max-h-64 overflow-y-auto ${
            alignRight ? "right-0" : "left-0"
          }`}
        >
          <div className="space-y-1">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left font-bold border-none transition-all cursor-pointer ${
                    isSelected
                      ? "bg-black text-white shadow-xs"
                      : "text-gray-800 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <i className="fi fi-rr-check text-white text-xs shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
