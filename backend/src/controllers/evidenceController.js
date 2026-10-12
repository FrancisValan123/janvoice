/* ===================================
   JANVOICE — EVIDENCE CONTROLLER
   =================================== */

const Complaint = require('../models/Complaint')
const { deleteFile, deleteFiles, getThumbnail } = require('../config/cloudinary')
const { HTTP_STATUS } = require('../config/constants')

exports.uploadComplaintEvidence = async (req, res) => {
  try {
    const { complaintId } = req.params

    if (!req.files || req.files.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'No files uploaded'
      })
    }

    const complaint = await Complaint.findById(complaintId)
    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      })
    }

    const isOwner = complaint.citizen.toString() === req.user.id.toString()
    const isAssignedOfficer =
      complaint.assignedTo &&
      complaint.assignedTo.toString() === req.user.id.toString()
    const isAdmin = ['system_admin', 'department_admin'].includes(req.user.role)

    if (!isOwner && !isAssignedOfficer && !isAdmin) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Not authorized'
      })
    }

    const evidenceItems = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
      type: file.resource_type === 'video' ? 'video' : 'image',
      uploadedAt: new Date(),
      uploadedBy: req.user.id
    }))

    complaint.evidence.push(...evidenceItems)
    await complaint.save()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `${evidenceItems.length} file(s) uploaded successfully`,
      evidence: evidenceItems,
      complaint
    })
  } catch (error) {
    console.error('Upload evidence error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Upload failed'
    })
  }
}

exports.deleteEvidence = async (req, res) => {
  try {
    const { complaintId, publicId } = req.params

    const complaint = await Complaint.findById(complaintId)
    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      })
    }

    const isOwner = complaint.citizen.toString() === req.user.id.toString()
    const isAdmin = req.user.role === 'system_admin'

    if (!isOwner && !isAdmin) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Not authorized'
      })
    }

    const evidenceItem = complaint.evidence.find((e) => e.publicId === publicId)
    if (!evidenceItem) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Evidence not found'
      })
    }

    try {
      await deleteFile(publicId, evidenceItem.type)
    } catch (cloudinaryError) {
      console.warn('Cloudinary delete failed:', cloudinaryError.message)
    }

    complaint.evidence = complaint.evidence.filter(
      (e) => e.publicId !== publicId
    )
    await complaint.save()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Evidence deleted'
    })
  } catch (error) {
    console.error('Delete evidence error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Delete failed'
    })
  }
}

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'No file uploaded'
      })
    }

    const User = require('../models/User')
    const user = await User.findById(req.user.id)

    if (user.profileImage && user.profileImagePublicId) {
      try {
        await deleteFile(user.profileImagePublicId)
      } catch (err) {
        console.warn('Old image delete failed:', err.message)
      }
    }

    user.profileImage = req.file.path
    user.profileImagePublicId = req.file.filename
    await user.save()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Profile image uploaded',
      profileImage: user.profileImage
    })
  } catch (error) {
    console.error('Upload profile error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Upload failed'
    })
  }
}

exports.getEvidence = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId).select(
      'evidence actionEvidence citizen assignedTo'
    )

    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      })
    }

    const isOwner = complaint.citizen.toString() === req.user.id.toString()
    const isOfficer =
      complaint.assignedTo &&
      complaint.assignedTo.toString() === req.user.id.toString()
    const isAdmin = ['system_admin', 'department_admin', 'higher_authority'].includes(
      req.user.role
    )

    if (!isOwner && !isOfficer && !isAdmin) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Not authorized'
      })
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      evidence: complaint.evidence || [],
      actionEvidence: complaint.actionEvidence || []
    })
  } catch (error) {
    console.error('Get evidence error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch evidence'
    })
  }
}