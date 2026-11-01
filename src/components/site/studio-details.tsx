"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ArrowLeftIcon,
  CheckIcon,
  MapPinIcon,
  ShieldCheckIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BookingDialog } from "@/components/site/booking-dialog"
import { api, ApiError } from "@/lib/api"
import { useSession } from "@/lib/session"
import type { Studio } from "@/lib/studios"

export function StudioDetails({ id }: { id: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useSession()

  const [studio, setStudio] = React.useState<Studio | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [notFound, setNotFound] = React.useState(false)
  const [bookingOpen, setBookingOpen] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false

    api<{ data: Studio }>(`/studios/${id}`)
      .then((res) => {
        if (!cancelled) setStudio(res.data)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
          setNotFound(true)
        } else {
          toast.error(err.message)
          setNotFound(true)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const handleBookClick = () => {
    if (!user) {
      toast.info("Please log in to book this studio.")
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
      return
    }
    setBookingOpen(true)
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <Skeleton className="h-8 w-40" />
        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Skeleton className="aspect-[16/9] w-full" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    )
  }

  if (notFound || !studio) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Studio not found
        </h1>
        <p className="text-muted-foreground">
          This listing may have been removed or the link is incorrect.
        </p>
        <Button render={<Link href="/studios" />}>Browse studios</Button>
      </div>
    )
  }

  const isOwner = user?.email === studio.ownerEmail

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <Button
        variant="ghost"
        size="sm"
        render={<Link href="/studios" />}
        className="mb-4"
      >
        <ArrowLeftIcon className="size-4" />
        All studios
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={studio.imageUrl}
            alt={studio.title}
            className="aspect-[16/9] w-full rounded-xl border border-border object-cover"
          />

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{studio.category}</Badge>
              <span className="flex items-center gap-1 text-sm">
                <StarIcon className="size-4 fill-amber-500 text-amber-500" />
                <span className="font-medium">{studio.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({studio.reviewCount} reviews)
                </span>
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {studio.title}
            </h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="size-4" />
                {studio.location}
              </span>
              <span className="flex items-center gap-1.5">
                <UsersIcon className="size-4" />
                Up to {studio.maxCapacity} people
              </span>
            </div>
          </div>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-foreground">Overview</h2>
            <p className="leading-7 whitespace-pre-line text-muted-foreground">
              {studio.overview}
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-foreground">Amenities</h2>
            {studio.amenities.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                The host hasn&apos;t listed any amenities yet.
              </p>
            ) : (
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {studio.amenities.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckIcon className="size-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-foreground">Hosted by</h2>
            <div className="flex items-center gap-3">
              <Avatar>
                {studio.ownerImage && <AvatarImage src={studio.ownerImage} alt={studio.ownerName} />}
                <AvatarFallback>
                  {studio.ownerName?.slice(0, 2).toUpperCase() || "H"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-foreground">
                  {studio.ownerName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {studio.ownerEmail}
                </span>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-foreground">Reviews</h2>
            <p className="text-sm text-muted-foreground">
              {studio.reviewCount === 0
                ? "No reviews yet. Be the first to book and share your experience."
                : `${studio.reviewCount} guest reviews.`}
            </p>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="flex flex-col gap-4">
              <p>
                <span className="text-3xl font-semibold text-foreground">
                  ${studio.hourlyRate}
                </span>
                <span className="text-muted-foreground"> / hour</span>
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Security deposit</span>
                <span className="font-medium">${studio.securityDeposit}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Max capacity</span>
                <span className="font-medium">{studio.maxCapacity} people</span>
              </div>

              {isOwner ? (
                <>
                  <Button disabled>This is your studio</Button>
                  <Button
                    variant="outline"
                    render={<Link href={`/studios/edit/${studio._id}`} />}
                  >
                    Edit listing
                  </Button>
                </>
              ) : (
                <Button onClick={handleBookClick}>Book Workspace Now</Button>
              )}

              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheckIcon className="size-4 shrink-0" />
                You won&apos;t be charged until the host confirms.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>

      <BookingDialog
        studio={studio}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  )
}