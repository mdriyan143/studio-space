import { ApertureIcon } from "lucide-react"

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-1 flex-col items-center justify-center gap-4 py-24"
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <ApertureIcon className="size-8 animate-spin [animation-duration:2s]" />
      </span>
      <p className="text-sm text-muted-foreground">Loading StudioSpace...</p>
    </div>
  )
}