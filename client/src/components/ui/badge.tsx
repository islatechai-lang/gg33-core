import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "whitespace-nowrap inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-amber-500 text-zinc-950 font-semibold shadow-sm hover:bg-amber-400",
        secondary: "border-white/10 bg-white/10 text-zinc-200 backdrop-blur-md",
        destructive: "border-rose-500/30 bg-rose-500/15 text-rose-300 shadow-sm",
        outline: "border-white/10 bg-white/[0.04] text-zinc-300 backdrop-blur-sm",
        success: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300 shadow-sm",
        warning: "border-amber-500/30 bg-amber-500/15 text-amber-300 shadow-sm",
        info: "border-blue-500/30 bg-blue-500/15 text-blue-300 shadow-sm",
        glass: "glass-pill text-zinc-200 border-white/10",
      },
      color: {
        default: "",
        blue: "bg-blue-500/15 text-blue-300 border-blue-500/25",
        green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
        red: "bg-rose-500/15 text-rose-300 border-rose-500/25",
        amber: "bg-amber-500/15 text-amber-300 border-amber-500/25",
        violet: "bg-purple-500/15 text-purple-300 border-purple-500/25",
        gray: "bg-white/[0.06] text-zinc-300 border-white/10",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      color: "default",
      size: "default",
    },
  },
)

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, color, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, color, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants }
