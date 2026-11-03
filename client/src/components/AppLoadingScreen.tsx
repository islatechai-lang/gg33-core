import React from 'react';
import { StarField } from '@/components/StarField';

interface AppLoadingScreenProps {
  message?: string;
  subMessage?: string;
}

export function AppLoadingScreen({ message }: AppLoadingScreenProps) {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col relative selection:bg-amber-500/30 overflow-x-hidden">
      {/* Background Starfield & Subtle Glow */}
      <StarField />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Navbar Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          {/* Logo & Brand Skeleton */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-800/70 border border-zinc-700/40 animate-pulse" />
            <div className="h-4 w-28 bg-zinc-800/70 rounded-md animate-pulse" />
          </div>

          {/* Right Action Buttons Skeleton */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block h-8 w-28 rounded-full bg-amber-500/10 border border-amber-500/20 animate-pulse" />
            <div className="w-8 h-8 rounded-xl bg-zinc-800/70 border border-zinc-700/40 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Dashboard Skeleton */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 pt-20 pb-24 sm:pb-16 relative z-10 space-y-6">
        {/* Hero Profile Overview Card Skeleton */}
        <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-xl shadow-2xl space-y-6">
          {/* User Info Header */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-800/60">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800/70 border border-zinc-700/40 flex-shrink-0 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-20 bg-zinc-800/50 rounded animate-pulse" />
                <div className="h-6 w-40 sm:w-56 bg-zinc-800/80 rounded-md animate-pulse" />
                <div className="flex items-center gap-3 pt-0.5">
                  <div className="h-3 w-24 bg-zinc-800/40 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-zinc-800/40 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="hidden sm:block h-7 w-20 rounded-full bg-zinc-800/50 border border-zinc-700/30 animate-pulse" />
          </div>

          {/* 1. Life Path & Energy Signature Side-by-Side Skeleton */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-900/50 border border-amber-500/20 flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/15 border border-amber-500/25 flex-shrink-0 animate-pulse" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-2.5 w-14 bg-amber-500/30 rounded animate-pulse" />
                <div className="h-4 w-24 sm:w-32 bg-zinc-700/60 rounded animate-pulse" />
                <div className="h-2.5 w-16 bg-zinc-800/50 rounded animate-pulse hidden sm:block" />
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 flex flex-col justify-center space-y-1.5">
              <div className="h-2.5 w-24 bg-zinc-800/50 rounded animate-pulse" />
              <div className="h-4 sm:h-5 w-28 sm:w-40 bg-zinc-700/60 rounded animate-pulse" />
              <div className="h-2.5 w-20 bg-zinc-800/50 rounded animate-pulse hidden sm:block" />
            </div>
          </div>

          {/* 2. Western & Chinese Zodiac Side-by-Side Skeleton */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/40 flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-800/70 flex-shrink-0 animate-pulse" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-2.5 w-16 bg-zinc-800/40 rounded animate-pulse" />
                <div className="h-3.5 w-20 bg-zinc-700/50 rounded animate-pulse" />
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/40 flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-800/70 flex-shrink-0 animate-pulse" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-2.5 w-16 bg-zinc-800/40 rounded animate-pulse" />
                <div className="h-3.5 w-20 bg-zinc-700/50 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* 3. Numbers Grid Skeleton */}
          <div className="space-y-2.5">
            <div className="h-3 w-32 bg-zinc-800/50 rounded animate-pulse" />
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/40 flex flex-col items-center justify-center gap-2 h-20 sm:h-22"
                >
                  <div className="w-6 h-6 rounded-lg bg-zinc-800/70 animate-pulse" />
                  <div className="h-4 w-6 bg-zinc-700/70 rounded animate-pulse" />
                  <div className="h-2 w-12 bg-zinc-800/40 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower Row: Personality Insights & Daily Energy Skeletons */}
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Card 1 Skeleton */}
          <div className="rounded-3xl p-6 sm:p-7 bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-800/70 animate-pulse" />
                <div className="h-4 w-36 bg-zinc-800/70 rounded animate-pulse" />
              </div>
              <div className="h-3 w-16 bg-zinc-800/40 rounded animate-pulse" />
            </div>
            <div className="space-y-2.5 pt-2">
              <div className="h-3.5 w-full bg-zinc-800/40 rounded animate-pulse" />
              <div className="h-3.5 w-[92%] bg-zinc-800/40 rounded animate-pulse" />
              <div className="h-3.5 w-[78%] bg-zinc-800/35 rounded animate-pulse" />
              <div className="h-3.5 w-[85%] bg-zinc-800/35 rounded animate-pulse" />
              <div className="h-3.5 w-[60%] bg-zinc-800/30 rounded animate-pulse" />
            </div>
          </div>

          {/* Card 2 Skeleton */}
          <div className="rounded-3xl p-6 sm:p-7 bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 animate-pulse" />
                <div className="h-4 w-32 bg-zinc-800/70 rounded animate-pulse" />
              </div>
              <div className="h-3 w-14 bg-zinc-800/40 rounded animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/40 space-y-2">
              <div className="h-4 w-28 bg-amber-500/30 rounded animate-pulse" />
              <div className="h-3.5 w-full bg-zinc-800/40 rounded animate-pulse" />
              <div className="h-3.5 w-[80%] bg-zinc-800/35 rounded animate-pulse" />
            </div>
            <div className="space-y-2 pt-1">
              <div className="h-3.5 w-[90%] bg-zinc-800/40 rounded animate-pulse" />
              <div className="h-3.5 w-[70%] bg-zinc-800/30 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Status Pill (only shown when a specific background status message exists) */}
      {message && (
        <aside
          aria-live="polite"
          className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900/90 border border-amber-500/30 text-xs font-medium text-zinc-300 shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-md"
        >
          <div className="w-3.5 h-3.5 border-2 border-amber-500/25 border-t-amber-400 rounded-full animate-spin flex-shrink-0" />
          <span>{message}</span>
        </aside>
      )}

      {/* Fixed Bottom Navigation Skeleton for Mobile */}
      <nav
        aria-label="Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-zinc-800/80 bg-zinc-950/95 backdrop-blur-xl sm:hidden flex items-center justify-around px-2"
      >
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 py-1 px-3">
            <div className="w-5 h-5 rounded-md bg-zinc-800/70 animate-pulse" />
            <div className="h-2 w-7 bg-zinc-850 rounded animate-pulse" />
          </div>
        ))}
      </nav>
    </div>
  );
}
