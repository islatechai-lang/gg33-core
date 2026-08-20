import React, { useState, useEffect } from 'react';
import { StarField } from '@/components/StarField';
import { Sparkles } from 'lucide-react';

interface AppLoadingScreenProps {
  message?: string;
  subMessage?: string;
}

const COSMIC_PHRASES = [
  'Harmonizing cosmic matrix...',
  'Aligning celestial frequencies...',
  'Calculating your esoteric blueprint...',
  'Decoding universal numbers...',
  'Awakening your portal...',
];

export function AppLoadingScreen({
  message,
  subMessage = 'GG33 Esoteric Intelligence',
}: AppLoadingScreenProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Cycle through cosmic phrases if no custom static message is provided
  useEffect(() => {
    if (message) return;
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % COSMIC_PHRASES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [message]);

  const displayMessage = message || COSMIC_PHRASES[phraseIndex];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden select-none">
      {/* Background Starfield */}
      <StarField />

      {/* Radial Golden Aura Glow */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-[300px] h-[300px] bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* Central Sacred Geometry & Logo Animation */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer Rotating Sacred Geometry Ring 1 (Clockwise) */}
        <svg
          className="w-40 h-40 sm:w-48 sm:h-48 absolute animate-[spin_12s_linear_infinite]"
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            opacity="0.6"
          />
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="0.8"
            strokeDasharray="2 14"
            opacity="0.4"
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
        </svg>

        {/* Outer Counter-Rotating Ring 2 (Counter-Clockwise) */}
        <svg
          className="w-32 h-32 sm:w-40 sm:h-40 absolute animate-[spin_18s_linear_infinite_reverse]"
          viewBox="0 0 160 160"
        >
          <circle
            cx="80"
            cy="80"
            r="72"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1"
            strokeDasharray="4 12"
            opacity="0.35"
          />
          {/* Orbital Celestial Dots */}
          <circle cx="80" cy="8" r="3" fill="#fbbf24" filter="drop-shadow(0 0 6px #f59e0b)" />
          <circle cx="152" cy="80" r="2.5" fill="#f59e0b" opacity="0.8" />
          <circle cx="8" cy="80" r="2.5" fill="#f59e0b" opacity="0.8" />
          <circle cx="80" cy="152" r="3" fill="#fbbf24" filter="drop-shadow(0 0 6px #f59e0b)" />
        </svg>

        {/* Central Logo Container with Glow */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 shadow-[0_0_40px_rgba(245,158,11,0.35)] flex items-center justify-center transition-transform duration-700 animate-[pulse_3s_ease-in-out_infinite]">
          <div className="w-full h-full rounded-xl overflow-hidden bg-black flex items-center justify-center p-2">
            <img
              src="/images/logo.png?v=1"
              alt="GG33 CORE"
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
            />
          </div>
        </div>
      </div>

      {/* Brand & Loading Status */}
      <div className="relative z-10 text-center space-y-3 max-w-sm px-4">
        <div className="flex items-center justify-center gap-2">
          <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-amber-500/60" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-400/90 font-mono">
            {subMessage}
          </span>
          <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-amber-500/60" />
        </div>

        {/* Brand Name */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-amber-200 to-zinc-200 drop-shadow-sm">
          GG33 CORE
        </h1>

        {/* Dynamic Status Phrase */}
        <p className="text-xs sm:text-sm text-zinc-400 font-medium h-6 flex items-center justify-center gap-2 transition-all duration-500">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block flex-shrink-0" />
          <span className="animate-fade-in">{displayMessage}</span>
        </p>

        {/* Shimmering Progress Bar */}
        <div className="w-48 sm:w-56 h-1 bg-zinc-900/80 rounded-full mx-auto overflow-hidden border border-zinc-800/80 relative mt-4 shadow-inner">
          <div className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 rounded-full w-full animate-[shimmer_1.8s_infinite] bg-[length:200%_100%]" />
        </div>
      </div>
    </div>
  );
}
