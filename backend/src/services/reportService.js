/* ===================================
   JANVOICE — REPORT SERVICE
   Generate reports in various formats (JSON, CSV, HTML)
   =================================== */

const Complaint = require('../models/Complaint')
const User = require('../models/User')
const { calculateSlaCompliance } = require('./priorityService')

// ===================================
// GENERATE SUMMARY REPORT
// ===================================
const generateSummaryReport = async (filters = {}) => {
  const { startDate, endDate, department } = filters

  const dateFilter = {}
  if (startDate || endDate) {
    dateFilter.createdAt = {}
    if (startDate) dateFilter.createdAt.$gte = new Date(startDate)
    if (endDate) dateFilter.createdAt.$lte = new Date(endDate)
  }

  const baseQuery = {
    ...dateFilter,
    ...(department && { department })
  }

  const [
    total,
    resolved,
    pending,
    escalated,
    overdue,
    emergency,
    byCategory,
    byPriority,
    byStatus,
    byDepartment
  ] = await Promise.all([
    Complaint.countDocuments(baseQuery),
    Complaint.countDocuments({ ...baseQuery, status: 'resolved' }),
    Complaint.countDocuments({
      ...baseQuery,
      status: { $in: ['pending', 'assigned', 'investigating', 'in-progress'] }
    }),
    Complaint.countDocuments({ ...baseQuery, status: 'escalated' }),
    Complaint.countDocuments({
      ...baseQuery,
      status: { $ne: 'resolved' },
      deadline: { $lt: new Date() }
    }),
    Complaint.countDocuments({
      ...baseQuery,
      priority: 'emergency',
      status: { $ne: 'resolved' }
    }),
    Complaint.aggregate([
      { $match: baseQuery },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    Complaint.aggregate([
      { $match: baseQuery },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]),
    Complaint.aggregate([
      { $match: baseQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Complaint.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: '$department',
          total: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
        }
      },
      { $sort: { total: -1 } }
    ])
  ])

  return {
    generatedAt: new Date().toISOString(),
    period: { startDate, endDate },
    summary: {
      total,
      resolved,
      pending,
      escalated,
      overdue,
      emergency,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0
    },
    byCategory,
    byPriority,
    byStatus,
    byDepartment
  }
}

// ===================================
// GENERATE CSV REPORT
// ===================================
const generateCsvReport = async (filters = {}) => {
  const complaints = await Complaint.find(filters)
    .populate('citizen', 'name email')
    .populate('assignedTo', 'name email')
    .lean()

  if (complaints.length === 0) {
    return 'No data available'
  }

  const headers = [
    'Complaint ID',
    'Title',
    'Category',
    'Priority',
    'Status',
    'Citizen',
    'Citizen Email',
    'Assigned Officer',
    'Location',
    'Created',
    'Deadline',
    'Resolved At'
  ]

  const escape = (val) => {
    if (val === null || val === undefined) return ''
    const str = String(val)
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str
  }

  const rows = complaints.map((c) =>
    [
      c.complaintId,
      c.title,
      c.category,
      c.priority,
      c.status,
      c.citizen?.name || '',
      c.citizen?.email || '',
      c.assignedTo?.name || 'Unassigned',
      c.location?.address || '',
      c.createdAt ? new Date(c.createdAt).toISOString() : '',
      c.deadline ? new Date(c.deadline).toISOString() : '',
      c.resolvedAt ? new Date(c.resolvedAt).toISOString() : ''
    ]
      .map(escape)
      .join(',')
  )

  return [headers.join(','), ...rows].join('\n')
}

// ===================================
// GENERATE HTML REPORT
// ===================================
const generateHtmlReport = async (filters = {}) => {
  const summary = await generateSummaryReport(filters)

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      : '—'

  const categoryRows = summary.byCategory
    .map(
      (c) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${c._id || 'Unknown'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700;">${c.count}</td>
    </tr>
  `
    )
    .join('')

  const deptRows = summary.byDepartment
    .map(
      (d) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${d._id || 'General'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">${d.total}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #38A169; font-weight: 700;">${d.resolved}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">${d.total > 0 ? Math.round((d.resolved / d.total) * 100) : 0}%</td>
    </tr>
  `
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>JanVoice Report</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f5f7fa; padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #FF6B35, #F7931E); padding: 40px 30px; text-align: center; color: white; }
        .content { padding: 30px; }
        .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0; }
        .kpi { background: #f7fafc; padding: 16px; border-radius: 8px; text-align: center; }
        .kpi-value { font-size: 28px; font-weight: 800; color: #FF6B35; }
        .kpi-label { font-size: 11px; color: #718096; text-transform: uppercase; font-weight: 700; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th { background: #f7fafc; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #718096; }
        .section-title { font-size: 18px; font-weight: 800; color: #1a202c; margin: 24px 0 12px; }
        .footer { background: #f7fafc; padding: 20px; text-align: center; font-size: 13px; color: #718096; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🇮🇳 JanVoice Report</h1>
          <p style="margin: 8px 0 0;">Generated on ${formatDate(new Date())}</p>
        </div>
        <div class="content">
          <h2 class="section-title">Summary</h2>
          <div class="kpi-grid">
            <div class="kpi"><div class="kpi-value">${summary.summary.total}</div><div class="kpi-label">Total</div></div>
            <div class="kpi"><div class="kpi-value" style="color: #38A169;">${summary.summary.resolved}</div><div class="kpi-label">Resolved</div></div>
            <div class="kpi"><div class="kpi-value" style="color: #ED8936;">${summary.summary.pending}</div><div class="kpi-label">Pending</div></div>
            <div class="kpi"><div class="kpi-value" style="color: #E53E3E;">${summary.summary.escalated}</div><div class="kpi-label">Escalated</div></div>
            <div class="kpi"><div class="kpi-value" style="color: #C53030;">${summary.summary.overdue}</div><div class="kpi-label">Overdue</div></div>
            <div class="kpi"><div class="kpi-value" style="color: #805AD5;">${summary.summary.resolutionRate}%</div><div class="kpi-label">Resolution</div></div>
          </div>

          <h2 class="section-title">📁 By Category</h2>
          <table>
            <thead><tr><th>Category</th><th style="text-align: right;">Count</th></tr></thead>
            <tbody>${categoryRows || '<tr><td colspan="2" style="padding: 20px; text-align: center; color: #718096;">No data</td></tr>'}</tbody>
          </table>

          <h2 class="section-title">🏛️ By Department</h2>
          <table>
            <thead><tr><th>Department</th><th style="text-align: right;">Total</th><th style="text-align: right;">Resolved</th><th style="text-align: right;">SLA %</th></tr></thead>
            <tbody>${deptRows || '<tr><td colspan="4" style="padding: 20px; text-align: center; color: #718096;">No data</td></tr>'}</tbody>
          </table>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} JanVoice | Government of India Initiative</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// ===================================
// EXPORT
// ===================================
module.exports = {
  generateSummaryReport,
  generateCsvReport,
  generateHtmlReport
}