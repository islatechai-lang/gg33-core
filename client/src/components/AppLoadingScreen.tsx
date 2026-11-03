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

      {/* Very subtle ambient depth (no harsh glows) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar Skeleton - Minimal & Smooth */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-white/[0.04] bg-black/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          {/* Logo & Brand Placeholders */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] animate-pulse" />
            <div className="h-3.5 w-24 bg-white/[0.04] rounded-md animate-pulse" />
          </div>

          {/* Right Action Placeholders */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block h-7 w-24 rounded-full bg-white/[0.04] animate-pulse" />
            <div className="w-8 h-8 rounded-xl bg-white/[0.04] animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Dashboard Skeleton - Soft & Low Contrast */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 pt-20 pb-24 sm:pb-16 relative z-10 space-y-6">
        {/* Hero Profile Overview Card Skeleton */}
        <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/40 border border-white/[0.04] space-y-6">
          {/* User Info Row */}
          <div className="flex items-center justify-between pb-6 border-b border-white/[0.03]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.05] flex-shrink-0 animate-pulse" />
              <div className="space-y-2">
                <div className="h-2.5 w-20 bg-white/[0.04] rounded animate-pulse" />
                <div className="h-5 w-36 sm:w-48 bg-white/[0.06] rounded-md animate-pulse" />
                <div className="flex items-center gap-3 pt-0.5">
                  <div className="h-2.5 w-24 bg-white/[0.03] rounded animate-pulse" />
                  <div className="h-2.5 w-16 bg-white/[0.03] rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="hidden sm:block h-6 w-16 rounded-full bg-white/[0.04] animate-pulse" />
          </div>

          {/* 1. Life Path & Energy Signature Side-by-Side */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/[0.05] flex-shrink-0 animate-pulse" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-2 w-14 bg-white/[0.04] rounded animate-pulse" />
                <div className="h-3.5 w-24 sm:w-28 bg-white/[0.06] rounded animate-pulse" />
                <div className="h-2 w-16 bg-white/[0.03] rounded animate-pulse hidden sm:block" />
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] flex flex-col justify-center space-y-1.5">
              <div className="h-2 w-20 bg-white/[0.04] rounded animate-pulse" />
              <div className="h-3.5 sm:h-4 w-28 sm:w-36 bg-white/[0.06] rounded animate-pulse" />
              <div className="h-2 w-16 bg-white/[0.03] rounded animate-pulse hidden sm:block" />
            </div>
          </div>

          {/* 2. Western & Chinese Zodiac Side-by-Side */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.015] border border-white/[0.025] flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.04] flex-shrink-0 animate-pulse" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-2 w-14 bg-white/[0.03] rounded animate-pulse" />
                <div className="h-3 w-20 bg-white/[0.05] rounded animate-pulse" />
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.015] border border-white/[0.025] flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.04] flex-shrink-0 animate-pulse" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-2 w-14 bg-white/[0.03] rounded animate-pulse" />
                <div className="h-3 w-20 bg-white/[0.05] rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* 3. Numbers Grid */}
          <div className="space-y-2.5">
            <div className="h-2.5 w-28 bg-white/[0.03] rounded animate-pulse" />
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white/[0.015] border border-white/[0.025] flex flex-col items-center justify-center gap-2 h-20 sm:h-22"
                >
                  <div className="w-6 h-6 rounded-lg bg-white/[0.04] animate-pulse" />
                  <div className="h-3.5 w-6 bg-white/[0.06] rounded animate-pulse" />
                  <div className="h-2 w-12 bg-white/[0.03] rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower Row: Personality Insights & Daily Energy */}
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Card 1 Skeleton */}
          <div className="rounded-3xl p-6 sm:p-7 bg-zinc-950/40 border border-white/[0.04] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/[0.05] animate-pulse" />
                <div className="h-3.5 w-32 bg-white/[0.06] rounded animate-pulse" />
              </div>
              <div className="h-2.5 w-14 bg-white/[0.03] rounded animate-pulse" />
            </div>
            <div className="space-y-2.5 pt-2">
              <div className="h-3 w-full bg-white/[0.03] rounded animate-pulse" />
              <div className="h-3 w-[90%] bg-white/[0.03] rounded animate-pulse" />
              <div className="h-3 w-[75%] bg-white/[0.025] rounded animate-pulse" />
              <div className="h-3 w-[82%] bg-white/[0.025] rounded animate-pulse" />
              <div className="h-3 w-[55%] bg-white/[0.02] rounded animate-pulse" />
            </div>
          </div>

          {/* Card 2 Skeleton */}
          <div className="rounded-3xl p-6 sm:p-7 bg-zinc-950/40 border border-white/[0.04] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/[0.05] animate-pulse" />
                <div className="h-3.5 w-28 bg-white/[0.06] rounded animate-pulse" />
              </div>
              <div className="h-2.5 w-12 bg-white/[0.03] rounded animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/[0.025] space-y-2">
              <div className="h-3.5 w-24 bg-white/[0.05] rounded animate-pulse" />
              <div className="h-3 w-full bg-white/[0.03] rounded animate-pulse" />
              <div className="h-3 w-[78%] bg-white/[0.025] rounded animate-pulse" />
            </div>
            <div className="space-y-2 pt-1">
              <div className="h-3 w-[88%] bg-white/[0.03] rounded animate-pulse" />
              <div className="h-3 w-[65%] bg-white/[0.02] rounded animate-pulse" />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Status Pill (minimal, smooth, subtle) */}
      {message && (
        <aside
          aria-live="polite"
          className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-white/[0.08] text-xs font-normal text-zinc-400 shadow-xl backdrop-blur-sm"
        >
          <div className="w-3 h-3 border border-amber-500/30 border-t-amber-400 rounded-full animate-spin flex-shrink-0" />
          <span>{message}</span>
        </aside>
      )}

      {/* Fixed Bottom Navigation Skeleton for Mobile */}
      <nav
        aria-label="Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-white/[0.04] bg-black/60 backdrop-blur-sm sm:hidden flex items-center justify-around px-2"
      >
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 py-1 px-3">
            <div className="w-5 h-5 rounded-md bg-white/[0.04] animate-pulse" />
            <div className="h-1.5 w-7 bg-white/[0.02] rounded animate-pulse" />
          </div>
        ))}
      </nav>
    </div>
  );
}
