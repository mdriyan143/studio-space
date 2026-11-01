"use client"

import * as React from "react"
import { format } from "date-fns"
import { Loader2Icon, MessageSquareIcon, StarIcon } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import type { Review } from "@/lib/reviews"
import { useSession } from "@/lib/session"
import type { Studio } from "@/lib/studios"

export function ReviewsSection({
  studio,
  onReviewed,
}: {
  studio: Studio
  onReviewed: () => void
}) {
  const { user } = useSession()
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [loading, setLoading] = React.useState(true)
  const [rating, setRating] = React.useState(0)
  const [comment, setComment] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)

  const load = React.useCallback(async () => {
    try {
      const res = await api<{ data: Review[] }>(
        `/reviews/studio/${studio._id}`
      )
      setReviews(res.data)
    } catch {
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [studio._id])

  React.useEffect(() => {
    load()
  }, [load])

  const isOwner = user?.email === studio.ownerEmail

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating < 1) return toast.error("Please choose a star rating.")
    if (comment.trim().length < 10) {
      return toast.error("Please write at least 10 characters.")
    }

    setSubmitting(true)
    try {
      await api("/reviews", {
        method: "POST",
        auth: true,
        body: { studioId: studio._id, rating, comment },
      })
      toast.success("Thanks! Your review has been posted.")
      setRating(0)
      setComment("")
      await load()
      onReviewed()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not post review.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-foreground">
        Reviews ({reviews.length})
      </h2>

      {user && !isOwner && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-xl border border-border p-4"
        >
          <p className="text-sm font-medium text-foreground">
            Share your experience
          </p>
          <div
            className="flex gap-1"
            role="radiogroup"
            aria-label="Your rating"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} star${value > 1 ? "s" : ""}`}
                onClick={() => setRating(value)}
                className="rounded p-0.5 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <StarIcon
                  className={`size-6 ${
                    value <= rating
                      ? "fill-amber-500 text-amber-500"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            rows={3}
            maxLength={600}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What was the space like? Gear, lighting, host communication..."
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              You can review a studio after completing a booking there.
            </p>
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting && <Loader2Icon className="size-4 animate-spin" />}
              Post review
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          <MessageSquareIcon className="size-5 shrink-0" />
          No reviews yet. Book and complete a session to be the first to review.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {reviews.map((review) => (
            <li
              key={review._id}
              className="flex flex-col gap-2 rounded-xl border border-border p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    {review.userImage && (
                      <AvatarImage src={review.userImage} alt="" />
                    )}
                    <AvatarFallback>
                      {review.userName?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {review.userName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(review.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
                <div
                  className="flex gap-0.5"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <StarIcon
                      key={value}
                      aria-hidden
                      className={`size-4 ${
                        value <= review.rating
                          ? "fill-amber-500 text-amber-500"
                          : "text-muted-foreground/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {review.comment}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}