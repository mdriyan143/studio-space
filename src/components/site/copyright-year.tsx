"use client"

import * as React from "react"

/**
 * Displays the current copyright year, computed after mount. `cacheComponents`
 * forbids reading `new Date()` during prerendering (even in client
 * components), so the value is deferred until the app is hydrated.
 */
export function CopyrightYear() {
  const [year, setYear] = React.useState<number | null>(null)

  React.useEffect(() => {
    // Deferred to after mount: a synchronous read here is still executed
    // during prerendering and fails the build under `cacheComponents`.
    const id = window.setTimeout(() => setYear(new Date().getFullYear()), 0)
    return () => window.clearTimeout(id)
  }, [])

  return <span suppressHydrationWarning>{year}</span>
}
