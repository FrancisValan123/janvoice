/* ===================================
   JANVOICE — LOGGER (Winston)
   Centralized logging utility
   =================================== */

const winston = require('winston')
const path = require('path')

// ===================================
// LOG DIRECTORY
// ===================================
const LOG_DIR = path.join(__dirname, '../../logs')

// ===================================
// FORMATS
// ===================================
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? `\n${JSON.stringify(meta, null, 2)}`
      : ''
    return `[${timestamp}] ${level}: ${message}${metaStr}`
  })
)

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

// ===================================
// TRANSPORTS
// ===================================
const consoleTransport = new winston.transports.Console({
  format: consoleFormat,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
})

const errorTransport = new winston.transports.File({
  filename: path.join(LOG_DIR, 'error.log'),
  level: 'error',
  format: fileFormat,
  maxsize: 20 * 1024 * 1024,
  maxFiles: 30
})

const combinedTransport = new winston.transports.File({
  filename: path.join(LOG_DIR, 'combined.log'),
  format: fileFormat,
  maxsize: 20 * 1024 * 1024,
  maxFiles: 30
})

const accessTransport = new winston.transports.File({
  filename: path.join(LOG_DIR, 'access.log'),
  level: 'http',
  format: fileFormat,
  maxsize: 20 * 1024 * 1024,
  maxFiles: 30
})

// ===================================
// CREATE LOGGER
// ===================================
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: winston.config.npm.levels,
  format: fileFormat,
  defaultMeta: { service: 'janvoice-api' },
  transports: [consoleTransport, errorTransport, combinedTransport],
  exitOnError: false
})

logger.add(accessTransport)

// ===================================
// HELPER METHODS
// ===================================
logger.logRequest = (req, res, responseTime) => {
  logger.http('HTTP Request', {
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    responseTime: `${responseTime}ms`,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    userId: req.user?.id || null
  })
}

logger.logError = (error, context = '') => {
  logger.error(error.message, {
    context,
    stack: error.stack,
    statusCode: error.statusCode || 500
  })
}

logger.logAudit = (action, user, details = {}) => {
  logger.info(`Audit: ${action}`, {
    action,
    userId: user?.id,
    userName: user?.name,
    email: user?.email,
    ...details,
    timestamp: new Date().toISOString()
  })
}

logger.logDb = (operation, collection, details = {}) => {
  logger.debug(`DB: ${operation} ${collection}`, details)
}

logger.stream = {
  write: (message) => {
    logger.http(message.trim())
  }
}

module.exports = logger