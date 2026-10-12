import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'

const ComplaintList = () => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications' },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  const [complaints] = useState([
    { id: 'JV2026001', title: 'Broken street light near Anna Nagar', category: 'Roads & Infrastructure', status: 'in-progress', priority: 'normal', date: '2026-09-15', updated: '2026-09-20' },
    { id: 'JV2026002', title: 'Garbage not collected for 5 days', category: 'Sanitation & Waste', status: 'resolved', priority: 'high', date: '2026-09-10', updated: '2026-09-18' },
    { id: 'JV2026003', title: 'Water leakage on main road', category: 'Water Supply', status: 'assigned', priority: 'emergency', date: '2026-09-08', updated: '2026-09-08' },
    { id: 'JV2026004', title: 'Pothole causing traffic issues', category: 'Roads & Infrastructure', status: 'investigating', priority: 'high', date: '2026-09-05', updated: '2026-09-12' },
    { id: 'JV2026005', title: 'Street dog menace in residential area', category: 'Public Safety', status: 'pending', priority: 'normal', date: '2026-09-01', updated: '2026-09-01' },
    { id: 'JV2026006', title: 'Illegal dumping of waste in lake', category: 'Environment', status: 'resolved', priority: 'high', date: '2026-08-28', updated: '2026-09-15' }
  ])

  const getStatusConfig = (status) => {
    const map = {
      pending: { label: 'Pending', color: '#ED8936', bg: '#FEEBC8', icon: '⏳' },
      assigned: { label: 'Assigned', color: '#4299E1', bg: '#BEE3F8', icon: '👤' },
      investigating: { label: 'Investigating', color: '#805AD5', bg: '#E9D8FD', icon: '🔍' },
      'in-progress': { label: 'In Progress', color: '#3182CE', bg: '#BEE3F8', icon: '🚧' },
      resolved: { label: 'Resolved', color: '#38A169', bg: '#C6F6D5', icon: '✅' },
      rejected: { label: 'Rejected', color: '#E53E3E', bg: '#FED7D7', icon: '❌' },
      escalated: { label: 'Escalated', color: '#C53030', bg: '#FED7D7', icon: '🚨' }
    }
    return map[status] || map.pending
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

  const filtered = complaints.filter((c) => {
    const matchFilter = filter === 'all' || c.status === filter
    const matchSearch =
      !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const counts = {
    all: complaints.length,
    pending: complaints.filter((c) => c.status === 'pending').length,
    'in-progress': complaints.filter((c) => c.status === 'in-progress' || c.status === 'investigating').length,
    resolved: complaints.filter((c) => c.status === 'resolved').length
  }

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="My Complaints">
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '240px', display: 'flex', alignItems: 'center', gap: '8px', background: 'white', borderRadius: '10px', padding: '0 14px', border: '2px solid #e2e8f0' }}>
          <span style={{ opacity: 0.6 }}>🔍</span>
          <input
            type="text"
            placeholder="Search by ID or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '12px 0', border: 'none', outline: 'none', fontSize: '14px' }}
          />
        </div>
        <Link
          to="/citizen/submit"
          style={{
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
            color: 'white',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '14px',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
          }}
        >
          ➕ New Complaint
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All', count: counts.all },
          { id: 'pending', label: 'Pending', count: counts.pending },
          { id: 'in-progress', label: 'In Progress', count: counts['in-progress'] },
          { id: 'resolved', label: 'Resolved', count: counts.resolved }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              padding: '10px 18px',
              background: filter === tab.id ? 'linear-gradient(135deg, #FF6B35, #F7931E)' : 'white',
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
              boxShadow: filter === tab.id ? '0 4px 12px rgba(255, 107, 53, 0.3)' : '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            {tab.label}
            <span
              style={{
                background: filter === tab.id ? 'rgba(255,255,255,0.3)' : '#edf2f7',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '11px'
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Complaints List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map((c) => {
          const status = getStatusConfig(c.status)
          const priority = getPriorityConfig(c.priority)
          return (
            <div
              key={c.id}
              onClick={() => navigate(`/citizen/complaint/${c.id}`)}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderLeft: `4px solid ${status.color}`,
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
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
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', background: '#1a202c', color: 'white', padding: '3px 10px', borderRadius: '6px', letterSpacing: '0.5px' }}>
                    {c.id}
                  </span>
                  <span style={{ fontSize: '11px', color: priority.color, fontWeight: '700' }}>
                    {priority.icon} {priority.label}
                  </span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>
                  {c.title}
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#718096', flexWrap: 'wrap' }}>
                  <span>📁 {c.category}</span>
                  <span>📅 {c.date}</span>
                  <span>🔄 Updated {c.updated}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                <span style={{ padding: '6px 14px', background: status.bg, color: status.color, borderRadius: '20px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                  {status.icon} {status.label}
                </span>
                <span style={{ fontSize: '12px', color: '#FF6B35', fontWeight: '700' }}>
                  View Details →
                </span>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '60px 20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>
              No Complaints Found
            </h3>
            <p style={{ fontSize: '14px', color: '#718096', marginBottom: '20px' }}>
              {filter === 'all' && !search
                ? "You haven't submitted any complaints yet."
                : 'No complaints match your filters.'}
            </p>
            {filter === 'all' && !search ? (
              <Link
                to="/citizen/submit"
                style={{ display: 'inline-block', padding: '12px 24px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', borderRadius: '10px', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}
              >
                📝 Submit Your First Complaint
              </Link>
            ) : (
              <button
                onClick={() => { setFilter('all'); setSearch('') }}
                style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ComplaintList