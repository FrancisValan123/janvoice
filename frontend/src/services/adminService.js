import { api } from './api'

export const adminService = {
  // GET /api/admin/users
  getAllUsers: async () => {
    const response = await api.get('/admin/users')
    return response.data
  },

  // PATCH /api/admin/users/:id/role
  updateUserRole: async (id, roleData) => {
    const response = await api.patch(`/admin/users/${id}/role`, roleData)
    return response.data
  },

  // GET /api/admin/departments
  getAllDepartments: async () => {
    const response = await api.get('/admin/departments')
    return response.data
  },

  // POST /api/admin/departments
  createDepartment: async (departmentData) => {
    const response = await api.post('/admin/departments', departmentData)
    return response.data
  },

  // GET /api/admin/analytics
  getAnalyticsOverview: async () => {
    const response = await api.get('/admin/analytics')
    return response.data
  },

  // GET /api/admin/audit-logs
  getAuditLogs: async () => {
    const response = await api.get('/admin/audit-logs')
    return response.data
  }
}

export default adminService