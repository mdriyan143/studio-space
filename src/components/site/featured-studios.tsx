"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, PlusIcon, StoreIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  StudioCard,
  StudioCardSkeleton,
} from "@/components/site/studio-card"
import { api } from "@/lib/api"
import type { ListResponse, Studio } from "@/lib/studios"

export function FeaturedStudios() {
  const [studios, setStudios] = React.useState<Studio[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false

    api<ListResponse<Studio[]>>("/studios?limit=6")
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

  if (!loading && studios.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-dashed border-border px-6 py-14 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <StoreIcon className="size-6" />
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-foreground">
            No studios listed yet
          </h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Be the first host on StudioSpace and put your space in front of
            creators.
          </p>
        </div>
        <Button render={<Link href="/add-studio" />}>
          <PlusIcon className="size-4" />
          List your studio
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <StudioCardSkeleton key={i} />
            ))
          : studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
      </div>
      {!loading && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" render={<Link href="/studios" />}>
            View all studios
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      )}
    </>
  )
}