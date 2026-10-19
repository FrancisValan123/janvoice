import React, { useState } from 'react'
import './AuditLog.css'

const AuditLog = () => {
  const [logs] = useState([
    { _id: '1', user: 'Francis Valan', role: 'system_admin', action: 'LOGIN', description: 'Logged in from 192.168.1.5', ip: '192.168.1.5', time: '2026-09-26T18:30:00', severity: 'info' },
    { _id: '2', user: 'Officer Ravi', role: 'officer', action: 'RESOLVE_COMPLAINT', description: 'Resolved complaint JV2026045', ip: '192.168.1.12', time: '2026-09-26T18:15:00', severity: 'success' },
    { _id: '3', user: 'Admin Priya', role: 'department_admin', action: 'ASSIGN_OFFICER', description: 'Assigned JV2026050 to Officer Meena', ip: '192.168.1.8', time: '2026-09-26T17:45:00', severity: 'info' },
    { _id: '4', user: 'Unknown', role: 'unknown', action: 'FAILED_LOGIN', description: 'Failed login attempt for admin@janvoice.gov.in', ip: '203.45.67.89', time: '2026-09-26T17:20:00', severity: 'danger' },
    { _id: '5', user: 'System Admin', role: 'system_admin', action: 'CREATE_USER', description: 'Created new officer account', ip: '192.168.1.5', time: '2026-09-26T16:00:00', severity: 'success' },
    { _id: '6', user: 'Francis Valan', role: 'system_admin', action: 'DELETE_USER', description: 'Deleted user kumar@janvoice.gov.in', ip: '192.168.1.5', time: '2026-09-26T15:30:00', severity: 'warning' },
    { _id: '7', user: 'Authority Suresh', role: 'higher_authority', action: 'ESCALATE_CASE', description: 'Escalated JV2026012 to higher authority', ip: '192.168.1.20', time: '2026-09-26T14:15:00', severity: 'warning' },
    { _id: '8', user: 'Citizen Kumar', role: 'citizen', action: 'SUBMIT_COMPLAINT', description: 'Submitted emergency complaint JV2026055', ip: '192.168.1.30', time: '2026-09-26T13:00:00', severity: 'info' }
  ])

  const [search, setSearch] = useState('')
  const [filterAction, setFilterAction] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')

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
    const matchSearch =
      !search ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase())
    const matchAction = filterAction === 'all' || log.action === filterAction
    const matchSeverity = filterSeverity === 'all' || log.severity === filterSeverity
    return matchSearch && matchAction && matchSeverity
  })

  return (
    <div className="dashboard-content">
      <div className="audit-summary">
        <div className="summary-card">
          <div className="summary-value">{logs.length}</div>
          <div className="summary-label">Total Events</div>
        </div>
        <div className="summary-card">
          <div className="summary-value" style={{ color: '#E53E3E' }}>
            {logs.filter((l) => l.severity === 'danger').length}
          </div>
          <div className="summary-label">Security Alerts</div>
        </div>
        <div className="summary-card">
          <div className="summary-value" style={{ color: '#ED8936' }}>
            {logs.filter((l) => l.severity === 'warning').length}
          </div>
          <div className="summary-label">Warnings</div>
        </div>
        <div className="summary-card">
          <div className="summary-value" style={{ color: '#38A169' }}>
            {logs.filter((l) => l.severity === 'success').length}
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
          <button className="btn-secondary">📥 Export CSV</button>
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
                      <strong>{log.user}</strong>
                      <span className="log-role">{log.role}</span>
                    </div>
                    <div className="log-time">{new Date(log.time).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="log-action-badge">{log.action}</div>
                  <div className="log-description">{log.description}</div>
                  <div className="log-ip">🌐 IP: {log.ip}</div>
                </div>
              </div>
            )
          })}

          {filteredLogs.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <p>No logs match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuditLog