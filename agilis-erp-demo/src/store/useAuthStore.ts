import { create } from 'zustand'
import type { User } from '@/types'
import { currentUser, users } from '@/mock/users'

interface AuthState {
  user: User
  language: 'zh-CN' | 'en'
  setUser: (user: User) => void
  setLanguage: (lang: 'zh-CN' | 'en') => void
  availableUsers: User[]
}

export const useAuthStore = create<AuthState>((set) => ({
  user: currentUser,
  language: 'zh-CN',
  availableUsers: users,
  setUser: (user) => set({ user }),
  setLanguage: (language) => set({ language }),
}))
