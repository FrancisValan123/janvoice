/* ===================================
   JANVOICE — ERROR HANDLER
   =================================== */

/**
 * Extract a user-friendly error message from various error types
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred'

  // String error
  if (typeof error === 'string') return error

  // Axios error (with response)
  if (error.response) {
    const { status, data } = error.response

    // Server provided a message
    if (data?.message) return data.message
    if (data?.error) return data.error

    // Fallback by status code
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.'
      case 401:
        return 'Your session has expired. Please log in again.'
      case 403:
        return "You don't have permission to perform this action."
      case 404:
        return 'The requested resource was not found.'
      case 409:
        return 'This action conflicts with existing data.'
      case 422:
        return 'Validation failed. Please check your inputs.'
      case 429:
        return 'Too many requests. Please try again later.'
      case 500:
        return 'Server error. Please try again later.'
      case 502:
        return 'Bad gateway. The server is unreachable.'
      case 503:
        return 'Service unavailable. Please try again later.'
      default:
        return `Request failed with status ${status}`
    }
  }

  // Axios error (no response — network issue)
  if (error.request) {
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.'
    }
    return 'Network error. Please check your internet connection.'
  }

  // Standard Error object
  if (error.message) return error.message

  return 'An unexpected error occurred'
}

/**
 * Log an error with context
 */
export const logError = (error, context = '') => {
  const timestamp = new Date().toISOString()

  console.error(`[${timestamp}]${context ? ` [${context}]` : ''}`, {
    message: error?.message || error,
    stack: error?.stack,
    response: error?.response?.data,
    status: error?.response?.status
  })
}

/**
 * Check if error is a network error
 */
export const isNetworkError = (error) => {
  return !error?.response && error?.request
}

/**
 * Check if error is an auth error (401/403)
 */
export const isAuthError = (error) => {
  const status = error?.response?.status
  return status === 401 || status === 403
}

/**
 * Check if error is a validation error (422)
 */
export const isValidationError = (error) => {
  return error?.response?.status === 422
}

/**
 * Extract validation errors from response
 * @returns {Object} Field → message mapping
 */
export const extractValidationErrors = (error) => {
  if (!isValidationError(error)) return {}

  const data = error.response?.data
  if (!data) return {}

  // Common formats:
  // 1. { errors: { field: "message" } }
  // 2. { errors: [{ field, message }] }
  // 3. { errors: ["message1", "message2"] }

  if (data.errors && typeof data.errors === 'object') {
    if (Array.isArray(data.errors)) {
      // Format 2 or 3
      return data.errors.reduce((acc, err) => {
        if (typeof err === 'string') {
          acc._general = acc._general || []
          acc._general.push(err)
        } else if (err.field) {
          acc[err.field] = err.message
        }
        return acc
      }, {})
    }
    // Format 1
    return data.errors
  }

  return {}
}

/**
 * Safely execute an async function, returning a tuple
 * @returns {[data, error]}
 */
export const safeAsync = async (promise) => {
  try {
    const data = await promise
    return [data, null]
  } catch (error) {
    return [null, error]
  }
}

/**
 * Retry a failed operation
 */
export const retryOperation = async (
  operation,
  maxAttempts = 3,
  delayMs = 1000
) => {
  let lastError

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      // Don't retry on client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error
      }

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt))
      }
    }
  }

  throw lastError
}

/**
 * Global error handler for React errors
 */
export const handleReactError = (error, errorInfo) => {
  logError(error, 'React ErrorBoundary')
  console.error('Component stack:', errorInfo?.componentStack)

  // Could send to error tracking service (Sentry, etc.) here
  // sendToErrorTracking({ error, errorInfo })
}

/**
 * Show a browser alert with error message
 * (Fallback when UI toast is not available)
 */
export const alertError = (error) => {
  const message = getErrorMessage(error)
  alert(`Error: ${message}`)
}