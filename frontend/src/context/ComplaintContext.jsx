import React, { createContext, useState, useContext, useEffect } from 'react'

const ComplaintContext = createContext(null)

export const useComplaints = () => {
  const context = useContext(ComplaintContext)
  if (!context) {
    throw new Error('useComplaints must be used within ComplaintProvider')
  }
  return context
}

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([])
  const [notifications, setNotifications] = useState([])

  // Load from localStorage
  useEffect(() => {
    const savedNotifs = localStorage.getItem('janvoice_notifications')
    if (savedNotifs) {
      setNotifications(JSON.parse(savedNotifs))
    } else {
      const demo = getDemoNotifications()
      setNotifications(demo)
      localStorage.setItem('janvoice_notifications', JSON.stringify(demo))
    }

    const savedComplaints = localStorage.getItem('janvoice_complaints')
    if (savedComplaints) {
      setComplaints(JSON.parse(savedComplaints))
    }
  }, [])

  // Persist notifications
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('janvoice_notifications', JSON.stringify(notifications))
    }
  }, [notifications])

  // Persist complaints
  useEffect(() => {
    if (complaints.length > 0) {
      localStorage.setItem('janvoice_complaints', JSON.stringify(complaints))
    }
  }, [complaints])

  // ===== COMPLAINTS =====
  const addComplaint = (complaint) => {
    const newComplaint = {
      ...complaint,
      id: complaint.id || 'JV' + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString(),
      status: 'Pending'
    }
    setComplaints((prev) => [newComplaint, ...prev])

    // Auto-create notification
    addNotification({
      type: 'info',
      title: 'Complaint Submitted ✅',
      message: `Your complaint ${newComplaint.id} has been received successfully.`,
      complaintId: newComplaint.id
    })

    return newComplaint
  }

  const updateComplaint = (id, data) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    )
  }

  const deleteComplaint = (id) => {
    setComplaints((prev) => prev.filter((c) => c.id !== id))
  }

  const getComplaintById = (id) => {
    return complaints.find((c) => c.id === id)
  }

  // ===== NOTIFICATIONS =====
  const addNotification = ({ type, title, message, complaintId }) => {
    const newNotif = {
      id: 'N' + Date.now(),
      type: type || 'info',
      title,
      message,
      complaintId: complaintId || null,
      read: false,
      createdAt: new Date().toISOString()
    }
    setNotifications((prev) => [newNotif, ...prev])
    return newNotif
  }

  const updateNotification = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const updateAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
    localStorage.removeItem('janvoice_notifications')
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <ComplaintContext.Provider
      value={{
        // Complaints
        complaints,
        addComplaint,
        updateComplaint,
        deleteComplaint,
        getComplaintById,
        // Notifications
        notifications,
        unreadCount,
        addNotification,
        updateNotification,
        updateAllNotifications,
        deleteNotification,
        clearAllNotifications
      }}
    >
      {children}
    </ComplaintContext.Provider>
  )
}

// Demo notifications for first-time users
function getDemoNotifications() {
  const now = Date.now()
  const min = 60 * 1000
  const hr = 60 * min
  const day = 24 * hr

  return [
    {
      id: 'N1001',
      type: 'success',
      title: 'Complaint Resolved ✅',
      message: 'Your complaint JV2026002 "Garbage not collected" has been resolved.',
      complaintId: 'JV2026002',
      read: false,
      createdAt: new Date(now - 15 * min).toISOString()
    },
    {
      id: 'N1002',
      type: 'update',
      title: 'Status Updated',
      message: 'Complaint JV2026001 is now In Progress. Officer assigned.',
      complaintId: 'JV2026001',
      read: false,
      createdAt: new Date(now - 2 * hr).toISOString()
    },
    {
      id: 'N1003',
      type: 'info',
      title: 'Officer Assigned 👨‍💼',
      message: 'Officer Ravi Kumar has been assigned to your complaint JV2026003.',
      complaintId: 'JV2026003',
      read: false,
      createdAt: new Date(now - 5 * hr).toISOString()
    },
    {
      id: 'N1004',
      type: 'danger',
      title: 'Emergency Complaint Priority 🔴',
      message: 'Your emergency complaint JV2026004 has been marked as HIGH PRIORITY.',
      complaintId: 'JV2026004',
      read: true,
      createdAt: new Date(now - 1 * day).toISOString()
    },
    {
      id: 'N1005',
      type: 'warning',
      title: 'Feedback Requested ⭐',
      message: 'Please rate your experience for resolved complaint JV2026002.',
      complaintId: 'JV2026002',
      read: true,
      createdAt: new Date(now - 2 * day).toISOString()
    },
    {
      id: 'N1006',
      type: 'info',
      title: 'Complaint Received',
      message: 'Your complaint JV2026001 has been received successfully.',
      complaintId: 'JV2026001',
      read: true,
      createdAt: new Date(now - 5 * day).toISOString()
    }
  ]
}

export default ComplaintContext