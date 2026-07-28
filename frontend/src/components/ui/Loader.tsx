'use client';

import React from 'react';
import { Component as PencilLoader } from '@/components/ui/loader-1';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function Loader({
  size = 'md',
  text,
  fullScreen = false,
  className = '',
}: LoaderProps) {
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
    '2xl': 'w-80 h-80',
  };

  const textMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl',
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const currentTextSize = textMap[size] || textMap.md;

  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className={`relative ${currentSize} flex items-center justify-center`}>
        <PencilLoader className="w-full h-full text-black" />
      </div>

      {text && (
        <span className={`font-bold tracking-wide text-black/90 ${currentTextSize} animate-pulse`}>
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
}
