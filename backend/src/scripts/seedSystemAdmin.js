/* ===================================
   JANVOICE — SEED SYSTEM ADMIN
   Run: node src/scripts/seedSystemAdmin.js
   Creates the default System Admin account
   =================================== */

require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

const DEFAULT_SYSTEM_ADMIN = {
  name: process.env.SYSTEM_ADMIN_NAME || 'System Administrator',
  email: process.env.SYSTEM_ADMIN_EMAIL || 'admin@janvoice.gov.in',
  password: process.env.SYSTEM_ADMIN_PASSWORD || 'Admin@JanVoice2026',
  phone: process.env.SYSTEM_ADMIN_PHONE || '9999999999',
  role: 'system_admin',
  isActive: true,
  isVerified: true
}

const seedSystemAdmin = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI)
    console.log('✅ Connected')

    // Check if a system admin already exists
    const existing = await User.findOne({ role: 'system_admin' })
    if (existing) {
      console.log('ℹ️  A System Admin already exists:')
      console.log(`   📧 ${existing.email}`)
      console.log(`   👤 ${existing.name}`)
      console.log('   Skipping seed to avoid overwriting.')
      console.log('   If you want to reset, delete the existing admin first.')
      process.exit(0)
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(DEFAULT_SYSTEM_ADMIN.password, salt)

    // Create the admin
    const admin = await User.create({
      name: DEFAULT_SYSTEM_ADMIN.name,
      email: DEFAULT_SYSTEM_ADMIN.email,
      password: hashedPassword,
      phone: DEFAULT_SYSTEM_ADMIN.phone,
      role: DEFAULT_SYSTEM_ADMIN.role,
      isActive: true,
      isVerified: true
    })

    console.log('\n🎉 Default System Admin created successfully!\n')
    console.log('='.repeat(50))
    console.log('  📧 Email:    ', DEFAULT_SYSTEM_ADMIN.email)
    console.log('  🔐 Password: ', DEFAULT_SYSTEM_ADMIN.password)
    console.log('  👤 Name:     ', DEFAULT_SYSTEM_ADMIN.name)
    console.log('  🎭 Role:     ', 'system_admin')
    console.log('='.repeat(50))
    console.log('\n⚠️  IMPORTANT: Change this password immediately after first login!\n')

    process.exit(0)
  } catch (err) {
    console.error('❌ Seed error:', err.message)
    process.exit(1)
  }
}

seedSystemAdmin()