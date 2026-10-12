/* ===================================
   JANVOICE — REDIS CONFIGURATION (Optional)
   =================================== */

let redisClient = null

const createRedisClient = () => {
  if (!process.env.REDIS_URL) {
    console.warn('⚠️  Redis not configured — skipping')
    return null
  }

  try {
    const redis = require('redis')
    redisClient = redis.createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 5) return new Error('Redis reconnect failed')
          return Math.min(retries * 100, 3000)
        }
      }
    })

    redisClient.on('connect', () => console.log('🔗 Redis connecting...'))
    redisClient.on('ready', () => console.log('✅ Redis connected'))
    redisClient.on('error', (err) =>
      console.error('❌ Redis error:', err.message)
    )
    redisClient.on('end', () => console.warn('⚠️  Redis closed'))

    return redisClient
  } catch (error) {
    console.warn('⚠️  Redis not available:', error.message)
    return null
  }
}

const initRedis = async () => {
  redisClient = createRedisClient()
  if (redisClient) {
    try {
      await redisClient.connect()
    } catch (err) {
      console.warn('⚠️  Redis connection failed')
    }
  }
  return redisClient
}

const disconnectRedis = async () => {
  if (redisClient && redisClient.isReady) {
    try {
      await redisClient.quit()
      console.log('🔒 Redis disconnected')
    } catch (err) {
      console.error('Redis disconnect error:', err.message)
    }
  }
}

const getRedisClient = () => redisClient

module.exports = {
  initRedis,
  disconnectRedis,
  getRedisClient
}