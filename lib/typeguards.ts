export interface LemonWebhookPayloadMeta {
  event_id?: string
  event_name?: string
  custom_data?: { user_id?: string | number }
  custom?: { user_id?: string | number }
}

export interface LemonWebhookPayload {
  id?: string | number
  type?: string
  meta?: LemonWebhookPayloadMeta
  data?: {
    id?: string | number
    type?: string
    attributes?: Record<string, any>
    relationships?: Record<string, any>
  }
}

export function webhookHasMeta(data: unknown): data is LemonWebhookPayload {
  return (
    typeof data === 'object' &&
    data !== null &&
    'meta' in data &&
    typeof (data as any).meta === 'object' &&
    (data as any).meta !== null
  )
}


