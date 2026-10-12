/* ===================================
   JANVOICE — DATE UTILITIES
   =================================== */

/**
 * Format a date to a readable string
 * @param {Date|string} date
 * @param {string} format - 'short' | 'long' | 'full' | 'time' | 'datetime' | 'relative'
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '—'

  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Invalid date'

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  const monthsFull = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours24 = d.getHours()
  const hours12 = hours24 % 12 || 12
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours24 >= 12 ? 'PM' : 'AM'

  switch (format) {
    case 'short':
      return `${day}/${month}/${year}`
    case 'long':
      return `${day} ${months[d.getMonth()]} ${year}`
    case 'full':
      return `${day} ${monthsFull[d.getMonth()]} ${year}`
    case 'time':
      return `${hours12}:${minutes} ${ampm}`
    case 'datetime':
      return `${day}/${month}/${year} ${hours12}:${minutes} ${ampm}`
    case 'relative':
      return getRelativeTime(d)
    case 'input':
      return `${year}-${month}-${day}`
    default:
      return d.toLocaleString('en-IN')
  }
}

/**
 * Get relative time (e.g., "5 min ago", "2 hours ago")
 */
export const getRelativeTime = (date) => {
  if (!date) return '—'
  const d = new Date(date)
  const now = new Date()
  const diffMs = now - d
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffSec < 60) return 'Just now'
  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
  if (diffWeek < 4) return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`
  if (diffMonth < 12) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`
  return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`
}

/**
 * Time remaining until deadline
 */
export const getTimeRemaining = (deadline) => {
  if (!deadline) return { text: 'No deadline', isOverdue: false, isUrgent: false }

  const now = new Date()
  const due = new Date(deadline)
  const diffMs = due - now

  if (diffMs < 0) {
    const hours = Math.abs(Math.floor(diffMs / (1000 * 60 * 60)))
    const days = Math.floor(hours / 24)
    return {
      text: days > 0 ? `Overdue by ${days}d` : `Overdue by ${hours}h`,
      isOverdue: true,
      isUrgent: true,
      hours
    }
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor(diffMs / (1000 * 60))

  if (minutes < 60) {
    return { text: `${minutes}m left`, isOverdue: false, isUrgent: true, hours: 0 }
  }
  if (hours < 24) {
    return { text: `${hours}h left`, isOverdue: false, isUrgent: hours < 4, hours }
  }
  const days = Math.floor(hours / 24)
  return { text: `${days}d left`, isOverdue: false, isUrgent: false, hours }
}

/**
 * Get days between two dates
 */
export const daysBetween = (start, end) => {
  const d1 = new Date(start)
  const d2 = new Date(end)
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24))
}

/**
 * Add days to a date
 */
export const addDays = (date, days) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

/**
 * Add hours to a date
 */
export const addHours = (date, hours) => {
  const d = new Date(date)
  d.setHours(d.getHours() + hours)
  return d
}

/**
 * Get start of day
 */
export const startOfDay = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get end of day
 */
export const endOfDay = (date) => {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * Check if date is today
 */
export const isToday = (date) => {
  const d = new Date(date)
  const now = new Date()
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  )
}

/**
 * Check if date is in the past
 */
export const isPast = (date) => new Date(date) < new Date()

/**
 * Check if date is in the future
 */
export const isFuture = (date) => new Date(date) > new Date()