/* ===================================
   JANVOICE — PUSH NOTIFICATION SERVICE
   Firebase Cloud Messaging (FCM)
   =================================== */

const User = require('../models/User')

let firebaseAdmin = null

// ===================================
// INITIALIZE FIREBASE
// ===================================
const initializeFirebase = () => {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.warn('⚠️  Firebase not configured — push notifications disabled')
    return null
  }

  try {
    const admin = require('firebase-admin')
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT
    )

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      })
    }

    firebaseAdmin = admin
    console.log('✅ Firebase push service ready')
    return admin
  } catch (error) {
    console.error('❌ Firebase init failed:', error.message)
    return null
  }
}

// ===================================
// SEND TO SINGLE DEVICE
// ===================================
const sendPushToDevice = async ({ token, title, body, data = {} }) => {
  if (!firebaseAdmin) {
    console.warn('📱 Push skipped (not configured)')
    return { success: false, reason: 'not-configured' }
  }

  try {
    const message = {
      notification: { title, body },
      data: Object.keys(data).reduce((acc, key) => {
        acc[key] = String(data[key])
        return acc
      }, {}),
      token
    }

    const response = await firebaseAdmin.messaging().send(message)
    return { success: true, messageId: response }
  } catch (error) {
    console.error('❌ Push failed:', error.message)
    return { success: false, error: error.message }
  }
}

// ===================================
// SEND TO USER (all their devices)
// ===================================
const sendPushToUser = async (userId, { title, body, data = {} }) => {
  if (!firebaseAdmin) return { success: false }

  try {
    const user = await User.findById(userId).select('fcmTokens')
    if (!user || !user.fcmTokens || user.fcmTokens.length === 0) {
      return { success: false, reason: 'no-tokens' }
    }

    const message = {
      notification: { title, body },
      data: Object.keys(data).reduce((acc, key) => {
        acc[key] = String(data[key])
        return acc
      }, {}),
      tokens: user.fcmTokens
    }

    const response = await firebaseAdmin.messaging().sendMulticast(message)

    // Remove invalid tokens
    if (response.failureCount > 0) {
      const failedTokens = []
      response.responses.forEach((resp, idx) => {
        if (!resp.success) failedTokens.push(user.fcmTokens[idx])
      })
      if (failedTokens.length > 0) {
        await User.updateOne(
          { _id: userId },
          { $pull: { fcmTokens: { $in: failedTokens } } }
        )
      }
    }

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount
    }
  } catch (error) {
    console.error('❌ Push to user failed:', error.message)
    return { success: false, error: error.message }
  }
}

// ===================================
// SEND TO MULTIPLE USERS
// ===================================
const sendPushToUsers = async (userIds = [], notification = {}) => {
  const results = await Promise.allSettled(
    userIds.map((userId) => sendPushToUser(userId, notification))
  )

  const succeeded = results.filter(
    (r) => r.status === 'fulfilled' && r.value.success
  ).length

  return { succeeded, total: userIds.length }
}

// ===================================
// SEND TO TOPIC
// ===================================
const sendPushToTopic = async (topic, { title, body, data = {} }) => {
  if (!firebaseAdmin) return { success: false }

  try {
    const message = {
      notification: { title, body },
      data: Object.keys(data).reduce((acc, key) => {
        acc[key] = String(data[key])
        return acc
      }, {}),
      topic
    }

    const response = await firebaseAdmin.messaging().send(message)
    return { success: true, messageId: response }
  } catch (error) {
    console.error('❌ Push to topic failed:', error.message)
    return { success: false, error: error.message }
  }
}

// ===================================
// NOTIFICATION TEMPLATES
// ===================================
const templates = {
  complaintCreated: (complaint) => ({
    title: '✅ Complaint Registered',
    body: `Your complaint "${complaint.title}" has been submitted.`,
    data: {
      type: 'complaint-created',
      complaintId: complaint._id?.toString()
    }
  }),

  complaintAssigned: (complaint) => ({
    title: '👤 Officer Assigned',
    body: `An officer has been assigned to your complaint.`,
    data: {
      type: 'complaint-assigned',
      complaintId: complaint._id?.toString()
    }
  }),

  statusChanged: (complaint, status) => ({
    title: '📋 Status Update',
    body: `Complaint ${complaint.complaintId} is now ${status}.`,
    data: {
      type: 'status-changed',
      complaintId: complaint._id?.toString(),
      status
    }
  }),

  complaintResolved: (complaint) => ({
    title: '✅ Complaint Resolved',
    body: `Complaint ${complaint.complaintId} has been resolved!`,
    data: {
      type: 'complaint-resolved',
      complaintId: complaint._id?.toString()
    }
  }),

  newAssignment: (complaint) => ({
    title: '📥 New Case Assigned',
    body: `You have a new case: ${complaint.title}`,
    data: {
      type: 'new-assignment',
      complaintId: complaint._id?.toString()
    }
  }),

  deadlineWarning: (complaint, hoursLeft) => ({
    title: '⚠️ Deadline Warning',
    body: `Case ${complaint.complaintId} due in ${hoursLeft} hours`,
    data: {
      type: 'deadline-warning',
      complaintId: complaint._id?.toString(),
      hoursLeft
    }
  })
}

module.exports = {
  initializeFirebase,
  sendPushToDevice,
  sendPushToUser,
  sendPushToUsers,
  sendPushToTopic,
  templates,
  getAdmin: () => firebaseAdmin
}