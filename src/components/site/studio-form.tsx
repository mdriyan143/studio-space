"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ImagePlusIcon, Loader2Icon, UploadIcon, XIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { uploadImage } from "@/lib/imgbb"
import { useSession } from "@/lib/session"
import { STUDIO_CATEGORIES, type Studio } from "@/lib/studios"

const AMENITIES = [
  "Wi-Fi",
  "Air conditioning",
  "Parking",
  "Green screen",
  "Cyclorama wall",
  "Soundproofing",
  "Lighting kit",
  "Backdrops",
  "Microphones",
  "Mixing console",
  "Makeup area",
  "Kitchenette",
  "Changing room",
  "Props",
]

const MAX_GALLERY = 8

const positiveNumber = (label: string) =>
  z
    .string()
    .trim()
    .refine(
      (v) => v !== "" && Number.isFinite(Number(v)) && Number(v) >= 0,
      `${label} must be a valid number`
    )

const schema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  category: z.enum(STUDIO_CATEGORIES, { message: "Please choose a category" }),
  hourlyRate: positiveNumber("Hourly rate"),
  securityDeposit: positiveNumber("Security deposit"),
  maxCapacity: z
    .string()
    .trim()
    .refine(
      (v) => /^\d+$/.test(v) && Number(v) >= 1,
      "Capacity must be a whole number of 1 or more"
    ),
  location: z.string().trim().min(3, "Please enter a location or address"),
  imageUrl: z.string().trim().url("Please enter a valid image URL"),
  overview: z
    .string()
    .trim()
    .min(30, "Overview must be at least 30 characters"),
})

type FormValues = z.infer<typeof schema>

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-destructive">{message}</p>
}

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:[color-scheme:dark] [&_option]:bg-popover [&_option]:text-popover-foreground"

export function StudioForm({ studio }: { studio?: Studio }) {
  const router = useRouter()
  const { user } = useSession()
  const isEdit = Boolean(studio)

  const [amenities, setAmenities] = React.useState<string[]>(
    studio?.amenities ?? []
  )
  const [submitting, setSubmitting] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement>(null)

  const [gallery, setGallery] = React.useState<string[]>(studio?.gallery ?? [])
  const [uploadingGallery, setUploadingGallery] = React.useState(false)
  const galleryRef = React.useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: studio?.title ?? "",
      category: (studio?.category as FormValues["category"]) ?? undefined,
      hourlyRate: studio ? String(studio.hourlyRate) : "",
      securityDeposit: studio ? String(studio.securityDeposit) : "",
      maxCapacity: studio ? String(studio.maxCapacity) : "",
      location: studio?.location ?? "",
      imageUrl: studio?.imageUrl ?? "",
      overview: studio?.overview ?? "",
    },
  })

  const imageUrl = watch("imageUrl")
  const previewOk = /^https?:\/\/.+/i.test(imageUrl ?? "")

  const toggleAmenity = (item: string) =>
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    )

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setValue("imageUrl", url, { shouldValidate: true })
      toast.success("Image uploaded.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ""
    if (files.length === 0) return

    const room = MAX_GALLERY - gallery.length
    if (room <= 0) {
      toast.error(`You can add up to ${MAX_GALLERY} gallery photos.`)
      return
    }

    setUploadingGallery(true)
    try {
      const urls: string[] = []
      for (const file of files.slice(0, room)) {
        urls.push(await uploadImage(file))
      }
      setGallery((prev) => [...prev, ...urls])
      toast.success(
        `${urls.length} photo${urls.length > 1 ? "s" : ""} uploaded.`
      )
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setUploadingGallery(false)
    }
  }

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      const payload = {
        ...values,
        hourlyRate: Number(values.hourlyRate),
        securityDeposit: Number(values.securityDeposit),
        maxCapacity: Number(values.maxCapacity),
        amenities,
        gallery,
      }

      if (studio) {
        await api(`/studios/${studio._id}`, {
          method: "PATCH",
          auth: true,
          body: payload,
        })
        toast.success("Studio updated successfully!")
      } else {
        await api("/studios", { method: "POST", auth: true, body: payload })
        toast.success("Studio added successfully!")
      }

      router.push("/my-listings")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {isEdit ? "Update Studio" : "Add New Studio"}
        </h1>
        <p className="text-muted-foreground">
          {isEdit
            ? "Edit your listing details below."
            : "Tell creators about your space. Clear photos and details get more bookings."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 flex flex-col gap-6"
        noValidate
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="title">Studio title</Label>
            <Input
              id="title"
              placeholder="e.g. Sunlit Cyclorama Photo Loft"
              {...register("title")}
            />
            <FieldError message={errors.title?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className={selectClass}
              defaultValue={studio?.category ?? ""}
              {...register("category")}
            >
              <option value="" disabled>
                Select a category
              </option>
              {STUDIO_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <FieldError message={errors.category?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="maxCapacity">Max capacity (people)</Label>
            <Input
              id="maxCapacity"
              inputMode="numeric"
              placeholder="e.g. 10"
              {...register("maxCapacity")}
            />
            <FieldError message={errors.maxCapacity?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="hourlyRate">Hourly rate ($)</Label>
            <Input
              id="hourlyRate"
              inputMode="decimal"
              placeholder="e.g. 45"
              {...register("hourlyRate")}
            />
            <FieldError message={errors.hourlyRate?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="securityDeposit">Security deposit ($)</Label>
            <Input
              id="securityDeposit"
              inputMode="decimal"
              placeholder="e.g. 100"
              {...register("securityDeposit")}
            />
            <FieldError message={errors.securityDeposit?.message} />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="location">Location / address</Label>
            <Input
              id="location"
              placeholder="e.g. 12 Gulshan Avenue, Dhaka"
              {...register("location")}
            />
            <FieldError message={errors.location?.message} />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="imageUrl">Cover image URL</Label>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="imageUrl"
                placeholder="Paste an image link, or upload a file"
                className="flex-1"
                {...register("imageUrl")}
              />

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="shrink-0"
              >
                {uploading ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <UploadIcon className="size-4" />
                )}
                {uploading ? "Uploading..." : "Upload image"}
              </Button>
            </div>

            <FieldError message={errors.imageUrl?.message} />

            {previewOk && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Studio preview"
                className="mt-1 aspect-[16/9] w-full max-w-sm rounded-lg border border-border object-cover"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label>Gallery photos (optional, up to {MAX_GALLERY})</Label>
          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleGalleryUpload}
          />
          <div className="flex flex-wrap gap-3">
            {gallery.map((src) => (
              <div key={src} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="Gallery photo"
                  className="size-24 rounded-lg border border-border object-cover"
                />
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() =>
                    setGallery((prev) => prev.filter((u) => u !== src))
                  }
                  className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white"
                >
                  <XIcon className="size-3.5" />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              disabled={uploadingGallery || gallery.length >= MAX_GALLERY}
              onClick={() => galleryRef.current?.click()}
              className="size-24 flex-col gap-1"
            >
              {uploadingGallery ? (
                <Loader2Icon className="size-5 animate-spin" />
              ) : (
                <ImagePlusIcon className="size-5" />
              )}
              <span className="text-xs">
                {uploadingGallery ? "Uploading" : "Add"}
              </span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label>Amenities</Label>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((item) => {
              const active = amenities.includes(item)
              return (
                <Button
                  key={item}
                  type="button"
                  size="sm"
                  variant={active ? "default" : "outline"}
                  aria-pressed={active}
                  onClick={() => toggleAmenity(item)}
                >
                  {item}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="overview">Detailed overview</Label>
          <Textarea
            id="overview"
            rows={6}
            placeholder="Describe the space, equipment, house rules and what makes it great for creators."
            {...register("overview")}
          />
          <FieldError message={errors.overview?.message} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="hostName">Host name</Label>
            <Input
              id="hostName"
              value={isEdit ? studio?.ownerName : (user?.name ?? "")}
              readOnly
              className="bg-muted/50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="hostEmail">Host email</Label>
            <Input
              id="hostEmail"
              value={isEdit ? studio?.ownerEmail : (user?.email ?? "")}
              readOnly
              className="bg-muted/50"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/my-listings")}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting || uploading || uploadingGallery}
          >
            {submitting && <Loader2Icon className="size-4 animate-spin" />}
            {isEdit ? "Save changes" : "Add studio"}
          </Button>
        </div>
      </form>
    </div>
  )
}