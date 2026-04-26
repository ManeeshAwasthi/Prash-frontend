import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '@/lib/api'

interface User {
  id: string
  github_username: string
  email: string | null
}

interface AuthContextValue {
  user: User | null
  jwt: string | null
  loading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [jwt, setJwt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('drufiy_jwt')
    if (!token) {
      setLoading(false)
      return
    }
    setJwt(token)
    api<User>('/auth/me')
      .then((u) => setUser(u))
      .catch(() => {
        localStorage.removeItem('drufiy_jwt')
        setJwt(null)
      })
      .finally(() => setLoading(false))
  }, [])

  function login(token: string, u: User) {
    localStorage.setItem('drufiy_jwt', token)
    setJwt(token)
    setUser(u)
  }

  function logout() {
    localStorage.removeItem('drufiy_jwt')
    setJwt(null)
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, jwt, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
