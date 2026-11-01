import Image from "next/image"
import Link from "next/link"
import {
  BadgeCheckIcon,
  CalendarCheckIcon,
  CameraIcon,
  ClockIcon,
  HeadsetIcon,
  SearchIcon,
  ShieldCheckIcon,
  StarIcon,
  WrenchIcon,
} from "lucide-react"
import { cn } from "cn"

import { FeaturedStudios } from "@/components/site/featured-studios"
import { HeroSlider } from "@/components/site/hero-slider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

const HIGHLIGHTS = [
  { value: "5", label: "Studio categories" },
  { value: "Hourly", label: "Flexible booking" },
  { value: "Verified", label: "Host accounts" },
  { value: "24/7", label: "Creator support" },
]

const CATEGORIES = [
  {
    href: "/studios?category=Photo%20Studio",
    label: "Photo Studios",
    image: "/studios/cat-photography.jpg",
    listings: "Cyc walls & lofts",
  },
  {
    href: "/studios?category=Film%20Stage",
    label: "Sound Stages",
    image: "/studios/cat-video.jpg",
    listings: "Film & video sets",
  },
  {
    href: "/studios?category=Podcast%20Lounge",
    label: "Podcast Rooms",
    image: "/studios/cat-podcast.jpg",
    listings: "Quiet, treated rooms",
  },
  {
    href: "/studios?category=Music%20Suite",
    label: "Music Suites",
    image: "/studios/cat-recording.jpg",
    listings: "Recording & rehearsal",
  },
  {
    href: "/studios?category=Workshop",
    label: "Art Workshops",
    image: "/studios/cat-meeting.jpg",
    listings: "Creative work spaces",
  },
]

const STEPS = [
  {
    icon: SearchIcon,
    title: "Discover spaces",
    description:
      "Filter by category and location. Every listing shows real photos, amenities and transparent hourly rates.",
  },
  {
    icon: ClockIcon,
    title: "Select shoot hours",
    description:
      "Pick your date and the exact hours you need. Confirmed slots are shown so you can avoid clashes.",
  },
  {
    icon: CalendarCheckIcon,
    title: "Book instantly",
    description:
      "Send your request in one click and track its status from your bookings page.",
  },
  {
    icon: CameraIcon,
    title: "Create & produce",
    description:
      "Arrive, set up and get to work. The space is yours for the hours you booked.",
  },
]

const GUARANTEES = [
  {
    icon: ShieldCheckIcon,
    title: "Liability protection",
    description:
      "Clear booking terms and security deposits protect hosts and creators on every reservation.",
  },
  {
    icon: BadgeCheckIcon,
    title: "Verified profiles",
    description:
      "Hosts and guests sign in with verified accounts, so you always know who you're working with.",
  },
  {
    icon: WrenchIcon,
    title: "Equipment safety",
    description:
      "Hosts list their gear and amenities up front, and every space follows its posted house rules.",
  },
  {
    icon: HeadsetIcon,
    title: "24/7 host support",
    description:
      "Questions before a shoot or a problem during one? Our support team is always reachable.",
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
      <HeroSlider />

      {/* Highlights strip */}
      <section className="w-full border-y border-border bg-muted/40">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6">
          {HIGHLIGHTS.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1">
              <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {item.value}
              </p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category grid */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Browse by craft"
          title="Every space a creator needs"
          description="Daylit lofts with cyc walls, sound stages, dead-quiet podcast rooms. Whatever you make, there is a room for it."
        />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
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
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
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
          description="The newest spaces on StudioSpace, listed by hosts and ready to book."
        />
        <FeaturedStudios />
      </section>

      {/* How booking works */}
      <section className="w-full border-y border-border bg-muted/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <SectionHeading
            eyebrow="How booking works"
            title="From search to shoot in four steps"
            align="center"
          />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Host guarantee */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Host guarantee"
          title="Creator support you can count on"
          description="Every booking is backed by protections for hosts and creators alike."
          align="center"
        />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map((item) => (
            <Card key={item.title} size="sm" className="h-full">
              <CardContent className="flex flex-col gap-4">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <item.icon className="size-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription className="text-sm leading-6">
                    {item.description}
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20">
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
            Book a studio for your next shoot, or open your doors to creators
            and turn empty hours into revenue.
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
              render={<Link href="/add-studio" />}
            >
              List your studio
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}