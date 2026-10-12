/* ===================================
   JANVOICE — NOTIFICATION CONTROLLER
   =================================== */

const Notification = require('../models/Notification')
const { HTTP_STATUS } = require('../config/constants')

exports.getNotifications = async (req, res) => {
  try {
    const { read, type, page = 1, limit = 20 } = req.query

    const query = { user: req.user.id }
    if (read === 'true') query.read = true
    if (read === 'false') query.read = false
    if (type && type !== 'all') query.type = type

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Notification.countDocuments(query),
      Notification.countDocuments({ user: req.user.id, read: false })
    ])

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: notifications.length,
      total,
      unreadCount,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      notifications
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch notifications'
    })
  }
}

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      read: false
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      unreadCount: count
    })
  } catch (error) {
    console.error('Unread count error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch count'
    })
  }
}

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id
    })

    if (!notification) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Notification not found'
      })
    }

    notification.read = true
    notification.readAt = new Date()
    await notification.save()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Marked as read',
      notification
    })
  } catch (error) {
    console.error('Mark read error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to mark as read'
    })
  }
}

exports.markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user.id, read: false },
      { $set: { read: true, readAt: new Date() } }
    )

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`
    })
  } catch (error) {
    console.error('Mark all read error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to mark all as read'
    })
  }
}

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    })

    if (!notification) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Notification not found'
      })
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Notification deleted'
    })
  } catch (error) {
    console.error('Delete notification error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete'
    })
  }
}

exports.clearAll = async (req, res) => {
  try {
    const result = await Notification.deleteMany({ user: req.user.id })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `${result.deletedCount} notifications deleted`
    })
  } catch (error) {
    console.error('Clear all error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to clear'
    })
  }
}

exports.broadcast = async (req, res) => {
  try {
    const { role, type = 'info', title, message, link = null } = req.body

    if (!title || !message) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Title and message are required'
      })
    }

    const User = require('../models/User')
    const query = role && role !== 'all' ? { role } : { isActive: true }

    const users = await User.find(query).select('_id')

    const notifications = users.map((u) => ({
      user: u._id,
      type,
      title,
      message,
      link,
      read: false
    }))

    await Notification.insertMany(notifications)

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: `Broadcast sent to ${users.length} users`,
      count: users.length
    })
  } catch (error) {
    console.error('Broadcast error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Broadcast failed'
    })
  }
}