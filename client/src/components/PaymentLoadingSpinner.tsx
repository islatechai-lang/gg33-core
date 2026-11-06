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
      {/* High-speed smooth rotating spinner without inline style conflict */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Soft amber ambient glow */}
        <div className="absolute inset-0 rounded-full bg-amber-500/15 blur-md pointer-events-none" />

        {/* Outer neutral track */}
        <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />

        {/* Smooth active rotating arc */}
        <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-amber-400 border-r-amber-500 animate-spin-smooth" />

        {/* Inner glowing pulsing core */}
        <div className="absolute w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse" />
      </div>

      <div className="flex flex-col items-center gap-1.5 text-center px-4">
        <p className="text-sm font-semibold text-zinc-200 tracking-wide flex items-center gap-1">
          <span>{text.replace(/\.+$/, '')}</span>
          <span className="inline-flex">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
          </span>
        </p>
        {subtext && <p className="text-xs text-zinc-500">{subtext}</p>}
      </div>
    </div>
  );
}
