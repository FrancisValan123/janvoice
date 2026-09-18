const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')

dotenv.config()

const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/janvoice')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message))

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'JanVoice API is running',
    timestamp: new Date().toISOString()
  })
})

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to JanVoice API' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 API available at http://localhost:${PORT}/api`)
  console.log(`🔗 Frontend at http://localhost:5173`)
})