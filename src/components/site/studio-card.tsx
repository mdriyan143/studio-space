import Link from "next/link"
import { MapPinIcon, StarIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Studio } from "@/lib/studios"

export function StudioCard({ studio }: { studio: Studio }) {
  return (
    <Card size="sm" className="h-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={studio.imageUrl}
        alt={studio.title}
        className="aspect-[4/3] w-full object-cover"
        loading="lazy"
      />
      <CardContent className="flex flex-1 flex-col gap-3 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-0.5">
            <CardTitle className="truncate">{studio.title}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPinIcon className="size-3.5 shrink-0" />
              <span className="truncate">{studio.location}</span>
            </CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {studio.category}
          </Badge>
        </div>

        <p className="flex items-center gap-1 text-sm text-foreground">
          <StarIcon className="size-4 fill-amber-500 text-amber-500" />
          <span className="font-medium">{studio.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">
            ({studio.reviewCount} reviews)
          </span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
          <p className="text-sm">
            <span className="text-base font-semibold text-foreground">
              ${studio.hourlyRate}
            </span>
            <span className="text-muted-foreground"> / hr</span>
          </p>
          <Button size="sm" render={<Link href={`/studios/${studio._id}`} />}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function StudioCardSkeleton() {
  return (
    <Card size="sm" className="h-full">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <CardContent className="flex flex-col gap-3 pt-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex items-center justify-between border-t border-border pt-3">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}