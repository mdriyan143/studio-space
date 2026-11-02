import { ProfileForm } from "@/components/site/profile-form"
import { RequireAuth } from "@/components/site/require-auth"

export const metadata = { title: "My Profile" }

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileForm />
    </RequireAuth>
  )
}