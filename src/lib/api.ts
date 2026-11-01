import { authClient } from "@/lib/auth-client"

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

  if (auth) {
    const { data } = await authClient.token()
    if (!data?.token) throw new ApiError("Please log in to continue.", 401)
    finalHeaders.Authorization = `Bearer ${data.token}`
  }

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
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