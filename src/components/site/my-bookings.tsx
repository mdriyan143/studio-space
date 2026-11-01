"use client"

import * as React from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
  CalendarDaysIcon,
  CalendarXIcon,
  ClockIcon,
  Loader2Icon,
  MapPinIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BookingStatusBadge } from "@/components/site/booking-status-badge"
import { api } from "@/lib/api"
import type { Booking, BookingStatus } from "@/lib/bookings"
import type { ListResponse } from "@/lib/studios"

type Tab = "mine" | "hosting"

function formatDate(date: string) {
  return format(new Date(`${date}T00:00:00`), "EEE, MMM d, yyyy")
}

export function MyBookings() {
  const [tab, setTab] = React.useState<Tab>("mine")
  const [mine, setMine] = React.useState<Booking[]>([])
  const [hosting, setHosting] = React.useState<Booking[]>([])
  const [loading, setLoading] = React.useState(true)

  const [toCancel, setToCancel] = React.useState<Booking | null>(null)
  const [busyId, setBusyId] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    try {
      const [a, b] = await Promise.all([
        api<ListResponse<Booking[]>>("/bookings/mine", { auth: true }),
        api<ListResponse<Booking[]>>("/bookings/hosting", { auth: true }),
      ])
      setMine(a.data)
      setHosting(b.data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not load bookings.")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

  const cancelBooking = async () => {
    if (!toCancel) return
    setBusyId(toCancel._id)
    try {
      await api(`/bookings/${toCancel._id}/cancel`, {
        method: "PATCH",
        auth: true,
      })
      setMine((prev) =>
        prev.map((b) =>
          b._id === toCancel._id ? { ...b, status: "Cancelled" } : b
        )
      )
      toast.success("Booking cancelled.")
      setToCancel(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel.")
    } finally {
      setBusyId(null)
    }
  }

  const updateStatus = async (booking: Booking, status: BookingStatus) => {
    setBusyId(booking._id)
    try {
      await api(`/bookings/${booking._id}/status`, {
        method: "PATCH",
        auth: true,
        body: { status },
      })
      setHosting((prev) =>
        prev.map((b) => (b._id === booking._id ? { ...b, status } : b))
      )
      toast.success(`Booking marked as ${status}.`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update.")
    } finally {
      setBusyId(null)
    }
  }

  const list = tab === "mine" ? mine : hosting

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          My Bookings
        </h1>
        <p className="text-muted-foreground">
          Track your reservations and manage requests for your own studios.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={tab === "mine" ? "default" : "outline"}
          onClick={() => setTab("mine")}
        >
          My bookings ({mine.length})
        </Button>
        <Button
          size="sm"
          variant={tab === "hosting" ? "default" : "outline"}
          onClick={() => setTab("hosting")}
        >
          Hosting requests ({hosting.length})
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full" />
          ))
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border px-6 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <CalendarXIcon className="size-6" />
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-foreground">
                {tab === "mine"
                  ? "No bookings yet"
                  : "No booking requests yet"}
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                {tab === "mine"
                  ? "Find a studio that fits your next shoot and reserve your hours."
                  : "When creators request your studios, they will show up here."}
              </p>
            </div>
            <Button
              render={
                <Link href={tab === "mine" ? "/studios" : "/add-studio"} />
              }
            >
              {tab === "mine" ? "Explore studios" : "Add a studio"}
            </Button>
          </div>
        ) : (
          list.map((booking) => {
            const busy = busyId === booking._id
            return (
              <Card key={booking._id}>
                <CardContent className="flex flex-col gap-4 sm:flex-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={booking.studioImage}
                    alt={booking.studioTitle}
                    className="aspect-[4/3] w-full rounded-lg object-cover sm:w-44"
                  />

                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex min-w-0 flex-col gap-1">
                        <Link
                          href={`/studios/${booking.studioId}`}
                          className="truncate text-lg font-semibold text-foreground hover:underline"
                        >
                          {booking.studioTitle}
                        </Link>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPinIcon className="size-3.5 shrink-0" />
                          <span className="truncate">
                            {booking.studioLocation}
                          </span>
                        </span>
                      </div>
                      <BookingStatusBadge status={booking.status} />
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CalendarDaysIcon className="size-4" />
                        {formatDate(booking.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ClockIcon className="size-4" />
                        {booking.startTime} - {booking.endTime} ({booking.hours}{" "}
                        hr)
                      </span>
                    </div>

                    {tab === "hosting" && (
                      <p className="text-sm text-muted-foreground">
                        Requested by{" "}
                        <span className="font-medium text-foreground">
                          {booking.userName}
                        </span>{" "}
                        ({booking.userEmail})
                      </p>
                    )}

                    {booking.notes && (
                      <p className="text-sm text-muted-foreground">
                        Notes: {booking.notes}
                      </p>
                    )}

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Total: </span>
                        <span className="text-base font-semibold text-foreground">
                          ${booking.totalPrice.toFixed(2)}
                        </span>
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {tab === "mine" && booking.status === "Pending" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setToCancel(booking)}
                          >
                            Cancel Booking
                          </Button>
                        )}

                        {tab === "hosting" && booking.status === "Pending" && (
                          <>
                            <Button
                              size="sm"
                              disabled={busy}
                              onClick={() => updateStatus(booking, "Confirmed")}
                            >
                              {busy && (
                                <Loader2Icon className="size-3.5 animate-spin" />
                              )}
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={busy}
                              onClick={() => updateStatus(booking, "Cancelled")}
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        {tab === "hosting" && booking.status === "Confirmed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            onClick={() => updateStatus(booking, "Completed")}
                          >
                            Mark completed
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      <AlertDialog
        open={Boolean(toCancel)}
        onOpenChange={(open) => {
          if (!open && !busyId) setToCancel(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Your request for &ldquo;{toCancel?.studioTitle}&rdquo; on{" "}
              {toCancel ? formatDate(toCancel.date) : ""} will be cancelled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setToCancel(null)}
              disabled={Boolean(busyId)}
            >
              Keep booking
            </Button>
            <Button
              variant="destructive"
              onClick={cancelBooking}
              disabled={Boolean(busyId)}
            >
              {busyId && <Loader2Icon className="size-4 animate-spin" />}
              Yes, cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}