/* ===================================
   JANVOICE — COMPLEX VALIDATIONS
   =================================== */

import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validatePincode
} from './validators'

/**
 * Validate entire login form
 */
export const validateLoginForm = (values) => {
  const errors = {}

  const emailError = validateEmail(values.email)
  if (emailError) errors.email = emailError

  const passwordError = validatePassword(values.password, 6)
  if (passwordError) errors.password = passwordError

  return errors
}

/**
 * Validate entire registration form
 */
export const validateRegisterForm = (values) => {
  const errors = {}

  const nameError = validateName(values.name)
  if (nameError) errors.name = nameError

  const emailError = validateEmail(values.email)
  if (emailError) errors.email = emailError

  const phoneError = validatePhone(values.phone, true)
  if (phoneError) errors.phone = phoneError

  const passwordError = validatePassword(values.password, 6)
  if (passwordError) errors.password = passwordError

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  if (!values.agreeTerms) {
    errors.agreeTerms = 'You must agree to the terms'
  }

  return errors
}

/**
 * Validate complaint submission form
 */
export const validateComplaintForm = (values) => {
  const errors = {}

  if (!values.title || !values.title.trim()) {
    errors.title = 'Title is required'
  } else if (values.title.trim().length < 10) {
    errors.title = 'Title must be at least 10 characters'
  } else if (values.title.length > 200) {
    errors.title = 'Title cannot exceed 200 characters'
  }

  if (!values.category) {
    errors.category = 'Please select a category'
  }

  if (!values.priority) {
    errors.priority = 'Please select a priority'
  }

  if (!values.description || !values.description.trim()) {
    errors.description = 'Description is required'
  } else if (values.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters'
  } else if (values.description.length > 2000) {
    errors.description = 'Description cannot exceed 2000 characters'
  }

  if (!values.location?.address?.trim()) {
    errors.address = 'Address is required'
  }

  if (!values.location?.city?.trim()) {
    errors.city = 'City is required'
  }

  if (values.location?.pincode) {
    const pinError = validatePincode(values.location.pincode)
    if (pinError) errors.pincode = pinError
  }

  if (values.affectedPeople && values.affectedPeople < 1) {
    errors.affectedPeople = 'Must be at least 1'
  }

  return errors
}

/**
 * Validate status update form
 */
export const validateStatusUpdate = (values) => {
  const errors = {}

  if (!values.status) {
    errors.status = 'Please select a status'
  }

  const validStatuses = [
    'pending',
    'assigned',
    'investigating',
    'in-progress',
    'resolved',
    'rejected',
    'escalated',
    'closed'
  ]

  if (values.status && !validStatuses.includes(values.status)) {
    errors.status = 'Invalid status value'
  }

  if (values.note && values.note.length > 500) {
    errors.note = 'Note cannot exceed 500 characters'
  }

  return errors
}

/**
 * Validate reassignment request
 */
export const validateReassignment = (values) => {
  const errors = {}

  if (!values.reasonCategory) {
    errors.reasonCategory = 'Please select a reason'
  }

  if (!values.reason || values.reason.trim().length < 20) {
    errors.reason = 'Reason must be at least 20 characters'
  } else if (values.reason.length > 500) {
    errors.reason = 'Reason cannot exceed 500 characters'
  }

  return errors
}

/**
 * Validate escalation request
 */
export const validateEscalation = (values) => {
  const errors = {}

  if (!values.category) {
    errors.category = 'Please select a reason category'
  }

  if (!values.reason || values.reason.trim().length < 30) {
    errors.reason = 'Reason must be at least 30 characters'
  } else if (values.reason.length > 1000) {
    errors.reason = 'Reason cannot exceed 1000 characters'
  }

  if (!values.urgency) {
    errors.urgency = 'Please select an urgency level'
  }

  return errors
}

/**
 * Validate resolution report
 */
export const validateResolutionReport = (values) => {
  const errors = {}

  if (!values.resolutionSummary || values.resolutionSummary.trim().length < 30) {
    errors.resolutionSummary = 'Summary must be at least 30 characters'
  }

  if (!values.actionTaken || values.actionTaken.trim().length < 20) {
    errors.actionTaken = 'Action taken must be at least 20 characters'
  }

  if (values.followUpRequired && !values.followUpDate) {
    errors.followUpDate = 'Please select a follow-up date'
  }

  if (values.followUpDate) {
    const followUpDate = new Date(values.followUpDate)
    if (followUpDate < new Date()) {
      errors.followUpDate = 'Follow-up date must be in the future'
    }
  }

  return errors
}

/**
 * Validate feedback form
 */
export const validateFeedbackForm = (values) => {
  const errors = {}

  if (!values.rating || values.rating < 1 || values.rating > 5) {
    errors.rating = 'Please provide a rating (1-5)'
  }

  if (values.comment && values.comment.length > 500) {
    errors.comment = 'Comment cannot exceed 500 characters'
  }

  return errors
}

/**
 * Generic form validator that runs all validators
 * @param {Object} values - Form values
 * @param {Object} schema - Object mapping field → validator function
 * @returns {Object} - Errors object
 */
export const runValidators = (values, schema) => {
  const errors = {}
  Object.entries(schema).forEach(([field, validator]) => {
    const error = validator(values[field], values)
    if (error) errors[field] = error
  })
  return errors
}