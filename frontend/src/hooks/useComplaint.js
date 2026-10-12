import { useState, useCallback } from 'react'
import complaintService from '../services/complaintService'

/**
 * useComplaint - Custom hook for complaint operations
 *
 * @returns {Object} {
 *   complaints,        // List of complaints
 *   currentComplaint,  // Currently viewed complaint
 *   stats,             // Complaint statistics
 *   loading,           // Loading state
 *   error,             // Error message
 *   fetchComplaints,   // Fetch all complaints
 *   fetchAssignedComplaints, // Fetch officer's assigned complaints
 *   fetchComplaintById, // Fetch single complaint
 *   submitComplaint,   // Submit new complaint
 *   updateStatus,      // Update complaint status
 *   uploadEvidence,    // Upload action evidence
 *   fetchStats,        // Get officer stats
 *   clearError,        // Reset error state
 *   clearCurrent       // Reset current complaint
 * }
 */
const useComplaint = () => {
  const [complaints, setComplaints] = useState([])
  const [currentComplaint, setCurrentComplaint] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const clearError = useCallback(() => setError(null), [])
  const clearCurrent = useCallback(() => setCurrentComplaint(null), [])

  // ============================================
  // Fetch all complaints (with filters)
  // ============================================
  const fetchComplaints = useCallback(async (filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await complaintService.getAllComplaints(filters)
      setComplaints(response.data.complaints || [])
      return response.data
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to fetch complaints'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ============================================
  // Fetch officer's assigned complaints
  // ============================================
  const fetchAssignedComplaints = useCallback(async (filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await complaintService.getAssignedComplaints(filters)
      setComplaints(response.data.complaints || [])
      return response.data
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to fetch assigned complaints'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ============================================
  // Fetch single complaint by ID
  // ============================================
  const fetchComplaintById = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      const response = await complaintService.getComplaintById(id)
      setCurrentComplaint(response.data.complaint)
      return response.data.complaint
    } catch (err) {
      const msg = err.response?.data?.message || 'Complaint not found'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ============================================
  // Submit new complaint
  // ============================================
  const submitComplaint = useCallback(async (complaintData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await complaintService.createComplaint(complaintData)
      const newComplaint = response.data.complaint
      setComplaints((prev) => [newComplaint, ...prev])
      return response.data
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to submit complaint'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ============================================
  // Update complaint status (officer)
  // ============================================
  const updateStatus = useCallback(async (id, status, note = '') => {
    setLoading(true)
    setError(null)
    try {
      const response = await complaintService.updateStatus(id, status, note)
      const updated = response.data.complaint

      // Update in complaints list
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? updated : c))
      )

      // Update current complaint if matches
      if (currentComplaint?._id === id) {
        setCurrentComplaint(updated)
      }

      return response.data
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update status'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [currentComplaint])

  // ============================================
  // Upload action evidence
  // ============================================
  const uploadEvidence = useCallback(async (id, evidenceData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await complaintService.uploadActionEvidence(
        id,
        evidenceData
      )
      const updated = response.data.complaint

      if (currentComplaint?._id === id) {
        setCurrentComplaint(updated)
      }

      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? updated : c))
      )

      return response.data
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to upload evidence'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [currentComplaint])

  // ============================================
  // Fetch officer stats
  // ============================================
  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await complaintService.getOfficerStats()
      setStats(response.data.stats)
      return response.data.stats
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch stats'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    // State
    complaints,
    currentComplaint,
    stats,
    loading,
    error,

    // Actions
    fetchComplaints,
    fetchAssignedComplaints,
    fetchComplaintById,
    submitComplaint,
    updateStatus,
    uploadEvidence,
    fetchStats,

    // Cleanup
    clearError,
    clearCurrent
  }
}

export default useComplaint