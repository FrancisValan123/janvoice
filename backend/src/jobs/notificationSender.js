/* ===================================
   JANVOICE — NOTIFICATION SENDER JOB
   Runs every 5 minutes
   - Sends pending email notifications
   - Cleans up old notifications
   =================================== */

const cron = require('node-cron')
const Notification = require('../models/Notification')
const { sendEmail } = require('../config/email')

const BATCH_SIZE = 50

// ===================================
// SEND PENDING EMAIL NOTIFICATIONS
// ===================================
const sendPendingEmails = async () => {
  const notifications = await Notification.find({
    emailSent: false,
    emailQueued: true,
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  })
    .populate('user', 'name email')
    .limit(BATCH_SIZE)

  let sent = 0
  let failed = 0

  for (const notification of notifications) {
    if (!notification.user?.email) continue

    try {
      const html = buildEmailHtml(notification, notification.user)

      await sendEmail({
        to: notification.user.email,
        subject: notification.title,
        html
      })

      notification.emailSent = true
      notification.emailSentAt = new Date()
      await notification.save()
      sent++
    } catch (err) {
      notification.emailAttempts = (notification.emailAttempts || 0) + 1
      notification.emailError = err.message

      // Give up after 3 attempts
      if (notification.emailAttempts >= 3) {
        notification.emailSent = true
        notification.emailFailed = true
      }
      await notification.save()
      failed++
    }
  }

  return { sent, failed, total: notifications.length }
}

// ===================================
// BUILD EMAIL HTML
// ===================================
const buildEmailHtml = (notification, user) => {
  const typeColors = {
    info: '#4299E1',
    success: '#38A169',
    warning: '#ED8936',
    danger: '#E53E3E',
    emergency: '#C53030'
  }
  const color = typeColors[notification.type] || typeColors.info

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f5f7fa; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #FF6B35, #F7931E); padding: 30px; text-align: center; color: white; }
        .content { padding: 30px; color: #4a5568; }
        .type-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: ${color}20; color: ${color}; margin-bottom: 12px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #FF6B35, #F7931E); color: white !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; margin: 16px 0; }
        .footer { background: #f7fafc; padding: 20px; text-align: center; font-size: 13px; color: #718096; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🇮🇳 JanVoice</h1>
        </div>
        <div class="content">
          <span class="type-badge">${notification.type.toUpperCase()}</span>
          <h2>Hi ${user.name},</h2>
          <h3 style="color: #1a202c;">${notification.title}</h3>
          <p style="line-height: 1.6;">${notification.message}</p>
          ${
            notification.link
              ? `<div style="text-align: center;"><a href="${process.env.CLIENT_URL}${notification.link}" class="btn">View Details →</a></div>`
              : ''
          }
        </div>
        <div class="footer">
          <p>© 2026 JanVoice | Government of India Initiative</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// ===================================
// CLEANUP OLD NOTIFICATIONS
// ===================================
const cleanupOldNotifications = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const result = await Notification.deleteMany({
    read: true,
    readAt: { $lt: thirtyDaysAgo }
  })

  if (result.deletedCount > 0) {
    console.log(`🧹 Cleaned up ${result.deletedCount} old notifications`)
  }

  return result.deletedCount
}

// ===================================
// MAIN JOB RUNNER
// ===================================
const runNotificationSender = async () => {
  const startTime = Date.now()
  console.log('📧 Running notification sender...')

  try {
    const emails = await sendPendingEmails()
    console.log(`   Emails: ${emails.sent} sent, ${emails.failed} failed`)

    const cleaned = await cleanupOldNotifications()
    if (cleaned > 0) console.log(`   Cleaned: ${cleaned}`)

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`✅ Notification sender complete in ${duration}s`)

    return { emails, cleaned }
  } catch (error) {
    console.error('❌ Notification sender failed:', error)
    return { error: error.message }
  }
}

// ===================================
// SCHEDULE THE JOB
// ===================================
const startNotificationSender = () => {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', runNotificationSender)

  // Run once on startup (after 45 seconds)
  setTimeout(runNotificationSender, 45000)

  console.log('✅ Notification sender scheduled (every 5 min)')
}

module.exports = {
  startNotificationSender,
  runNotificationSender
}