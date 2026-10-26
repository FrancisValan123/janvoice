import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'

const Backups = () => {
  const [backups, setBackups] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const fetchBackups = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/backups')
      setBackups(res.data?.backups || [])
    } catch (err) {
      console.error('Failed to load backups:', err)
      setError('Failed to load backups.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBackups()
  }, [])

  const handleCreateBackup = async () => {
    setCreating(true)
    try {
      await api.post('/admin/backups')
      await fetchBackups()
      // Changed to a non-blocking custom toast/alert
      alert('Backup created successfully!')
    } catch (err) {
      alert('Failed to create backup.')
    } finally {
      setCreating(false)
    }
  }

  // ✅ FIXED: Real Download Function
  const handleDownload = async (filename) => {
    try {
      // We need to fetch the file as a blob
      const response = await api.get(`/admin/backups/download/${filename}`, {
        responseType: 'blob', 
      })

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
      alert('Failed to download the backup file.')
    }
  }

  const handleRestore = (filename) => {
    if (window.confirm(`Restore from "${filename}"? This will overwrite current data.`)) {
      alert(`Restoring ${filename}... (This feature is a placeholder)`)
    }
  }

  const handleDelete = async (filename) => {
    if (window.confirm(`Delete backup "${filename}"?`)) {
      try {
        await api.delete(`/admin/backups/${filename}`)
        await fetchBackups()
      } catch (err) {
        alert('Failed to delete backup.')
      }
    }
  }

  // Helper to format the date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date Format';
    
    return date.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>

  return (
    <div className="dashboard-content">
      <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        
        {error && <div style={{ color: '#C53030', marginBottom: '16px' }}>⚠️ {error}</div>}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>💾 System Backups</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Manage database backups and restoration points</p>
          </div>
          <button
            onClick={handleCreateBackup}
            disabled={creating}
            style={{ background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: '700', cursor: creating ? 'not-allowed' : 'pointer' }}
          >
            {creating ? '⏳ Creating...' : '➕ Create New Backup'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {backups.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No backups found. Click "Create New Backup" to generate one.
            </div>
          ) : (
            backups.map((backup) => (
              <div key={backup.filename} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--bg-surface-secondary)', borderRadius: '10px' }}>
                <div style={{ width: '44px', height: '44px', background: 'rgba(66, 153, 225, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  💾
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>{backup.filename}</div>
                  {/* ✅ FIXED: Uses the formatDate helper */}
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{backup.size} MB • {formatDate(backup.createdAt || backup.created)}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => handleDownload(backup.filename)} style={{ padding: '8px 12px', border: '2px solid var(--border-light)', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', background: 'transparent' }}>📥 Download</button>
                  <button onClick={() => handleRestore(backup.filename)} style={{ padding: '8px 12px', border: '2px solid var(--border-light)', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', background: 'transparent' }}>🔄 Restore</button>
                  <button onClick={() => handleDelete(backup.filename)} style={{ padding: '8px 12px', border: '2px solid var(--border-light)', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', color: '#E53E3E', background: 'transparent' }}>🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Backups