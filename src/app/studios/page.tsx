import { Suspense } from "react"

import { StudiosExplorer } from "@/components/site/studios-explorer"

export const metadata = { title: "Explore Studios" }

export default function StudiosPage() {
  return (
    <Suspense fallback={null}>
      <StudiosExplorer />
    </Suspense>
  )
}