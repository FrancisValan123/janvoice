/* ===================================
   JANVOICE — EMAIL CONFIGURATION
   =================================== */

const nodemailer = require('nodemailer')

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
    console.log(`📧 Email sent: ${info.messageId} to ${to}`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Email send failed:', error.message)
    throw error
  }
}

const emailTemplates = {
  passwordReset: (userName, resetLink) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f5f7fa; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #FF6B35, #F7931E); padding: 40px 30px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 40px 30px; color: #4a5568; }
        .content h2 { color: #1a202c; margin-top: 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #FF6B35, #F7931E); color: white !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; margin: 20px 0; }
        .info-box { background: #f7fafc; border-left: 4px solid #FF6B35; padding: 16px; margin: 20px 0; border-radius: 4px; }
        .footer { background: #f7fafc; padding: 20px 30px; text-align: center; font-size: 13px; color: #718096; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🇮🇳 JanVoice</h1>
          <p style="margin: 8px 0 0; opacity: 0.95;">National Public Complaint & Action Platform</p>
        </div>
        <div class="content">
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
        </div>
        <div class="footer">
          <p>© 2026 JanVoice | Government of India Initiative</p>
        </div>
      </div>
    </body>
    </html>
  `,

  welcome: (userName) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f5f7fa; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; }
        .header { background: linear-gradient(135deg, #FF6B35, #F7931E); padding: 40px 30px; text-align: center; color: white; }
        .content { padding: 40px 30px; color: #4a5568; }
        .footer { background: #f7fafc; padding: 20px 30px; text-align: center; font-size: 13px; color: #718096; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🇮🇳 Welcome to JanVoice!</h1>
        </div>
        <div class="content">
          <h2>Hi ${userName},</h2>
          <p>Thank you for joining JanVoice — India's national platform for civic complaint management.</p>
          <p>You can now submit complaints, track resolutions, and receive updates.</p>
          <p>Together, let's build a better India. 🇮🇳</p>
        </div>
        <div class="footer">
          <p>© 2026 JanVoice</p>
        </div>
      </div>
    </body>
    </html>
  `
}

module.exports = {
  getTransporter,
  verifyEmailConnection,
  sendEmail,
  emailTemplates
}