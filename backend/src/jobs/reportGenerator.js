/* ===================================
   JANVOICE — REPORT GENERATOR JOB
   Runs weekly on Monday at 6:00 AM IST
   - Generates weekly performance report
   - Emails to higher authorities
   - Archives as HTML + JSON
   =================================== */

const cron = require('node-cron')
const fs = require('fs').promises
const path = require('path')
const Complaint = require('../models/Complaint')
const User = require('../models/User')
const { sendEmail } = require('../config/email')

// ===================================
// CONFIGURATION
// ===================================
const CONFIG = {
  REPORT_DIR: path.join(__dirname, '../../reports'),
  RETENTION_WEEKS: 12
}

// ===================================
// ENSURE REPORT DIRECTORY
// ===================================
const ensureReportDir = async () => {
  try {
    await fs.access(CONFIG.REPORT_DIR)
  } catch {
    await fs.mkdir(CONFIG.REPORT_DIR, { recursive: true })
  }
}

// ===================================
// COMPUTE WEEKLY STATS
// ===================================
const computeWeeklyStats = async () => {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [
    total,
    created,
    resolved,
    escalated,
    pending,
    overdue,
    emergency
  ] = await Promise.all([
    Complaint.countDocuments(),
    Complaint.countDocuments({ createdAt: { $gte: weekAgo } }),
    Complaint.countDocuments({
      status: 'resolved',
      resolvedAt: { $gte: weekAgo }
    }),
    Complaint.countDocuments({
      status: 'escalated',
      escalatedAt: { $gte: weekAgo }
    }),
    Complaint.countDocuments({
      status: { $in: ['pending', 'assigned', 'investigating', 'in-progress'] }
    }),
    Complaint.countDocuments({
      status: { $ne: 'resolved' },
      deadline: { $lt: now }
    }),
    Complaint.countDocuments({
      priority: 'emergency',
      status: { $ne: 'resolved' }
    })
  ])

  const departments = await Complaint.aggregate([
    { $match: { createdAt: { $gte: weekAgo } } },
    {
      $group: {
        _id: '$department',
        total: { $sum: 1 },
        resolved: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        }
      }
    },
    { $sort: { total: -1 } }
  ])

  const priorityBreakdown = await Complaint.aggregate([
    { $match: { createdAt: { $gte: weekAgo } } },
    { $group: { _id: '$priority', count: { $sum: 1 } } }
  ])

  const topOfficers = await Complaint.aggregate([
    {
      $match: {
        status: 'resolved',
        resolvedAt: { $gte: weekAgo },
        assignedTo: { $ne: null }
      }
    },
    { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'officer'
      }
    },
    { $unwind: '$officer' },
    {
      $project: {
        name: '$officer.name',
        email: '$officer.email',
        resolved: '$count'
      }
    }
  ])

  const slaData = await Complaint.aggregate([
    {
      $match: {
        status: 'resolved',
        resolvedAt: { $gte: weekAgo },
        deadline: { $ne: null }
      }
    },
    { $project: { onTime: { $lte: ['$resolvedAt', '$deadline'] } } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        onTime: { $sum: { $cond: ['$onTime', 1, 0] } }
      }
    }
  ])

  const sla =
    slaData[0] && slaData[0].total > 0
      ? Math.round((slaData[0].onTime / slaData[0].total) * 100)
      : 0

  return {
    period: {
      from: weekAgo.toISOString(),
      to: now.toISOString()
    },
    summary: {
      totalComplaints: total,
      newThisWeek: created,
      resolvedThisWeek: resolved,
      escalatedThisWeek: escalated,
      pending,
      overdue,
      emergencyActive: emergency,
      slaCompliance: sla,
      resolutionRate: created > 0 ? Math.round((resolved / created) * 100) : 0
    },
    departments,
    priorityBreakdown,
    topOfficers
  }
}

// ===================================
// BUILD REPORT HTML
// ===================================
const buildReportHtml = (stats) => {
  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })

  const deptRows = stats.departments
    .map(
      (d) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${d._id || 'Unassigned'}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${d.total}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #38A169; font-weight: 700;">${d.resolved}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${d.total > 0 ? Math.round((d.resolved / d.total) * 100) : 0}%</td>
      </tr>
    `
    )
    .join('')

  const officerRows = stats.topOfficers
    .map(
      (o, i) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: 700;">#${i + 1}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${o.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: 700; color: #38A169;">${o.resolved}</td>
      </tr>
    `
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f5f7fa; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #FF6B35, #F7931E); padding: 40px 30px; text-align: center; color: white; }
        .content { padding: 30px; }
        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
        .kpi { background: #f7fafc; padding: 16px; border-radius: 8px; text-align: center; }
        .kpi-value { font-size: 24px; font-weight: 800; color: #FF6B35; }
        .kpi-label { font-size: 11px; color: #718096; text-transform: uppercase; font-weight: 700; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f7fafc; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #718096; }
        .section-title { font-size: 18px; font-weight: 800; color: #1a202c; margin: 24px 0 12px; }
        .footer { background: #f7fafc; padding: 20px; text-align: center; font-size: 13px; color: #718096; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🇮🇳 JanVoice Weekly Report</h1>
          <p style="margin: 8px 0 0; opacity: 0.95;">
            ${formatDate(stats.period.from)} → ${formatDate(stats.period.to)}
          </p>
        </div>
        <div class="content">
          <h2 style="color: #1a202c; margin-top: 0;">Summary</h2>
          <div class="kpi-grid">
            <div class="kpi">
              <div class="kpi-value">${stats.summary.newThisWeek}</div>
              <div class="kpi-label">New</div>
            </div>
            <div class="kpi">
              <div class="kpi-value" style="color: #38A169;">${stats.summary.resolvedThisWeek}</div>
              <div class="kpi-label">Resolved</div>
            </div>
            <div class="kpi">
              <div class="kpi-value" style="color: #E53E3E;">${stats.summary.escalatedThisWeek}</div>
              <div class="kpi-label">Escalated</div>
            </div>
            <div class="kpi">
              <div class="kpi-value" style="color: #805AD5;">${stats.summary.slaCompliance}%</div>
              <div class="kpi-label">SLA</div>
            </div>
          </div>

          <div style="background: #FFF5F5; border-left: 4px solid #E53E3E; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <strong>⚠️ Attention Required:</strong>
            <ul style="margin: 8px 0 0; padding-left: 20px; color: #4a5568;">
              <li><strong>${stats.summary.pending}</strong> complaints pending</li>
              <li><strong>${stats.summary.overdue}</strong> complaints overdue</li>
              <li><strong>${stats.summary.emergencyActive}</strong> active emergencies</li>
            </ul>
          </div>

          <h2 class="section-title">📊 Department Performance</h2>
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th style="text-align: center;">Total</th>
                <th style="text-align: center;">Resolved</th>
                <th style="text-align: center;">SLA %</th>
              </tr>
            </thead>
            <tbody>
              ${deptRows || '<tr><td colspan="4" style="padding: 20px; text-align: center; color: #718096;">No department data</td></tr>'}
            </tbody>
          </table>

          <h2 class="section-title">🏆 Top Officers</h2>
          <table>
            <thead>
              <tr>
                <th style="width: 60px;">Rank</th>
                <th>Officer</th>
                <th style="text-align: center;">Resolved</th>
              </tr>
            </thead>
            <tbody>
              ${officerRows || '<tr><td colspan="3" style="padding: 20px; text-align: center; color: #718096;">No officer data</td></tr>'}
            </tbody>
          </table>
        </div>
        <div class="footer">
          <p>© 2026 JanVoice | Government of India Initiative</p>
          <p style="margin: 4px 0 0; font-size: 12px;">Auto-generated weekly report</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// ===================================
// HELPER
// ===================================
const formatDateShort = (d) =>
  new Date(d).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

// ===================================
// GENERATE REPORT
// ===================================
const generateReport = async () => {
  const startTime = Date.now()
  console.log('📄 Generating weekly report...')

  try {
    await ensureReportDir()
    const stats = await computeWeeklyStats()
    const html = buildReportHtml(stats)

    const timestamp = new Date().toISOString().slice(0, 10)
    const filename = `weekly-report-${timestamp}.html`
    const filepath = path.join(CONFIG.REPORT_DIR, filename)

    await fs.writeFile(filepath, html, 'utf8')

    // Save JSON version
    const jsonPath = path.join(CONFIG.REPORT_DIR, `weekly-report-${timestamp}.json`)
    await fs.writeFile(jsonPath, JSON.stringify(stats, null, 2), 'utf8')

    console.log(`✅ Report generated: ${filename}`)

    // Email to higher authorities
    try {
      const recipients = await User.find({
        role: { $in: ['higher_authority', 'system_admin'] },
        isActive: true
      }).select('email name')

      for (const recipient of recipients) {
        await sendEmail({
          to: recipient.email,
          subject: `📊 JanVoice Weekly Report - ${formatDateShort(stats.period.from)}`,
          html
        })
      }

      console.log(`📧 Report emailed to ${recipients.length} recipients`)
    } catch (emailError) {
      console.warn('Report email failed:', emailError.message)
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`✅ Report generation complete in ${duration}s`)

    return { success: true, filename, stats }
  } catch (error) {
    console.error('❌ Report generation failed:', error)
    return { success: false, error: error.message }
  }
}

// ===================================
// CLEANUP OLD REPORTS
// ===================================
const cleanupOldReports = async () => {
  try {
    await ensureReportDir()
    const files = await fs.readdir(CONFIG.REPORT_DIR)
    const cutoff = Date.now() - CONFIG.RETENTION_WEEKS * 7 * 24 * 60 * 60 * 1000
    let deleted = 0

    for (const file of files) {
      if (!file.startsWith('weekly-report-')) continue

      const filepath = path.join(CONFIG.REPORT_DIR, file)
      const stats = await fs.stat(filepath)

      if (stats.mtimeMs < cutoff) {
        await fs.unlink(filepath)
        deleted++
      }
    }

    if (deleted > 0) {
      console.log(`🧹 Deleted ${deleted} old reports`)
    }

    return deleted
  } catch (error) {
    console.error('Cleanup failed:', error.message)
    return 0
  }
}

// ===================================
// MAIN JOB RUNNER
// ===================================
const runReportGenerator = async () => {
  const result = await generateReport()
  await cleanupOldReports()
  return result
}

// ===================================
// SCHEDULE THE JOB
// ===================================
const startReportGenerator = () => {
  // Run weekly on Monday at 6:00 AM IST
  cron.schedule('0 6 * * 1', runReportGenerator, {
    timezone: 'Asia/Kolkata'
  })

  console.log('✅ Report generator scheduled (Mondays at 6 AM IST)')
}

module.exports = {
  startReportGenerator,
  runReportGenerator,
  generateReport,
  cleanupOldReports
}