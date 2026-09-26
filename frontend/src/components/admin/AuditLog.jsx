import React, { useState, useMemo } from 'react'
import './AuditLog.css'

const AuditLog = () => {
  const [logs] = useState([
    { id: 1, user: 'Admin Priya', role: 'system_admin', action: 'Created user', target: 'Officer Ravi Kumar', type: 'create', timestamp: '2026-09-26 11:45:22', ip: '192.168.1.45' },
    { id: 2, user: 'Officer Ravi', role: 'officer', action: 'Resolved complaint', target: '#JV2026088', type: 'update', timestamp: '2026-09-26 11:32:10', ip: '192.168.1.78' },
    { id: 3, user: 'Citizen Kumar', role: 'citizen', action: 'Submitted complaint', target: '#JV2026095 (Emergency)', type: 'create', timestamp: '2026-09-26 11:15:45', ip: '10.0.5.22' },
    { id: 4, user: 'Dept Head Suresh', role: 'department_admin', action: 'Escalated case', target: '#JV2026089', type: 'warning', timestamp: '2026-09-26 10:58:33', ip: '192.168.1.102' },
    { id: 5, user: 'System', role: 'system', action: 'Automated backup', target: 'Database (47 GB)', type: 'info', timestamp: '2026-09-26 10:00:00', ip: 'localhost' },
    { id: 6, user: 'Admin Priya', role: 'system_admin', action: 'Deleted category', target: '"Old Category"', type: 'delete', timestamp: '2026-09-26 09:45:12', ip: '192.168.1.45' },
    { id: 7, user: 'Officer Deepa', role: 'officer', action: 'Updated status', target: '#JV2026090 → Resolved', type: 'update', timestamp: '2026-09-26 09:22:08', ip: '192.168.1.88' },
    { id: 8, user: 'Admin Priya', role: 'system_admin', action: 'Changed system settings', target: 'Email SLA: 24h → 12h', type: 'update', timestamp: '2026-09-26 08:55:41', ip: '192.168.1.45' },
    { id: 9, user: 'Citizen Anitha', role: 'citizen', action: 'Login failed', target: 'Invalid password', type: 'danger', timestamp: '2026-09-26 08:30:15', ip: '10.0.5.42' },
    { id: 10, user: 'Officer Suresh', role: 'officer', action: 'Uploaded evidence', target: '#JV2026091', type: 'create', timestamp: '2026-09-26 08:12:55', ip: '192.168.1.75' }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterDate, setFilterDate] = useState('all')

  const typeConfig = {
    create: { icon: '➕', label: 'Created', color: '#38A169' },
    update: { icon: '✏️', label: 'Updated', color: '#4299E1' },
    delete: { icon: '🗑️', label: 'Deleted', color: '#E53E3E' },
    warning: { icon: '⚠️', label: 'Warning', color: '#F7931E' },
    danger: { icon: '🚨', label: 'Alert', color: '#E53E3E' },
    info: { icon: 'ℹ️', label: 'Info', color: '#805AD5' }
  }

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchesSearch =
        l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.target.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || l.type === filterType
      return matchesSearch && matchesType
    })
  }, [logs, searchTerm, filterType])

  const stats = useMemo(() => ({
    total: logs.length,
    creates: logs.filter((l) => l.type === 'create').length,
    updates: logs.filter((l) => l.type === 'update').length,
    alerts: logs.filter((l) => l.type === 'danger' || l.type === 'warning').length
  }), [logs])

  return (
    <div className="audit-log">
      <div className="page-header">
        <div>
          <h2>📋 Audit Logs</h2>
          <p>Track all system activity</p>
        </div>
        <button className="btn-export">
          <span>📥</span> Export CSV
        </button>
      </div>

      <div className="quick-stats">
        <div className="quick-stat">
          <span className="qs-icon">📋</span>
          <div>
            <div className="qs-value">{stats.total}</div>
            <div className="qs-label">Total Logs</div>
          </div>
        </div>
        <div className="quick-stat">
          <span className="qs-icon">➕</span>
          <div>
            <div className="qs-value">{stats.creates}</div>
            <div className="qs-label">Created</div>
          </div>
        </div>
        <div className="quick-stat">
          <span className="qs-icon">✏️</span>
          <div>
            <div className="qs-value">{stats.updates}</div>
            <div className="qs-label">Updated</div>
          </div>
        </div>
        <div className="quick-stat">
          <span className="qs-icon">⚠️</span>
          <div>
            <div className="qs-value">{stats.alerts}</div>
            <div className="qs-label">Alerts</div>
          </div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search by user, action or target..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="create">➕ Created</option>
          <option value="update">✏️ Updated</option>
          <option value="delete">🗑️ Deleted</option>
          <option value="warning">⚠️ Warning</option>
          <option value="danger">🚨 Alert</option>
          <option value="info">ℹ️ Info</option>
        </select>

        <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="timeline">
        {filteredLogs.map((log) => {
          const t = typeConfig[log.type]
          return (
            <div key={log.id} className="timeline-item">
              <div className="timeline-dot" style={{ background: t.color }}>
                {t.icon}
              </div>
              <div className="timeline-card">
                <div className="timeline-header">
                  <div>
                    <span className="log-user">{log.user}</span>
                    <span className="log-role">{log.role.replace('_', ' ')}</span>
                  </div>
                  <span className="log-time">{log.timestamp}</span>
                </div>
                <div className="timeline-body">
                  <span className="log-action">{log.action}:</span>{' '}
                  <span className="log-target">{log.target}</span>
                </div>
                <div className="timeline-footer">
                  <span className={`type-badge type-${log.type}`} style={{ background: `${t.color}20`, color: t.color }}>
                    {t.label}
                  </span>
                  <span className="log-ip">🌐 {log.ip}</span>
                </div>
              </div>
            </div>
          )
        })}

        {filteredLogs.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>No activity logs found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuditLog