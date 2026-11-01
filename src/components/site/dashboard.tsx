"use client"

import * as React from "react"
import Link from "next/link"
import {
  CalendarCheckIcon,
  ClockIcon,
  InboxIcon,
  PlusIcon,
  StoreIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import type { Booking } from "@/lib/bookings"
import { useSession } from "@/lib/session"
import type { ListResponse, Studio } from "@/lib/studios"

export function Dashboard() {
  const { user } = useSession()
  const [loading, setLoading] = React.useState(true)
  const [studios, setStudios] = React.useState<Studio[]>([])
  const [mine, setMine] = React.useState<Booking[]>([])
  const [hosting, setHosting] = React.useState<Booking[]>([])

  React.useEffect(() => {
    let cancelled = false

    Promise.all([
      api<ListResponse<Studio[]>>("/studios/mine", { auth: true }),
      api<ListResponse<Booking[]>>("/bookings/mine", { auth: true }),
      api<ListResponse<Booking[]>>("/bookings/hosting", { auth: true }),
    ])
      .then(([a, b, c]) => {
        if (cancelled) return
        setStudios(a.data)
        setMine(b.data)
        setHosting(c.data)
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

  const pendingRequests = hosting.filter((b) => b.status === "Pending").length
  const upcoming = mine.filter(
    (b) => b.status === "Pending" || b.status === "Confirmed"
  ).length

  const stats = [
    {
      label: "My studios",
      value: studios.length,
      icon: StoreIcon,
      href: "/my-listings",
    },
    {
      label: "Active bookings",
      value: upcoming,
      icon: CalendarCheckIcon,
      href: "/my-bookings",
    },
    {
      label: "Requests awaiting you",
      value: pendingRequests,
      icon: InboxIcon,
      href: "/my-bookings",
    },
    {
      label: "Total hosted bookings",
      value: hosting.length,
      icon: ClockIcon,
      href: "/my-bookings",
    },
  ]

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s a quick look at your studios and bookings.
          </p>
        </div>
        <Button render={<Link href="/add-studio" />}>
          <PlusIcon className="size-4" />
          Add New Studio
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="block">
            <Card size="sm" className="h-full transition-colors hover:bg-muted/40">
              <CardContent className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                  {loading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <span className="text-3xl font-semibold text-foreground">
                      {stat.value}
                    </span>
                  )}
                </div>
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <stat.icon className="size-5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="outline" render={<Link href="/studios" />}>
          Explore studios
        </Button>
        <Button variant="outline" render={<Link href="/my-listings" />}>
          Manage listings
        </Button>
        <Button variant="outline" render={<Link href="/my-bookings" />}>
          View bookings
        </Button>
      </div>
    </div>
  )
}