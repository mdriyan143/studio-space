
"use client"

import * as React from "react"
import { authClient } from "@/lib/auth-client"

export type SessionUser = {
  name: string
  email: string
  initials: string
  avatarUrl?: string
}

export function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

export function useSession() {
  const { data: session, isPending } = authClient.useSession()

  const user: SessionUser | null = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        initials: session.user.name
          .split(" ")
          .filter(Boolean)
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        avatarUrl: session.user.image ?? undefined,
      }
    : null

  const signOut = React.useCallback(async () => {
    await authClient.signOut()
  }, [])

  return {
    user,
    signOut,
    isPending,
  }
}
