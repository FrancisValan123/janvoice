/* ===================================
   JANVOICE — BACKUP SERVICE
   Database backup & restore utilities
   =================================== */

const fs = require('fs').promises
const path = require('path')
const mongoose = require('mongoose')
const logger = require('../utils/logger')

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
// ENSURE BACKUP DIR
// ===================================
const ensureBackupDir = async () => {
  try {
    await fs.access(CONFIG.BACKUP_DIR)
  } catch {
    await fs.mkdir(CONFIG.BACKUP_DIR, { recursive: true })
  }
}

// ===================================
// CREATE BACKUP
// ===================================
const createBackup = async (options = {}) => {
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
    const collections = options.collections || CONFIG.COLLECTIONS

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

    for (const collectionName of collections) {
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

    // Write backup file
    await fs.writeFile(filepath, JSON.stringify(backupData, null, 2), 'utf8')

    const stats = await fs.stat(filepath)
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2)
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    console.log(`✅ Backup complete in ${duration}s`)
    console.log(`   File: ${filename}`)
    console.log(`   Size: ${sizeMB} MB`)
    console.log(`   Records: ${totalRecords}`)

    return {
      success: true,
      filename,
      filepath,
      sizeMB: parseFloat(sizeMB),
      totalRecords,
      duration: parseFloat(duration),
      collections: backupData.metadata.collections
    }
  } catch (error) {
    logger.logError(error, 'backupService.createBackup')
    return { success: false, error: error.message }
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
        sizeBytes: stats.size,
        createdAt: stats.mtime,
        age: Math.floor((Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24))
      })
    }

    return backups.sort((a, b) => b.createdAt - a.createdAt)
  } catch (error) {
    logger.logError(error, 'backupService.listBackups')
    return []
  }
}

// ===================================
// GET BACKUP FILE
// ===================================
const getBackupFile = async (filename) => {
  try {
    const filepath = path.join(CONFIG.BACKUP_DIR, filename)
    const content = await fs.readFile(filepath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    logger.logError(error, `backupService.getBackupFile(${filename})`)
    throw new Error('Backup file not found')
  }
}

// ===================================
// RESTORE FROM BACKUP
// ===================================
const restoreBackup = async (filename, options = {}) => {
  const { dropExisting = false, collections = null } = options

  try {
    const backup = await getBackupFile(filename)
    const db = mongoose.connection.db

    const targetCollections = collections || Object.keys(backup.data)
    const results = []

    for (const collectionName of targetCollections) {
      if (!backup.data[collectionName]) continue

      const docs = backup.data[collectionName]

      try {
        if (dropExisting) {
          await db.collection(collectionName).deleteMany({})
        }

        if (docs.length > 0) {
          await db.collection(collectionName).insertMany(docs, {
            ordered: false
          })
        }

        results.push({
          collection: collectionName,
          restored: docs.length,
          status: 'success'
        })
        console.log(`   ✓ Restored ${collectionName}: ${docs.length} records`)
      } catch (err) {
        results.push({
          collection: collectionName,
          status: 'failed',
          error: err.message
        })
        console.warn(`   ⚠️  Failed to restore ${collectionName}: ${err.message}`)
      }
    }

    console.log(`✅ Restore complete`)

    return { success: true, results }
  } catch (error) {
    logger.logError(error, `backupService.restoreBackup(${filename})`)
    return { success: false, error: error.message }
  }
}

// ===================================
// DELETE BACKUP
// ===================================
const deleteBackup = async (filename) => {
  try {
    const filepath = path.join(CONFIG.BACKUP_DIR, filename)
    await fs.unlink(filepath)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ===================================
// CLEANUP OLD BACKUPS
// ===================================
const cleanupOldBackups = async (daysToKeep = CONFIG.RETENTION_DAYS) => {
  try {
    await ensureBackupDir()
    const files = await fs.readdir(CONFIG.BACKUP_DIR)
    const cutoff = Date.now() - daysToKeep * 24 * 60 * 60 * 1000
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
      console.log(`🧹 Deleted ${deleted} old backups (older than ${daysToKeep} days)`)
    }

    return { deleted, daysToKeep }
  } catch (error) {
    logger.logError(error, 'backupService.cleanupOldBackups')
    return { deleted: 0, error: error.message }
  }
}

// ===================================
// GET BACKUP STATS
// ===================================
const getBackupStats = async () => {
  const backups = await listBackups()

  const totalSize = backups.reduce((sum, b) => sum + b.sizeBytes, 0)
  const avgSize = backups.length > 0 ? totalSize / backups.length : 0

  return {
    totalBackups: backups.length,
    totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
    avgSizeMB: (avgSize / 1024 / 1024).toFixed(2),
    oldest: backups[backups.length - 1]?.createdAt || null,
    newest: backups[0]?.createdAt || null
  }
}

module.exports = {
  createBackup,
  listBackups,
  getBackupFile,
  restoreBackup,
  deleteBackup,
  cleanupOldBackups,
  getBackupStats,
  CONFIG
}