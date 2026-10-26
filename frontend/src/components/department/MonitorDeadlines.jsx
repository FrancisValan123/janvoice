import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' // ✅ Import useNavigate
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const MonitorDeadlines = () => {
  const navigate = useNavigate() // ✅ Initialize navigate

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/department/dashboard' },
    { icon: '👥', label: 'Assign Officers', path: '/department/assign' },
    { icon: '⏰', label: 'Monitor Deadlines', path: '/department/deadlines' },
    { icon: '🚨', label: 'Escalate Cases', path: '/department/escalate' },
    { icon: '📈', label: 'Analytics', path: '/department/analytics' },
    { icon: '📄', label: 'SLA Reports', path: '/department/sla' },
    { icon: '👨‍💼', label: 'Officer Performance', path: '/department/officers' },
    { icon: '⚙️', label: 'Settings', path: '/department/settings' }
  ]

  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true)
        const res = await api.get('/complaints?limit=100') 
        const data = res.data?.complaints || []
        
        const now = new Date()

        const processed = data
          .filter(c => c.status !== 'resolved' && c.status !== 'rejected')
          .map(c => {
            const deadline = c.deadline ? new Date(c.deadline) : null
            let hoursLeft = null
            let dueStr = 'No deadline'
            let deadlineStatus = 'on-time'

            if (deadline) {
              hoursLeft = (deadline - now) / (1000 * 60 * 60)
              dueStr = `${Math.round(Math.abs(hoursLeft))} hours`
              
              if (hoursLeft < 0) {
                deadlineStatus = 'overdue'
                dueStr = `-${Math.round(Math.abs(hoursLeft))} hours`
              } else if (hoursLeft < 6) {
                deadlineStatus = 'critical'
              } else if (hoursLeft < 24) {
                deadlineStatus = 'warning'
              }
            }

            return { ...c, hoursLeft, dueStr, deadlineStatus }
          })
          .sort((a, b) => {
            if (a.hoursLeft === null) return 1
            if (b.hoursLeft === null) return -1
            return a.hoursLeft - b.hoursLeft
          })

        setComplaints(processed)
      } catch (err) {
        console.error('Failed to fetch deadlines:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  const filtered = complaints.filter(c => {
    if (filter === 'all') return true
    return c.deadlineStatus === filter
  })

  const stats = {
    total: complaints.length,
    overdue: complaints.filter(c => c.deadlineStatus === 'overdue').length,
    critical: complaints.filter(c => c.deadlineStatus === 'critical').length,
    warning: complaints.filter(c => c.deadlineStatus === 'warning').length,
    onTime: complaints.filter(c => c.deadlineStatus === 'on-time').length
  }

  const getPriorityConfig = (p) => {
    const map = {
      emergency: { icon: '🔴', label: 'Emergency', color: '#E53E3E' },
      high: { icon: '🟠', label: 'High', color: '#F7931E' },
      normal: { icon: '🟡', label: 'Normal', color: '#ECC94B' },
      low: { icon: '🔵', label: 'Low', color: '#4299E1' }
    }
    return map[p] || map.normal
  }

  const getDeadlineBadge = (status) => {
    const map = {
      overdue: { label: 'Overdue', color: '#E53E3E', bg: 'rgba(229, 62, 62, 0.15)', icon: '🔴' },
      critical: { label: 'Critical', color: '#DD6B20', bg: 'rgba(221, 107, 32, 0.15)', icon: '🚨' },
      warning: { label: 'Warning', color: '#ED8936', bg: 'rgba(237, 137, 54, 0.15)', icon: '⚠️' },
      'on-time': { label: 'On Time', color: '#38A169', bg: 'rgba(56, 161, 105, 0.15)', icon: '✅' }
    }
    return map[status]
  }

  if (loading) {
    return (
      <DashboardLayout role="department_admin" menuItems={menuItems} title="Monitor Deadlines">
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>Loading deadlines...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="Monitor Deadlines">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Banner */}
        <div style={{ background: 'linear-gradient(135deg, #2C5282 0%, #3182CE 60%, #63B3ED 100%)', borderRadius: '20px', padding: '32px', color: 'white', marginBottom: '24px', boxShadow: '0 12px 32px rgba(49, 130, 206, 0.25)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              ⏰ Monitor Deadlines
            </h2>
            <p style={{ fontSize: '15px', opacity: 0.95, color: '#FFFFFF', fontWeight: '500', maxWidth: '600px', textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
              Track SLA compliance and ensure no cases pass their deadlines without action.
            </p>
          </div>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-80px', right: '150px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }}></div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Cases', count: stats.total, color: '#3182CE' },
            { id: 'overdue', label: 'Overdue', count: stats.overdue, color: '#E53E3E' },
            { id: 'critical', label: 'Critical', count: stats.critical, color: '#DD6B20' },
            { id: 'warning', label: 'Warning', count: stats.warning, color: '#ED8936' },
            { id: 'on-time', label: 'On Time', count: stats.onTime, color: '#38A169' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                background: filter === tab.id ? tab.color : 'var(--bg-surface)',
                color: filter === tab.id ? 'white' : 'var(--text-secondary)',
                boxShadow: filter === tab.id ? `0 4px 12px ${tab.color}40` : 'var(--shadow-sm)'
              }}
            >
              {tab.label}
              <span style={{ background: filter === tab.id ? 'rgba(255,255,255,0.25)' : 'var(--bg-surface-secondary)', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', overflowX: 'auto', minHeight: '400px' }}>
          {filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>No Cases Found</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>There are no cases in this category right now.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left' }}>
                  <th style={{ padding: '12px', fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: '800', textTransform: 'uppercase' }}>ID</th>
                  <th style={{ padding: '12px', fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: '800', textTransform: 'uppercase' }}>Case</th>
                  <th style={{ padding: '12px', fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: '800', textTransform: 'uppercase' }}>Priority</th>
                  <th style={{ padding: '12px', fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: '800', textTransform: 'uppercase' }}>Officer</th>
                  <th style={{ padding: '12px', fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: '800', textTransform: 'uppercase' }}>Due In</th>
                  <th style={{ padding: '12px', fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: '800', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px', fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: '800', textTransform: 'uppercase' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const priority = getPriorityConfig(c.priority)
                  const deadlineBadge = getDeadlineBadge(c.deadlineStatus)
                  return (
                    <tr key={c._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '16px 12px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{c.complaintId || c._id}</td>
                      <td style={{ padding: '16px 12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>{c.title}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{ fontSize: '12px', color: priority.color, fontWeight: '700' }}>
                          {priority.icon} {priority.label}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {c.assignedTo?.name || 'Unassigned'}
                      </td>
                      <td style={{ padding: '16px 12px', fontSize: '13px', color: c.deadlineStatus === 'overdue' ? '#E53E3E' : 'var(--text-secondary)', fontWeight: '600' }}>
                        ⏰ {c.dueStr}
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: deadlineBadge.bg, color: deadlineBadge.color }}>
                          {deadlineBadge.icon} {deadlineBadge.label}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        {/* ✅ FIXED: Added onClick handler to navigate */}
                        <button 
                          onClick={() => navigate(`/department/complaints/${c._id}`)}
                          style={{ padding: '6px 12px', background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', color: '#FF6B35', fontWeight: '700', fontFamily: 'inherit' }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MonitorDeadlines