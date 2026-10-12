import { useEffect, useState } from 'react'

export function useCooldown(initialSeconds = 0) {
  const [until, setUntil] = useState(() => Date.now() + initialSeconds * 1000)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (until <= now) return
    const timeout = setTimeout(() => setNow(Date.now()), 1000)
    return () => clearTimeout(timeout)
  }, [until, now])

  const start = (seconds: number) => {
    const started = Date.now()
    setNow(started)
    setUntil(started + seconds * 1000)
  }

  return [Math.max(0, Math.ceil((until - now) / 1000)), start] as const
}
