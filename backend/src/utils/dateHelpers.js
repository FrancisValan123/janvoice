/* ===================================
   JANVOICE — DATE HELPERS
   Date/time utilities
   =================================== */

// ===================================
// DATE CALCULATIONS
// ===================================

/**
 * Add days to a date
 */
const addDays = (date, days) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

/**
 * Add hours to a date
 */
const addHours = (date, hours) => {
  const d = new Date(date)
  d.setHours(d.getHours() + hours)
  return d
}

/**
 * Add minutes to a date
 */
const addMinutes = (date, minutes) => {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() + minutes)
  return d
}

/**
 * Days between two dates
 */
const daysBetween = (start, end) => {
  const d1 = new Date(start)
  const d2 = new Date(end)
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24))
}

/**
 * Hours between two dates
 */
const hoursBetween = (start, end) => {
  const d1 = new Date(start)
  const d2 = new Date(end)
  return Math.floor((d2 - d1) / (1000 * 60 * 60))
}

/**
 * Minutes between two dates
 */
const minutesBetween = (start, end) => {
  const d1 = new Date(start)
  const d2 = new Date(end)
  return Math.floor((d2 - d1) / (1000 * 60))
}

// ===================================
// DATE BOUNDARIES
// ===================================

/**
 * Start of day
 */
const startOfDay = (date = new Date()) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * End of day
 */
const endOfDay = (date = new Date()) => {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * Start of week (Monday)
 */
const startOfWeek = (date = new Date()) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * End of week (Sunday)
 */
const endOfWeek = (date = new Date()) => {
  const d = startOfWeek(date)
  d.setDate(d.getDate() + 6)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * Start of month
 */
const startOfMonth = (date = new Date()) => {
  const d = new Date(date)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * End of month
 */
const endOfMonth = (date = new Date()) => {
  const d = new Date(date)
  d.setMonth(d.getMonth() + 1)
  d.setDate(0)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * Start of year
 */
const startOfYear = (date = new Date()) => {
  const d = new Date(date)
  d.setMonth(0, 1)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * End of year
 */
const endOfYear = (date = new Date()) => {
  const d = new Date(date)
  d.setMonth(11, 31)
  d.setHours(23, 59, 59, 999)
  return d
}

// ===================================
// DATE CHECKS
// ===================================

/**
 * Check if date is today
 */
const isToday = (date) => {
  const d = new Date(date)
  const now = new Date()
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  )
}

/**
 * Check if date is in past
 */
const isPast = (date) => new Date(date) < new Date()

/**
 * Check if date is in future
 */
const isFuture = (date) => new Date(date) > new Date()

/**
 * Check if date is this week
 */
const isThisWeek = (date) => {
  const d = new Date(date)
  const now = new Date()
  const start = startOfWeek(now)
  const end = endOfWeek(now)
  return d >= start && d <= end
}

/**
 * Check if date is this month
 */
const isThisMonth = (date) => {
  const d = new Date(date)
  const now = new Date()
  return (
    d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  )
}

// ===================================
// DATE FORMATTING
// ===================================

/**
 * Format date to readable string
 */
const formatDate = (date, format = 'short') => {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Invalid date'

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')

  switch (format) {
    case 'short':
      return `${day}/${month}/${year}`
    case 'long':
      return `${day} ${months[d.getMonth()]} ${year}`
    case 'time':
      return `${hours}:${minutes}`
    case 'datetime':
      return `${day}/${month}/${year} ${hours}:${minutes}`
    case 'iso':
      return d.toISOString()
    case 'input':
      return `${year}-${month}-${day}`
    default:
      return d.toLocaleString('en-IN')
  }
}

/**
 * Relative time (e.g., "5 min ago")
 */
const getRelativeTime = (date) => {
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
const getTimeRemaining = (deadline) => {
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
 * Get date range for a period
 */
const getDateRange = (period) => {
  const now = new Date()
  const range = { start: null, end: now }

  switch (period) {
    case 'today':
      range.start = startOfDay(now)
      break
    case 'yesterday':
      range.start = startOfDay(addDays(now, -1))
      range.end = endOfDay(addDays(now, -1))
      break
    case 'week':
      range.start = startOfWeek(now)
      break
    case 'month':
      range.start = startOfMonth(now)
      break
    case 'last-month':
      range.start = startOfMonth(addDays(startOfMonth(now), -1))
      range.end = endOfMonth(addDays(startOfMonth(now), -1))
      break
    case 'quarter':
      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
      range.start = quarterStart
      break
    case 'year':
      range.start = startOfYear(now)
      break
    case 'last-7-days':
      range.start = startOfDay(addDays(now, -7))
      break
    case 'last-30-days':
      range.start = startOfDay(addDays(now, -30))
      break
    case 'last-90-days':
      range.start = startOfDay(addDays(now, -90))
      break
    default:
      range.start = startOfDay(addDays(now, -30))
  }

  return range
}

/**
 * Get array of dates between two dates
 */
const getDatesBetween = (start, end) => {
  const dates = []
  const current = new Date(start)
  const last = new Date(end)
  while (current <= last) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

module.exports = {
  addDays,
  addHours,
  addMinutes,
  daysBetween,
  hoursBetween,
  minutesBetween,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isToday,
  isPast,
  isFuture,
  isThisWeek,
  isThisMonth,
  formatDate,
  getRelativeTime,
  getTimeRemaining,
  getDateRange,
  getDatesBetween
}