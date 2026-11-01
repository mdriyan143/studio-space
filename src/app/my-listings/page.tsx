import { MyListings } from "@/components/site/my-listings"
import { RequireAuth } from "@/components/site/require-auth"

export const metadata = { title: "My Studio Listings" }

export default function MyListingsPage() {
  return (
    <RequireAuth>
      <MyListings />
    </RequireAuth>
  )
}