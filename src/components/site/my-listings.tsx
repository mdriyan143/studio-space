"use client"

import * as React from "react"
import Link from "next/link"
import {
  EyeIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  StoreIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { api } from "@/lib/api"
import type { ListResponse, Studio } from "@/lib/studios"

export function MyListings() {
  const [studios, setStudios] = React.useState<Studio[]>([])
  const [loading, setLoading] = React.useState(true)
  const [toDelete, setToDelete] = React.useState<Studio | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false

    api<ListResponse<Studio[]>>("/studios/mine", { auth: true })
      .then((res) => {
        if (!cancelled) setStudios(res.data)
      })
      .catch((err: Error) => {
        if (!cancelled) toast.error(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await api(`/studios/${toDelete._id}`, { method: "DELETE", auth: true })
      setStudios((prev) => prev.filter((s) => s._id !== toDelete._id))
      toast.success("Studio deleted successfully!")
      setToDelete(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            My Studio Listings
          </h1>
          <p className="text-muted-foreground">
            Manage the spaces you&apos;ve listed on StudioSpace.
          </p>
        </div>
        <Button render={<Link href="/add-studio" />}>
          <PlusIcon className="size-4" />
          Add New Studio
        </Button>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : studios.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border px-6 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <StoreIcon className="size-6" />
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-foreground">
                You haven&apos;t listed a studio yet
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Share your space with creators and start earning from the hours
                it sits empty.
              </p>
            </div>
            <Button render={<Link href="/add-studio" />}>
              <PlusIcon className="size-4" />
              List your first studio
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Studio</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead className="pr-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studios.map((studio) => (
                  <TableRow key={studio._id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={studio.imageUrl}
                          alt={studio.title}
                          className="size-12 rounded-md object-cover"
                        />
                        <div className="flex min-w-0 flex-col">
                          <span className="max-w-[16rem] truncate font-medium text-foreground">
                            {studio.title}
                          </span>
                          <span className="max-w-[16rem] truncate text-xs text-muted-foreground">
                            {studio.location}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{studio.category}</Badge>
                    </TableCell>
                    <TableCell>${studio.hourlyRate} / hr</TableCell>
                    <TableCell>{studio.maxCapacity} people</TableCell>
                    <TableCell className="pr-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          render={<Link href={`/studios/${studio._id}`} />}
                        >
                          <EyeIcon className="size-3.5" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          render={<Link href={`/studios/edit/${studio._id}`} />}
                        >
                          <PencilIcon className="size-3.5" />
                          Update
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setToDelete(studio)}
                        >
                          <Trash2Icon className="size-3.5" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AlertDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => {
          if (!open && !deleting) setToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this studio?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{toDelete?.title}&rdquo; will be permanently removed from
              StudioSpace. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setToDelete(null)}
              disabled={deleting}
            >
              Keep studio
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting && <Loader2Icon className="size-4 animate-spin" />}
              Yes, delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}