import { useState, type ReactNode } from 'react'
import { AuthContext, type User } from './authContextValue'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({ name: 'Minh Anh', email: 'minh@example.com' })
  return (
    <AuthContext.Provider
      value={{
        user,
        login: (email) => setUser({ name: email.split('@')[0], email }),
        logout: () => setUser(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
