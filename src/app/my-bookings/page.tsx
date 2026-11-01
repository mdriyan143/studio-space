import { MyBookings } from "@/components/site/my-bookings"
import { RequireAuth } from "@/components/site/require-auth"

export const metadata = { title: "My Bookings" }

export default function MyBookingsPage() {
  return (
    <RequireAuth>
      <MyBookings />
    </RequireAuth>
  )
}