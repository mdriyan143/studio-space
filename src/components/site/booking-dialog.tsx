"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { CalendarCheckIcon, ClockIcon, Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import type { Studio } from "@/lib/studios"

type Slot = { startTime: string; endTime: string }

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

function todayLocal() {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${month}-${day}`
}

export function BookingDialog({
  studio,
  open,
  onOpenChange,
}: {
  studio: Studio
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const pathname = usePathname()

  const [date, setDate] = React.useState("")
  const [startTime, setStartTime] = React.useState("10:00")
  const [endTime, setEndTime] = React.useState("12:00")
  const [notes, setNotes] = React.useState("")
  const [slots, setSlots] = React.useState<Slot[]>([])
  const [loadingSlots, setLoadingSlots] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  // Load confirmed slots whenever the date changes
  React.useEffect(() => {
    if (!open || !date) {
      setSlots([])
      return
    }

    let cancelled = false
    setLoadingSlots(true)

    api<{ data: Slot[] }>(`/bookings/availability/${studio._id}?date=${date}`)
      .then((res) => {
        if (!cancelled) setSlots(res.data)
      })
      .catch(() => {
        if (!cancelled) setSlots([])
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, date, studio._id])

  const hours =
    startTime && endTime ? (toMinutes(endTime) - toMinutes(startTime)) / 60 : 0
  const validRange = hours > 0
  const total = validRange ? studio.hourlyRate * hours : 0

  const overlapping = slots.find(
    (s) =>
      validRange &&
      toMinutes(startTime) < toMinutes(s.endTime) &&
      toMinutes(endTime) > toMinutes(s.startTime)
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date) return toast.error("Please choose a date.")
    if (!validRange) return toast.error("End time must be after start time.")
    if (overlapping) {
      return toast.error(
        `That time overlaps a confirmed booking (${overlapping.startTime} - ${overlapping.endTime}).`
      )
    }

    setSubmitting(true)
    try {
      await api("/bookings", {
        method: "POST",
        auth: true,
        body: { studioId: studio._id, date, startTime, endTime, notes },
      })
      toast.success("Booking request sent! Waiting for host confirmation.")
      onOpenChange(false)
      router.push("/my-bookings")
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not create booking."
      toast.error(message)

      // 401: session expired, send the user back to login
      if (err instanceof Error && "status" in err && err.status === 401) {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
          <DialogHeader>
            <DialogTitle>Book {studio.title}</DialogTitle>
            <DialogDescription>
              Choose your date and hours. The host will confirm your request.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="booking-date">Date</Label>
            <Input
              id="booking-date"
              type="date"
              min={todayLocal()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="booking-start">Start time</Label>
              <Input
                id="booking-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="booking-end">End time</Label>
              <Input
                id="booking-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {date && (
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
              <p className="flex items-center gap-2 font-medium text-foreground">
                <ClockIcon className="size-4" />
                Already booked on this date
              </p>
              {loadingSlots ? (
                <p className="mt-1 text-muted-foreground">Checking...</p>
              ) : slots.length === 0 ? (
                <p className="mt-1 text-muted-foreground">
                  No confirmed bookings. The whole day is open.
                </p>
              ) : (
                <ul className="mt-1 flex flex-wrap gap-2">
                  {slots.map((s) => (
                    <li
                      key={`${s.startTime}-${s.endTime}`}
                      className="rounded-md bg-background px-2 py-1 text-xs ring-1 ring-border"
                    >
                      {s.startTime} - {s.endTime}
                    </li>
                  ))}
                </ul>
              )}
              {overlapping && (
                <p className="mt-2 text-destructive">
                  Your selected time overlaps a confirmed booking.
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="booking-notes">Notes for the host (optional)</Label>
            <Textarea
              id="booking-notes"
              rows={3}
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What are you shooting? Any equipment needs?"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
            <span className="text-muted-foreground">
              {validRange ? `${hours} hr x $${studio.hourlyRate}` : "Total"}
            </span>
            <span className="text-base font-semibold text-foreground">
              ${total.toFixed(2)}
            </span>
          </div>
          <p className="-mt-2 text-xs text-muted-foreground">
            A refundable security deposit of ${studio.securityDeposit} may apply.
          </p>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || Boolean(overlapping)}>
              {submitting ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <CalendarCheckIcon className="size-4" />
              )}
              Request booking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}