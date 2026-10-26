const ResolutionReport = require('../models/ResolutionReport')
const Complaint = require('../models/Complaint')
const Notification = require('../models/Notification')
const User = require('../models/User')
const { HTTP_STATUS } = require('../config/constants')

exports.submitReport = async (req, res) => {
  try {
    const { id } = req.params
    const officerId = req.user._id || req.user.id

    const existingReport = await ResolutionReport.findOne({ complaint: id })
    if (existingReport) {
      return res.status(400).json({ success: false, message: 'A report already exists.' })
    }

    const complaint = await Complaint.findById(id)
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' })

    const report = await ResolutionReport.create({
      complaint: id,
      officer: officerId,
      department: complaint.department,
      ...req.body
    })

    // ✅ FIX: Only update status if it's not already resolved
    if (complaint.status !== 'resolved') {
      complaint.status = 'resolved'
      complaint.resolvedAt = new Date()
      complaint.statusHistory.push({
        status: 'resolved',
        note: 'Officer submitted a formal resolution report.',
        updatedBy: officerId,
        updatedAt: new Date()
      })
      await complaint.save()
    }

    // Notify Admins
    const admins = await User.find({ role: { $in: ['department_admin', 'higher_authority', 'system_admin'] }, isActive: true }).select('_id')
    
    const notifications = admins.map(admin => ({
      user: admin._id,
      type: 'success',
      category: 'complaint',
      title: '📄 New Resolution Report',
      message: `Report submitted for ${complaint.complaintId} by ${req.user.name}.`,
      link: `/admin/reports`,
      relatedId: report._id,
      // ✅ FIXED: Changed to 'Complaint' to match your Notification schema enum
      relatedModel: 'Complaint' 
    }))
    
    if (notifications.length > 0) await Notification.insertMany(notifications)

    res.status(201).json({ success: true, report })
  } catch (error) {
    console.error('Submit report error:', error)
    res.status(500).json({ success: false, message: 'Failed to submit report' })
  }
}

exports.getMyReports = async (req, res) => {
  try {
    const reports = await ResolutionReport.find({ officer: req.user._id || req.user.id })
      .populate('complaint', 'complaintId title category')
      .sort({ createdAt: -1 })
    res.status(200).json({ success: true, reports })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reports' })
  }
}

exports.getReportByComplaint = async (req, res) => {
  try {
    const report = await ResolutionReport.findOne({ complaint: req.params.id })
      .populate('officer', 'name email')
      .populate('complaint', 'complaintId title')
    if (!report) return res.status(404).json({ success: false, message: 'No report found' })
    res.status(200).json({ success: true, report })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch report' })
  }
}