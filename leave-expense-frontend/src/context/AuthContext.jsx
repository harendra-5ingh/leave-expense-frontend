import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('leavedesk_auth'))
    } catch {
      return null
    }
  })

  function login(data) {
    localStorage.setItem('leavedesk_auth', JSON.stringify(data))
    setAuth(data)
  }

  function logout() {
    localStorage.removeItem('leavedesk_auth')
    setAuth(null)
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
