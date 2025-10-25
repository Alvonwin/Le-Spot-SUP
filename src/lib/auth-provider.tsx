'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { localUser } from './local-storage'
import type { User } from './types'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let localUserData = localUser.get()
    
    if (!localUserData) {
      localUserData = {
        uid: 'local-user-' + Date.now(),
        email: 'utilisateur@local.com',
        displayName: 'Utilisateur Local'
      }
      localUser.save(localUserData)
    }
    
    setUser(localUserData)
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)