/* ===================================
   JANVOICE — GENERIC HELPERS
   =================================== */

const crypto = require('crypto')

// ===================================
// OBJECT HELPERS
// ===================================

/**
 * Remove undefined/null/empty values from object
 */
const cleanObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj
  const cleaned = {}
  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    if (value !== null && value !== undefined && value !== '') {
      cleaned[key] = value
    }
  })
  return cleaned
}

/**
 * Deep clone an object
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (Array.isArray(obj)) return obj.map(deepClone)

  const cloned = {}
  Object.keys(obj).forEach((key) => {
    cloned[key] = deepClone(obj[key])
  })
  return cloned
}

/**
 * Pick specific fields from object
 */
const pick = (obj, keys) => {
  if (!obj || !keys) return {}
  return keys.reduce((acc, key) => {
    if (obj[key] !== undefined) acc[key] = obj[key]
    return acc
  }, {})
}

/**
 * Omit specific fields from object
 */
const omit = (obj, keys) => {
  if (!obj) return {}
  const copy = { ...obj }
  keys.forEach((key) => delete copy[key])
  return copy
}

/**
 * Check if object is empty
 */
const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true
  if (typeof obj === 'string') return obj.trim().length === 0
  if (Array.isArray(obj)) return obj.length === 0
  if (typeof obj === 'object') return Object.keys(obj).length === 0
  return false
}

// ===================================
// STRING HELPERS
// ===================================

/**
 * Truncate string with ellipsis
 */
const truncate = (str, maxLength = 100, suffix = '...') => {
  if (!str || str.length <= maxLength) return str
  return str.slice(0, maxLength).trim() + suffix
}

/**
 * Capitalize first letter
 */
const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Title case
 */
const titleCase = (str) => {
  if (!str) return ''
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

/**
 * Slugify string
 */
const slugify = (text) => {
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
 * Random string generator
 */
const randomString = (length = 32, charset = 'alphanumeric') => {
  const charsets = {
    alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    numeric: '0123456789',
    alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    hex: '0123456789abcdef'
  }
  const chars = charsets[charset] || charsets.alphanumeric
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate a random integer between min and max
 */
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ===================================
// ARRAY HELPERS
// ===================================

/**
 * Chunk array into smaller arrays
 */
const chunk = (array, size) => {
  if (!Array.isArray(array)) return []
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Remove duplicates from array
 */
const unique = (array) => {
  return [...new Set(array)]
}

/**
 * Unique by key
 */
const uniqueBy = (array, key) => {
  const seen = new Set()
  return array.filter((item) => {
    const k = typeof key === 'function' ? key(item) : item[key]
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

/**
 * Group array by key
 */
const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key]
    ;(result[groupKey] = result[groupKey] || []).push(item)
    return result
  }, {})
}

/**
 * Sort array of objects by key
 */
const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key]
    const bVal = typeof key === 'function' ? key(b) : b[key]
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Shuffle array
 */
const shuffle = (array) => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// ===================================
// NUMBER HELPERS
// ===================================

/**
 * Round to decimal places
 */
const round = (num, decimals = 2) => {
  const factor = Math.pow(10, decimals)
  return Math.round(num * factor) / factor
}

/**
 * Format bytes to human readable
 */
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/**
 * Clamp number between min/max
 */
const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max)
}

// ===================================
// ASYNC HELPERS
// ===================================

/**
 * Sleep for ms
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Retry async function
 */
const retry = async (fn, maxAttempts = 3, delay = 1000) => {
  let lastError
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt < maxAttempts) {
        await sleep(delay * attempt)
      }
    }
  }
  throw lastError
}

/**
 * Debounce function
 */
const debounce = (fn, delay = 300) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// ===================================
// CRYPTO HELPERS
// ===================================

/**
 * Generate MD5 hash
 */
const md5 = (str) => {
  return crypto.createHash('md5').update(str).digest('hex')
}

/**
 * Generate SHA256 hash
 */
const sha256 = (str) => {
  return crypto.createHash('sha256').update(str).digest('hex')
}

// ===================================
// PAGINATION HELPERS
// ===================================

/**
 * Calculate pagination metadata
 */
const getPagination = (page = 1, limit = 10, total = 0) => {
  const p = Math.max(1, parseInt(page) || 1)
  const l = Math.min(100, Math.max(1, parseInt(limit) || 10))
  const skip = (p - 1) * l
  const totalPages = Math.ceil(total / l)

  return {
    page: p,
    limit: l,
    skip,
    total,
    totalPages,
    hasNext: p < totalPages,
    hasPrev: p > 1,
    from: total > 0 ? skip + 1 : 0,
    to: Math.min(skip + l, total)
  }
}

module.exports = {
  // Object
  cleanObject,
  deepClone,
  pick,
  omit,
  isEmpty,
  // String
  truncate,
  capitalize,
  titleCase,
  slugify,
  randomString,
  randomInt,
  // Array
  chunk,
  unique,
  uniqueBy,
  groupBy,
  sortBy,
  shuffle,
  // Number
  round,
  formatBytes,
  clamp,
  // Async
  sleep,
  retry,
  debounce,
  // Crypto
  md5,
  sha256,
  // Pagination
  getPagination
}