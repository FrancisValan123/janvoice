/* ===================================
   JANVOICE — AUTH MIDDLEWARE
   =================================== */

const User = require('../models/User')
const { verifyToken, extractTokenFromRequest } = require('../config/jwt')

const protect = async (req, res, next) => {
  try {
    const token = extractTokenFromRequest(req)

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login.'
      })
    }

    let decoded
    try {
      decoded = verifyToken(token)
    } catch (err) {
      return res.status(401).json({
        success: false,
        message:
          err.message === 'Token has expired'
            ? 'Session expired. Please login again.'
            : 'Invalid authentication token'
      })
    }

    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found'
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated.'
      })
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      isActive: user.isActive
    }
    req.token = token

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    })
  }
}

const optionalAuth = async (req, res, next) => {
  try {
    const token = extractTokenFromRequest(req)
    if (!token) {
      req.user = null
      return next()
    }

    const decoded = verifyToken(token)
    const user = await User.findById(decoded.id).select('-password')

    req.user =
      user && user.isActive
        ? {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        : null

    next()
  } catch {
    req.user = null
    next()
  }
}

module.exports = { protect, optionalAuth }