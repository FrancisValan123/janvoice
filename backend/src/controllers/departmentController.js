/* ===================================
   JANVOICE — DEPARTMENT CONTROLLER
   =================================== */

const Department = require('../models/Department')
const { HTTP_STATUS } = require('../config/constants')

// ===================================
// GET ALL DEPARTMENTS
// GET /api/departments
// ===================================
exports.getDepartments = async (req, res) => {
  try {
    const { active, search } = req.query

    const query = {}
    if (active !== 'false') query.isActive = true
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ]
    }

    const departments = await Department.find(query)
      .populate('officers', 'name email role')
      .sort({ name: 1 })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: departments.length,
      departments
    })
  } catch (error) {
    console.error('Get departments error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch departments'
    })
  }
}

// ===================================
// GET ONE DEPARTMENT
// GET /api/departments/:id
// ===================================
exports.getDepartmentById = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id)
      .populate('officers', 'name email role phone')

    if (!dept) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Department not found'
      })
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      department: dept
    })
  } catch (error) {
    console.error('Get department error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch department'
    })
  }
}

// ===================================
// CREATE DEPARTMENT
// POST /api/departments
// (System Admin only)
// ===================================
exports.createDepartment = async (req, res) => {
  try {
    const {
      name,
      code,
      head,
      description,
      contactEmail,
      contactPhone,
      color,
      icon,
      categories,
      zones,
      slaTargets
    } = req.body

    if (!name || !code) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Name and code are required'
      })
    }

    // Check for duplicates
    const existing = await Department.findOne({
      $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }]
    })
    if (existing) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'A department with this name or code already exists'
      })
    }

    const dept = await Department.create({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      head: head || null,
      description: description || '',
      contactEmail: contactEmail || undefined,
      contactPhone: contactPhone || undefined,
      color: color || '#FF6B35',
      icon: icon || '🏛️',
      categories: categories || [],
      zones: zones || [],
      slaTargets: slaTargets || undefined
    })

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Department created successfully',
      department: dept
    })
  } catch (error) {
    console.error('Create department error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to create department'
    })
  }
}

// ===================================
// UPDATE DEPARTMENT
// PATCH /api/departments/:id
// (System Admin only)
// ===================================
exports.updateDepartment = async (req, res) => {
  try {
    const allowedFields = [
      'name',
      'code',
      'head',
      'description',
      'contactEmail',
      'contactPhone',
      'color',
      'icon',
      'categories',
      'zones',
      'slaTargets',
      'isActive'
    ]

    const updates = {}
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field]
    })

    if (updates.code) updates.code = updates.code.toUpperCase()

    const dept = await Department.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )

    if (!dept) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Department not found'
      })
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Department updated successfully',
      department: dept
    })
  } catch (error) {
    console.error('Update department error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to update department'
    })
  }
}

// ===================================
// DELETE DEPARTMENT
// DELETE /api/departments/:id
// (System Admin only)
// ===================================
exports.deleteDepartment = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id)

    if (!dept) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Department not found'
      })
    }

    // Prevent deletion if officers are assigned
    if (dept.officers && dept.officers.length > 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: `Cannot delete — ${dept.officers.length} officer(s) are still assigned. Reassign them first.`
      })
    }

    await dept.deleteOne()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Department deleted successfully'
    })
  } catch (error) {
    console.error('Delete department error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete department'
    })
  }
}