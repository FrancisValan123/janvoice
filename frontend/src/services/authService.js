import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('janvoice_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('janvoice_token');
      localStorage.removeItem('janvoice_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  // Login
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },

  // Register
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },

  // Logout
  logout: async () => {
    return api.post('/auth/logout');
  },

  // Get current user
  getCurrentUser: async () => {
    return api.get('/auth/me');
  },

  // Forgot password
  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    return api.post('/auth/reset-password', { token, newPassword });
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    return api.post('/auth/verify-otp', { email, otp });
  }
};

export default authService;