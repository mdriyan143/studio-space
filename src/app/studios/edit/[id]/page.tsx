import { EditStudio } from "@/components/site/edit-studio"
import { RequireAuth } from "@/components/site/require-auth"

export const metadata = { title: "Update Studio" }

export default async function EditStudioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <RequireAuth>
      <EditStudio id={id} />
    </RequireAuth>
  )
}