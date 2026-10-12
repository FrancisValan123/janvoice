import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor: Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    // 👇 FIXED: Use 'janvoice_token' to match AuthContext
    const token = localStorage.getItem('janvoice_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Handle global 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 👇 FIXED: Use 'janvoice_token' and 'janvoice_user' to match AuthContext
      localStorage.removeItem('janvoice_token')
      localStorage.removeItem('janvoice_user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export { api }
export default api