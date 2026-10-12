import { api } from './api'

export const notificationService = {
  // GET /api/notifications
  getMyNotifications: async () => {
    const response = await api.get('/notifications')
    return response.data
  },

  // PATCH /api/notifications/:id/read
  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`)
    return response.data
  },

  // PATCH /api/notifications/read-all
  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all')
    return response.data
  }
}

export default notificationService