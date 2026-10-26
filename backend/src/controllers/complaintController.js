/* ===================================
   JANVOICE — COMPLAINT CONTROLLER
   =================================== */

const Complaint = require('../models/Complaint')
const AuditLog = require('../models/AuditLog') // ✅ Added AuditLog
const { HTTP_STATUS, PRIORITY_SLA_HOURS } = require('../config/constants')
const { calculatePriority } = require('../utils/priorityHelper')

// ===================================
// CATEGORY TO DEPARTMENT MAP
// ===================================
const CATEGORY_DEPARTMENT_MAP = {
  roads: 'Public Works',
  water: 'Water Supply',
  sanitation: 'Sanitation',
  electricity: 'Electricity',
  safety: 'Public Safety',
  transport: 'Transport',
  health: 'Health',
  education: 'Education',
  environment: 'Environment',
  other: 'General'
}

// ===================================
// GENERATE COMPLAINT ID
// ===================================
const generateComplaintId = async () => {
  const year = new Date().getFullYear()
  const count = await Complaint.countDocuments({
    createdAt: {
      $gte: new Date(`${year}-01-01`),
      $lt: new Date(`${year + 1}-01-01`)
    }
  })
  return `JV${year}${String(count + 1).padStart(4, '0')}`
}

// ===================================
// CREATE COMPLAINT
// ===================================
exports.createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority: userPriority,
      location,
      affectedPeople = 1,
      evidence = []
    } = req.body

    if (!title || !description || !category) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Title, description, and category are required'
      })
    }

    if (!location || !location.address) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Location with address is required'
      })
    }

    const { priority } = calculatePriority({
      title,
      description,
      category,
      affectedPeople,
      evidence
    })

    const complaintId = await generateComplaintId()

    const deadline = new Date()
    deadline.setHours(deadline.getHours() + PRIORITY_SLA_HOURS[priority])

    const userId = req.user._id || req.user.id

    const department = CATEGORY_DEPARTMENT_MAP[category] || 'General'

    const complaint = await Complaint.create({
      complaintId,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: 'pending',
      citizen: userId,
      department,
      location,
      affectedPeople,
      evidence,
      deadline,
      statusHistory: [
        {
          status: 'pending',
          note: `Complaint registered and routed to ${department} department`,
          updatedBy: userId,
          updatedAt: new Date()
        }
      ]
    })

    await complaint.populate('citizen', 'name email phone')

    // ✅ ADD AUDIT LOG: Complaint Created
    await AuditLog.create({
      user: userId,
      action: 'CREATE_COMPLAINT',
      category: 'complaint',
      severity: priority === 'emergency' ? 'danger' : 'info',
      description: `Submitted complaint ${complaintId} (${priority} priority)`,
      targetId: complaint._id,
      ip: req.ip || req.connection.remoteAddress
    })

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint
    })
  } catch (error) {
    console.error('Create complaint error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to submit complaint'
    })
  }
}

// ===================================
// GET ALL COMPLAINTS
// ===================================
exports.getAllComplaints = async (req, res) => {
  try {
    const {
      status,
      priority,
      category,
      search,
      page = 1,
      limit = 100,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    const query = {}

    if (req.user.role === 'department_admin') {
      query.department = req.user.department
    }

    if (status && status !== 'all') query.status = status
    if (priority && priority !== 'all') query.priority = priority
    if (category && category !== 'all') query.category = category

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } }
      ]
    }

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .populate('citizen', 'name email phone')
        .populate('assignedTo', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Complaint.countDocuments(query)
    ])

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: complaints.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      complaints
    })
  } catch (error) {
    console.error('Get complaints error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch complaints'
    })
  }
}

// ===================================
// GET MY COMPLAINTS
// ===================================
exports.getMyComplaints = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query

    const userId = req.user._id || req.user.id
    const query = { citizen: userId }

    if (status && status !== 'all') query.status = status
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Complaint.countDocuments(query)
    ])

    const stats = {
      total: await Complaint.countDocuments({ citizen: userId }),
      pending: await Complaint.countDocuments({
        citizen: userId,
        status: { $in: ['pending', 'assigned', 'investigating', 'in-progress'] }
      }),
      resolved: await Complaint.countDocuments({
        citizen: userId,
        status: 'resolved'
      }),
      emergency: await Complaint.countDocuments({
        citizen: userId,
        priority: 'emergency',
        status: { $ne: 'resolved' }
      })
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: complaints.length,
      total,
      stats,
      complaints
    })
  } catch (error) {
    console.error('Get my complaints error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch your complaints'
    })
  }
}

// ===================================
// GET COMPLAINT BY ID
// ===================================
exports.getComplaintById = async (req, res) => {
  try {
    const { id } = req.params

    let complaint
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      complaint = await Complaint.findById(id)
    } else {
      complaint = await Complaint.findOne({ complaintId: id })
    }

    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      })
    }

    await complaint.populate('citizen', 'name email phone')
    await complaint.populate('assignedTo', 'name email phone role')
    await complaint.populate('statusHistory.updatedBy', 'name role')

    const userId = (req.user._id || req.user.id).toString()

    const isOwner =
      complaint.citizen &&
      complaint.citizen._id &&
      complaint.citizen._id.toString() === userId

    const isAssignedOfficer =
      complaint.assignedTo &&
      complaint.assignedTo._id &&
      complaint.assignedTo._id.toString() === userId

    const isAdmin = [
      'system_admin',
      'department_admin',
      'higher_authority'
    ].includes(req.user.role)

    if (!isOwner && !isAssignedOfficer && !isAdmin) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Not authorized to view this complaint'
      })
    }

    const responseData = complaint.toObject()
    responseData.feedback = complaint.feedback || null

    res.status(HTTP_STATUS.OK).json({
      success: true,
      complaint: responseData
    })
  } catch (error) {
    console.error('Get complaint error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch complaint'
    })
  }
}

// ===================================
// GET ASSIGNED COMPLAINTS
// ===================================
exports.getAssignedComplaints = async (req, res) => {
  try {
    const {
      status,
      priority,
      search,
      page = 1,
      limit = 20,
      sort = '-createdAt'
    } = req.query

    const userId = req.user._id || req.user.id

    const query = { assignedTo: userId }
    if (status && status !== 'all') query.status = status
    if (priority && priority !== 'all') query.priority = priority
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .populate('citizen', 'name email phone')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Complaint.countDocuments(query)
    ])

    const statusCounts = await Complaint.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    const counts = {
      total,
      pending: 0,
      assigned: 0,
      investigating: 0,
      'in-progress': 0,
      resolved: 0,
      escalated: 0
    }
    statusCounts.forEach((s) => {
      if (counts.hasOwnProperty(s._id)) counts[s._id] = s.count
    })

    const priorityCounts = await Complaint.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ])

    const priorities = { emergency: 0, high: 0, normal: 0, low: 0 }
    priorityCounts.forEach((p) => {
      if (priorities.hasOwnProperty(p._id)) priorities[p._id] = p.count
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: complaints.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      counts,
      priorities,
      complaints
    })
  } catch (error) {
    console.error('Get assigned complaints error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch assigned complaints'
    })
  }
}

// ===================================
// ASSIGN COMPLAINT
// ===================================
exports.assignComplaint = async (req, res) => {
  try {
    const { assignedTo, department, note } = req.body

    if (!assignedTo) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Officer ID (assignedTo) is required'
      })
    }

    const complaint = await Complaint.findById(req.params.id)
    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      })
    }

    complaint.assignedTo = assignedTo
    complaint.assignedBy = req.user._id || req.user.id
    complaint.assignedAt = new Date()
    complaint.status = 'assigned'
    if (department) complaint.department = department

    complaint.statusHistory.push({
      status: 'assigned',
      note: note || `Case assigned to officer`,
      updatedBy: req.user._id || req.user.id,
      updatedAt: new Date()
    })

    await complaint.save()
    await complaint.populate('assignedTo', 'name email phone')

    // ✅ ADD AUDIT LOG: Assigned
    await AuditLog.create({
      user: req.user._id || req.user.id,
      action: 'ASSIGN_COMPLAINT',
      category: 'complaint',
      severity: 'info',
      description: `Assigned complaint ${complaint.complaintId} to ${complaint.assignedTo.name}`,
      targetId: complaint._id,
      targetUser: assignedTo,
      ip: req.ip || req.connection.remoteAddress
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Complaint assigned successfully',
      complaint
    })
  } catch (error) {
    console.error('Assign complaint error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to assign complaint'
    })
  }
}

// ===================================
// UPDATE STATUS
// ===================================
exports.updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body

    if (!status) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Status is required'
      })
    }

    const validStatuses = [
      'pending',
      'assigned',
      'investigating',
      'in-progress',
      'resolved',
      'rejected',
      'escalated',
      'closed'
    ]

    if (!validStatuses.includes(status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Invalid status value'
      })
    }

    const complaint = await Complaint.findById(req.params.id)
    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      })
    }

    const userId = (req.user._id || req.user.id).toString()

    const isAssignedOfficer =
      complaint.assignedTo && complaint.assignedTo.toString() === userId
      
    const isAdmin = ['system_admin', 'department_admin', 'higher_authority'].includes(req.user.role)

    if (!isAssignedOfficer && !isAdmin) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Not authorized to update this complaint'
      })
    }

    const oldStatus = complaint.status
    complaint.status = status

    if (status === 'resolved') {
      complaint.resolvedAt = new Date()
    }

    complaint.statusHistory.push({
      status,
      note: note || `Status updated to ${status}`,
      updatedBy: req.user._id || req.user.id,
      updatedAt: new Date()
    })

    await complaint.save()
    await complaint.populate('citizen', 'name email')

    // ✅ ADD AUDIT LOG: Status Updated
    await AuditLog.create({
      user: req.user._id || req.user.id,
      action: 'UPDATE_COMPLAINT_STATUS',
      category: 'complaint',
      severity: status === 'resolved' ? 'success' : 'info',
      description: `Updated ${complaint.complaintId} status from ${oldStatus} to ${status}`,
      targetId: complaint._id,
      ip: req.ip || req.connection.remoteAddress
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Status updated successfully',
      complaint
    })
  } catch (error) {
    console.error('Update status error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to update status'
    })
  }
}

// ===================================
// ADD NOTE
// ===================================
exports.addNote = async (req, res) => {
  try {
    const { text, type, isPrivate } = req.body

    if (!text || !text.trim()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Note text is required'
      })
    }

    const complaint = await Complaint.findById(req.params.id)
    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      })
    }

    const userId = (req.user._id || req.user.id).toString()
    const isAssignedOfficer =
      complaint.assignedTo && complaint.assignedTo.toString() === userId
    const isAdmin = ['system_admin', 'department_admin'].includes(req.user.role)

    if (!isAssignedOfficer && !isAdmin) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Only assigned officer or admin can add notes'
      })
    }

    if (!complaint.notes) {
      complaint.notes = []
    }

    const newNote = {
      text: text.trim(),
      type: type || 'observation',
      isPrivate: !!isPrivate,
      author: req.user._id || req.user.id,
      time: new Date()
    }

    complaint.notes.push(newNote)

    complaint.statusHistory.push({
      status: complaint.status,
      note: `[${type || 'note'}] ${text.trim()}`,
      updatedBy: req.user._id || req.user.id,
      updatedAt: new Date()
    })

    await complaint.save()

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Note added successfully',
      note: newNote
    })
  } catch (error) {
    console.error('Add note error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to add note'
    })
  }
}

// ===================================
// UPLOAD ACTION EVIDENCE
// ===================================
exports.uploadActionEvidence = async (req, res) => {
  try {
    const { url, type, note, publicId } = req.body

    if (!url || !type) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'URL and type are required'
      })
    }

    const complaint = await Complaint.findById(req.params.id)
    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      })
    }

    const userId = (req.user._id || req.user.id).toString()

    if (complaint.assignedTo.toString() !== userId) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Not authorized'
      })
    }

    complaint.actionEvidence.push({
      url,
      publicId,
      type,
      note: note || '',
      uploadedBy: req.user._id || req.user.id,
      uploadedAt: new Date()
    })

    await complaint.save()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Action evidence uploaded',
      complaint
    })
  } catch (error) {
    console.error('Upload evidence error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to upload evidence'
    })
  }
}

// ===================================
// REQUEST REASSIGNMENT
// ===================================
exports.requestReassignment = async (req, res) => {
  try {
    const { reason } = req.body

    if (!reason || reason.trim().length < 10) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Reason must be at least 10 characters'
      })
    }

    const complaint = await Complaint.findById(req.params.id)
    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      })
    }

    const userId = (req.user._id || req.user.id).toString()

    if (complaint.assignedTo.toString() !== userId) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Not authorized'
      })
    }

    complaint.statusHistory.push({
      status: 'reassign-requested',
      note: `Reassignment requested: ${reason}`,
      updatedBy: req.user._id || req.user.id,
      updatedAt: new Date()
    })

    await complaint.save()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Reassignment request submitted'
    })
  } catch (error) {
    console.error('Reassignment error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to submit request'
    })
  }
}

// ===================================
// GET OFFICER STATS
// ===================================
exports.getOfficerStats = async (req, res) => {
  try {
    const officerId = req.user._id || req.user.id

    const [total, resolved, pending, emergency, resolvedToday] =
      await Promise.all([
        Complaint.countDocuments({ assignedTo: officerId }),
        Complaint.countDocuments({ assignedTo: officerId, status: 'resolved' }),
        Complaint.countDocuments({
          assignedTo: officerId,
          status: { $in: ['pending', 'assigned', 'investigating', 'in-progress'] }
        }),
        Complaint.countDocuments({
          assignedTo: officerId,
          priority: 'emergency',
          status: { $ne: 'resolved' }
        }),
        Complaint.countDocuments({
          assignedTo: officerId,
          status: 'resolved',
          resolvedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        })
      ])

    const ratedComplaints = await Complaint.find({
      assignedTo: officerId,
      'feedback.rating': { $exists: true, $ne: null }
    }).select('feedback.rating')

    let avgRating = 0
    if (ratedComplaints.length > 0) {
      const totalRating = ratedComplaints.reduce((sum, c) => sum + c.feedback.rating, 0)
      avgRating = (totalRating / ratedComplaints.length).toFixed(1)
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      stats: {
        total,
        resolved,
        pending,
        emergency,
        resolvedToday,
        resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
        avgRating: parseFloat(avgRating)
      }
    })
  } catch (error) {
    console.error('Officer stats error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch stats'
    })
  }
}

// ===================================
// DELETE COMPLAINT
// ===================================
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      })
    }

    const userId = (req.user._id || req.user.id).toString()

    const isOwner = complaint.citizen.toString() === userId
    const isSystemAdmin = req.user.role === 'system_admin'

    if (!isOwner && !isSystemAdmin) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Not authorized to delete this complaint'
      })
    }

    if (complaint.status === 'resolved' && !isSystemAdmin) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Cannot delete a resolved complaint'
      })
    }

    // ✅ ADD AUDIT LOG: Complaint Deleted
    await AuditLog.create({
      user: req.user._id || req.user.id,
      action: 'DELETE_COMPLAINT',
      category: 'complaint',
      severity: 'danger',
      description: `Deleted complaint ${complaint.complaintId} (${complaint.title})`,
      targetId: complaint._id,
      ip: req.ip || req.connection.remoteAddress
    })

    await complaint.deleteOne()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Complaint deleted successfully'
    })
  } catch (error) {
    console.error('Delete complaint error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete complaint'
    })
  }
}