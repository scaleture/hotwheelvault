import { createClient } from '@supabase/supabase-js'

export function createServerSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. ' +
      'Create a .env.local file with these values.'
    )
  }

  return createClient(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, { ...options, cache: 'no-store' })
      },
    },
  })
}
