import React, { createContext, useState, useContext, useEffect } from 'react'
import authService from '../services/authService'
import { api } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // ===================================
  // LOAD USER FROM LOCALSTORAGE ON MOUNT
  // ===================================
  useEffect(() => {
    const savedToken = localStorage.getItem('janvoice_token')
    const savedUser = localStorage.getItem('janvoice_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // ===================================
  // LOGIN
  // ✅ Now handles the "requiresTwoFA" response
  // ===================================
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)

      // 🚨 If backend asks for a 2FA code, DON'T set token yet
      if (response.data.requiresTwoFA) {
        return {
          success: true,
          requiresTwoFA: true,
          userId: response.data.userId,
          email: response.data.email
        }
      }

      // Normal login (no 2FA)
      const { token, user } = response.data
      setToken(token)
      setUser(user)
      localStorage.setItem('janvoice_token', token)
      localStorage.setItem('janvoice_user', JSON.stringify(user))
      localStorage.setItem('janvoice_login_time', new Date().toISOString())

      return { success: true, user }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Login failed. Please try again.'
      }
    }
  }

  // ===================================
  // COMPLETE 2FA LOGIN (after entering code)
  // ===================================
  const completeTwoFALogin = async ({ userId, token: code, backupCode }) => {
    try {
      const payload = backupCode
        ? { userId, backupCode }
        : { userId, token: code }

      const response = await api.post('/auth/2fa/login', payload)

      if (response.data?.success) {
        const { token: accessToken, user: loggedInUser } = response.data
        setToken(accessToken)
        setUser(loggedInUser)
        localStorage.setItem('janvoice_token', accessToken)
        localStorage.setItem('janvoice_user', JSON.stringify(loggedInUser))
        localStorage.setItem('janvoice_login_time', new Date().toISOString())

        return { success: true, user: loggedInUser }
      }

      return {
        success: false,
        message: response.data?.message || 'Invalid 2FA code'
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Invalid or expired code. Please try again.'
      }
    }
  }

  // ===================================
  // REGISTER
  // ===================================
  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      const { token, user } = response.data

      setToken(token)
      setUser(user)
      localStorage.setItem('janvoice_token', token)
      localStorage.setItem('janvoice_user', JSON.stringify(user))
      localStorage.setItem('janvoice_login_time', new Date().toISOString())

      return { success: true, user }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.'
      }
    }
  }

  // ===================================
  // LOGOUT
  // ===================================
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('janvoice_token')
    localStorage.removeItem('janvoice_user')
    localStorage.removeItem('janvoice_remember')
    localStorage.removeItem('janvoice_login_time')
  }

  // ===================================
  // UPDATE USER (used by Profile page after save)
  // ===================================
  const updateUser = (updatedUser) => {
    if (!updatedUser) return
    setUser(updatedUser)
    localStorage.setItem('janvoice_user', JSON.stringify(updatedUser))
  }

  // ===================================
  // REFRESH USER FROM BACKEND
  // ===================================
  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me')
      const freshUser = response.data?.user || response.data
      if (freshUser) {
        updateUser(freshUser)
      }
      return { success: true, user: freshUser }
    } catch (error) {
      console.error('Failed to refresh user:', error)
      return {
        success: false,
        message:
          error.response?.data?.message || 'Failed to refresh user data'
      }
    }
  }

  const isAuthenticated = () => !!token && !!user
  const hasRole = (role) => user?.role === role

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        hasRole,
        setUser: updateUser,
        updateUser,
        refreshUser,
        completeTwoFALogin // ✅ New: exposes 2FA completion to Login page
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext