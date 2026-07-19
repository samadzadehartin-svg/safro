import { createClient } from '@supabase/supabase-js'
import { getSettings } from './store'

export function getSupabaseClient() {
  const settings = getSettings()
  if (!settings.supabaseUrl || !settings.supabaseKey) return null
  return createClient(settings.supabaseUrl, settings.supabaseKey)
}

export async function syncToSupabase(data: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient()
  if (!client) return { success: false, error: 'Supabase تنظیم نشده است. URL و کلید را در تنظیمات وارد کنید.' }

  try {
    const { error } = await client
      .from('safaro_store')
      .upsert({ key: 'app_data', value: JSON.stringify(data), updated_at: new Date().toISOString() })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'خطای ناشناخته' }
  }
}

export async function testSupabaseConnection(): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient()
  if (!client) return { success: false, error: 'Supabase تنظیم نشده است.' }

  try {
    const { error } = await client.from('safaro_store').select('key').limit(1)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'خطای اتصال' }
  }
}
