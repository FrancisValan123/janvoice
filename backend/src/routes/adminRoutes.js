/* ===================================
   JANVOICE — ADMIN ROUTES
   =================================== */

const express = require('express')
const path = require('path') // ✅ Added for file downloading
const router = express.Router()

const { 
  createUser, 
  getUsers, 
  toggleUserActive, 
  resetUserPassword, 
  updateUserDepartment,
  getDepartmentStats 
} = require('../controllers/adminController')

// ✅ Import getSystemHealth along with getAuditLogs
const { getAuditLogs, getSystemHealth } = require('../controllers/systemAdminController')

// ✅ Import Backup Service functions
const { listBackups, createBackup, deleteBackup } = require('../services/backupService')

const { protect } = require('../middleware/auth')
const { authorize } = require('../middleware/roleCheck')

// All routes require authentication
router.use(protect)

// Restrict to elevated roles
router.use(
  authorize('system_admin', 'higher_authority', 'department_admin')
)

// ===================================
// USER MANAGEMENT ROUTES
// ===================================
router.get('/users', getUsers)
router.post('/users', createUser)
router.patch('/users/:id/toggle-active', toggleUserActive)
router.patch('/users/:id/reset-password', resetUserPassword)
router.patch('/users/:id/department', updateUserDepartment)

// ===================================
// SYSTEM ADMIN ROUTES
// ===================================
router.get('/audit-logs', authorize('system_admin'), getAuditLogs)
router.get('/health', authorize('system_admin'), getSystemHealth)
router.get('/departments-stats', authorize('system_admin'), getDepartmentStats)

// ===================================
// BACKUP ROUTES
// ===================================
router.get('/backups', authorize('system_admin'), async (req, res) => {
  try {
    const backups = await listBackups()
    res.status(200).json({ success: true, backups })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

router.post('/backups', authorize('system_admin'), async (req, res) => {
  try {
    const result = await createBackup()
    res.status(201).json({ success: true, result })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ✅ NEW ROUTE: Download a specific backup file
router.get('/backups/download/:filename', authorize('system_admin'), (req, res) => {
  try {
    const { filename } = req.params

    // Security check: prevent directory traversal attacks
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ success: false, message: 'Invalid filename' })
    }

    // Construct the path to the backups directory
    // Based on backupService.js, it's usually '../../backups' from src/routes
    const filePath = path.join(__dirname, '../../backups', filename)

    // Send the file
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Download error:', err)
        if (!res.headersSent) {
          res.status(404).json({ success: false, message: 'Backup file not found on server.' })
        }
      }
    })
  } catch (err) {
    console.error('Download route error:', err)
    res.status(500).json({ success: false, message: 'Failed to download backup.' })
  }
})

router.delete('/backups/:filename', authorize('system_admin'), async (req, res) => {
  try {
    await deleteBackup(req.params.filename)
    res.status(200).json({ success: true, message: 'Backup deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router