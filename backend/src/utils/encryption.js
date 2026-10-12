/* ===================================
   JANVOICE — ENCRYPTION UTILITIES
   Hashing, encryption, secure comparisons
   =================================== */

const crypto = require('crypto')
const bcrypt = require('bcryptjs')

// ===================================
// CONFIGURATION
// ===================================
const CONFIG = {
  SALT_ROUNDS: 10,
  ENCRYPTION_ALGORITHM: 'aes-256-cbc',
  HASH_ALGORITHM: 'sha256',
  IV_LENGTH: 16
}

// ===================================
// ENCRYPTION KEY
// ===================================
const getEncryptionKey = () => {
  const secret = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET
  if (!secret) {
    throw new Error('ENCRYPTION_KEY or JWT_SECRET must be set')
  }
  // Ensure 32-byte key for AES-256
  return crypto.createHash('sha256').update(secret).digest()
}

// ===================================
// PASSWORD HASHING (bcrypt)
// ===================================
const hashPassword = async (password) => {
  if (!password) throw new Error('Password is required')
  const salt = await bcrypt.genSalt(CONFIG.SALT_ROUNDS)
  return bcrypt.hash(password, salt)
}

const comparePassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) return false
  return bcrypt.compare(password, hashedPassword)
}

// ===================================
// HASHING (SHA-256)
// ===================================
const hash = (data, algorithm = CONFIG.HASH_ALGORITHM) => {
  if (typeof data !== 'string') data = JSON.stringify(data)
  return crypto.createHash(algorithm).update(data).digest('hex')
}

const hashSHA256 = (data) => hash(data, 'sha256')
const hashMD5 = (data) => hash(data, 'md5')
const hashSHA512 = (data) => hash(data, 'sha512')

// ===================================
// AES ENCRYPTION
// ===================================
const encrypt = (text) => {
  if (!text) return text
  try {
    const key = getEncryptionKey()
    const iv = crypto.randomBytes(CONFIG.IV_LENGTH)
    const cipher = crypto.createCipheriv(CONFIG.ENCRYPTION_ALGORITHM, key, iv)

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return `${iv.toString('hex')}:${encrypted}`
  } catch (error) {
    console.error('Encryption error:', error.message)
    return null
  }
}

const decrypt = (encryptedText) => {
  if (!encryptedText) return encryptedText
  try {
    const parts = encryptedText.split(':')
    if (parts.length !== 2) return null

    const [ivHex, encrypted] = parts
    const key = getEncryptionKey()
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv(CONFIG.ENCRYPTION_ALGORITHM, key, iv)

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('Decryption error:', error.message)
    return null
  }
}

// ===================================
// HMAC (Message Authentication)
// ===================================
const createHMAC = (data, secret = null) => {
  const key = secret || process.env.JWT_SECRET
  if (!key) throw new Error('Secret key required for HMAC')
  return crypto.createHmac('sha256', key).update(data).digest('hex')
}

const verifyHMAC = (data, signature, secret = null) => {
  const expected = createHMAC(data, secret)
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  )
}

// ===================================
// RANDOM GENERATORS
// ===================================
const generateRandomBytes = (length = 32) => {
  return crypto.randomBytes(length).toString('hex')
}

const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const bytes = crypto.randomBytes(length)
  for (let i = 0; i < length; i++) {
    result += chars.charAt(bytes[i] % chars.length)
  }
  return result
}

const generateNumericOTP = (length = 6) => {
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(0, 10).toString()
  }
  return otp
}

const generateSecureUUID = () => crypto.randomUUID()

// ===================================
// SECURE COMPARISON
// ===================================
const secureCompare = (a, b) => {
  try {
    const bufA = Buffer.from(String(a))
    const bufB = Buffer.from(String(b))
    if (bufA.length !== bufB.length) return false
    return crypto.timingSafeEqual(bufA, bufB)
  } catch {
    return false
  }
}

// ===================================
// MASKING (for logs)
// ===================================
const maskEmail = (email) => {
  if (!email) return ''
  const [user, domain] = email.split('@')
  if (!domain) return email
  if (user.length <= 2) return `${user[0]}***@${domain}`
  return `${user.slice(0, 2)}${'*'.repeat(user.length - 3)}${user.slice(-1)}@${domain}`
}

const maskPhone = (phone) => {
  if (!phone) return ''
  const digits = String(phone).replace(/\D/g, '')
  if (digits.length < 4) return '****'
  return `******${digits.slice(-4)}`
}

const maskAadhar = (aadhar) => {
  if (!aadhar) return ''
  const digits = String(aadhar).replace(/\D/g, '')
  if (digits.length < 4) return '****'
  return `XXXX-XXXX-${digits.slice(-4)}`
}

// ===================================
// JWT-COMPATIBLE HELPERS
// ===================================
const generateResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex')
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
  return { token, hashedToken }
}

const hashResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

module.exports = {
  // Password
  hashPassword,
  comparePassword,
  // Hashing
  hash,
  hashSHA256,
  hashMD5,
  hashSHA512,
  // Encryption
  encrypt,
  decrypt,
  createHMAC,
  verifyHMAC,
  // Random
  generateRandomBytes,
  generateRandomString,
  generateNumericOTP,
  generateSecureUUID,
  // Compare
  secureCompare,
  // Masking
  maskEmail,
  maskPhone,
  maskAadhar,
  // Token
  generateResetToken,
  hashResetToken,
  // Config
  CONFIG
}