"use client"

import { HeartIcon } from "lucide-react"
import { cn } from "cn"

import { useWishlist } from "@/lib/wishlist"

export function WishlistButton({
  studioId,
  className,
}: {
  studioId: string
  className?: string
}) {
  const { ids, toggle } = useWishlist()
  const saved = ids.has(studioId)

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from saved studios" : "Save studio"}
      aria-pressed={saved}
      onClick={() => toggle(studioId)}
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-background/90 shadow ring-1 ring-border transition hover:scale-105",
        className
      )}
    >
      <HeartIcon
        className={cn("size-5", saved ? "fill-red-500 text-red-500" : "text-foreground")}
      />
    </button>
  )
}