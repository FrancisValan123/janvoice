import { useState, useCallback } from 'react'

/**
 * useForm - Custom hook for managing form state and validation
 *
 * @param {Object} initialValues - Initial form values
 * @param {Function} validateFn - Optional validation function
 * @param {Function} onSubmitFn - Optional submit handler
 * @returns {Object} {
 *   values,        // Current form values
 *   errors,        // Validation errors
 *   touched,       // Fields that user has interacted with
 *   isSubmitting,  // Submission state
 *   handleChange,  // Input change handler
 *   handleBlur,    // Input blur handler
 *   handleSubmit,  // Form submit handler
 *   setFieldValue, // Manually set field value
 *   setFieldError, // Manually set field error
 *   setValues,     // Set all values
 *   resetForm,     // Reset form to initial state
 *   isValid        // Whether form has no errors
 * }
 *
 * @example
 * const form = useForm(
 *   { email: '', password: '' },
 *   (values) => {
 *     const errors = {}
 *     if (!values.email) errors.email = 'Required'
 *     return errors
 *   },
 *   async (values) => {
 *     await api.login(values)
 *   }
 * )
 */
const useForm = (initialValues = {}, validateFn = null, onSubmitFn = null) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ============================================
  // Handle input change
  // ============================================
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked, files } = e.target

      let fieldValue
      if (type === 'checkbox') {
        fieldValue = checked
      } else if (type === 'file') {
        fieldValue = files
      } else if (type === 'number') {
        fieldValue = value === '' ? '' : Number(value)
      } else {
        fieldValue = value
      }

      setValues((prev) => {
        const updated = { ...prev, [name]: fieldValue }

        // Re-validate if validator exists
        if (validateFn) {
          const newErrors = validateFn(updated)
          setErrors(newErrors)
        }

        return updated
      })
    },
    [validateFn]
  )

  // ============================================
  // Handle input blur (mark as touched)
  // ============================================
  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target
      setTouched((prev) => ({ ...prev, [name]: true }))

      if (validateFn) {
        const newErrors = validateFn(values)
        setErrors(newErrors)
      }
    },
    [values, validateFn]
  )

  // ============================================
  // Handle form submit
  // ============================================
  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault()

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      )
      setTouched(allTouched)

      // Validate
      if (validateFn) {
        const validationErrors = validateFn(values)
        setErrors(validationErrors)

        if (Object.keys(validationErrors).length > 0) {
          return
        }
      }

      // Submit
      if (onSubmitFn) {
        setIsSubmitting(true)
        try {
          await onSubmitFn(values, { setErrors, setValues })
        } finally {
          setIsSubmitting(false)
        }
      }
    },
    [values, validateFn, onSubmitFn]
  )

  // ============================================
  // Manually set a single field value
  // ============================================
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  // ============================================
  // Manually set a single field error
  // ============================================
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }))
  }, [])

  // ============================================
  // Reset form
  // ============================================
  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  // ============================================
  // Check if form is valid
  // ============================================
  const isValid = Object.keys(errors).length === 0

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setValues,
    resetForm
  }
}

export default useForm