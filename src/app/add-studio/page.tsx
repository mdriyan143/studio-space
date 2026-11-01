import { RequireAuth } from "@/components/site/require-auth"
import { StudioForm } from "@/components/site/studio-form"

export const metadata = { title: "Add New Studio" }

export default function AddStudioPage() {
  return (
    <RequireAuth>
      <StudioForm />
    </RequireAuth>
  )
}