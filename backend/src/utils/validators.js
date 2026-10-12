/* ===================================
   JANVOICE — FIELD VALIDATORS
   =================================== */

// ===================================
// REGEX PATTERNS
// ===================================
const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  PINCODE: /^[1-9][0-9]{5}$/,
  AADHAR: /^\d{12}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  COMPLAINT_ID: /^JV\d{8}$/,
  URL: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/,
  OBJECT_ID: /^[0-9a-fA-F]{24}$/,
  NAME: /^[a-zA-Z\s.'-]+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
}

// ===================================
// VALIDATORS (return error message or null)
// ===================================

const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email is required'
  if (!REGEX.EMAIL.test(email)) return 'Please provide a valid email'
  return null
}

const validatePassword = (password, minLength = 6) => {
  if (!password) return 'Password is required'
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`
  }
  return null
}

const validateStrongPassword = (password) => {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter'
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter'
  if (!/\d/.test(password)) return 'Password must contain a number'
  return null
}

const validateName = (name, minLength = 3) => {
  if (!name || !name.trim()) return 'Name is required'
  if (name.trim().length < minLength) {
    return `Name must be at least ${minLength} characters`
  }
  if (!REGEX.NAME.test(name)) {
    return 'Name can only contain letters, spaces, dots, apostrophes, and hyphens'
  }
  return null
}

const validatePhone = (phone, required = false) => {
  if (!phone) {
    return required ? 'Phone number is required' : null
  }
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length !== 10) return 'Phone number must be 10 digits'
  if (!/^[6-9]/.test(cleaned)) return 'Phone number must start with 6, 7, 8, or 9'
  return null
}

const validatePincode = (pincode) => {
  if (!pincode) return null
  if (!REGEX.PINCODE.test(pincode)) return 'Please enter a valid 6-digit pincode'
  return null
}

const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`
  }
  return null
}

const validateMinLength = (value, min, fieldName = 'This field') => {
  if (!value) return null
  if (value.length < min) {
    return `${fieldName} must be at least ${min} characters`
  }
  return null
}

const validateMaxLength = (value, max, fieldName = 'This field') => {
  if (!value) return null
  if (value.length > max) {
    return `${fieldName} cannot exceed ${max} characters`
  }
  return null
}

const validateObjectId = (id, fieldName = 'ID') => {
  if (!id) return `${fieldName} is required`
  if (!REGEX.OBJECT_ID.test(id)) return `Invalid ${fieldName}`
  return null
}

const validateUrl = (url) => {
  if (!url) return null
  if (!REGEX.URL.test(url)) return 'Please provide a valid URL'
  return null
}

const validateNumber = (value, min = null, max = null) => {
  if (value === '' || value === null || value === undefined) return null
  const num = Number(value)
  if (isNaN(num)) return 'Must be a number'
  if (min !== null && num < min) return `Must be at least ${min}`
  if (max !== null && num > max) return `Must be at most ${max}`
  return null
}

const validateEnum = (value, allowed, fieldName = 'Value') => {
  if (!value) return null
  if (!allowed.includes(value)) {
    return `${fieldName} must be one of: ${allowed.join(', ')}`
  }
  return null
}

const validateDate = (date, { past = false, future = false } = {}) => {
  if (!date) return null
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Invalid date'
  if (past && d > new Date()) return 'Date must be in the past'
  if (future && d < new Date()) return 'Date must be in the future'
  return null
}

const validateArray = (arr, { min = 0, max = null } = {}) => {
  if (!arr) return null
  if (!Array.isArray(arr)) return 'Must be an array'
  if (arr.length < min) return `Must have at least ${min} items`
  if (max !== null && arr.length > max) return `Cannot have more than ${max} items`
  return null
}

// ===================================
// SANITIZERS
// ===================================
const sanitizeEmail = (email) => {
  if (!email) return ''
  return email.toLowerCase().trim()
}

const sanitizePhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/\D/g, '').slice(-10)
}

const sanitizeString = (str) => {
  if (!str) return ''
  return String(str).trim().replace(/\s+/g, ' ')
}

// ===================================
// BATCH VALIDATION
// ===================================
const runValidators = (values, schema) => {
  const errors = {}
  Object.entries(schema).forEach(([field, validator]) => {
    const error = validator(values[field], values)
    if (error) errors[field] = error
  })
  return errors
}

module.exports = {
  REGEX,
  // Validators
  validateEmail,
  validatePassword,
  validateStrongPassword,
  validateName,
  validatePhone,
  validatePincode,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateObjectId,
  validateUrl,
  validateNumber,
  validateEnum,
  validateDate,
  validateArray,
  // Sanitizers
  sanitizeEmail,
  sanitizePhone,
  sanitizeString,
  // Batch
  runValidators
}