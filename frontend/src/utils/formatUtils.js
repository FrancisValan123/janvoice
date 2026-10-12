/* ===================================
   JANVOICE — FORMAT UTILITIES
   =================================== */

/**
 * Format a number with Indian comma separator
 * @example formatNumber(1234567) → "12,34,567"
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return Number(num).toLocaleString('en-IN')
}

/**
 * Format large numbers with K, M, B suffix
 * @example formatCompactNumber(12847) → "12.8K"
 */
export const formatCompactNumber = (num) => {
  if (!num) return '0'
  const n = Number(num)
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}

/**
 * Format currency in Indian Rupees
 * @example formatCurrency(45000) → "₹45,000"
 */
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Format file size
 * @example formatFileSize(2500000) → "2.5 MB"
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * Truncate text with ellipsis
 * @example truncate("Hello World", 8) → "Hello..."
 */
export const truncate = (text, maxLength = 100, suffix = '...') => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + suffix
}

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Title case
 * @example titleCase("hello world") → "Hello World"
 */
export const titleCase = (str) => {
  if (!str) return ''
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}

/**
 * Convert string to URL-friendly slug
 * @example slugify("Broken Street Light") → "broken-street-light"
 */
export const slugify = (text) => {
  if (!text) return ''
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

/**
 * Format phone number
 * @example formatPhone("9876543210") → "+91 98765 43210"
 */
export const formatPhone = (phone) => {
  if (!phone) return '—'
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }
  return phone
}

/**
 * Mask email
 * @example maskEmail("francis@example.com") → "fr*****s@example.com"
 */
export const maskEmail = (email) => {
  if (!email) return ''
  const [user, domain] = email.split('@')
  if (user.length <= 2) return `${user[0]}***@${domain}`
  return `${user.slice(0, 2)}${'*'.repeat(user.length - 3)}${user.slice(-1)}@${domain}`
}

/**
 * Get initials from name
 * @example getInitials("Francis Valan") → "FV"
 */
export const getInitials = (name) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

/**
 * Pluralize a word based on count
 * @example pluralize(1, "day") → "1 day"
 *          pluralize(3, "day") → "3 days"
 */
export const pluralize = (count, singular, plural = null) => {
  const pluralForm = plural || `${singular}s`
  return `${count} ${count === 1 ? singular : pluralForm}`
}

/**
 * Format percentage
 * @example formatPercentage(0.855) → "85.5%"
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%'
  return `${(value * 100).toFixed(decimals)}%`
}