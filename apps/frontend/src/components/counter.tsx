import { Button, Card } from '@repo/ui'
import { useCounterStore } from '../stores/counter'

export function Counter() {
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)
  const reset = useCounterStore((state) => state.reset)
  return (
    <Card
      title="Shared state"
      description="A small Zustand store, available across routes."
    >
      <output className="counter" aria-live="polite" aria-label="Counter value">
        {count}
      </output>
      <div className="actions">
        <Button onClick={increment}>Increment</Button>
        <Button variant="secondary" onClick={reset}>
          Reset
        </Button>
      </div>
    </Card>
  )
}
