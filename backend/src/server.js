/* ===================================
   JANVOICE — BACKEND SERVER
   Main Express application entry point
   =================================== */

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const http = require('http')
const path = require('path')

// ===================================
// LOAD ENVIRONMENT VARIABLES FIRST
// ===================================
dotenv.config()

// ===================================
// CREATE APP + HTTP SERVER
// ===================================
const app = express()
const server = http.createServer(app)

// ===================================
// CONFIG IMPORTS
// ===================================
const { connectDB, disconnectDB } = require('./config/database')
const { verifyEmailConnection } = require('./config/email')
const { initSocket } = require('./config/socket')
const { initRedis, disconnectRedis } = require('./config/redis')

// ===================================
// MIDDLEWARE IMPORTS
// ===================================
const { corsMiddleware } = require('./middleware/cors')
const {
  sanitizeMongo,
  sanitizeXSS,
  preventHPP,
  trimStrings
} = require('./middleware/sanitize')
const { httpLogger } = require('./middleware/logger')
const { apiLimiter } = require('./middleware/rateLimiter')
const { errorHandler, notFound } = require('./middleware/errorHandler')

// ===================================
// SOCKET IMPORTS
// ===================================
const { initializeSocketHandlers } = require('./sockets')

// ===================================
// JOB IMPORTS
// ===================================
const { startDeadlineChecker } = require('./jobs/deadlineChecker')
const { startNotificationSender } = require('./jobs/notificationSender')
const { startDataBackup } = require('./jobs/dataBackup')
const { startReportGenerator } = require('./jobs/reportGenerator')

// ===================================
// ROUTE IMPORTS
// ===================================
const apiRoutes = require('./routes')
const uploadRoutes = require('./routes/uploadRoutes')
const adminRoutes = require('./routes/adminRoutes')
const departmentRoutes = require('./routes/departmentRoutes') // ✅ Added

// ===================================
// LOGGER
// ===================================
const logger = require('./utils/logger')

// ===================================
// SECURITY MIDDLEWARE
// ===================================
app.use(helmet())
app.use(corsMiddleware)

// ===================================
// BODY PARSING + COMPRESSION
// ===================================
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(compression())

// ===================================
// HTTP REQUEST LOGGING
// ===================================
app.use(httpLogger)

// ===================================
// INPUT SANITIZATION
// (skip multipart so file uploads aren't mangled)
// ===================================
app.use((req, res, next) => {
  if (req.is('multipart/form-data')) return next()
  return sanitizeMongo(req, res, () => {
    sanitizeXSS(req, res, () => {
      preventHPP(req, res, () => {
        trimStrings(req, res, next)
      })
    })
  })
})

// ===================================
// SERVE STATIC UPLOADS (local fallback)
// ===================================
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// ===================================
// RATE LIMITING
// ===================================
app.use('/api', apiLimiter)

// ===================================
// HEALTH CHECK
// ===================================
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose')

  res.status(200).json({
    status: 'OK',
    message: 'JanVoice API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      server: 'running',
      cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'not configured'
    }
  })
})

// ===================================
// ROOT ROUTE
// ===================================
app.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'JanVoice API',
    version: '1.0.0',
    description: 'National Public Complaint & Action Platform',
    documentation: '/api/docs',
    health: '/api/health'
  })
})

// ===================================
// ADMIN ROUTES (hierarchy-aware user creation)
// ===================================
app.use('/api/admin', adminRoutes)

// ===================================
// DEPARTMENT ROUTES ✅
// ===================================
app.use('/api/departments', departmentRoutes)

// ===================================
// UPLOAD ROUTES
// ===================================
app.use('/api/upload', uploadRoutes)

// ===================================
// API ROUTES
// ===================================
app.use('/api', apiRoutes)

// ===================================
// 404 NOT FOUND HANDLER
// ===================================
app.use(notFound)

// ===================================
// GLOBAL ERROR HANDLER
// ===================================
app.use(errorHandler)

// ===================================
// INITIALIZE SERVICES
// ===================================
const initializeServices = async () => {
  try {
    console.log('🔄 Initializing services...')

    await connectDB()
    await verifyEmailConnection()

    if (process.env.REDIS_URL) {
      await initRedis()
    }

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      console.log('☁️  Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME)
    } else {
      console.warn('⚠️  Cloudinary not configured — file uploads will fail')
    }

    console.log('✅ All services initialized')
  } catch (error) {
    console.error('❌ Service initialization failed:', error.message)
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  }
}

// ===================================
// INITIALIZE SOCKET.IO
// ===================================
initSocket(server)
initializeSocketHandlers()

// ===================================
// START BACKGROUND JOBS
// ===================================
const startJobs = () => {
  const jobsEnabled =
    process.env.NODE_ENV === 'production' ||
    process.env.ENABLE_JOBS === 'true'

  if (!jobsEnabled) {
    console.log('ℹ️  Background jobs disabled (set ENABLE_JOBS=true to enable)')
    return
  }

  try {
    console.log('🚀 Starting background jobs...')
    startDeadlineChecker()
    startNotificationSender()
    startDataBackup()
    startReportGenerator()
    console.log('✅ Background jobs running')
  } catch (error) {
    console.error('❌ Failed to start jobs:', error.message)
  }
}

// ===================================
// START SERVER
// ===================================
const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await initializeServices()

    server.listen(PORT, () => {
      console.log('\n' + '='.repeat(60))
      console.log(`🚀 JanVoice API Server`)
      console.log('='.repeat(60))
      console.log(`📡 Port:        ${PORT}`)
      console.log(`🔗 API:         http://localhost:${PORT}/api`)
      console.log(`💚 Health:      http://localhost:${PORT}/api/health`)
      console.log(`🎨 Frontend:    ${process.env.CLIENT_URL || 'http://localhost:5173'}`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`🔌 WebSocket:   Enabled`)
      console.log(`☁️  Cloudinary:  ${process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'not configured'}`)
      console.log('='.repeat(60) + '\n')

      startJobs()
    })

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`)
        process.exit(1)
      } else {
        console.error('❌ Server error:', error.message)
      }
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// ===================================
// GRACEFUL SHUTDOWN
// ===================================
const gracefulShutdown = async (signal) => {
  console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`)

  server.close(async () => {
    console.log('✅ HTTP server closed')

    try {
      if (process.env.REDIS_URL) {
        await disconnectRedis()
      }
      await disconnectDB()
      console.log('✅ All connections closed')
      console.log('👋 Goodbye!\n')
      process.exit(0)
    } catch (error) {
      console.error('❌ Error during shutdown:', error.message)
      process.exit(1)
    }
  })

  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout')
    process.exit(1)
  }, 10000)
}

// ===================================
// PROCESS EVENT HANDLERS
// ===================================
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error)
  logger.logError(error, 'uncaughtException')
  gracefulShutdown('uncaughtException')
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise)
  console.error('   Reason:', reason)
  logger.logError(
    reason instanceof Error ? reason : new Error(String(reason)),
    'unhandledRejection'
  )
})

process.on('warning', (warning) => {
  console.warn('⚠️  Warning:', warning.name, '-', warning.message)
})

// ===================================
// BOOT THE SERVER
// ===================================
startServer()

module.exports = app