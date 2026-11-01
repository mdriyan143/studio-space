"use client"

import * as React from "react"
import Link from "next/link"
import { HeartIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { StudioCard, StudioCardSkeleton } from "@/components/site/studio-card"
import { api } from "@/lib/api"
import type { ListResponse, Studio } from "@/lib/studios"
import { useWishlist } from "@/lib/wishlist"

export function SavedStudios() {
  const { ids, ready } = useWishlist()
  const [studios, setStudios] = React.useState<Studio[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    api<ListResponse<Studio[]>>("/wishlist", { auth: true })
      .then((res) => {
        if (!cancelled) setStudios(res.data)
      })
      .catch((err: Error) => {
        if (!cancelled) toast.error(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Hide a card as soon as the user un-hearts it
  const visible = studios.filter((s) => !ready || ids.has(s._id))

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Saved Studios
        </h1>
        <p className="text-muted-foreground">
          Your favorite spaces, saved for later.
        </p>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <StudioCardSkeleton key={i} />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <HeartIcon className="size-6" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-foreground">
              No saved studios yet
            </h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Tap the heart on any studio to keep it here.
            </p>
          </div>
          <Button render={<Link href="/studios" />}>Explore studios</Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      )}
    </div>
  )
}