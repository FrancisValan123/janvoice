import { api } from './api'

export const fileUploadService = {
  // POST /api/upload
  uploadFile: async (file, onUploadProgress) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/upload', formData, {
      headers: {
        // Let the browser set the boundary and content-type automatically
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    })
    return response.data
  }
}

export default fileUploadService