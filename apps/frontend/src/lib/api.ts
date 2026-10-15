export type Health = { status: 'ok'; service: string }

export async function getHealth(signal?: AbortSignal): Promise<Health> {
  const response = await fetch('/api/health', { signal })
  if (!response.ok) throw new Error('API returned HTTP ' + response.status)
  const body: unknown = await response.json()
  if (
    typeof body !== 'object' ||
    body === null ||
    !('status' in body) ||
    body.status !== 'ok' ||
    !('service' in body) ||
    typeof body.service !== 'string'
  )
    throw new Error('API returned an invalid health response')
  return { status: body.status, service: body.service }
}
