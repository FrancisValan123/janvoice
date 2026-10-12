import React, { useState } from 'react'
import AdminLayout from './AdminLayout'

const Backups = () => {
  const [backups, setBackups] = useState([
    { _id: '1', name: 'Auto Backup - 2026-09-26', size: '48.2 MB', type: 'auto', status: 'completed', createdAt: '2026-09-26T02:00:00' },
    { _id: '2', name: 'Manual Backup', size: '47.8 MB', type: 'manual', status: 'completed', createdAt: '2026-09-25T14:30:00' },
    { _id: '3', name: 'Auto Backup - 2026-09-25', size: '47.5 MB', type: 'auto', status: 'completed', createdAt: '2026-09-25T02:00:00' },
    { _id: '4', name: 'Auto Backup - 2026-09-24', size: '47.1 MB', type: 'auto', status: 'completed', createdAt: '2026-09-24T02:00:00' },
    { _id: '5', name: 'Pre-Update Backup', size: '46.9 MB', type: 'manual', status: 'completed', createdAt: '2026-09-23T16:45:00' }
  ])

  const [creating, setCreating] = useState(false)

  const handleCreateBackup = () => {
    setCreating(true)
    setTimeout(() => {
      const now = new Date()
      setBackups([
        {
          _id: String(Date.now()),
          name: `Manual Backup`,
          size: '48.5 MB',
          type: 'manual',
          status: 'completed',
          createdAt: now.toISOString()
        },
        ...backups
      ])
      setCreating(false)
      alert('Backup created successfully!')
    }, 2000)
  }

  const handleRestore = (name) => {
    if (window.confirm(`Restore from "${name}"? This will overwrite current data.`)) {
      alert('Restore in progress...')
    }
  }

  const handleDownload = (name) => {
    alert(`Downloading ${name}...`)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this backup?')) {
      setBackups((prev) => prev.filter((b) => b._id !== id))
    }
  }

  return (
    <AdminLayout title="Backups">
      <div
        style={{
          background: 'white',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
              💾 System Backups
            </h3>
            <p style={{ fontSize: '13px', color: '#718096' }}>
              Manage your database backups and restoration points
            </p>
          </div>
          <button
            onClick={handleCreateBackup}
            disabled={creating}
            style={{
              background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: creating ? 'not-allowed' : 'pointer',
              opacity: creating ? 0.7 : 1,
              boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
            }}
          >
            {creating ? '⏳ Creating...' : '➕ Create New Backup'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {backups.map((backup) => (
            <div
              key={backup._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: '#f7fafc',
                borderRadius: '10px',
                flexWrap: 'wrap'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  background: backup.type === 'auto' ? '#BEE3F8' : '#FEEBC8',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0
                }}
              >
                {backup.type === 'auto' ? '🔄' : '👤'}
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#1a202c',
                    marginBottom: '4px'
                  }}
                >
                  {backup.name}
                </div>
                <div style={{ fontSize: '12px', color: '#718096' }}>
                  {backup.size} • {new Date(backup.createdAt).toLocaleString('en-IN')}
                </div>
              </div>
              <span
                style={{
                  padding: '4px 12px',
                  background: '#c6f6d5',
                  color: '#276749',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '700'
                }}
              >
                ✅ {backup.status}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => handleDownload(backup.name)}
                  style={{
                    padding: '8px 12px',
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  📥 Download
                </button>
                <button
                  onClick={() => handleRestore(backup.name)}
                  style={{
                    padding: '8px 12px',
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Restore
                </button>
                <button
                  onClick={() => handleDelete(backup._id)}
                  style={{
                    padding: '8px 12px',
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: '#E53E3E'
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

export default Backups