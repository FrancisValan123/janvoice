// ============================================
// JANVOICE - Complaint Storage (LocalStorage)
// ============================================

const STORAGE_KEY = 'janvoice_complaints'

// Save a new complaint
export const saveComplaint = (complaint) => {
  const existing = getComplaints()

  const newComplaint = {
    id: `JV${Date.now()}`,
    complaintNumber: `JV2026${Date.now().toString().slice(-6)}`,
    title: complaint.title,
    category: complaint.category,
    priority: complaint.priority,
    description: complaint.description,
    location: complaint.location,
    affectedPeople: complaint.affectedPeople,
    evidence: complaint.evidence
      ? { name: complaint.evidence.name, size: complaint.evidence.size }
      : null,
    status: 'Pending',
    submittedBy: complaint.submittedBy || 'citizen@test.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  existing.push(newComplaint)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))

  console.log('✅ Complaint saved:', newComplaint)
  return newComplaint
}

// Get all complaints
export const getComplaints = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

// Get complaints for a specific user
export const getUserComplaints = (email) => {
  return getComplaints().filter((c) => c.submittedBy === email)
}

// Get a single complaint by ID
export const getComplaintById = (id) => {
  return getComplaints().find((c) => c.id === id || c.complaintNumber === id)
}

// Update complaint status
export const updateComplaintStatus = (id, status) => {
  const complaints = getComplaints()
  const updated = complaints.map((c) =>
    c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

// Delete a complaint (for testing)
export const deleteComplaint = (id) => {
  const complaints = getComplaints()
  const filtered = complaints.filter((c) => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

// Clear all (for testing)
export const clearAllComplaints = () => {
  localStorage.removeItem(STORAGE_KEY)
}