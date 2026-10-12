/* ===================================
   JANVOICE — SYSTEM ADMIN ROUTES
   Base: /api/admin
   =================================== */

const express = require('express')
const router = express.Router()

const {
  getAdminStats,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserActive,
  deleteUser,
  getAuditLogs,
  getSystemHealth
} = require('../controllers/systemAdminController')

const { protect } = require('../middleware/auth')
const { authorize } = require('../middleware/roleCheck')

// All routes require System Admin
router.use(protect)
router.use(authorize('system_admin'))

// Dashboard
router.get('/stats', getAdminStats)

// User management
router.get('/users', getAllUsers)
router.post('/users', createUser)
router.get('/users/:id', getUserById)
router.put('/users/:id', updateUser)
router.put('/users/:id/toggle-active', toggleUserActive)
router.delete('/users/:id', deleteUser)

// Audit & health
router.get('/audit', getAuditLogs)
router.get('/health', getSystemHealth)

module.exports = router