/* ===================================
   JANVOICE — SMS SERVICE
   Uses Twilio (or MSG91 for India)
   =================================== */

// ===================================
// CONFIGURATION
// ===================================
let twilioClient = null

const initializeTwilio = () => {
  if (
    !process.env.TWILIO_ACCOUNT_SID ||
    !process.env.TWILIO_AUTH_TOKEN
  ) {
    console.warn('⚠️  Twilio not configured — SMS disabled')
    return null
  }

  try {
    const twilio = require('twilio')
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )
    console.log('✅ Twilio SMS service ready')
    return twilioClient
  } catch (error) {
    console.error('❌ Twilio init failed:', error.message)
    return null
  }
}

// ===================================
// SEND SMS
// ===================================
const sendSMS = async ({ to, message }) => {
  // Skip if not configured
  if (!twilioClient) {
    console.warn(`📱 SMS skipped (not configured): ${to}`)
    return { success: false, reason: 'not-configured' }
  }

  // Format phone number (add +91 if missing)
  const phone = to.startsWith('+') ? to : `+91${to.replace(/\D/g, '')}`

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    })

    console.log(`📱 SMS sent: ${result.sid} → ${phone}`)
    return { success: true, sid: result.sid }
  } catch (error) {
    console.error('❌ SMS failed:', error.message)
    return { success: false, error: error.message }
  }
}

// ===================================
// SEND BULK SMS
// ===================================
const sendBulkSMS = async (messages = []) => {
  const results = await Promise.allSettled(
    messages.map((msg) => sendSMS(msg))
  )

  const succeeded = results.filter((r) => r.status === 'fulfilled').length
  return { succeeded, total: messages.length, results }
}

// ===================================
// SMS TEMPLATES
// ===================================
const templates = {
  complaintCreated: (complaintId) =>
    `🇮🇳 JanVoice: Complaint ${complaintId} received. Track at ${process.env.CLIENT_URL}/citizen/complaints`,

  statusUpdate: (complaintId, status) =>
    `JanVoice: Complaint ${complaintId} status updated to ${status}. View details in your dashboard.`,

  emergencyAlert: (complaintId) =>
    `🚨 JanVoice: Emergency complaint ${complaintId} registered. Our team will respond within 1 hour.`,

  resolution: (complaintId) =>
    `✅ JanVoice: Complaint ${complaintId} has been RESOLVED. Please rate the resolution in your dashboard.`,

  otp: (otp) => `Your JanVoice verification code is: ${otp}. Valid for 10 minutes.`,

  assignment: (complaintId) =>
    `👤 JanVoice: You have been assigned complaint ${complaintId}. Please check your dashboard.`
}

module.exports = {
  initializeTwilio,
  sendSMS,
  sendBulkSMS,
  templates,
  getTwilioClient: () => twilioClient
}