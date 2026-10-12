/* ===================================
   JANVOICE — DATA BACKUP JOB
   Runs daily at 2:00 AM IST
   - Backs up all MongoDB collections to JSON
   - Cleans up backups older than 30 days
   =================================== */

const cron = require('node-cron')
const fs = require('fs').promises
const path = require('path')
const mongoose = require('mongoose')

// ===================================
// CONFIGURATION
// ===================================
const CONFIG = {
  BACKUP_DIR: path.join(__dirname, '../../backups'),
  RETENTION_DAYS: 30,
  COLLECTIONS: [
    'users',
    'complaints',
    'notifications',
    'auditlogs',
    'feedbacks',
    'departments',
    'categories',
    'escalations'
  ]
}

// ===================================
// ENSURE BACKUP DIRECTORY EXISTS
// ===================================
const ensureBackupDir = async () => {
  try {
    await fs.access(CONFIG.BACKUP_DIR)
  } catch {
    await fs.mkdir(CONFIG.BACKUP_DIR, { recursive: true })
    console.log(`📁 Created backup directory: ${CONFIG.BACKUP_DIR}`)
  }
}

// ===================================
// CREATE BACKUP
// ===================================
const runBackup = async () => {
  const startTime = Date.now()
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, 19)
  const filename = `janvoice-backup-${timestamp}.json`
  const filepath = path.join(CONFIG.BACKUP_DIR, filename)

  console.log('💾 Starting backup...')

  try {
    await ensureBackupDir()

    const db = mongoose.connection.db
    const backupData = {
      metadata: {
        app: 'JanVoice',
        version: '1.0.0',
        backupDate: new Date().toISOString(),
        database: db.databaseName,
        environment: process.env.NODE_ENV,
        collections: []
      },
      data: {}
    }

    let totalRecords = 0

    for (const collectionName of CONFIG.COLLECTIONS) {
      try {
        const docs = await db.collection(collectionName).find({}).toArray()

        // Remove sensitive fields
        const sanitized = docs.map((doc) => {
          if (doc.password) delete doc.password
          if (doc.resetPasswordToken) delete doc.resetPasswordToken
          if (doc.verificationToken) delete doc.verificationToken
          return doc
        })

        backupData.data[collectionName] = sanitized
        backupData.metadata.collections.push({
          name: collectionName,
          count: sanitized.length
        })

        totalRecords += sanitized.length
        console.log(`   ✓ ${collectionName}: ${sanitized.length} records`)
      } catch (err) {
        console.warn(`   ⚠️  ${collectionName}: skipped (${err.message})`)
      }
    }

    backupData.metadata.totalRecords = totalRecords

    // Write file
    await fs.writeFile(filepath, JSON.stringify(backupData, null, 2), 'utf8')

    const stats = await fs.stat(filepath)
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2)
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    console.log(`✅ Backup complete in ${duration}s`)
    console.log(`   File: ${filename}`)
    console.log(`   Size: ${sizeMB} MB`)
    console.log(`   Records: ${totalRecords}`)

    return { success: true, filename, sizeMB, totalRecords }
  } catch (error) {
    console.error('❌ Backup failed:', error)
    return { success: false, error: error.message }
  }
}

// ===================================
// CLEANUP OLD BACKUPS
// ===================================
const cleanupOldBackups = async () => {
  try {
    await ensureBackupDir()

    const files = await fs.readdir(CONFIG.BACKUP_DIR)
    const cutoff = Date.now() - CONFIG.RETENTION_DAYS * 24 * 60 * 60 * 1000
    let deleted = 0

    for (const file of files) {
      if (!file.startsWith('janvoice-backup-')) continue

      const filepath = path.join(CONFIG.BACKUP_DIR, file)
      const stats = await fs.stat(filepath)

      if (stats.mtimeMs < cutoff) {
        await fs.unlink(filepath)
        deleted++
      }
    }

    if (deleted > 0) {
      console.log(`🧹 Deleted ${deleted} old backups (>${CONFIG.RETENTION_DAYS} days)`)
    }

    return deleted
  } catch (error) {
    console.error('Cleanup failed:', error.message)
    return 0
  }
}

// ===================================
// LIST BACKUPS
// ===================================
const listBackups = async () => {
  try {
    await ensureBackupDir()
    const files = await fs.readdir(CONFIG.BACKUP_DIR)

    const backups = []
    for (const file of files) {
      if (!file.startsWith('janvoice-backup-')) continue
      const filepath = path.join(CONFIG.BACKUP_DIR, file)
      const stats = await fs.stat(filepath)
      backups.push({
        filename: file,
        size: (stats.size / 1024 / 1024).toFixed(2),
        created: stats.mtime
      })
    }

    return backups.sort((a, b) => b.created - a.created)
  } catch {
    return []
  }
}

// ===================================
// MAIN JOB RUNNER
// ===================================
const runDataBackup = async () => {
  const result = await runBackup()
  await cleanupOldBackups()
  return result
}

// ===================================
// SCHEDULE THE JOB
// ===================================
const startDataBackup = () => {
  // Run daily at 2:00 AM IST
  cron.schedule('0 2 * * *', runDataBackup, {
    timezone: 'Asia/Kolkata'
  })

  console.log('✅ Data backup scheduled (daily at 2 AM IST)')
}

module.exports = {
  startDataBackup,
  runDataBackup,
  runBackup,
  listBackups,
  cleanupOldBackups
}