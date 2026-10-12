/* ===================================
   JANVOICE — EMAIL SERVICE
   Nodemailer-based email sending
   =================================== */

const nodemailer = require('nodemailer')

// ===================================
// CREATE TRANSPORTER (Singleton)
// ===================================
let transporter = null

const getTransporter = () => {
  if (transporter) return transporter

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  })

  return transporter
}

// ===================================
// VERIFY CONNECTION
// ===================================
const verifyEmailConnection = async () => {
  try {
    const mailer = getTransporter()
    await mailer.verify()
    console.log('✅ Email service ready')
    return true
  } catch (error) {
    console.error('❌ Email service error:', error.message)
    return false
  }
}

// ===================================
// SEND EMAIL (Generic)
// ===================================
const sendEmail = async ({ to, subject, html, text, attachments = [] }) => {
  try {
    const mailer = getTransporter()

    const mailOptions = {
      from: process.env.EMAIL_FROM || `JanVoice <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || html?.replace(/<[^>]*>/g, ''),
      attachments
    }

    const info = await mailer.sendMail(mailOptions)
    console.log(`📧 Email sent: ${info.messageId} → ${to}`)

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Email send failed:', error.message)
    throw error
  }
}

// ===================================
// SEND BULK EMAILS
// ===================================
const sendBulkEmails = async (emails = []) => {
  const results = await Promise.allSettled(
    emails.map((email) => sendEmail(email))
  )

  const succeeded = results.filter((r) => r.status === 'fulfilled').length
  const failed = results.filter((r) => r.status === 'rejected').length

  return { succeeded, failed, total: emails.length }
}

// ===================================
// EMAIL TEMPLATES
// ===================================
const baseTemplate = (content) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f5f7fa; padding: 20px; margin: 0; }
      .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
      .header { background: linear-gradient(135deg, #FF6B35, #F7931E); padding: 40px 30px; text-align: center; color: white; }
      .header h1 { margin: 0; font-size: 28px; font-weight: 800; }
      .header p { margin: 8px 0 0; opacity: 0.95; font-size: 14px; }
      .content { padding: 40px 30px; color: #4a5568; line-height: 1.7; }
      .content h2 { color: #1a202c; margin-top: 0; font-size: 22px; }
      .btn { display: inline-block; background: linear-gradient(135deg, #FF6B35, #F7931E); color: white !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; margin: 20px 0; }
      .info-box { background: #f7fafc; border-left: 4px solid #FF6B35; padding: 16px; margin: 20px 0; border-radius: 4px; }
      .footer { background: #f7fafc; padding: 20px 30px; text-align: center; font-size: 13px; color: #718096; }
      .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; }
      .badge-success { background: #c6f6d5; color: #276749; }
      .badge-warning { background: #feebc8; color: #9c4221; }
      .badge-danger { background: #fed7d7; color: #9b2c2c; }
      .badge-info { background: #bee3f8; color: #2c5282; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🇮🇳 JanVoice</h1>
        <p>National Public Complaint & Action Platform</p>
      </div>
      <div class="content">${content}</div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} JanVoice | Government of India Initiative</p>
        <p style="margin: 8px 0 0; font-size: 12px;">
          Need help? <a href="mailto:support@janvoice.gov.in" style="color: #FF6B35; text-decoration: none;">Contact Support</a>
        </p>
      </div>
    </div>
  </body>
  </html>
`

const templates = {
  passwordReset: (userName, resetLink) =>
    baseTemplate(`
      <h2>Hi ${userName},</h2>
      <p>We received a request to reset your JanVoice password.</p>
      <p>Click the button below to create a new password:</p>
      <div style="text-align: center;">
        <a href="${resetLink}" class="btn">Reset My Password</a>
      </div>
      <div class="info-box">
        <strong>⚠️ Important:</strong>
        <ul style="margin: 8px 0 0; padding-left: 20px;">
          <li>This link expires in <strong>15 minutes</strong></li>
          <li>You can only use this link once</li>
          <li>If you didn't request this, ignore this email</li>
        </ul>
      </div>
      <p style="font-size: 13px; color: #718096;">
        If the button doesn't work, copy this link:<br>
        <span style="color: #FF6B35; word-break: break-all;">${resetLink}</span>
      </p>
    `),

  welcome: (userName) =>
    baseTemplate(`
      <h2>Welcome to JanVoice, ${userName}! 🎉</h2>
      <p>Thank you for joining India's national civic complaint platform.</p>
      <p>You can now:</p>
      <ul style="padding-left: 20px;">
        <li>📝 Submit complaints about civic issues</li>
        <li>📍 Track resolutions in real-time</li>
        <li>🔔 Receive notifications on updates</li>
        <li>⭐ Rate the resolution quality</li>
      </ul>
      <p>Together, let's build a better India. 🇮🇳</p>
      <div style="text-align: center;">
        <a href="${process.env.CLIENT_URL}/login" class="btn">Login to JanVoice</a>
      </div>
    `),

  complaintCreated: (userName, complaint) =>
    baseTemplate(`
      <h2>Complaint Submitted ✅</h2>
      <p>Hi ${userName},</p>
      <p>Your complaint has been successfully registered.</p>
      <div class="info-box">
        <strong>Complaint ID:</strong> ${complaint.complaintId}<br>
        <strong>Title:</strong> ${complaint.title}<br>
        <strong>Category:</strong> ${complaint.category}<br>
        <strong>Priority:</strong> <span class="badge badge-${
          complaint.priority === 'emergency'
            ? 'danger'
            : complaint.priority === 'high'
            ? 'warning'
            : 'info'
        }">${complaint.priority.toUpperCase()}</span>
      </div>
      <p>You can track your complaint status at any time.</p>
      <div style="text-align: center;">
        <a href="${process.env.CLIENT_URL}/citizen/complaints/${
      complaint._id || complaint.id
    }" class="btn">Track Complaint</a>
      </div>
    `),

  statusUpdate: (userName, complaint, status, note) =>
    baseTemplate(`
      <h2>Complaint Status Update 📋</h2>
      <p>Hi ${userName},</p>
      <p>Your complaint <strong>${complaint.complaintId}</strong> has been updated.</p>
      <div class="info-box">
        <strong>Title:</strong> ${complaint.title}<br>
        <strong>New Status:</strong> <span class="badge badge-${
          status === 'resolved'
            ? 'success'
            : status === 'escalated' || status === 'rejected'
            ? 'danger'
            : 'info'
        }">${status.replace('-', ' ').toUpperCase()}</span>
        ${note ? `<br><strong>Note:</strong> ${note}` : ''}
      </div>
      <div style="text-align: center;">
        <a href="${process.env.CLIENT_URL}/citizen/complaints/${
      complaint._id || complaint.id
    }" class="btn">View Details</a>
      </div>
    `),

  deadlineWarning: (officerName, complaint, hoursLeft) =>
    baseTemplate(`
      <h2>⚠️ Deadline Warning</h2>
      <p>Hi ${officerName},</p>
      <p>A case assigned to you is approaching its deadline.</p>
      <div class="info-box" style="background: #FFFAF0; border-left-color: #ED8936;">
        <strong>Complaint:</strong> ${complaint.complaintId}<br>
        <strong>Title:</strong> ${complaint.title}<br>
        <strong>Priority:</strong> ${complaint.priority.toUpperCase()}<br>
        <strong>⏰ Time Left:</strong> ${hoursLeft} hours
      </div>
      <p>Please take action immediately to meet the SLA.</p>
      <div style="text-align: center;">
        <a href="${process.env.CLIENT_URL}/officer/case/${
      complaint._id || complaint.id
    }" class="btn">Open Case</a>
      </div>
    `),

  weeklyReport: (stats) =>
    baseTemplate(`
      <h2>📊 Weekly Performance Report</h2>
      <p>Here's this week's summary:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 8px 0;"><strong>New Complaints:</strong></td><td style="text-align: right;">${stats.newThisWeek}</td></tr>
        <tr><td style="padding: 8px 0;"><strong>Resolved:</strong></td><td style="text-align: right; color: #38A169;">${stats.resolvedThisWeek}</td></tr>
        <tr><td style="padding: 8px 0;"><strong>Escalated:</strong></td><td style="text-align: right; color: #E53E3E;">${stats.escalatedThisWeek}</td></tr>
        <tr><td style="padding: 8px 0;"><strong>SLA Compliance:</strong></td><td style="text-align: right; color: #805AD5;">${stats.slaCompliance}%</td></tr>
      </table>
      <div style="text-align: center;">
        <a href="${process.env.CLIENT_URL}/authority/dashboard" class="btn">View Full Dashboard</a>
      </div>
    `)
}

// ===================================
// EXPORT
// ===================================
module.exports = {
  getTransporter,
  verifyEmailConnection,
  sendEmail,
  sendBulkEmails,
  templates,
  emailTemplates: templates // Alias for backwards compatibility
}