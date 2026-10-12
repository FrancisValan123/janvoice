/* ===================================
   JANVOICE — API CONFIGURATION
   =================================== */

import axios from 'axios'

// ===================================
// BASE CONFIGURATION
// ===================================
const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const TIMEOUT = 30000 // 30 seconds

// ===================================
// AXIOS INSTANCE
// ===================================
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

// ===================================
// REQUEST INTERCEPTOR
// Adds JWT token to every request
// ===================================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('janvoice_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.log(
        `📤 ${config.method?.toUpperCase()} ${config.url}`,
        config.data || ''
      )
    }

    return config
  },
  (error) => {
    console.error('📤 Request error:', error)
    return Promise.reject(error)
  }
)

// ===================================
// RESPONSE INTERCEPTOR
// Handles common errors globally
// ===================================
apiClient.interceptors.response.use(
  (response) => {
    // Log in development
    if (import.meta.env.DEV) {
      console.log(
        `📥 ${response.status} ${response.config.url}`,
        response.data || ''
      )
    }

    return response
  },
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message

    // Log in development
    if (import.meta.env.DEV) {
      console.error(
        `📥 ${status || 'NETWORK'} ${error.config?.url}`,
        message || error.message
      )
    }

    // Handle 401 — token expired or invalid
    if (status === 401) {
      // Don't redirect if already on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('janvoice_token')
        localStorage.removeItem('janvoice_user')
        window.location.href = '/login?session=expired'
      }
    }

    // Handle 403 — access denied
    if (status === 403) {
      console.warn('🚫 Access denied:', error.config?.url)
    }

    // Handle 500+ — server errors
    if (status >= 500) {
      console.error('🔥 Server error:', message || 'Internal server error')
    }

    // Handle network errors
    if (!error.response) {
      console.error('🌐 Network error — check your internet connection')
    }

    return Promise.reject(error)
  }
)

// ===================================
// API HELPER METHODS
// ===================================
export const api = {
  // GET
  get: (url, config = {}) => apiClient.get(url, config),

  // POST
  post: (url, data, config = {}) => apiClient.post(url, data, config),

  // PUT
  put: (url, data, config = {}) => apiClient.put(url, data, config),

  // PATCH
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),

  // DELETE
  delete: (url, config = {}) => apiClient.delete(url, config),

  // Upload file (multipart/form-data)
  upload: (url, formData, onUploadProgress = null) =>
    apiClient.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress
    }),

  // Download file (as blob)
  download: (url, config = {}) =>
    apiClient.get(url, { ...config, responseType: 'blob' })
}

// ===================================
// TOKEN MANAGEMENT
// ===================================
export const tokenManager = {
  get: () => localStorage.getItem('janvoice_token'),

  set: (token) => {
    localStorage.setItem('janvoice_token', token)
  },

  remove: () => {
    localStorage.removeItem('janvoice_token')
  },

  exists: () => !!localStorage.getItem('janvoice_token'),

  // Decode JWT payload (client-side only — don't trust for security)
  decode: () => {
    try {
      const token = localStorage.getItem('janvoice_token')
      if (!token) return null

      const payload = token.split('.')[1]
      const decoded = JSON.parse(atob(payload))
      return decoded
    } catch {
      return null
    }
  },

  // Check if token is expired
  isExpired: () => {
    try {
      const token = localStorage.getItem('janvoice_token')
      if (!token) return true

      const payload = JSON.parse(atob(token.split('.')[1]))
      if (!payload.exp) return false

      // exp is in seconds, Date.now() is in ms
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }
}

// ===================================
// REQUEST CONFIG BUILDERS
// ===================================
export const buildAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export const buildQueryParams = (params) => {
  const cleaned = Object.entries(params || {}).reduce((acc, [key, val]) => {
    if (val !== null && val !== undefined && val !== '') {
      acc[key] = val
    }
    return acc
  }, {})
  return { params: cleaned }
}

// ===================================
// ENDPOINTS REFERENCE
// ===================================
export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_RESET_TOKEN: (token) => `/auth/verify-reset-token/${token}`
  },

  // Complaints
  COMPLAINTS: {
    LIST: '/complaints',
    CREATE: '/complaints',
    GET: (id) => `/complaints/${id}`,
    UPDATE: (id) => `/complaints/${id}`,
    DELETE: (id) => `/complaints/${id}`,
    ASSIGNED: '/complaints/assigned',
    UPDATE_STATUS: (id) => `/complaints/${id}/status`,
    UPLOAD_EVIDENCE: (id) => `/complaints/${id}/action-evidence`,
    REQUEST_REASSIGN: (id) => `/complaints/${id}/request-reassign`,
    OFFICER_STATS: '/complaints/officer-stats'
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    DELETE: (id) => `/notifications/${id}`,
    CLEAR_ALL: '/notifications/clear-all'
  },

  // Analytics
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    DEPARTMENTS: '/analytics/departments'
  },

  // Admin
  ADMIN: {
    STATS: '/admin/stats',
    USERS: '/admin/users',
    DEPARTMENTS: '/admin/departments',
    CATEGORIES: '/admin/categories',
    AUDIT_LOGS: '/admin/audit'
  }
}

export default apiClient