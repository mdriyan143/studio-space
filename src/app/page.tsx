import Image from "next/image"
import Link from "next/link"
import {
  ArrowRightIcon,
  CalendarCheckIcon,
  CameraIcon,
  ClockIcon,
  MapPinIcon,
  SearchIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react"
import { cn } from "cn"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

/* Soft cap on how far unsplash crops can be pushed if images change later. */
const CARD_IMAGE_SIZES =
  "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"

const STATS = [
  { value: "12k+", label: "Studios listed" },
  { value: "48", label: "Cities covered" },
  { value: "4.9", label: "Average rating" },
  { value: "120k+", label: "Bookings completed" },
]

const CATEGORIES = [
  {
    href: "/studios?category=photography",
    label: "Photography",
    image: "/studios/cat-photography.jpg",
    listings: "3,214 listings",
  },
  {
    href: "/studios?category=recording",
    label: "Recording",
    image: "/studios/cat-recording.jpg",
    listings: "2,876 listings",
  },
  {
    href: "/studios?category=podcast",
    label: "Podcast",
    image: "/studios/cat-podcast.jpg",
    listings: "1,902 listings",
  },
  {
    href: "/studios?category=video",
    label: "Video & Film",
    image: "/studios/cat-video.jpg",
    listings: "2,145 listings",
  },
  {
    href: "/studios?category=dance",
    label: "Dance & Rehearsal",
    image: "/studios/cat-dance.jpg",
    listings: "1,530 listings",
  },
  {
    href: "/studios?category=meeting",
    label: "Creative Rooms",
    image: "/studios/cat-meeting.jpg",
    listings: "1,388 listings",
  },
]

const FEATURED = [
  {
    name: "Echo Lane Recording",
    city: "Nashville, TN",
    category: "Recording",
    rating: 4.9,
    reviews: 186,
    price: 45,
    image: "/studios/studio-1.jpg",
  },
  {
    name: "Palm & Pine Podcasts",
    city: "Austin, TX",
    category: "Podcast",
    rating: 4.8,
    reviews: 132,
    price: 38,
    image: "/studios/studio-2.jpg",
  },
  {
    name: "Northlight Stage",
    city: "Los Angeles, CA",
    category: "Video & Film",
    rating: 5.0,
    reviews: 240,
    price: 62,
    image: "/studios/studio-3.jpg",
  },
  {
    name: "Hartwell Loft",
    city: "Brooklyn, NY",
    category: "Photography",
    rating: 4.9,
    reviews: 158,
    price: 55,
    image: "/studios/studio-4.jpg",
  },
  {
    name: "Analog Room 12",
    city: "Portland, OR",
    category: "Recording",
    rating: 4.7,
    reviews: 94,
    price: 40,
    image: "/studios/studio-5.jpg",
  },
  {
    name: "Frame & Firm Loft",
    city: "Chicago, IL",
    category: "Meeting Room",
    rating: 4.8,
    reviews: 121,
    price: 30,
    image: "/studios/studio-6.jpg",
  },
]

const STEPS = [
  {
    icon: SearchIcon,
    title: "Browse studios",
    description:
      "Filter by city, craft, and budget. Every listing shows real photos, gear, and transparent hourly rates.",
  },
  {
    icon: CalendarCheckIcon,
    title: "Book your slot",
    description:
      "Reserve by the hour or day. Instant confirmation — no calls, no quoting, no back-and-forth.",
  },
  {
    icon: CameraIcon,
    title: "Arrive and create",
    description:
      "Door codes and access notes arrive the night before. Just show up and get to work.",
  },
]

const TESTIMONIALS = [
  {
    quote:
      "Booked a podcast room at 9pm for the next morning. Confirmed in two minutes, door code was waiting in my inbox. Our old process was three phone calls and a prayer.",
    name: "Maya Chen",
    role: "Podcast producer",
    initials: "MC",
  },
  {
    quote:
      "Finally a marketplace that lists real photos and real rates. I scouted four studios in one afternoon and shipped the shoot the same week.",
    name: "Dario Fontaine",
    role: "Commercial videographer",
    initials: "DF",
  },
  {
    quote:
      "Listing our two rehearsal rooms took twenty minutes. We went from word-of-mouth bookings to a calendar that fills itself.",
    name: "Priya Nair",
    role: "Studio owner",
    initials: "PN",
  },
]

/**
 * Single source of truth for section headers so every section's heading stays
 * identical in font, size, and color.
 */
function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" && "items-center text-center"
      )}
    >
      {eyebrow ? <Badge variant="secondary">{eyebrow}</Badge> : null}
      <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      {/* Hero */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-10 pb-12 sm:px-6 sm:pt-14 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-12">
          <div className="flex flex-col items-start gap-5">
            <Badge variant="secondary">
              <SparklesIcon data-icon="inline-start" />
              12k+ studios ready to book
            </Badge>
            <h1 className="text-4xl leading-tight font-semibold tracking-tight text-foreground sm:text-5xl xl:text-6xl">
              Book the space. <br className="hidden sm:block" />
              Skip the search.
            </h1>
            <p className="max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              StudioSpace is the marketplace for photographers, podcasters,
              filmmakers, and musicians — real spaces, transparent hourly rates,
              and instant booking. Or list your own studio and fill its empty
              hours.
            </p>
            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <Button size="lg" render={<Link href="/studios" />}>
                Explore studios
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/studios/new" />}
              >
                List your studio
              </Button>
            </div>
          </div>

          <div className="relative flex-1">
            <Image
              priority
              src="/studios/hero.jpg"
              alt="Photographer reviewing shots in a studio"
              width={1200}
              height={900}
              className="aspect-[4/3] h-full w-full rounded-2xl object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <Card
              size="sm"
              className="absolute inset-x-4 bottom-4 flex-row items-center gap-3 bg-background/90 backdrop-blur sm:inset-x-auto sm:right-4 sm:w-80"
            >
              <Image
                src="/studios/studio-1.jpg"
                alt=""
                width={64}
                height={64}
                className="size-14 shrink-0 rounded-lg object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="truncate text-sm font-semibold text-foreground">
                  Echo Lane Recording
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <StarIcon className="size-3 fill-amber-500 text-amber-500" />
                  4.9 · Nashville, TN
                </p>
              </div>
              <Button size="sm" render={<Link href="/studios" />}>
                $45/hr
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="w-full border-y border-border bg-muted/40">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category grid */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Browse by craft"
          title="Every space a creator needs"
          description="Grimy garages with vintage desks, daylit lofts with cyc walls, dead-quiet VO booths. Whatever you make, there is a room for it."
        />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((category) => (
            <Link
              key={category.label}
              href={category.href}
              className="group relative block overflow-hidden rounded-xl ring-1 ring-foreground/10 transition-shadow hover:ring-foreground/30"
            >
              <div className="aspect-square">
                <Image
                  src={category.image}
                  alt={category.label}
                  width={800}
                  height={800}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-3 bottom-3">
                <p className="text-sm font-semibold text-white">
                  {category.label}
                </p>
                <p className="text-xs text-white/70">{category.listings}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured studios */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20">
        <SectionHeading
          eyebrow="Fresh on the marketplace"
          title="Featured studios this week"
          description="Hand-picked spaces with lightning-fast hosts and verified equipment lists."
        />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((studio) => (
            <Card key={studio.name} size="sm" className="h-full">
              <Image
                src={studio.image}
                alt={studio.name}
                width={1200}
                height={900}
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                sizes={CARD_IMAGE_SIZES}
              />
              <CardContent className="flex flex-1 flex-col gap-3 pt-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <CardTitle className="truncate">{studio.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPinIcon className="size-3.5 shrink-0" />
                      {studio.city}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{studio.category}</Badge>
                </div>
                <p className="flex items-center gap-1 text-sm text-foreground">
                  <StarIcon className="size-4 fill-amber-500 text-amber-500" />
                  <span className="font-medium">{studio.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({studio.reviews} reviews)
                  </span>
                </p>
                <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
                  <p className="text-sm">
                    <span className="text-base font-semibold text-foreground">
                      ${studio.price}
                    </span>
                    <span className="text-muted-foreground">/hour</span>
                  </p>
                  <Button size="sm" render={<Link href={`/studios`} />}>
                    Book now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="w-full border-y border-border bg-muted/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <SectionHeading
            eyebrow="How it works"
            title="From search to shoot in three steps"
            align="center"
          />
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <Card key={step.title} size="sm" className="h-full">
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <step.icon className="size-5" />
                    </span>
                    <span className="text-4xl leading-none font-semibold text-muted-foreground/25">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <CardTitle>{step.title}</CardTitle>
                    <CardDescription className="text-sm leading-6">
                      {step.description}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Loved by creators"
          title="What people book with"
          description="From bedroom podcasts to national campaigns — booked, shot, and shipped on StudioSpace."
        />
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <Card key={testimonial.name} size="sm" className="h-full">
              <CardContent className="flex h-full flex-col gap-4">
                <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      aria-hidden
                      className="size-4 fill-amber-500 text-amber-500"
                    />
                  ))}
                </div>
                <p className="text-sm leading-6 text-foreground">
                  “{testimonial.quote}”
                </p>
                <div className="mt-auto flex items-center gap-3 border-t border-border pt-4">
                  <Avatar size="sm">
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20">
        <div className="flex flex-col items-center gap-5 rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Your next session starts here
          </h2>
          <p className="max-w-xl text-base leading-7 text-primary-foreground/70">
            Join thousands of creators booking studios in 48 cities — or open
            your doors to them and turn empty hours into revenue.
          </p>
          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <Button
              size="lg"
              className="bg-background text-foreground hover:bg-background/90"
              render={<Link href="/studios" />}
            >
              <ClockIcon data-icon="inline-start" />
              Explore studios
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              render={<Link href="/studios/new" />}
            >
              List your studio
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
