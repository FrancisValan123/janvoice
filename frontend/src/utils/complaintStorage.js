/* ===================================
   JANVOICE — COMPLAINT LOCAL STORAGE
   =================================== */

import { STORAGE_KEYS } from './constants'
import { safeJsonParse } from './helpers'

const DRAFT_KEY = 'janvoice_complaint_draft'
const RECENT_KEY = 'janvoice_recent_complaints'
const FILTERS_KEY = 'janvoice_complaint_filters'

/**
 * Save a complaint draft to localStorage
 * (Used when user is filling a form and navigates away)
 */
export const saveDraft = (draft) => {
  try {
    const data = {
      ...draft,
      savedAt: new Date().toISOString()
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
    return true
  } catch (err) {
    console.error('Failed to save draft:', err)
    return false
  }
}

/**
 * Load a saved draft
 */
export const loadDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    return safeJsonParse(raw)
  } catch (err) {
    console.error('Failed to load draft:', err)
    return null
  }
}

/**
 * Clear the saved draft
 */
export const clearDraft = () => {
  try {
    localStorage.removeItem(DRAFT_KEY)
    return true
  } catch (err) {
    console.error('Failed to clear draft:', err)
    return false
  }
}

/**
 * Check if a draft exists
 */
export const hasDraft = () => {
  return localStorage.getItem(DRAFT_KEY) !== null
}

/**
 * Get the age of the current draft in hours
 */
export const getDraftAge = () => {
  const draft = loadDraft()
  if (!draft?.savedAt) return null
  const saved = new Date(draft.savedAt)
  const hours = (Date.now() - saved.getTime()) / (1000 * 60 * 60)
  return Math.round(hours * 10) / 10
}

/**
 * Save recently viewed complaints
 * (For quick access, max 10)
 */
export const addRecentComplaint = (complaint) => {
  try {
    const list = getRecentComplaints()
    const filtered = list.filter((c) => c.id !== complaint.id)
    const updated = [
      {
        id: complaint.id || complaint._id,
        title: complaint.title,
        status: complaint.status,
        priority: complaint.priority,
        viewedAt: new Date().toISOString()
      },
      ...filtered
    ].slice(0, 10)

    localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
    return true
  } catch (err) {
    console.error('Failed to save recent:', err)
    return false
  }
}

/**
 * Get recently viewed complaints
 */
export const getRecentComplaints = () => {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return safeJsonParse(raw, [])
  } catch {
    return []
  }
}

/**
 * Clear recent complaints
 */
export const clearRecentComplaints = () => {
  try {
    localStorage.removeItem(RECENT_KEY)
    return true
  } catch {
    return false
  }
}

/**
 * Save complaint list filters
 */
export const saveFilters = (filters) => {
  try {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters))
    return true
  } catch {
    return false
  }
}

/**
 * Load saved filters
 */
export const loadFilters = () => {
  try {
    const raw = localStorage.getItem(FILTERS_KEY)
    return safeJsonParse(raw, {})
  } catch {
    return {}
  }
}

/**
 * Clear saved filters
 */
export const clearFilters = () => {
  try {
    localStorage.removeItem(FILTERS_KEY)
    return true
  } catch {
    return false
  }
}

/**
 * Clear ALL complaint-related local storage
 */
export const clearAllComplaintStorage = () => {
  try {
    localStorage.removeItem(DRAFT_KEY)
    localStorage.removeItem(RECENT_KEY)
    localStorage.removeItem(FILTERS_KEY)
    return true
  } catch {
    return false
  }
}

// Export keys for external use
export const STORAGE_KEYS_LIST = {
  DRAFT: DRAFT_KEY,
  RECENT: RECENT_KEY,
  FILTERS: FILTERS_KEY
}