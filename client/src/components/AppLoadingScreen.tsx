import React from 'react';
import { StarField } from '@/components/StarField';

interface AppLoadingScreenProps {
  message?: string;
  subMessage?: string;
}

export function AppLoadingScreen({ message }: AppLoadingScreenProps) {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col relative overflow-x-hidden selection:bg-amber-500/20">
      {/* Background Starfield */}
      <StarField />

      {/* Subtle Warm Amber Glow Behind Header */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar Skeleton - Matches Real Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/60 animate-pulse flex-shrink-0" />
            <div className="h-4 w-24 bg-zinc-700/80 rounded-md animate-pulse" />
          </div>

          {/* Center Navigation Placeholders (Desktop) */}
          <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            {[48, 56, 64, 72, 60].map((width, idx) => (
              <div
                key={idx}
                style={{ width: `${width}px` }}
                className="h-3.5 bg-zinc-800/80 rounded-md animate-pulse"
              />
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="h-8 w-24 sm:w-28 rounded-lg bg-amber-500/20 border border-amber-500/30 animate-pulse" />
            <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/60 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Dashboard Skeleton */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 pt-20 pb-24 lg:pb-16 relative z-10 space-y-6">
        {/* Hero Profile Overview Card Skeleton */}
        <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/80 shadow-2xl space-y-6 backdrop-blur-sm">
          {/* User Info Row */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-800/70">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700/60 flex-shrink-0 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-24 bg-zinc-800/80 rounded animate-pulse" />
                <div className="h-5 sm:h-6 w-44 sm:w-56 bg-zinc-700/90 rounded-md animate-pulse" />
                <div className="flex items-center gap-3 pt-0.5">
                  <div className="h-3 w-28 bg-zinc-800/70 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-zinc-800/60 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="hidden sm:block h-7 w-20 rounded-full bg-zinc-800/70 border border-zinc-700/50 animate-pulse" />
          </div>

          {/* 1. Life Path & Energy Signature Side-by-Side */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            {/* Life Path Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-900/80 border border-amber-500/25 flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/20 border border-amber-500/35 flex-shrink-0 animate-pulse" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-2.5 w-16 bg-amber-400/50 rounded animate-pulse" />
                <div className="h-4 w-24 sm:w-32 bg-zinc-700/90 rounded animate-pulse" />
                <div className="h-2.5 w-20 bg-zinc-800/80 rounded animate-pulse hidden sm:block" />
              </div>
            </div>

            {/* Energy Signature Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex flex-col justify-center space-y-1.5">
              <div className="h-2.5 w-28 bg-zinc-800/80 rounded animate-pulse" />
              <div className="h-4 sm:h-5 w-32 sm:w-44 bg-zinc-700/90 rounded animate-pulse" />
              <div className="h-2.5 w-24 bg-zinc-800/80 rounded animate-pulse hidden sm:block" />
            </div>
          </div>

          {/* 2. Western & Chinese Zodiac Side-by-Side */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-800 border border-zinc-700/60 flex-shrink-0 animate-pulse" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-2.5 w-20 bg-zinc-800/80 rounded animate-pulse" />
                <div className="h-3.5 w-24 bg-zinc-700/80 rounded animate-pulse" />
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-800 border border-zinc-700/60 flex-shrink-0 animate-pulse" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-2.5 w-20 bg-zinc-800/80 rounded animate-pulse" />
                <div className="h-3.5 w-24 bg-zinc-700/80 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* 3. Numbers Grid (6 items) */}
          <div className="space-y-2.5">
            <div className="h-3 w-32 bg-zinc-800/80 rounded animate-pulse" />
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 flex flex-col items-center justify-center gap-2 h-20 sm:h-22"
                >
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/50 animate-pulse" />
                  <div className="h-4 w-7 bg-zinc-700/90 rounded animate-pulse" />
                  <div className="h-2 w-12 bg-zinc-800/80 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower Row: Personality Insights & Daily Energy */}
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Card 1 Skeleton - Personality Insights */}
          <div className="rounded-3xl p-6 sm:p-7 bg-zinc-950/80 border border-zinc-800/80 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700/50 animate-pulse" />
                <div className="h-4 w-36 bg-zinc-700/90 rounded animate-pulse" />
              </div>
              <div className="h-3 w-16 bg-zinc-800/70 rounded animate-pulse" />
            </div>
            <div className="space-y-2.5 pt-2">
              <div className="h-3.5 w-full bg-zinc-800/70 rounded animate-pulse" />
              <div className="h-3.5 w-[92%] bg-zinc-800/70 rounded animate-pulse" />
              <div className="h-3.5 w-[80%] bg-zinc-800/60 rounded animate-pulse" />
              <div className="h-3.5 w-[85%] bg-zinc-800/60 rounded animate-pulse" />
              <div className="h-3.5 w-[65%] bg-zinc-800/50 rounded animate-pulse" />
            </div>
          </div>

          {/* Card 2 Skeleton - Daily Energy */}
          <div className="rounded-3xl p-6 sm:p-7 bg-zinc-950/80 border border-zinc-800/80 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 animate-pulse" />
                <div className="h-4 w-32 bg-zinc-700/90 rounded animate-pulse" />
              </div>
              <div className="h-3 w-14 bg-zinc-800/70 rounded animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 space-y-2">
              <div className="h-4 w-28 bg-amber-400/40 rounded animate-pulse" />
              <div className="h-3.5 w-full bg-zinc-800/70 rounded animate-pulse" />
              <div className="h-3.5 w-[82%] bg-zinc-800/60 rounded animate-pulse" />
            </div>
            <div className="space-y-2 pt-1">
              <div className="h-3.5 w-[90%] bg-zinc-800/70 rounded animate-pulse" />
              <div className="h-3.5 w-[70%] bg-zinc-800/50 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Status Pill (only shown when a specific background status message exists) */}
      {message && (
        <aside
          aria-live="polite"
          className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900/95 border border-amber-500/30 text-xs font-medium text-zinc-300 shadow-2xl backdrop-blur-md"
        >
          <div className="w-3.5 h-3.5 border-2 border-amber-500/25 border-t-amber-400 rounded-full animate-spin flex-shrink-0" />
          <span>{message}</span>
        </aside>
      )}

      {/* Modern 5-Item Bottom Navigation Bar Skeleton (Visible up to lg:hidden to match real Navigation) */}
      <nav
        aria-label="Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] pb-[env(safe-area-inset-bottom,0px)]"
      >
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1 items-center">
          {/* Tab 1: Home */}
          <div className="flex flex-col items-center justify-center py-1 gap-1.5">
            <div className="w-5 h-5 rounded-md bg-zinc-750 border border-zinc-700/60 animate-pulse" />
            <div className="h-2 w-7 bg-zinc-800 rounded animate-pulse" />
          </div>

          {/* Tab 2: Explore */}
          <div className="flex flex-col items-center justify-center py-1 gap-1.5 relative">
            <div className="w-5 h-5 rounded-md bg-zinc-750 border border-zinc-700/60 animate-pulse" />
            <div className="h-2 w-8 bg-zinc-800 rounded animate-pulse" />
          </div>

          {/* Tab 3: CoreChats (Center Hero Tab) */}
          <div className="flex flex-col items-center justify-center py-1 gap-1">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/35 flex items-center justify-center animate-pulse" />
            <div className="h-2 w-10 bg-amber-400/40 rounded animate-pulse" />
          </div>

          {/* Tab 4: Birth Chart */}
          <div className="flex flex-col items-center justify-center py-1 gap-1.5 relative">
            <div className="w-5 h-5 rounded-md bg-zinc-750 border border-zinc-700/60 animate-pulse" />
            <div className="h-2 w-10 bg-zinc-800 rounded animate-pulse" />
          </div>

          {/* Tab 5: More */}
          <div className="flex flex-col items-center justify-center py-1 gap-1.5">
            <div className="w-5 h-5 rounded-md bg-zinc-750 border border-zinc-700/60 animate-pulse" />
            <div className="h-2 w-7 bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
      </nav>
    </div>
  );
}
