/* ===================================
   JANVOICE — DEPARTMENT ROUTES
   Base: /api/departments
   =================================== */

const express = require('express')
const router = express.Router()

const {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController')

// ✅ NEW IMPORT: Escalate Case Controller
const { escalateCase } = require('../controllers/departmentAdminController')

const { protect } = require('../middleware/auth')
const { authorize } = require('../middleware/roleCheck')

// ===================================
// PUBLIC-ISH: Any logged-in user can list departments
// ===================================
router.get('/', protect, getDepartments)

// ===================================
// SYSTEM ADMIN ONLY: Manage departments
// ===================================
router.get('/:id', protect, getDepartmentById)
router.post('/', protect, authorize('system_admin'), createDepartment)
router.patch('/:id', protect, authorize('system_admin'), updateDepartment)
router.delete('/:id', protect, authorize('system_admin'), deleteDepartment)

// ===================================
// ✅ NEW ROUTE: Escalate a single case
// ===================================
router.put(
  '/escalate/:id',
  protect,
  authorize('department_admin', 'system_admin'),
  escalateCase
)

module.exports = router