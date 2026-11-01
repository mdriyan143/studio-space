import { StudioDetails } from "@/components/site/studio-details"

export default async function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <StudioDetails id={id} />
}