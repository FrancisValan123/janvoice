import { api } from './api'

export const officerService = {
  // GET /api/officer/assigned
  getAssignedComplaints: async () => {
    const response = await api.get('/officer/assigned')
    return response.data
  },

  // GET /api/officer/case/:id
  getCaseDetails: async (id) => {
    const response = await api.get(`/officer/case/${id}`)
    return response.data
  },

  // PATCH /api/officer/status/:id
  updateStatus: async (id, statusData) => {
    const response = await api.patch(`/officer/status/${id}`, statusData)
    return response.data
  },

  // POST /api/officer/notes/:id
  addNote: async (id, noteData) => {
    const response = await api.post(`/officer/notes/${id}`, noteData)
    return response.data
  },

  // POST /api/officer/escalate/:id
  requestEscalation: async (id, escalationData) => {
    const response = await api.post(`/officer/escalate/${id}`, escalationData)
    return response.data
  },

  // GET /api/officer/performance
  getPerformanceMetrics: async () => {
    const response = await api.get('/officer/performance')
    return response.data
  }
}

export default officerService