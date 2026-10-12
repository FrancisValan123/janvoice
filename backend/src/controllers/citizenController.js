/* ===================================
   JANVOICE — CITIZEN CONTROLLER
   =================================== */

const Complaint = require('../models/Complaint')
const Feedback = require('../models/Feedback')
const { HTTP_STATUS } = require('../config/constants')

exports.getDashboard = async (req, res) => {
  try {
    const citizenId = req.user._id

    const [total, pending, active, resolved, emergency] = await Promise.all([
      Complaint.countDocuments({ citizen: citizenId }),
      Complaint.countDocuments({ citizen: citizenId, status: 'pending' }),
      Complaint.countDocuments({
        citizen: citizenId,
        status: { $in: ['assigned', 'investigating', 'in-progress'] }
      }),
      Complaint.countDocuments({ citizen: citizenId, status: 'resolved' }),
      Complaint.countDocuments({
        citizen: citizenId,
        priority: 'emergency',
        status: { $ne: 'resolved' }
      })
    ])

    const recent = await Complaint.find({ citizen: citizenId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('complaintId title category status priority createdAt updatedAt')

    const recentUpdates = await Complaint.find({
      citizen: citizenId,
      'statusHistory.updatedAt': {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('complaintId title status updatedAt statusHistory')

    const activities = recentUpdates.map((c) => {
      const last = c.statusHistory[c.statusHistory.length - 1]
      return {
        complaintId: c.complaintId,
        title: c.title,
        status: c.status,
        action: last?.note || 'Updated',
        time: c.updatedAt
      }
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      stats: { total, pending, active, resolved, emergency },
      recent,
      activities
    })
  } catch (error) {
    console.error('Citizen dashboard error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to load dashboard'
    })
  }
}

exports.trackComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params

    const complaint = await Complaint.findOne({
      complaintId: complaintId.toUpperCase()
    })
      .populate('assignedTo', 'name email phone')
      .populate('citizen', 'name email')

    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'No complaint found with this ID'
      })
    }

    const isOwner =
      complaint.citizen._id.toString() === req.user.id.toString()
    const isAdmin = ['system_admin', 'department_admin', 'higher_authority'].includes(
      req.user.role
    )

    if (!isOwner && !isAdmin) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'You can only track your own complaints'
      })
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      complaint
    })
  } catch (error) {
    console.error('Track complaint error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to track complaint'
    })
  }
}

exports.giveFeedback = async (req, res) => {
  try {
    const { complaintId, rating, comment } = req.body

    if (!complaintId || !rating) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Complaint ID and rating are required'
      })
    }

    if (rating < 1 || rating > 5) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      })
    }

    const complaint = await Complaint.findById(complaintId)
    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      })
    }

    if (complaint.citizen.toString() !== req.user.id.toString()) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Not authorized'
      })
    }

    if (complaint.status !== 'resolved') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'You can only give feedback on resolved complaints'
      })
    }

    complaint.feedback = {
      rating,
      comment: comment || '',
      submittedAt: new Date()
    }
    await complaint.save()

    await Feedback.create({
      complaint: complaint._id,
      citizen: req.user.id,
      officer: complaint.assignedTo,
      rating,
      comment: comment || ''
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Thank you for your feedback!'
    })
  } catch (error) {
    console.error('Feedback error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to submit feedback'
    })
  }
}

exports.getNotifications = async (req, res) => {
  try {
    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: 0,
      notifications: []
    })
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch notifications'
    })
  }
}