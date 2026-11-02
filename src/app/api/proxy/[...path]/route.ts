import { NextRequest, NextResponse } from "next/server"

import { auth } from "@/lib/auth"

const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000"

// Only these Express resources can be reached through the proxy
const ALLOWED = new Set(["studios", "bookings", "reviews", "wishlist", "notifications"])

function json(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status })
}

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params

  if (!path?.length || !ALLOWED.has(path[0])) {
    return json("Not found.", 404)
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD"

  // CSRF guard: state-changing requests must come from our own origin
  if (hasBody) {
    const origin = req.headers.get("origin")
    if (origin && origin !== req.nextUrl.origin) {
      return json("Cross-origin requests are not allowed.", 403)
    }
  }

  // The session lives in an HTTPOnly cookie; the JWT is created server-side
  let token: string | undefined
  try {
    const result = await auth.api.getToken({ headers: req.headers })
    token = result?.token
  } catch {
    token = undefined
  }

  if (!token) {
    return json("Unauthorized. Please log in to continue.", 401)
  }

  const target = `${API_URL}/${path.map(encodeURIComponent).join("/")}${req.nextUrl.search}`

  let upstream: Response
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
      },
      body: hasBody ? await req.text() : undefined,
      cache: "no-store",
    })
  } catch {
    return json("Can't reach the server. Please try again.", 502)
  }

  return new NextResponse(await upstream.text(), {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  })
}

export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as PUT,
  handler as DELETE,
}