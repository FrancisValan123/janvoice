/* ===================================
   JANVOICE — NOTIFICATION ROUTES
   Base: /api/notifications
   =================================== */

const express = require('express')
const router = express.Router()

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAll,
  broadcast
} = require('../controllers/notificationController')

const { protect } = require('../middleware/auth')
const { authorize } = require('../middleware/roleCheck')

router.use(protect)

router.get('/', getNotifications)
router.get('/unread-count', getUnreadCount)
router.put('/mark-all-read', markAllAsRead)
router.put('/:id/read', markAsRead)
router.delete('/clear-all', clearAll)
router.delete('/:id', deleteNotification)

// Broadcast (admin only)
router.post('/broadcast', authorize('system_admin'), broadcast)

module.exports = router