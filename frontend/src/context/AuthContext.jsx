import React, { createContext, useState, useContext, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('janvoice_token')
    const savedUser = localStorage.getItem('janvoice_user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      // Mock login for demo (replace with real API call)
      // const response = await authService.login(credentials)
      
      // DEMO MODE - Remove this block when backend is ready
      const mockUser = {
        id: '1',
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: credentials.role || 'citizen'
      }
      const mockToken = 'demo_token_' + Date.now()
      
      setToken(mockToken)
      setUser(mockUser)
      localStorage.setItem('janvoice_token', mockToken)
      localStorage.setItem('janvoice_user', JSON.stringify(mockUser))
      
      return { success: true, user: mockUser }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      }
    }
  }

  const register = async (userData) => {
    try {
      // Mock register for demo
      const mockUser = {
        id: '1',
        name: userData.name,
        email: userData.email,
        role: userData.role || 'citizen'
      }
      const mockToken = 'demo_token_' + Date.now()
      
      setToken(mockToken)
      setUser(mockUser)
      localStorage.setItem('janvoice_token', mockToken)
      localStorage.setItem('janvoice_user', JSON.stringify(mockUser))
      
      return { success: true, user: mockUser }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.'
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('janvoice_token')
    localStorage.removeItem('janvoice_user')
    localStorage.removeItem('janvoice_remember')
  }

  const isAuthenticated = () => {
    return !!token && !!user
  }

  const hasRole = (role) => {
    return user?.role === role
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext