"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, MapPinIcon } from "lucide-react"

import { StudioCard } from "@/components/site/studio-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import type { ListResponse, Studio } from "@/lib/studios"

type Host = {
  id: string
  name: string
  image: string
  bio: string
  location: string
  memberSince: string | null
}

export function HostProfile({ id }: { id: string }) {
  const [host, setHost] = React.useState<Host | null>(null)
  const [studios, setStudios] = React.useState<Studio[]>([])
  const [loading, setLoading] = React.useState(true)
  const [notFound, setNotFound] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false

    Promise.all([
      fetch(`/api/hosts/${encodeURIComponent(id)}`).then(async (r) => {
        if (!r.ok) throw new Error("not-found")
        return (await r.json()) as { data: Host }
      }),
      api<ListResponse<Studio[]>>(`/studios?ownerId=${encodeURIComponent(id)}`),
    ])
      .then(([h, s]) => {
        if (cancelled) return
        setHost(h.data)
        setStudios(s.data)
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 sm:px-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (notFound || !host) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-xl font-semibold">Host not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This profile doesn&apos;t exist or was removed.
        </p>
      </div>
    )
  }

  const initials = host.name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 sm:px-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar className="size-24">
          {host.image ? <AvatarImage src={host.image} alt={host.name} /> : null}
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{host.name}</h1>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {host.location && (
              <span className="inline-flex items-center gap-1">
                <MapPinIcon className="size-4" />
                {host.location}
              </span>
            )}
            {host.memberSince && (
              <span className="inline-flex items-center gap-1">
                <CalendarIcon className="size-4" />
                Member since {format(new Date(host.memberSince), "MMM yyyy")}
              </span>
            )}
          </div>

          {host.bio && <p className="max-w-prose pt-2 text-sm">{host.bio}</p>}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          Studios by {host.name.split(" ")[0]} ({studios.length})
        </h2>

        {studios.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No studios listed yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}