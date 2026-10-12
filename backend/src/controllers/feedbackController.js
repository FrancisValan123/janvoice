/* ===================================
   JANVOICE — FEEDBACK CONTROLLER
   =================================== */

const Feedback = require('../models/Feedback')
const Complaint = require('../models/Complaint')
const { HTTP_STATUS } = require('../config/constants')

exports.submitFeedback = async (req, res) => {
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
        message: 'You can only give feedback on your own complaints'
      })
    }

    if (complaint.status !== 'resolved') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'You can only give feedback on resolved complaints'
      })
    }

    const existing = await Feedback.findOne({ complaint: complaintId })
    if (existing) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Feedback already submitted for this complaint'
      })
    }

    const feedback = await Feedback.create({
      complaint: complaintId,
      citizen: req.user.id,
      officer: complaint.assignedTo,
      rating,
      comment: comment || ''
    })

    complaint.feedback = {
      rating,
      comment: comment || '',
      submittedAt: new Date()
    }
    await complaint.save()

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Thank you for your feedback!',
      feedback
    })
  } catch (error) {
    console.error('Submit feedback error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to submit feedback'
    })
  }
}

exports.getOfficerFeedback = async (req, res) => {
  try {
    const { officerId } = req.params

    const feedback = await Feedback.find({ officer: officerId })
      .populate('citizen', 'name')
      .populate('complaint', 'complaintId title')
      .sort({ createdAt: -1 })

    const avgRating =
      feedback.length > 0
        ? (
            feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
          ).toFixed(1)
        : 0

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    feedback.forEach((f) => {
      distribution[f.rating]++
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: feedback.length,
      avgRating: parseFloat(avgRating),
      distribution,
      feedback
    })
  } catch (error) {
    console.error('Get officer feedback error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch feedback'
    })
  }
}

exports.getAllFeedback = async (req, res) => {
  try {
    const { rating, page = 1, limit = 20 } = req.query

    const query = {}
    if (rating) query.rating = parseInt(rating)

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [feedback, total] = await Promise.all([
      Feedback.find(query)
        .populate('citizen', 'name email')
        .populate('officer', 'name email')
        .populate('complaint', 'complaintId title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Feedback.countDocuments(query)
    ])

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: feedback.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      feedback
    })
  } catch (error) {
    console.error('Get all feedback error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch feedback'
    })
  }
}

exports.getFeedbackStats = async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          totalFeedback: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      }
    ])

    const distribution = await Feedback.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])

    res.status(HTTP_STATUS.OK).json({
      success: true,
      stats: stats[0] || { totalFeedback: 0, avgRating: 0 },
      distribution
    })
  } catch (error) {
    console.error('Feedback stats error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch stats'
    })
  }
}