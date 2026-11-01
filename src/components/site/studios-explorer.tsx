"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { PlusIcon, SearchIcon, SearchXIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  StudioCard,
  StudioCardSkeleton,
} from "@/components/site/studio-card"
import { api } from "@/lib/api"
import {
  STUDIO_CATEGORIES,
  type ListResponse,
  type Studio,
} from "@/lib/studios"

export function StudiosExplorer() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const category = searchParams.get("category") ?? ""
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "")
  const [studios, setStudios] = React.useState<Studio[]>([])
  const [loading, setLoading] = React.useState(true)

  // Keep the URL in sync so filters survive reloads and can be shared
  const updateParams = React.useCallback(
    (next: { category?: string; search?: string }) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(next)) {
        if (value) params.set(key, value)
        else params.delete(key)
      }
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  // Debounce the search box
  React.useEffect(() => {
    const current = searchParams.get("search") ?? ""
    if (search === current) return
    const timer = setTimeout(() => updateParams({ search }), 400)
    return () => clearTimeout(timer)
  }, [search, searchParams, updateParams])

  const urlSearch = searchParams.get("search") ?? ""

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)

    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (urlSearch) params.set("search", urlSearch)

    api<ListResponse<Studio[]>>(`/studios?${params.toString()}`)
      .then((res) => {
        if (!cancelled) setStudios(res.data)
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setStudios([])
          toast.error(err.message)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [category, urlSearch])

  const clearFilters = () => {
    setSearch("")
    router.replace(pathname, { scroll: false })
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Explore Studios
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Browse photography, film, podcast and music spaces, and book the hours
          you need.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <div className="relative max-w-md">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or location"
            className="pl-9"
            aria-label="Search studios"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={category ? "outline" : "default"}
            onClick={() => updateParams({ category: "" })}
          >
            All
          </Button>
          {STUDIO_CATEGORIES.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={category === item ? "default" : "outline"}
              onClick={() => updateParams({ category: item })}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <StudioCardSkeleton key={i} />
          ))
        ) : (
          studios.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))
        )}
      </div>

      {!loading && studios.length === 0 && (
        <div className="mt-6 flex flex-col items-center gap-4 rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <SearchXIcon className="size-6" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-foreground">
              No studios found
            </h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Nothing matches your search yet. Try different keywords, or be the
              first to list a space in this category.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
            <Button render={<Link href="/add-studio" />}>
              <PlusIcon className="size-4" />
              Host your space
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}