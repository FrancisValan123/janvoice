/* ===================================
   JANVOICE — TOKEN GENERATOR
   Secure tokens for auth, reset, verification
   =================================== */

const crypto = require('crypto')
const jwt = require('jsonwebtoken')

// ===================================
// COMPLAINT ID GENERATOR
// ===================================
const generateComplaintId = async (Complaint) => {
  const year = new Date().getFullYear()
  const count = await Complaint.countDocuments({
    createdAt: {
      $gte: new Date(`${year}-01-01`),
      $lt: new Date(`${year + 1}-01-01`)
    }
  })
  return `JV${year}${String(count + 1).padStart(4, '0')}`
}

// ===================================
// JWT TOKENS
// ===================================
const generateAccessToken = (payload, expiresIn = '7d') => {
  if (!payload || !payload.id) {
    throw new Error('Payload must contain an id')
  }
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn,
      algorithm: 'HS256',
      issuer: 'janvoice.gov.in',
      audience: 'janvoice-api'
    }
  )
}

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
      algorithm: 'HS256',
      issuer: 'janvoice.gov.in'
    }
  )
}

// ===================================
// PASSWORD RESET TOKEN
// ===================================
const generatePasswordResetToken = () => {
  // Generate random plain token
  const plainToken = crypto.randomBytes(32).toString('hex')

  // Hash it for storage
  const hashedToken = crypto
    .createHash('sha256')
    .update(plainToken)
    .digest('hex')

  // Expiry: 15 minutes from now
  const expiresAt = Date.now() + 15 * 60 * 1000

  return { plainToken, hashedToken, expiresAt }
}

const verifyPasswordResetToken = (plainToken) => {
  return crypto.createHash('sha256').update(plainToken).digest('hex')
}

// ===================================
// EMAIL VERIFICATION TOKEN
// ===================================
const generateEmailVerificationToken = () => {
  const plainToken = crypto.randomBytes(24).toString('hex')
  const hashedToken = crypto
    .createHash('sha256')
    .update(plainToken)
    .digest('hex')
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

  return { plainToken, hashedToken, expiresAt }
}

// ===================================
// OTP GENERATOR
// ===================================
const generateOTP = (length = 6) => {
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(0, 10)
  }
  return otp
}

const generateHashedOTP = () => {
  const otp = generateOTP(6)
  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex')
  const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes
  return { otp, hashedOTP, expiresAt }
}

const verifyOTP = (inputOtp, hashedOtp) => {
  const inputHash = crypto
    .createHash('sha256')
    .update(String(inputOtp))
    .digest('hex')
  try {
    return crypto.timingSafeEqual(
      Buffer.from(inputHash),
      Buffer.from(hashedOtp)
    )
  } catch {
    return false
  }
}

// ===================================
// API KEY GENERATION
// ===================================
const generateApiKey = () => {
  const prefix = 'jv_'
  const random = crypto.randomBytes(24).toString('hex')
  const plainKey = `${prefix}${random}`
  const hashedKey = crypto
    .createHash('sha256')
    .update(plainKey)
    .digest('hex')

  return { plainKey, hashedKey }
}

// ===================================
// SESSION TOKEN
// ===================================
const generateSessionId = () => {
  return `sess_${crypto.randomBytes(32).toString('hex')}`
}

// ===================================
// REFERRAL CODE
// ===================================
const generateReferralCode = (length = 8) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // No confusing chars
  let code = ''
  const bytes = crypto.randomBytes(length)
  for (let i = 0; i < length; i++) {
    code += chars.charAt(bytes[i] % chars.length)
  }
  return code
}

// ===================================
// VERIFY JWT
// ===================================
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'janvoice.gov.in'
    })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired')
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token')
    }
    throw error
  }
}

const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true })
  } catch {
    return null
  }
}

// ===================================
// CHECK EXPIRY
// ===================================
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token)
    if (!decoded || !decoded.exp) return true
    return decoded.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

const getTokenRemainingTime = (token) => {
  try {
    const decoded = jwt.decode(token)
    if (!decoded || !decoded.exp) return 0
    return Math.max(0, Math.floor((decoded.exp * 1000 - Date.now()) / 1000))
  } catch {
    return 0
  }
}

module.exports = {
  // Complaint
  generateComplaintId,
  // JWT
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  isTokenExpired,
  getTokenRemainingTime,
  // Password Reset
  generatePasswordResetToken,
  verifyPasswordResetToken,
  // Email Verification
  generateEmailVerificationToken,
  // OTP
  generateOTP,
  generateHashedOTP,
  verifyOTP,
  // API Key
  generateApiKey,
  // Session
  generateSessionId,
  // Referral
  generateReferralCode
}