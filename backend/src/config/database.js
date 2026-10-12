/* ===================================
   JANVOICE — DATABASE CONFIGURATION
   MongoDB Atlas connection via Mongoose
   =================================== */

const mongoose = require('mongoose')

const connectionOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI,
      connectionOptions
    )

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
    return conn
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    } else {
      console.warn('⚠️  Continuing without DB (development mode)')
      return null
    }
  }
}

mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message)
})

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  Mongoose disconnected from MongoDB')
})

const disconnectDB = async () => {
  try {
    await mongoose.connection.close()
    console.log('🔒 MongoDB disconnected successfully')
  } catch (error) {
    console.error('❌ Error disconnecting MongoDB:', error.message)
  }
}

const checkDBHealth = () => {
  const state = mongoose.connection.readyState
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }
  return {
    status: states[state] || 'unknown',
    isHealthy: state === 1
  }
}

module.exports = {
  connectDB,
  disconnectDB,
  checkDBHealth,
  connection: mongoose.connection
}