const BASE = '/api'

export async function apiFetch(path, options = {}, token = null) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    let message = 'Request failed'
    try {
      const err = await res.json()
      message = err.message || message
    } catch {}
    throw new Error(message)
  }

  if (res.status === 204) return null
  return res.json()
}
