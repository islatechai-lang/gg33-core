import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-gray-6 bg-transparent hover:bg-gray-3 hover:text-foreground",
        secondary: "bg-gray-3 text-foreground shadow-sm hover:bg-gray-4",
        ghost: "hover:bg-gray-3 hover:text-foreground",
        link: "text-amber-11 underline-offset-4 hover:underline",
        frosted: "glass glass-hover text-foreground",
        gold: "bg-gold-gradient text-gray-1 font-semibold shadow-md hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
        hero: "bg-gold-gradient text-gray-1 font-semibold text-base px-8 py-6 shadow-lg hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
        glass: "glass glass-hover text-foreground",
        glow: "bg-amber-3 text-amber-11 border border-amber-6 hover:bg-amber-4 hover:border-amber-7",
        soft: "bg-gray-a3 text-foreground hover:bg-gray-a4",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
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
