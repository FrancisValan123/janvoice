import { api } from './api'

export const dashboardService = {
  // GET /api/dashboard/citizen-stats
  getCitizenStats: async () => {
    const response = await api.get('/dashboard/citizen-stats')
    return response.data
  },

  // GET /api/dashboard/officer-stats
  getOfficerStats: async () => {
    const response = await api.get('/dashboard/officer-stats')
    return response.data
  },

  // GET /api/dashboard/admin-stats
  getAdminStats: async () => {
    const response = await api.get('/dashboard/admin-stats')
    return response.data
  }
}

export default dashboardService