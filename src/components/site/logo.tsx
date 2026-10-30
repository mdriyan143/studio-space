import Link from "next/link"
import { ApertureIcon } from "lucide-react"
import { cn } from "cn"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="StudioSpace home"
      className={cn("inline-flex items-center gap-2", className)}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ApertureIcon className="size-5" />
      </span>
      <span className="text-lg leading-none font-semibold tracking-tight text-foreground">
        Studio<span className="text-primary">Space</span>
      </span>
    </Link>
  )
}
