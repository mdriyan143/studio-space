export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

type ApiOptions = Omit<RequestInit, "body"> & {
  auth?: boolean
  body?: unknown
}

export async function api<T = unknown>(
  path: string,
  { auth = false, body, headers, ...init }: ApiOptions = {}
): Promise<T> {
  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  }

  if (body !== undefined) finalHeaders["Content-Type"] = "application/json"

  // Protected calls go through our own origin; the HTTPOnly session cookie
  // is sent automatically and the JWT is attached on the server.
  const url = auth ? `/api/proxy${path}` : `${API_URL}${path}`

  let res: Response
  try {
    res = await fetch(url, {
      ...init,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    })
  } catch {
    throw new ApiError("Can't reach the server. Please try again.", 0)
  }

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError(json?.message ?? "Something went wrong.", res.status)
  }

  return json as T
}