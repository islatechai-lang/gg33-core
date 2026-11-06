import React from 'react';

interface PaymentLoadingSpinnerProps {
  text?: string;
  subtext?: string;
}

export function PaymentLoadingSpinner({
  text = 'Loading payment form...',
  subtext = 'Securing end-to-end encrypted connection...',
}: PaymentLoadingSpinnerProps) {
  return (
    <div className="h-96 flex flex-col items-center justify-center gap-5 select-none animate-fade-in">
      {/* GPU-composited hardware-accelerated spinner */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Soft amber glow */}
        <div className="absolute inset-0 rounded-full bg-amber-500/15 blur-md pointer-events-none" />

        {/* Outer neutral track */}
        <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />

        {/* Rotating gradient ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400 border-r-amber-500 animate-spin"
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        />

        {/* Inner pulsing core */}
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.7)] animate-pulse" />
      </div>

      <div className="flex flex-col items-center gap-1.5 text-center px-4">
        <p className="text-sm font-semibold text-zinc-200 tracking-wide">{text}</p>
        {subtext && <p className="text-xs text-zinc-500">{subtext}</p>}
      </div>
    </div>
  );
}
