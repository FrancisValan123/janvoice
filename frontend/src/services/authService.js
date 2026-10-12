import { api } from './api'

export const authService = {
  // POST /api/auth/register
  // Expects: { name, email, password, phone, role }
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    if (response.data.token) {
      localStorage.setItem('janvoice_token', response.data.token)
      localStorage.setItem('janvoice_user', JSON.stringify(response.data.user))
    }
    return response // 👈 Return full response (AuthContext needs response.data)
  },

  // POST /api/auth/login
  // Expects: { email, password, role }
  login: async (credentials) => {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    })
    if (response.data.token) {
      localStorage.setItem('janvoice_token', response.data.token)
      localStorage.setItem('janvoice_user', JSON.stringify(response.data.user))
    }
    return response // 👈 Return full response
  },

  // POST /api/auth/logout
  logout: () => {
    localStorage.removeItem('janvoice_token')
    localStorage.removeItem('janvoice_user')
  },

  // GET /api/auth/me
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // POST /api/auth/verify-otp
  verifyOTP: async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp })
    return response.data
  }
}

export default authService