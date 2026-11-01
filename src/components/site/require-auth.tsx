"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2Icon } from "lucide-react"

import { useSession } from "@/lib/session"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isPending } = useSession()

  React.useEffect(() => {
    if (!isPending && !user) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
    }
  }, [isPending, user, pathname, router])

  if (isPending || !user) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2Icon
          className="size-8 animate-spin text-muted-foreground"
          aria-label="Loading"
        />
      </div>
    )
  }

  return <>{children}</>
}