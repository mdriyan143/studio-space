import Link from "next/link"
import { HomeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export const metadata = { title: "Page not found" }

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <svg
        viewBox="0 0 240 180"
        role="img"
        aria-label="A studio spotlight pointing at an empty stage"
        className="w-64 text-foreground"
      >
        {/* spotlight beam */}
        <path
          d="M120 28 L64 150 L176 150 Z"
          className="fill-primary/10"
        />
        {/* stage */}
        <rect
          x="30"
          y="150"
          width="180"
          height="10"
          rx="3"
          className="fill-muted-foreground/30"
        />
        {/* light rig */}
        <rect x="60" y="8" width="120" height="6" rx="3" className="fill-foreground" />
        <rect x="108" y="14" width="24" height="14" rx="3" className="fill-foreground" />
        <circle cx="120" cy="34" r="8" className="fill-primary" />
        {/* camera on tripod */}
        <rect x="150" y="104" width="30" height="20" rx="3" className="fill-foreground" />
        <circle cx="165" cy="114" r="6" className="fill-background" />
        <path
          d="M165 124 L152 150 M165 124 L178 150 M165 124 L165 150"
          className="stroke-foreground"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* stool */}
        <rect x="76" y="122" width="26" height="6" rx="3" className="fill-foreground" />
        <path
          d="M82 128 L80 150 M96 128 L98 150"
          className="stroke-foreground"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium tracking-widest text-primary uppercase">
          Error 404
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          This stage is empty
        </h1>
        <p className="text-muted-foreground">
          The page you&apos;re looking for has wrapped and moved on. Head back
          home and find your next studio.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Button render={<Link href="/" />}>
          <HomeIcon className="size-4" />
          Return to Home
        </Button>
        <Button variant="outline" render={<Link href="/studios" />}>
          Explore studios
        </Button>
      </div>
    </div>
  )
}