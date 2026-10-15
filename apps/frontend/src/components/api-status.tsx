import { useEffect, useState } from 'react'
import { Button, Card } from '@repo/ui'
import { getHealth } from '../lib/api'

type Status =
  | { kind: 'loading' }
  | { kind: 'success'; service: string }
  | { kind: 'error'; message: string }

export function ApiStatus() {
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<Status>({ kind: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    getHealth(controller.signal).then(
      (health) => {
        if (!controller.signal.aborted)
          setStatus({ kind: 'success', service: health.service })
      },
      (error: unknown) => {
        if (!controller.signal.aborted)
          setStatus({
            kind: 'error',
            message:
              error instanceof Error
                ? error.message
                : 'Unable to reach the API',
          })
      },
    )
    return () => controller.abort()
  }, [attempt])

  return (
    <Card
      title="Go API"
      description="A live request through the Vite development proxy."
    >
      <output className="api-status">
        <span className={'status-dot ' + status.kind} />
        {status.kind === 'loading' && 'Connecting…'}
        {status.kind === 'success' && status.service + ' is online'}
        {status.kind === 'error' && status.message}
      </output>
      <Button
        variant="secondary"
        disabled={status.kind === 'loading'}
        onClick={() => {
          setStatus({ kind: 'loading' })
          setAttempt((value) => value + 1)
        }}
      >
        Check connection
      </Button>
    </Card>
  )
}
