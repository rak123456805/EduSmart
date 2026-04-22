import { useEffect } from 'react'
import AppRouter from '@/router'
import { ToastProvider } from '@/components/ui/Toast'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

function App() {
  const { setUser } = useAuthStore()

  useEffect(() => {
    // 1. Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || 'User',
          email: session.user.email || '',
          role: session.user.user_metadata?.role || null
        })
      }
    })

    // 2. Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth Event:", event)

      if (session) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || 'User',
          email: session.user.email || '',
          role: session.user.user_metadata?.role || null
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  )
}

export default App
