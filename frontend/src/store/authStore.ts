import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = 'student' | 'teacher' | null

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
  department?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isDark: boolean
  setUser: (user: User | null) => void
  logout: () => void
  toggleTheme: () => void
}

const applyTheme = (dark: boolean) => {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isDark: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
      toggleTheme: () => {
        const next = !get().isDark
        applyTheme(next)
        set({ isDark: next })
      },
    }),
    {
      name: 'edusmart-auth',
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.isDark)
      },
    }
  )
)
