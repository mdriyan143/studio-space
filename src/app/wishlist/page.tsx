import { RequireAuth } from "@/components/site/require-auth"
import { SavedStudios } from "@/components/site/saved-studios"

export const metadata = { title: "Saved Studios" }

export default function WishlistPage() {
  return (
    <RequireAuth>
      <SavedStudios />
    </RequireAuth>
  )
}