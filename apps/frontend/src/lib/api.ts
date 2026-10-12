import { treaty } from '@elysia/eden'
import type { App } from 'backend'

export const backend = treaty<App>(window.location.origin)
