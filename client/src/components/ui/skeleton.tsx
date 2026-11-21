import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-shimmer rounded-2xl border border-white/[0.04]", className)}
      {...props}
    />
  )
}

export { Skeleton }
