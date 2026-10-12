/* ===================================
   JANVOICE — ROLE CHECK MIDDLEWARE
   =================================== */

const ROLE_HIERARCHY = {
  citizen: 1,
  officer: 2,
  department_admin: 3,
  higher_authority: 4,
  system_admin: 5
}

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of: ${allowedRoles.join(', ')}`,
        yourRole: req.user.role
      })
    }

    next()
  }
}

const authorizeAtLeast = (minRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const userLevel = ROLE_HIERARCHY[req.user.role] || 0
    const minLevel = ROLE_HIERARCHY[minRole] || 0

    if (userLevel < minLevel) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires role "${minRole}" or higher.`
      })
    }

    next()
  }
}

module.exports = {
  authorize,
  authorizeAtLeast,
  ROLE_HIERARCHY
}