"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { StudioForm } from "@/components/site/studio-form"
import { api } from "@/lib/api"
import { useSession } from "@/lib/session"
import type { Studio } from "@/lib/studios"

export function EditStudio({ id }: { id: string }) {
  const { user } = useSession()
  const [studio, setStudio] = React.useState<Studio | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    api<{ data: Studio }>(`/studios/${id}`)
      .then((res) => {
        if (!cancelled) setStudio(res.data)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
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
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <Skeleton className="h-9 w-56" />
        <div className="mt-8 flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !studio) {
    return (
      <Message
        title="Studio not found"
        text={error ?? "This listing may have been removed."}
      />
    )
  }

  if (user && studio.ownerEmail !== user.email) {
    return (
      <Message
        title="You can't edit this studio"
        text="Only the host who created this listing can update it."
      />
    )
  }

  return <StudioForm studio={studio} />
}

function Message({ title, text }: { title: string; text: string }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <p className="text-muted-foreground">{text}</p>
      <Button render={<Link href="/my-listings" />}>Back to my listings</Button>
    </div>
  )
}