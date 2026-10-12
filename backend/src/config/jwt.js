/* ===================================
   JANVOICE — JWT CONFIGURATION
   =================================== */

const jwt = require('jsonwebtoken')

const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'janvoice_default_dev_secret_key_2024',
  expiresIn: {
    access: '7d',
    refresh: '30d',
    reset: '15m',
    otp: '10m'
  },
  algorithm: 'HS256',
  issuer: 'janvoice.gov.in',
  audience: 'janvoice-api'
}

const generateAccessToken = (payload) => {
  if (!payload || !payload.id) {
    throw new Error('Payload must contain an id')
  }
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role
    },
    JWT_CONFIG.secret,
    {
      expiresIn: JWT_CONFIG.expiresIn.access,
      algorithm: JWT_CONFIG.algorithm,
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience
    }
  )
}

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    JWT_CONFIG.secret,
    {
      expiresIn: JWT_CONFIG.expiresIn.refresh,
      algorithm: JWT_CONFIG.algorithm,
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience
    }
  )
}

const generateResetToken = (userId) => {
  return jwt.sign(
    { id: userId, purpose: 'password-reset' },
    JWT_CONFIG.secret,
    {
      expiresIn: JWT_CONFIG.expiresIn.reset,
      algorithm: JWT_CONFIG.algorithm,
      issuer: JWT_CONFIG.issuer
    }
  )
}

const generateOTPToken = (userId, otp) => {
  return jwt.sign(
    { id: userId, otp, purpose: 'otp-verification' },
    JWT_CONFIG.secret,
    {
      expiresIn: JWT_CONFIG.expiresIn.otp,
      algorithm: JWT_CONFIG.algorithm,
      issuer: JWT_CONFIG.issuer
    }
  )
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.secret, {
      algorithms: [JWT_CONFIG.algorithm],
      issuer: JWT_CONFIG.issuer
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
  } catch (error) {
    return null
  }
}

const extractTokenFromRequest = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    return req.headers.authorization.split(' ')[1]
  }
  if (req.cookies && req.cookies.janvoice_token) {
    return req.cookies.janvoice_token
  }
  if (req.query && req.query.token) {
    return req.query.token
  }
  return null
}

const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token)
    if (!decoded || !decoded.exp) return true
    return decoded.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

module.exports = {
  JWT_CONFIG,
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  generateOTPToken,
  verifyToken,
  decodeToken,
  extractTokenFromRequest,
  isTokenExpired
}