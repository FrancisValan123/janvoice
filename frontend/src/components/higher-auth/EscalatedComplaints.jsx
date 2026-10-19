import React, { useState, useEffect } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const EscalatedComplaints = () => {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/authority/dashboard' },
    { icon: '🚨', label: 'Escalated Cases', path: '/authority/escalated' },
    { icon: '📈', label: 'Performance', path: '/authority/performance' },
    { icon: '⏰', label: 'Overdue Review', path: '/authority/overdue' },
    { icon: '🏛️', label: 'Departments', path: '/authority/departments' },
    { icon: '📄', label: 'Action Reports', path: '/authority/reports' },
    { icon: '📊', label: 'Statistics', path: '/authority/statistics' },
    { icon: '💡', label: 'Recommendations', path: '/authority/recommendations' }
  ]

  const [escalated, setEscalated] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('severity')

  // ===================================
  // FETCH REAL DATA
  // ===================================
  useEffect(() => {
    const fetchEscalated = async () => {
      try {
        setLoading(true)
        const res = await api.get('/authority/escalated')
        setEscalated(res.data?.complaints || [])
      } catch (err) {
        console.error('Failed to load escalations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEscalated()
  }, [])

  const getSeverityConfig = (sev) => {
    const map = {
      critical: { label: 'Critical', color: '#C53030', bg: '#FED7D7', icon: '🔴' },
      high: { label: 'High', color: '#9C4221', bg: '#FEEBC8', icon: '🟠' },
      medium: { label: 'Medium', color: '#975A16', bg: '#FEFCBF', icon: '🟡' }
    }
    return map[sev] || map.high
  }

  const getStatusConfig = (status) => {
    const map = {
      'pending-review': { label: 'Pending Review', color: '#E53E3E', bg: '#FED7D7' },
      'under-review': { label: 'Under Review', color: '#ED8936', bg: '#FEEBC8' },
      'action-taken': { label: 'Action Taken', color: '#38A169', bg: '#C6F6D5' }
    }
    return map[status] || map['pending-review']
  }

  const counts = {
    all: escalated.length,
    critical: escalated.filter(e => e.priority === 'emergency').length,
    high: escalated.filter(e => e.priority === 'high').length,
    pending: escalated.filter(e => e.status === 'pending-review').length,
    action: escalated.filter(e => e.status === 'action-taken').length
  }

  let filtered = filter === 'all' ? escalated : escalated.filter(e => 
    (filter === 'critical' && e.priority === 'emergency') ||
    (filter === 'high' && e.priority === 'high') ||
    (filter === 'pending-review' && e.status === 'pending-review') ||
    (filter === 'action-taken' && e.status === 'action-taken')
  )

  if (sortBy === 'days') {
    filtered = [...filtered].sort((a, b) => new Date(a.deadline || Date.now()) - new Date(b.deadline || Date.now()))
  } else if (sortBy === 'severity') {
    const order = { emergency: 0, high: 1, normal: 2, low: 3 }
    filtered = [...filtered].sort((a, b) => (order[a.priority] ?? 4) - (order[b.priority] ?? 4))
  }

  if (loading) {
    return (
      <DashboardLayout role="higher_authority" menuItems={menuItems} title="Escalated Complaints">
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>⏳ Loading escalations...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="higher_authority" menuItems={menuItems} title="Escalated Complaints">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* ✅ FIXED: Added explicit white color to banner text */}
        <div style={{ background: 'linear-gradient(135deg, #742A2A, #C53030)', borderRadius: '20px', padding: '32px', color: 'white', marginBottom: '24px', boxShadow: '0 12px 32px rgba(197, 48, 48, 0.25)' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
            🚨 Escalated Complaints
          </h2>
          <p style={{ fontSize: '15px', opacity: 0.95, color: '#FFFFFF', fontWeight: '500', textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
            Review and take action on cases escalated from department admins
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Total Escalated', value: counts.all, color: '#E53E3E' },
            { label: 'Critical', value: counts.critical, color: '#C53030' },
            { label: 'High Priority', value: counts.high, color: '#F7931E' },
            { label: 'Pending Review', value: counts.pending, color: '#ED8936' },
            { label: 'Action Taken', value: counts.action, color: '#38A169' }
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '16px', marginBottom: '20px', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'critical', label: '🔴 Critical' },
              { id: 'high', label: '🟠 High' },
              { id: 'pending-review', label: '⏳ Pending' },
              { id: 'action-taken', label: '✅ Action Taken' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: '9px 16px', background: filter === tab.id ? 'linear-gradient(135deg, #FF6B35, #F7931E)' : 'var(--bg-surface-secondary)',
                  color: filter === tab.id ? 'white' : 'var(--text-secondary)', border: 'none', borderRadius: '8px', fontWeight: '700',
                  fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '10px 14px', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', background: 'var(--input-bg)' }}
          >
            <option value="severity">Sort: Severity</option>
            <option value="days">Sort: Most Overdue</option>
          </select>
        </div>

        {/* Cases List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.length === 0 ? (
            <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>No Escalated Cases</h3>
              <p style={{ fontSize: '14px' }}>There are no cases currently escalated to higher authority.</p>
            </div>
          ) : (
            filtered.map((c) => {
              const isCritical = c.priority === 'emergency'
              const sev = getSeverityConfig(isCritical ? 'critical' : 'high')
              const status = getStatusConfig(c.status)
              return (
                <div key={c._id} style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow-sm)', borderLeft: `5px solid ${sev.color}`, display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', background: '#1a202c', color: 'white', padding: '3px 10px', borderRadius: '6px', letterSpacing: '0.5px' }}>{c.complaintId || c._id}</span>
                      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: sev.bg, color: sev.color }}>
                        {sev.icon} {sev.label}
                      </span>
                      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>{c.title}</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>🏛️ <strong style={{ color: 'var(--text-secondary)' }}>{c.department}</strong></div>
                      <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>👤 <strong style={{ color: 'var(--text-secondary)' }}>{c.assignedTo?.name || 'Unassigned'}</strong></div>
                      <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>👥 <strong style={{ color: 'var(--text-secondary)' }}>{c.affectedPeople || 1} affected</strong></div>
                    </div>

                    <div style={{ padding: '12px 16px', background: 'rgba(229, 62, 62, 0.05)', borderLeft: '3px solid #E53E3E', borderRadius: '8px', fontSize: '13px', color: '#9B2C2C', fontWeight: '600' }}>
                      ⚠️ Reason: {c.escalationReason || 'Escalated for higher authority review'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '160px' }}>
                    <button style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #C53030, #9B2C2C)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(197, 48, 48, 0.3)' }}>
                      🚨 Take Action
                    </button>
                    <button style={{ padding: '12px 20px', background: 'var(--bg-surface-secondary)', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
                      👁️ View Details
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EscalatedComplaints