/* ===================================
   JANVOICE — SIMPLE FIELD VALIDATORS
   =================================== */

/**
 * Validate email format
 * @returns {string|null} Error message or null
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email is required'
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(email)) return 'Please enter a valid email'
  return null
}

/**
 * Validate password
 * @param {string} password
 * @param {number} minLength - Minimum length (default: 6)
 */
export const validatePassword = (password, minLength = 6) => {
  if (!password) return 'Password is required'
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`
  }
  return null
}

/**
 * Validate strong password
 */
export const validateStrongPassword = (password) => {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(password)) return 'Must contain an uppercase letter'
  if (!/[a-z]/.test(password)) return 'Must contain a lowercase letter'
  if (!/\d/.test(password)) return 'Must contain a number'
  return null
}

/**
 * Validate password confirmation
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password'
  if (password !== confirmPassword) return 'Passwords do not match'
  return null
}

/**
 * Validate name
 */
export const validateName = (name, minLength = 3) => {
  if (!name || !name.trim()) return 'Name is required'
  if (name.trim().length < minLength) {
    return `Name must be at least ${minLength} characters`
  }
  if (!/^[a-zA-Z\s.'-]+$/.test(name)) {
    return 'Name can only contain letters, spaces, dots, apostrophes, and hyphens'
  }
  return null
}

/**
 * Validate Indian phone number
 */
export const validatePhone = (phone, required = false) => {
  if (!phone) {
    if (required) return 'Phone number is required'
    return null
  }
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length !== 10) return 'Phone number must be 10 digits'
  if (!/^[6-9]/.test(cleaned)) return 'Phone number must start with 6, 7, 8, or 9'
  return null
}

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`
  }
  return null
}

/**
 * Validate minimum length
 */
export const validateMinLength = (value, min, fieldName = 'This field') => {
  if (!value) return null
  if (value.length < min) {
    return `${fieldName} must be at least ${min} characters`
  }
  return null
}

/**
 * Validate maximum length
 */
export const validateMaxLength = (value, max, fieldName = 'This field') => {
  if (!value) return null
  if (value.length > max) {
    return `${fieldName} cannot exceed ${max} characters`
  }
  return null
}

/**
 * Validate pincode (Indian)
 */
export const validatePincode = (pincode) => {
  if (!pincode) return null
  if (!/^[1-9][0-9]{5}$/.test(pincode)) {
    return 'Please enter a valid 6-digit pincode'
  }
  return null
}

/**
 * Validate URL
 */
export const validateUrl = (url) => {
  if (!url) return null
  try {
    new URL(url)
    return null
  } catch {
    return 'Please enter a valid URL'
  }
}

/**
 * Validate numeric value
 */
export const validateNumber = (value, min = null, max = null) => {
  if (value === '' || value === null || value === undefined) return null
  const num = Number(value)
  if (isNaN(num)) return 'Must be a number'
  if (min !== null && num < min) return `Must be at least ${min}`
  if (max !== null && num > max) return `Must be at most ${max}`
  return null
}

/**
 * Validate checkbox is checked
 */
export const validateChecked = (checked, fieldName = 'This option') => {
  if (!checked) return `You must accept ${fieldName.toLowerCase()}`
  return null
}