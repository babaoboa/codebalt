import { treaty } from '@elysia/eden'
import type { App } from 'backend'

// @ts-expect-error yeah im going to sleep 😂✌️
export const backend = treaty<App>(window.location.origin)
