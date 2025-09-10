import { createContext, useContext, useState, useEffect } from 'react'
// import { login as apiLogin, refresh } from '../services/auth'

export type User = { id: string; email: string; role: string; firstName: string; lastName: string }
type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Dummy login for development/demo
  const login = async (email: string, password: string) => {
    // If API is not connected, use dummy user
    if (email === 'admin@oyshmb.com' && password === 'Admin123!') {
      setUser({ id: '1', email, role: 'Admin', firstName: 'Root', lastName: 'Admin' })
      return
    }
    if (email === 'officer@example.com' && password === 'officer123') {
      setUser({ id: '2', email, role: 'Officer', firstName: 'John', lastName: 'Doe' })
      return
    }
    // Uncomment below when API is ready
    // const res = await apiLogin({ email, password })
    // setUser(res.data.user)
    throw new Error('Invalid credentials')
  }

  const logout = () => {
    setUser(null)
    // Optionally call logout API
  }

  // Optionally, implement refresh logic when API is ready
  useEffect(() => {
  //   refresh().then(res => setUser(res.data.user)).catch(() => setUser(null))
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
