/* ===================================
   JANVOICE — CITIZEN CONTROLLER
   =================================== */

const Complaint = require('../models/Complaint')
const Feedback = require('../models/Feedback')
const { HTTP_STATUS } = require('../config/constants')

exports.getDashboard = async (req, res) => {
  // ... (keep your existing dashboard code)
}

exports.trackComplaint = async (req, res) => {
  // ... (keep your existing tracking code)
}

// ✅ UPDATED: Enforce one feedback per complaint
exports.giveFeedback = async (req, res) => {
  try {
    const { id } = req.params // ID comes from the URL
    const { rating, comment, tags } = req.body 

    if (!rating) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Rating is required'
      })
    }

    if (rating < 1 || rating > 5) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      })
    }

    const complaint = await Complaint.findById(id)
    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      })
    }

    // Security check: Ensure the person giving feedback is the owner
    if (complaint.citizen.toString() !== req.user.id.toString()) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Not authorized to give feedback for this complaint'
      })
    }

    // Check: Only allow feedback on resolved complaints
    if (complaint.status !== 'resolved') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'You can only give feedback on resolved complaints'
      })
    }

    // ✅ CHECK: Has feedback already been given?
    const existingFeedback = await Feedback.findOne({ complaint: id })
    if (existingFeedback) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'You have already submitted feedback for this complaint.'
      })
    }

    // Save feedback to complaint document
    complaint.feedback = {
      rating: parseInt(rating),
      comment: comment || '',
      submittedAt: new Date()
    }
    await complaint.save()

    // Create standalone Feedback record for analytics
    await Feedback.create({
      complaint: complaint._id,
      citizen: req.user.id,
      officer: complaint.assignedTo,
      department: complaint.department,
      rating: parseInt(rating),
      comment: comment || '',
      tags: tags || []
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
  // ... (keep your existing notifications code)
}