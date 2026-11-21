import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-bold shadow-[0_4px_16px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_24px_rgba(245,158,11,0.35)] hover:brightness-105",
        destructive: "bg-rose-500/90 text-white shadow-sm hover:bg-rose-600",
        outline: "border border-white/10 bg-white/[0.04] backdrop-blur-md hover:bg-white/[0.08] hover:border-white/20 text-zinc-100",
        secondary: "bg-white/[0.08] hover:bg-white/[0.12] text-zinc-100 border border-white/10 backdrop-blur-md",
        ghost: "hover:bg-white/[0.07] hover:text-white text-zinc-400",
        link: "text-amber-400 underline-offset-4 hover:underline",
        frosted: "glass glass-hover text-zinc-100",
        gold: "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-bold shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_28px_rgba(245,158,11,0.45)] hover:scale-[1.02] active:scale-[0.97]",
        hero: "bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600 text-zinc-950 font-extrabold text-base px-8 py-6 rounded-2xl shadow-[0_8px_32px_rgba(245,158,11,0.35)] hover:shadow-[0_10px_40px_rgba(245,158,11,0.5)] hover:scale-[1.02] active:scale-[0.97]",
        glass: "bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 backdrop-blur-xl text-zinc-100 shadow-sm",
        glow: "bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 hover:border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]",
        soft: "bg-white/[0.05] text-zinc-200 hover:bg-white/[0.09] border border-white/5",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8.5 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-7 text-sm",
        xl: "h-13 rounded-2xl px-9 text-base",
        icon: "h-9 w-9 rounded-xl",
      },
      color: {
        default: "",
        blue: "bg-blue-9 text-white hover:bg-blue-10",
        green: "bg-green-9 text-white hover:bg-green-10",
        red: "bg-red-9 text-white hover:bg-red-10",
        amber: "bg-amber-9 text-gray-1 hover:bg-amber-10",
        violet: "bg-violet-9 text-white hover:bg-violet-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      color: "default",
    },
  },
)

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, color, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, color, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
