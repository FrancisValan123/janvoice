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

const { protect } = require('../middleware/auth')
const { authorize } = require('../middleware/roleCheck')

// ===================================
// PUBLIC-ISH: Any logged-in user can list departments
// (needed for dropdowns in the create-user form)
// ===================================
router.get('/', protect, getDepartments)

// ===================================
// SYSTEM ADMIN ONLY: Manage departments
// ===================================
router.get('/:id', protect, getDepartmentById)

router.post('/', protect, authorize('system_admin'), createDepartment)

router.patch('/:id', protect, authorize('system_admin'), updateDepartment)

router.delete('/:id', protect, authorize('system_admin'), deleteDepartment)

module.exports = router