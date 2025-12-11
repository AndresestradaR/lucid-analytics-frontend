import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await api.get('/auth/me')
      setUser(response.data)
    } catch (error) {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const { access_token, user: userData } = response.data
    localStorage.setItem('token', access_token)
    setUser(userData)
    return userData
  }

  const register = async (name, email, password, inviteCode) => {
    const response = await api.post('/auth/register', { 
      name, 
      email, 
      password,
      invite_code: inviteCode
    })
    const { access_token, user: userData } = response.data
    localStorage.setItem('token', access_token)
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateUser = (newData) => {
    setUser(prev => ({ ...prev, ...newData }))
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      updateUser,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
