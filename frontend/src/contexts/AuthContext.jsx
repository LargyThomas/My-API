import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext({ token: null, login: () => {}, logout: () => {} })

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  const login = (newToken) => setToken(newToken)
  const logout = () => setToken(null)

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
