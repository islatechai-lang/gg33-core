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

      {/* Subtle Warm Glow Behind Logo */}
      <div className="absolute w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-4 text-center">
        {/* Clean Logo with Soft Pulse */}
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/10 border border-zinc-800/80 bg-zinc-950 p-2.5 transition-transform">
          <img
            src="/images/logo.png?v=1"
            alt="GG33 CORE"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Brand Name */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight gradient-text">
            GG33 CORE
          </h1>
          {message ? (
            <p className="text-xs text-zinc-400 font-medium">
              {message}
            </p>
          ) : (
            <p className="text-xs text-zinc-500 font-medium">
              Loading...
            </p>
          )}
        </div>

        {/* Minimal Clean Gold Spinner */}
        <div className="w-5 h-5 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mt-1" />
      </div>
    </div>
  );
}
