import React from 'react';
import { StarField } from '@/components/StarField';

interface AppLoadingScreenProps {
  message?: string;
  subMessage?: string;
}

export function AppLoadingScreen({
  message,
}: AppLoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden select-none">
      {/* Background Starfield */}
      <StarField />

      {/* Subtle Warm Amber Glow */}
      <div className="absolute w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-4 text-center">
        {/* Floating Logo with Soft Rounded Edges (No outer box) */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24">
          <img
            src="/images/logo.png?v=1"
            alt="GG33 CORE"
            className="w-full h-full object-contain rounded-2xl drop-shadow-[0_4px_24px_rgba(245,158,11,0.25)]"
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight gradient-text">
          GG33 CORE
        </h1>

        {/* Inline Loading Text with Side Spinner */}
        <div className="flex items-center justify-center gap-2 text-zinc-400 text-xs font-medium pt-1">
          <div className="w-3.5 h-3.5 border-2 border-amber-500/25 border-t-amber-400 rounded-full animate-spin flex-shrink-0" />
          <span>{message || 'Loading...'}</span>
        </div>
      </div>
    </div>
  );
}
