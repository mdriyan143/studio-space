"use client"

import * as React from "react"
import { toast } from "sonner"

import { api } from "@/lib/api"
import { useSession } from "@/lib/session"

type WishlistContextValue = {
  ids: Set<string>
  ready: boolean
  toggle: (studioId: string) => Promise<void>
}

const WishlistContext = React.createContext<WishlistContextValue>({
  ids: new Set(),
  ready: false,
  toggle: async () => {},
})

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSession()
  const userEmail = user?.email
  const [ids, setIds] = React.useState<Set<string>>(new Set())
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    if (!userEmail) {
      setIds(new Set())
      setReady(false)
      return
    }
    let cancelled = false
    api<{ data: string[] }>("/wishlist/ids", { auth: true })
      .then((res) => {
        if (!cancelled) setIds(new Set(res.data))
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [userEmail])

  const toggle = React.useCallback(
    async (studioId: string) => {
      if (!userEmail) {
        toast.info("Please log in to save studios.")
        return
      }
      const saved = ids.has(studioId)

      const update = (add: boolean) =>
        setIds((prev) => {
          const next = new Set(prev)
          if (add) next.add(studioId)
          else next.delete(studioId)
          return next
        })

      update(!saved) // show the change straight away
      try {
        await api(`/wishlist/${studioId}`, {
          method: saved ? "DELETE" : "POST",
          auth: true,
        })
        toast.success(saved ? "Removed from saved studios." : "Saved to your wishlist.")
      } catch (err) {
        update(saved) // put it back if the request failed
        toast.error(err instanceof Error ? err.message : "Could not update wishlist.")
      }
    },
    [ids, userEmail]
  )

  return (
    <WishlistContext.Provider value={{ ids, ready, toggle }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return React.useContext(WishlistContext)
}