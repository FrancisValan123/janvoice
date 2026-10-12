/* ===================================
   JANVOICE — GENERIC HELPERS
   =================================== */

/**
 * Debounce a function (returns a new debounced function)
 */
export const debounce = (fn, delay = 300) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Throttle a function
 */
export const throttle = (fn, limit = 300) => {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Deep clone an object
 */
export const deepClone = (obj) => {
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
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true
  if (typeof obj === 'string') return obj.trim().length === 0
  if (Array.isArray(obj)) return obj.length === 0
  if (typeof obj === 'object') return Object.keys(obj).length === 0
  return false
}

/**
 * Remove empty values from object
 */
export const cleanObject = (obj) => {
  const cleaned = {}
  Object.keys(obj).forEach((key) => {
    if (!isEmpty(obj[key])) cleaned[key] = obj[key]
  })
  return cleaned
}

/**
 * Group array items by a key
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key]
    ;(result[groupKey] = result[groupKey] || []).push(item)
    return result
  }, {})
}

/**
 * Sort array by key
 */
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key]
    const bVal = typeof key === 'function' ? key(b) : b[key]

    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Unique array by key
 */
export const uniqueBy = (array, key) => {
  const seen = new Set()
  return array.filter((item) => {
    const k = typeof key === 'function' ? key(item) : item[key]
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

/**
 * Chunk array into smaller arrays
 */
export const chunk = (array, size) => {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Generate unique ID
 */
export const generateId = (prefix = '') => {
  return `${prefix}${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      return success
    }
  } catch (err) {
    console.error('Copy failed:', err)
    return false
  }
}

/**
 * Download a file from blob or data URL
 */
export const downloadFile = (data, filename, mimeType = 'text/plain') => {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export array of objects as CSV
 */
export const exportToCsv = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) return

  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          const escaped =
            typeof value === 'string' && value.includes(',')
              ? `"${value.replace(/"/g, '""')}"`
              : value
          return escaped
        })
        .join(',')
    )
  ]

  const csv = csvRows.join('\n')
  downloadFile(csv, filename, 'text/csv')
}

/**
 * Scroll to top of page
 */
export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

/**
 * Scroll to an element by ID
 */
export const scrollToElement = (elementId, offset = 80) => {
  const element = document.getElementById(elementId)
  if (!element) return
  const top = element.getBoundingClientRect().top + window.pageYOffset - offset
  window.scrollTo({ top, behavior: 'smooth' })
}

/**
 * Build query string from object
 */
export const buildQueryString = (params) => {
  const cleaned = cleanObject(params)
  const query = new URLSearchParams(cleaned).toString()
  return query ? `?${query}` : ''
}

/**
 * Parse query string to object
 */
export const parseQueryString = (search) => {
  const params = new URLSearchParams(search)
  const obj = {}
  for (const [key, value] of params.entries()) {
    obj[key] = value
  }
  return obj
}

/**
 * Retry an async function with backoff
 */
export const retry = async (fn, maxAttempts = 3, delay = 1000) => {
  let lastError
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delay * attempt))
      }
    }
  }
  throw lastError
}

/**
 * Sleep for a given duration
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Safe JSON parse
 */
export const safeJsonParse = (json, fallback = null) => {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

/**
 * Get random item from array
 */
export const randomItem = (array) => {
  if (!array || array.length === 0) return null
  return array[Math.floor(Math.random() * array.length)]
}