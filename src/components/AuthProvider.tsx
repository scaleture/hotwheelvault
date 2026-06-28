'use client'
import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'

function SearchParamsHandler() {
  const openAuthModal = useUIStore(s => s.openAuthModal)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('signin') === 'true') {
      openAuthModal()
    }
  }, [searchParams, openAuthModal])

  return null
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore(s => s.setUser)

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        const { data: existing } = await supabaseBrowser
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single()

        if (!existing) {
          const fullName = session.user.user_metadata?.full_name
            ?? session.user.user_metadata?.name
            ?? session.user.email?.split('@')[0]
            ?? ''

          await supabaseBrowser.from('profiles').upsert({
            id: session.user.id,
            full_name: fullName,
          })
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler />
      </Suspense>
      {children}
    </>
  )
}
