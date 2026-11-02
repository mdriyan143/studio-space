import { HostProfile } from "@/components/site/host-profile"

export const metadata = { title: "Host Profile" }

export default async function HostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <HostProfile id={id} />
}