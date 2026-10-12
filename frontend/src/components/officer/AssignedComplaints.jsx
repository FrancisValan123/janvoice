import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import './AssignedComplaints.css'

const AssignedComplaints = () => {
  const navigate = useNavigate()

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/officer/dashboard' },
    { icon: '📋', label: 'Assigned Cases', path: '/officer/assigned', badge: 8 },
    { icon: '🔍', label: 'Investigate', path: '/officer/investigate' },
    { icon: '📤', label: 'Upload Evidence', path: '/officer/evidence' },
    { icon: '📝', label: 'Complaint Notes', path: '/officer/notes' },
    { icon: '🔄', label: 'Reassignment', path: '/officer/reassign' },
    { icon: '🚨', label: 'Escalate Case', path: '/officer/escalate' },
    { icon: '📈', label: 'My Performance', path: '/officer/performance' },
    { icon: '📄', label: 'Resolution Report', path: '/officer/report' }
  ]

  const [complaints] = useState([
    { id: 'JV2026100', title: 'Road collapse risk on NH-45', category: 'Roads', priority: 'emergency', status: 'investigating', location: 'NH-45', citizens: 340, deadline: '2 hours', createdAt: '2 hours ago' },
    { id: 'JV2026101', title: 'Water contamination Ward 12', category: 'Water', priority: 'emergency', status: 'assigned', location: 'Ward 12', citizens: 220, deadline: '4 hours', createdAt: '30 min ago' },
    { id: 'JV2026102', title: 'Streetlight outage main road', category: 'Electricity', priority: 'high', status: 'in-progress', location: 'MG Road', citizens: 95, deadline: '12 hours', createdAt: '5 hours ago' },
    { id: 'JV2026103', title: 'Pothole repair MG Road', category: 'Roads', priority: 'high', status: 'investigating', location: 'MG Road', citizens: 180, deadline: '18 hours', createdAt: '8 hours ago' },
    { id: 'JV2026104', title: 'Garbage bin overflow', category: 'Sanitation', priority: 'normal', status: 'assigned', location: 'Adyar', citizens: 45, deadline: '1 day', createdAt: '1 day ago' },
    { id: 'JV2026105', title: 'Water supply disruption', category: 'Water', priority: 'normal', status: 'in-progress', location: 'Velachery', citizens: 120, deadline: '20 hours', createdAt: '6 hours ago' },
    { id: 'JV2026106', title: 'Broken footpath', category: 'Roads', priority: 'low', status: 'assigned', location: 'Anna Nagar', citizens: 30, deadline: '2 days', createdAt: '1 day ago' },
    { id: 'JV2026107', title: 'Stray dog menace', category: 'Public Safety', priority: 'normal', status: 'investigating', location: 'T Nagar', citizens: 60, deadline: '1 day', createdAt: '12 hours ago' }
  ])

  const [filter, setFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [search, setSearch] = useState('')

  const getPriorityConfig = (p) => {
    const map = {
      emergency: { label: 'Emergency', color: '#E53E3E', bg: '#FED7D7', icon: '🔴' },
      high: { label: 'High', color: '#F7931E', bg: '#FEEBC8', icon: '🟠' },
      normal: { label: 'Normal', color: '#ECC94B', bg: '#FEFCBF', icon: '🟡' },
      low: { label: 'Low', color: '#4299E1', bg: '#BEE3F8', icon: '🔵' }
    }
    return map[p] || map.normal
  }

  const getStatusConfig = (status) => {
    const map = {
      assigned: { label: 'Assigned', color: '#4299E1', bg: '#BEE3F8' },
      investigating: { label: 'Investigating', color: '#805AD5', bg: '#E9D8FD' },
      'in-progress': { label: 'In Progress', color: '#3182CE', bg: '#BEE3F8' },
      resolved: { label: 'Resolved', color: '#38A169', bg: '#C6F6D5' }
    }
    return map[status] || map.assigned
  }

  const counts = {
    all: complaints.length,
    assigned: complaints.filter((c) => c.status === 'assigned').length,
    investigating: complaints.filter((c) => c.status === 'investigating').length,
    'in-progress': complaints.filter((c) => c.status === 'in-progress').length,
    emergency: complaints.filter((c) => c.priority === 'emergency').length
  }

  const filtered = complaints.filter((c) => {
    const matchStatus = filter === 'all' || c.status === filter
    const matchPriority = priorityFilter === 'all' || c.priority === priorityFilter
    const matchSearch =
      !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchPriority && matchSearch
  })

  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="Assigned Cases">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #2C5282, #4299E1)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>📋 Assigned Cases</h2>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            Manage and prioritize all cases assigned to you
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #FF6B35' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#FF6B35', lineHeight: 1, marginBottom: '4px' }}>{counts.all}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Total</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #4299E1' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#4299E1', lineHeight: 1, marginBottom: '4px' }}>{counts.assigned}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Assigned</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #805AD5' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#805AD5', lineHeight: 1, marginBottom: '4px' }}>{counts.investigating}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Investigating</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #3182CE' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#3182CE', lineHeight: 1, marginBottom: '4px' }}>{counts['in-progress']}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>In Progress</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #E53E3E' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#E53E3E', lineHeight: 1, marginBottom: '4px' }}>{counts.emergency}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Emergency</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', gap: '8px', background: '#f7fafc', border: '2px solid #e2e8f0', borderRadius: '10px', padding: '0 12px' }}>
            <span style={{ fontSize: '15px', opacity: 0.6 }}>🔍</span>
            <input
              type="text"
              placeholder="Search cases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, padding: '11px 0', border: 'none', background: 'transparent', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ padding: '11px 14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#2d3748', outline: 'none', background: 'white', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <option value="all">All Priorities</option>
            <option value="emergency">🔴 Emergency</option>
            <option value="high">🟠 High</option>
            <option value="normal">🟡 Normal</option>
            <option value="low">🔵 Low</option>
          </select>
        </div>

        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Cases', count: counts.all },
            { id: 'assigned', label: '📥 Assigned', count: counts.assigned },
            { id: 'investigating', label: '🔍 Investigating', count: counts.investigating },
            { id: 'in-progress', label: '🚧 In Progress', count: counts['in-progress'] }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '10px 18px',
                background: filter === tab.id ? 'linear-gradient(135deg, #2C5282, #4299E1)' : 'white',
                color: filter === tab.id ? 'white' : '#4a5568',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: filter === tab.id ? '0 4px 12px rgba(66, 153, 225, 0.3)' : '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              {tab.label}
              <span style={{ background: filter === tab.id ? 'rgba(255,255,255,0.3)' : '#edf2f7', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Cases List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((c) => {
            const priority = getPriorityConfig(c.priority)
            const status = getStatusConfig(c.status)
            return (
              <div
                key={c.id}
                onClick={() => navigate(`/officer/case/${c.id}`)}
                style={{
                  background: 'white',
                  borderRadius: '14px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderLeft: `5px solid ${priority.color}`,
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', background: '#1a202c', color: 'white', padding: '3px 10px', borderRadius: '6px', letterSpacing: '0.5px' }}>{c.id}</span>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: priority.bg, color: priority.color }}>
                      {priority.icon} {priority.label}
                    </span>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                  </div>

                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>{c.title}</div>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#718096', flexWrap: 'wrap' }}>
                    <span>📁 {c.category}</span>
                    <span>📍 {c.location}</span>
                    <span>👥 {c.citizens} affected</span>
                    <span style={{ color: c.deadline.includes('hour') && c.deadline.match(/\d/) <= 4 ? '#E53E3E' : '#718096', fontWeight: '700' }}>
                      ⏰ {c.deadline}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/officer/investigate/${c.id}`)
                    }}
                    style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #2C5282, #4299E1)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    🔍 Investigate
                  </button>
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div style={{ background: 'white', borderRadius: '14px', padding: '60px 20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>No Cases Found</h3>
              <p style={{ fontSize: '14px', color: '#718096' }}>No complaints match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AssignedComplaints