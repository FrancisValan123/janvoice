/* ===================================
   JANVOICE — ADMIN ROUTES
   Base: /api/admin
   Handles privileged user creation with role hierarchy:
   
   system_admin       → can create: officer, department_admin,
                                     higher_authority, system_admin
   higher_authority   → can create: officer, department_admin
   department_admin   → can create: officer
   =================================== */

const express = require('express')
const router = express.Router()

const {
  createUser,
  getUsers,
  toggleUserActive,
  resetUserPassword,
  updateUserDepartment // ✅ ADDED
} = require('../controllers/adminController')

const { protect } = require('../middleware/auth')
const { authorize } = require('../middleware/roleCheck')

// All routes require authentication
router.use(protect)

// ✅ Only allow elevated roles to reach the admin routes
// (the specific hierarchy check happens in the controller)
router.use(
  authorize('system_admin', 'higher_authority', 'department_admin')
)

// @route   GET /api/admin/users
// @desc    List users (filtered by creator's hierarchy)
router.get('/users', getUsers)

// @route   POST /api/admin/users
// @desc    Create a new privileged user
router.post('/users', createUser)

// @route   PATCH /api/admin/users/:id/toggle-active
// @desc    Activate/deactivate a user
router.patch('/users/:id/toggle-active', toggleUserActive)

// @route   PATCH /api/admin/users/:id/reset-password
// @desc    Reset a user's password
router.patch('/users/:id/reset-password', resetUserPassword)

// ✅ NEW ROUTE
// @route   PATCH /api/admin/users/:id/department
// @desc    Assign a department to a user
router.patch('/users/:id/department', updateUserDepartment)

module.exports = router