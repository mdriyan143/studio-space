"use client"

import * as React from "react"

export type SessionUser = {
  name: string
  email: string
  initials: string
  avatarUrl?: string
}

/**
 * Placeholder for real authentication. Until auth is wired up, the session
 * defaults to the demo user below. Set `startInDemo` to false to boot into
 * the header's unauthenticated state.
 */
const startInDemo = true

const DEMO_USER: SessionUser = {
  name: "Ava Rein",
  email: "ava@studiospace.com",
  initials: "AR",
}

type SessionContextValue = {
  user: SessionUser | null
  signIn: (user?: Partial<SessionUser>) => void
  signOut: () => void
}

const SessionContext = React.createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<SessionUser | null>(
    startInDemo ? DEMO_USER : null
  )

  const signIn = React.useCallback((nextUser?: Partial<SessionUser>) => {
    setUser({ ...DEMO_USER, ...nextUser })
  }, [])

  const signOut = React.useCallback(() => {
    setUser(null)
  }, [])

  const context = React.useMemo(
    () => ({ user, signIn, signOut }),
    [user, signIn, signOut]
  )

  return (
    <SessionContext.Provider value={context}>{children}</SessionContext.Provider>
  )
}

export function useSession() {
  const context = React.useContext(SessionContext)
  if (!context) {
    throw new Error("useSession must be used within a <SessionProvider>")
  }
  return context
}
