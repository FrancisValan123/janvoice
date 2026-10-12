import { api } from './api'

export const complaintService = {
  // POST /api/complaints
  submitComplaint: async (complaintData) => {
    const response = await api.post('/complaints', complaintData)
    return response.data
  },

  // GET /api/complaints/my-complaints
  getMyComplaints: async () => {
    const response = await api.get('/complaints/my-complaints')
    return response.data
  },

  // GET /api/complaints/:id
  getComplaintById: async (id) => {
    const response = await api.get(`/complaints/${id}`)
    return response.data
  },

  // GET /api/complaints/track/:id
  trackComplaint: async (id) => {
    const response = await api.get(`/complaints/track/${id}`)
    return response.data
  },

  // PATCH /api/complaints/:id/status (Officer/Admin only)
  updateComplaintStatus: async (id, statusData) => {
    const response = await api.patch(`/complaints/${id}/status`, statusData)
    return response.data
  },

  // POST /api/complaints/:id/feedback
  submitFeedback: async (id, feedbackData) => {
    const response = await api.post(`/complaints/${id}/feedback`, feedbackData)
    return response.data
  }
}

export default complaintService