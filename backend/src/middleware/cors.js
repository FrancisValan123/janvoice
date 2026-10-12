/* ===================================
   JANVOICE — CORS MIDDLEWARE
   =================================== */

const cors = require('cors')

const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ]

  if (process.env.CLIENT_URL) origins.push(process.env.CLIENT_URL)

  if (process.env.ADDITIONAL_ORIGINS) {
    const extra = process.env.ADDITIONAL_ORIGINS.split(',').map((o) => o.trim())
    origins.push(...extra)
  }

  return origins
}

const ALLOWED_ORIGINS = getAllowedOrigins()

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`🚫 CORS blocked: ${origin}`)
      callback(new Error(`CORS: Origin not allowed`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Length', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 24 * 60 * 60,
  preflightContinue: false,
  optionsSuccessStatus: 204
}

module.exports = {
  corsMiddleware: cors(corsOptions),
  corsOptions,
  devCors: cors({ origin: true, credentials: true }),
  ALLOWED_ORIGINS
}