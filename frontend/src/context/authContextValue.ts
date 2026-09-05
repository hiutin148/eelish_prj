import { createContext } from 'react'

export type User = { name: string; email: string }
export type AuthContextValue = {
  user: User | null
  login: (email: string) => void
  logout: () => void
}
export const AuthContext = createContext<AuthContextValue | null>(null)
