"use client"

import * as React from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { BellIcon, CheckCheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { api } from "@/lib/api"
import type { AppNotification } from "@/lib/notifications"

type NotificationsResponse = {
  success: boolean
  data: AppNotification[]
  unreadCount: number
}

const POLL_MS = 30_000

export function NotificationBell() {
  const [items, setItems] = React.useState<AppNotification[]>([])
  const [unread, setUnread] = React.useState(0)
  const [loaded, setLoaded] = React.useState(false)

  const load = React.useCallback(async () => {
    try {
      const res = await api<NotificationsResponse>("/notifications", {
        auth: true,
      })
      setItems(res.data)
      setUnread(res.unreadCount)
    } catch {
      // keep the bell quiet if polling fails
    } finally {
      setLoaded(true)
    }
  }, [])

  React.useEffect(() => {
    load()
    const id = setInterval(load, POLL_MS)
    return () => clearInterval(id)
  }, [load])

  const markAllRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnread(0)
    try {
      await api("/notifications/read-all", { auth: true, method: "PATCH" })
    } catch {
      load()
    }
  }

  const markOneRead = async (n: AppNotification) => {
    if (n.read) return
    setItems((prev) =>
      prev.map((x) => (x._id === n._id ? { ...x, read: true } : x))
    )
    setUnread((c) => Math.max(0, c - 1))
    try {
      await api(`/notifications/${n._id}/read`, { auth: true, method: "PATCH" })
    } catch {
      load()
    }
  }

  return (
    <Popover onOpenChange={(open) => open && load()}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={
              unread > 0
                ? `Notifications, ${unread} unread`
                : "Notifications"
            }
          />
        }
      >
        <BellIcon />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-4 text-primary-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[min(20rem,calc(100vw-2rem))] p-0"
      >
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <p className="text-sm font-semibold">Notifications</p>
          {unread > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={markAllRead}
            >
              <CheckCheckIcon className="size-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {!loaded ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Loading…
            </p>
          ) : items.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No notifications yet.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((n) => (
                <li key={n._id}>
                  <Link
                    href="/my-bookings"
                    onClick={() => markOneRead(n)}
                    className="flex gap-2 px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                  >
                    <span
                      aria-hidden
                      className={
                        n.read
                          ? "mt-1.5 size-2 shrink-0"
                          : "mt-1.5 size-2 shrink-0 rounded-full bg-primary"
                      }
                    />
                    <span className="min-w-0">
                      <span
                        className={
                          n.read
                            ? "block text-muted-foreground"
                            : "block font-medium text-foreground"
                        }
                      >
                        {n.message}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(n.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}