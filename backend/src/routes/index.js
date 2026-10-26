/* ===================================
   JANVOICE — ROUTES INDEX
   Aggregates all route modules
   =================================== */

const express = require('express')
const router = express.Router()

// Import route modules
const authRoutes = require('./authRoutes')
const complaintRoutes = require('./complaintRoutes')
const officerRoutes = require('./officerRoutes')
const departmentRoutes = require('./departmentRoutes')
const higherAuthRoutes = require('./higherAuthRoutes')
const adminRoutes = require('./adminRoutes')
const analyticsRoutes = require('./analyticsRoutes')
const notificationRoutes = require('./notificationRoutes')

// ✅ NEW IMPORT: Resolution Reports
const reportRoutes = require('./reportRoutes')

// ===================================
// MOUNT ROUTES
// ===================================
router.use('/auth', authRoutes)
router.use('/complaints', complaintRoutes)
router.use('/officer', officerRoutes)
router.use('/department', departmentRoutes)
router.use('/authority', higherAuthRoutes)
router.use('/admin', adminRoutes)
router.use('/analytics', analyticsRoutes)
router.use('/notifications', notificationRoutes)

// ✅ NEW MOUNT: Reports
router.use('/reports', reportRoutes)

// ===================================
// API INFO
// ===================================
router.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'JanVoice API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      complaints: '/api/complaints',
      officer: '/api/officer',
      department: '/api/department',
      authority: '/api/authority',
      admin: '/api/admin',
      analytics: '/api/analytics',
      notifications: '/api/notifications',
      reports: '/api/reports'
    }
  })
})

module.exports = router