import { Badge } from "@/components/ui/badge"
import { cn } from "cn"
import type { BookingStatus } from "@/lib/bookings"

const STYLES: Record<BookingStatus, string> = {
  Pending:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Confirmed:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Completed:
    "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  Cancelled:
    "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", STYLES[status])}>
      {status}
    </Badge>
  )
}