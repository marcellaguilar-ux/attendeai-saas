const hits = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, { max = 20, windowMs = 60_000 } = {}): boolean {
  const now = Date.now()
  const entry = hits.get(key)

  if (entry && now < entry.resetAt) {
    entry.count++
    return entry.count > max
  }

  hits.set(key, { count: 1, resetAt: now + windowMs })

  // Cleanup when map grows too large
  if (hits.size > 10_000) {
    for (const [k, v] of hits) {
      if (now >= v.resetAt) hits.delete(k)
    }
  }

  return false
}
