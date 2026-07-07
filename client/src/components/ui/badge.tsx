import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary: "border-transparent bg-gray-3 text-gray-12",
        destructive: "border-transparent bg-red-9 text-white shadow-sm",
        outline: "border border-gray-6 bg-transparent text-foreground",
        success: "border-transparent bg-green-9 text-white shadow-sm",
        warning: "border-transparent bg-amber-9 text-gray-1 shadow-sm",
        info: "border-transparent bg-blue-9 text-white shadow-sm",
        glass: "glass text-foreground",
      },
      color: {
        default: "",
        blue: "bg-blue-3 text-blue-11 border-blue-6",
        green: "bg-green-3 text-green-11 border-green-6",
        red: "bg-red-3 text-red-11 border-red-6",
        amber: "bg-amber-3 text-amber-11 border-amber-6",
        violet: "bg-violet-3 text-violet-11 border-violet-6",
        gray: "bg-gray-3 text-gray-11 border-gray-6",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-0",
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
