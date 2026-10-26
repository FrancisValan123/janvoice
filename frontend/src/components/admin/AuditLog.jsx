import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'
import './AuditLog.css'

const AuditLog = () => {
  const [logs, setLogs] = useState([])
  // ✅ State for the KPI cards
  const [stats, setStats] = useState({ total: 0, danger: 0, warning: 0, success: 0 })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [filterAction, setFilterAction] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')

  // ===================================
  // FETCH REAL DATA
  // ===================================
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        setError('')
        
        // ✅ FIXED: Fetch from /admin/audit-logs (matching backend route)
        const res = await api.get('/admin/audit-logs')
        
        setLogs(res.data?.logs || [])
        
        // ✅ Set the real total stats for the top cards
        if (res.data?.stats) {
          setStats(res.data.stats)
        }

      } catch (err) {
        console.error('Failed to load audit logs:', err)
        setError(err.response?.data?.message || 'Failed to load audit logs from the server.')
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  const getSeverityConfig = (severity) => {
    const config = {
      info: { color: '#4299E1', bg: '#BEE3F8', icon: 'ℹ️' },
      success: { color: '#38A169', bg: '#C6F6D5', icon: '✅' },
      warning: { color: '#ED8936', bg: '#FEEBC8', icon: '⚠️' },
      danger: { color: '#E53E3E', bg: '#FED7D7', icon: '❌' }
    }
    return config[severity] || config.info
  }

  const actions = [...new Set(logs.map((l) => l.action))]

  const filteredLogs = logs.filter((log) => {
    const userName = log.user?.name || 'Unknown'
    const description = log.description || ''
    
    const matchSearch =
      !search ||
      userName.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase())
      
    const matchAction = filterAction === 'all' || log.action === filterAction
    const matchSeverity = filterSeverity === 'all' || log.severity === filterSeverity
    
    return matchSearch && matchAction && matchSeverity
  })

  const handleExportCSV = () => {
    if (logs.length === 0) return alert('No logs to export')
    
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Description', 'IP Address', 'Severity']
    const csvRows = logs.map(l => 
      `"${new Date(l.createdAt).toLocaleString()}","${l.user?.name || 'Unknown'}","${l.user?.role || 'N/A'}","${l.action}","${l.description}","${l.ip || 'N/A'}","${l.severity}"`
    )
    const csvString = [headers.join(','), ...csvRows].join('\n')

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Audit_Log_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Loading audit logs...</div>
  }

  return (
    <div className="dashboard-content">
      
      {error && (
        <div style={{ background: 'rgba(229, 62, 62, 0.1)', color: '#C53030', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* KPI Summary using real stats */}
      <div className="audit-summary">
        <div className="summary-card">
          <div className="summary-value">{stats.total}</div>
          <div className="summary-label">Total Events</div>
        </div>
        <div className="summary-card">
          <div className="summary-value" style={{ color: '#E53E3E' }}>
            {stats.danger}
          </div>
          <div className="summary-label">Security Alerts</div>
        </div>
        <div className="summary-card">
          <div className="summary-value" style={{ color: '#ED8936' }}>
            {stats.warning}
          </div>
          <div className="summary-label">Warnings</div>
        </div>
        <div className="summary-card">
          <div className="summary-value" style={{ color: '#38A169' }}>
            {stats.success}
          </div>
          <div className="summary-label">Success</div>
        </div>
      </div>

      <div className="audit-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">📋 System Activity Log</h3>
            <p className="card-subtitle">Track all system and user activities</p>
          </div>
          <button className="btn-secondary" onClick={handleExportCSV}>
            📥 Export CSV
          </button>
        </div>

        <div className="filters-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search user or action..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="filter-select" value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
            <option value="all">All Actions</option>
            {actions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select className="filter-select" value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
            <option value="all">All Severities</option>
            <option value="info">ℹ️ Info</option>
            <option value="success">✅ Success</option>
            <option value="warning">⚠️ Warning</option>
            <option value="danger">❌ Danger</option>
          </select>
        </div>

        <div className="log-list">
          {filteredLogs.map((log) => {
            const sev = getSeverityConfig(log.severity)
            return (
              <div key={log._id} className="log-item">
                <div className="log-severity" style={{ background: sev.bg, color: sev.color }}>
                  {sev.icon}
                </div>
                <div className="log-main">
                  <div className="log-header">
                    <div className="log-user">
                      <strong>{log.user?.name || 'System / Unknown'}</strong>
                      <span className="log-role">{log.user?.role || 'N/A'}</span>
                    </div>
                    <div className="log-time">{new Date(log.createdAt).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="log-action-badge">{log.action}</div>
                  <div className="log-description">{log.description || 'No description provided'}</div>
                  <div className="log-ip">🌐 IP: {log.ip || 'Unknown'}</div>
                </div>
              </div>
            )
          })}

          {filteredLogs.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <p>No logs match your filters or no activity exists yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuditLog