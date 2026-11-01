import { Dashboard } from "@/components/site/dashboard"
import { RequireAuth } from "@/components/site/require-auth"

export const metadata = { title: "Dashboard" }

export default function DashboardPage() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  )
}