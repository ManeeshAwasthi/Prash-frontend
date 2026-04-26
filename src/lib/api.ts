export class ApiError extends Error {
  status: number
  code: string
  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

const BASE = import.meta.env.VITE_API_URL as string

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const jwt = localStorage.getItem('drufiy_jwt')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  }
  if (jwt) headers['Authorization'] = `Bearer ${jwt}`

  const res = await fetch(`${BASE}${path}`, { ...init, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    if (res.status === 401) {
      localStorage.removeItem('drufiy_jwt')
      window.location.href = '/login'
    }
    throw new ApiError(
      res.status,
      (body as { error?: string }).error ?? 'unknown',
      (body as { message?: string }).message ?? res.statusText,
    )
  }
  return res.json() as Promise<T>
}
