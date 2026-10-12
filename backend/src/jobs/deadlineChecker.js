/* ===================================
   JANVOICE — DEADLINE CHECKER JOB
   Runs every 15 minutes
   - Warns officers before deadline
   - Auto-escalates overdue cases
   =================================== */

const cron = require('node-cron')
const Complaint = require('../models/Complaint')
const { sendEmail } = require('../config/email')

// ===================================
// CONFIGURATION
// ===================================
const CONFIG = {
  WARN_HOURS_BEFORE: 4,     // Warn 4 hours before deadline
  AUTO_ESCALATE_HOURS: 24   // Escalate 24 hours after deadline
}

// ===================================
// FIND CASES NEARING DEADLINE
// ===================================
const findNearingDeadline = async () => {
  const now = new Date()
  const warningTime = new Date(
    now.getTime() + CONFIG.WARN_HOURS_BEFORE * 60 * 60 * 1000
  )

  return Complaint.find({
    status: { $in: ['assigned', 'investigating', 'in-progress'] },
    deadline: {
      $gte: now,
      $lte: warningTime
    },
    'alerts.deadlineWarned': { $ne: true }
  })
    .populate('assignedTo', 'name email')
    .populate('citizen', 'name email')
}

// ===================================
// SEND DEADLINE WARNING EMAIL
// ===================================
const sendDeadlineWarning = async (complaint) => {
  try {
    if (!complaint.assignedTo?.email) return false

    const hoursLeft = Math.round(
      (new Date(complaint.deadline) - Date.now()) / (1000 * 60 * 60)
    )

    const subject = `⚠️ Deadline Alert: ${complaint.complaintId} due in ${hoursLeft}h`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', sans-serif; background: #f5f7fa; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #ED8936, #DD6B20); padding: 30px; text-align: center; color: white; }
          .content { padding: 30px; color: #4a5568; }
          .alert-box { background: #FEEBC8; border-left: 4px solid #ED8936; padding: 16px; border-radius: 4px; margin: 20px 0; }
          .btn { display: inline-block; background: linear-gradient(135deg, #FF6B35, #F7931E); color: white !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; margin: 20px 0; }
          .footer { background: #f7fafc; padding: 20px; text-align: center; font-size: 13px; color: #718096; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Deadline Alert</h1>
          </div>
          <div class="content">
            <h2>Hi ${complaint.assignedTo.name},</h2>
            <p>A case assigned to you is approaching its deadline.</p>
            <div class="alert-box">
              <strong>Case:</strong> ${complaint.complaintId}<br>
              <strong>Title:</strong> ${complaint.title}<br>
              <strong>Priority:</strong> ${complaint.priority.toUpperCase()}<br>
              <strong>Time Left:</strong> ${hoursLeft} hours
            </div>
            <p>Please take action immediately to meet the SLA.</p>
            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL}/officer/case/${complaint._id}" class="btn">Open Case →</a>
            </div>
          </div>
          <div class="footer">
            <p>© 2026 JanVoice</p>
          </div>
        </div>
      </body>
      </html>
    `

    await sendEmail({
      to: complaint.assignedTo.email,
      subject,
      html
    })

    if (!complaint.alerts) complaint.alerts = {}
    complaint.alerts.deadlineWarned = true
    complaint.alerts.deadlineWarnedAt = new Date()
    await complaint.save()

    console.log(`📧 Deadline warning sent: ${complaint.complaintId}`)
    return true
  } catch (error) {
    console.error(`Deadline warning failed for ${complaint.complaintId}:`, error.message)
    return false
  }
}

// ===================================
// FIND OVERDUE CASES
// ===================================
const findOverdueCases = async () => {
  const now = new Date()
  const escalateAfter = new Date(
    now.getTime() - CONFIG.AUTO_ESCALATE_HOURS * 60 * 60 * 1000
  )

  return Complaint.find({
    status: { $in: ['assigned', 'investigating', 'in-progress'] },
    deadline: { $lt: escalateAfter },
    'alerts.autoEscalated': { $ne: true }
  })
    .populate('assignedTo', 'name email')
    .populate('citizen', 'name email')
}

// ===================================
// AUTO-ESCALATE OVERDUE CASE
// ===================================
const autoEscalateCase = async (complaint) => {
  try {
    complaint.status = 'escalated'
    complaint.escalatedAt = new Date()
    complaint.statusHistory.push({
      status: 'escalated',
      note: `Auto-escalated: Overdue by more than ${CONFIG.AUTO_ESCALATE_HOURS} hours`,
      updatedBy: null,
      updatedAt: new Date()
    })

    if (!complaint.alerts) complaint.alerts = {}
    complaint.alerts.autoEscalated = true
    complaint.alerts.autoEscalatedAt = new Date()

    await complaint.save()

    console.log(`🚨 Auto-escalated case: ${complaint.complaintId}`)
    return true
  } catch (error) {
    console.error(`Auto-escalate failed for ${complaint.complaintId}:`, error.message)
    return false
  }
}

// ===================================
// MAIN JOB RUNNER
// ===================================
const runDeadlineChecker = async () => {
  const startTime = Date.now()
  console.log('🕐 Running deadline checker...')

  try {
    // 1. Send warnings
    const nearing = await findNearingDeadline()
    console.log(`   Found ${nearing.length} cases nearing deadline`)

    let warningsSent = 0
    for (const complaint of nearing) {
      const sent = await sendDeadlineWarning(complaint)
      if (sent) warningsSent++
    }

    // 2. Auto-escalate overdue
    const overdue = await findOverdueCases()
    console.log(`   Found ${overdue.length} overdue cases`)

    let escalated = 0
    for (const complaint of overdue) {
      const ok = await autoEscalateCase(complaint)
      if (ok) escalated++
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`✅ Deadline checker complete in ${duration}s`)
    console.log(`   Warnings sent: ${warningsSent}`)
    console.log(`   Cases escalated: ${escalated}`)

    return { warningsSent, escalated }
  } catch (error) {
    console.error('❌ Deadline checker failed:', error)
    return { warningsSent: 0, escalated: 0, error: error.message }
  }
}

// ===================================
// SCHEDULE THE JOB
// ===================================
const startDeadlineChecker = () => {
  // Run every 15 minutes
  cron.schedule('*/15 * * * *', runDeadlineChecker)

  // Run once on startup (after 30 seconds)
  setTimeout(runDeadlineChecker, 30000)

  console.log('✅ Deadline checker scheduled (every 15 min)')
}

module.exports = {
  startDeadlineChecker,
  runDeadlineChecker
}