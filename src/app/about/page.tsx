import Link from "next/link"
import { HeartHandshakeIcon, LockKeyholeIcon, SparklesIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

export const metadata = { title: "About Us" }

const VALUES = [
  {
    icon: SparklesIcon,
    title: "Made for creators",
    description:
      "Photographers, filmmakers, podcasters and musicians shouldn't have to chase quotes by phone. Spaces, rates and availability are all in one place.",
  },
  {
    icon: HeartHandshakeIcon,
    title: "Fair for hosts",
    description:
      "Studio owners decide their own rates, deposits and which requests to accept, and they turn idle hours into income.",
  },
  {
    icon: LockKeyholeIcon,
    title: "Secure by design",
    description:
      "Every booking and listing action is protected by verified sign-in, so only the right person can change a listing or a reservation.",
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <Badge variant="secondary">About StudioSpace</Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          A peer-to-peer home for creative spaces
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          StudioSpace connects people who own creative spaces with people who
          need them, by the hour and with prices shown up front.
        </p>
      </div>

      <section className="mt-12 flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Our mission
        </h2>
        <p className="leading-7 text-muted-foreground">
          Great work needs the right room: a cyclorama wall for a product
          shoot, a quiet lounge for a podcast, a treated suite for a recording
          session. Most of those rooms sit empty for much of the week while
          creators struggle to find them. We built StudioSpace to close that
          gap, with transparent pricing, real availability and a booking flow
          that respects both sides.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          What we believe
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {VALUES.map((value) => (
            <Card key={value.title} size="sm" className="h-full">
              <CardContent className="flex flex-col gap-4">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <value.icon className="size-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <CardTitle>{value.title}</CardTitle>
                  <CardDescription className="text-sm leading-6">
                    {value.description}
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Button size="lg" render={<Link href="/studios" />}>
          Explore studios
        </Button>
        <Button size="lg" variant="outline" render={<Link href="/register" />}>
          Join StudioSpace
        </Button>
      </div>
    </div>
  )
}