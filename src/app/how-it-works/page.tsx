import Link from "next/link"
import {
  CalendarCheckIcon,
  CameraIcon,
  ClockIcon,
  ListPlusIcon,
  MailCheckIcon,
  SearchIcon,
  WalletIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

export const metadata = { title: "How It Works" }

const CREATOR_STEPS = [
  {
    icon: SearchIcon,
    title: "Discover spaces",
    description:
      "Search by name or location and filter by category, from photo studios to music suites.",
  },
  {
    icon: ClockIcon,
    title: "Select shoot hours",
    description:
      "Choose a date and your start and end time. Already-confirmed slots are shown so you can plan around them.",
  },
  {
    icon: CalendarCheckIcon,
    title: "Book instantly",
    description:
      "Send your request in one click. It starts as Pending until the host confirms.",
  },
  {
    icon: CameraIcon,
    title: "Create & produce",
    description:
      "Once confirmed, the space is yours for the hours you booked. Cancel any pending request from My Bookings.",
  },
]

const HOST_STEPS = [
  {
    icon: ListPlusIcon,
    title: "List your studio",
    description:
      "Add photos, amenities, your hourly rate, deposit and capacity in a few minutes.",
  },
  {
    icon: MailCheckIcon,
    title: "Review requests",
    description:
      "Booking requests appear under Hosting requests. Confirm the ones that fit, or reject the rest.",
  },
  {
    icon: WalletIcon,
    title: "Host & complete",
    description:
      "Mark a booking as completed after the session. Overlapping confirmations are blocked automatically.",
  },
]

const FAQS = [
  {
    q: "When am I charged?",
    a: "Booking a slot sends a request to the host. Nothing is confirmed until the host accepts it.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes. You can cancel any booking that is still Pending from the My Bookings page.",
  },
  {
    q: "Can two people book the same hours?",
    a: "Requests can overlap while pending, but once a booking is confirmed, any overlapping request is rejected.",
  },
  {
    q: "Who can list a studio?",
    a: "Anyone with an account. Register, then use Add New Studio from your profile menu.",
  },
]

function StepGrid({
  steps,
  columns,
}: {
  steps: typeof CREATOR_STEPS
  columns: string
}) {
  return (
    <div className={`mt-8 grid grid-cols-1 gap-4 ${columns}`}>
      {steps.map((step, index) => (
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
  )
}

export default function HowItWorksPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <Badge variant="secondary">How it works</Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          From search to shoot, simply
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          Whether you&apos;re booking a space or sharing one, StudioSpace keeps
          every step clear.
        </p>
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          For creators
        </h2>
        <StepGrid steps={CREATOR_STEPS} columns="sm:grid-cols-2 lg:grid-cols-4" />
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          For hosts
        </h2>
        <StepGrid steps={HOST_STEPS} columns="md:grid-cols-3" />
      </section>

      <section className="mx-auto mt-14 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Common questions
        </h2>
        <div className="mt-6 flex flex-col gap-3">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-border px-4 py-3"
            >
              <summary className="cursor-pointer list-none font-medium text-foreground">
                {faq.q}
              </summary>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-14 flex flex-wrap justify-center gap-3">
        <Button size="lg" render={<Link href="/studios" />}>
          Explore studios
        </Button>
        <Button size="lg" variant="outline" render={<Link href="/add-studio" />}>
          List your studio
        </Button>
      </div>
    </div>
  )
}