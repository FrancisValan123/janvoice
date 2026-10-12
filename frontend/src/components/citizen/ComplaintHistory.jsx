import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'

const ComplaintHistory = () => {
  const navigate = useNavigate()

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications' },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  const [history] = useState([
    { id: 'JV2025101', title: 'Street light issue', category: 'Roads', status: 'resolved', priority: 'normal', date: '2025-08-15', resolvedDate: '2025-08-22', days: 7, rating: 5 },
    { id: 'JV2025098', title: 'Water supply disruption', category: 'Water', status: 'resolved', priority: 'high', date: '2025-07-10', resolvedDate: '2025-07-15', days: 5, rating: 4 },
    { id: 'JV2025089', title: 'Garbage collection delay', category: 'Sanitation', status: 'resolved', priority: 'normal', date: '2025-06-05', resolvedDate: '2025-06-12', days: 7, rating: 5 },
    { id: 'JV2025075', title: 'Road repair request', category: 'Roads', status: 'resolved', priority: 'high', date: '2025-05-20', resolvedDate: '2025-06-01', days: 12, rating: 3 },
    { id: 'JV2025060', title: 'Broken park bench', category: 'Public Space', status: 'resolved', priority: 'low', date: '2025-04-10', resolvedDate: '2025-04-18', days: 8, rating: 4 },
    { id: 'JV2025045', title: 'Drainage blockage', category: 'Sanitation', status: 'rejected', priority: 'normal', date: '2025-03-05', resolvedDate: '2025-03-06', days: 1, rating: null }
  ])

  const [yearFilter, setYearFilter] = useState('all')

  const years = ['all', '2026', '2025', '2024']

  const filtered = history.filter((h) => {
    if (yearFilter === 'all') return true
    return h.date.startsWith(yearFilter)
  })

  const stats = {
    total: filtered.length,
    avgDays:
      filtered.filter((h) => h.status === 'resolved').length > 0
        ? (
            filtered.filter((h) => h.status === 'resolved').reduce((s, h) => s + h.days, 0) /
            filtered.filter((h) => h.status === 'resolved').length
          ).toFixed(1)
        : 0,
    avgRating:
      filtered.filter((h) => h.rating).length > 0
        ? (
            filtered.filter((h) => h.rating).reduce((s, h) => s + h.rating, 0) /
            filtered.filter((h) => h.rating).length
          ).toFixed(1)
        : 0
  }

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="Complaint History">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a202c, #2d3748)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px', boxShadow: '0 8px 24px rgba(26, 32, 44, 0.2)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>
            📜 Complaint History
          </h2>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            View all your past complaints and their outcomes
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#FF6B35', lineHeight: 1, marginBottom: '6px' }}>{stats.total}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Total Closed</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#38A169', lineHeight: 1, marginBottom: '6px' }}>{stats.avgDays}d</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Avg Resolution</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#F7931E', lineHeight: 1, marginBottom: '6px' }}>⭐ {stats.avgRating}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Avg Rating</div>
          </div>
        </div>

        {/* Year Filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setYearFilter(y)}
              style={{
                padding: '8px 18px',
                background: yearFilter === y ? 'linear-gradient(135deg, #FF6B35, #F7931E)' : 'white',
                color: yearFilter === y ? 'white' : '#4a5568',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: yearFilter === y ? '0 4px 12px rgba(255, 107, 53, 0.3)' : '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              {y === 'all' ? '📅 All Years' : y}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['ID', 'Title', 'Category', 'Submitted', 'Resolved', 'Days', 'Rating', 'Status', ''].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px', fontSize: '11px', fontWeight: '800', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((h) => (
                  <tr key={h.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 12px', fontSize: '12px', fontWeight: '800', color: '#1a202c' }}>{h.id}</td>
                    <td style={{ padding: '16px 12px', fontSize: '13px', color: '#1a202c', fontWeight: '600' }}>{h.title}</td>
                    <td style={{ padding: '16px 12px', fontSize: '12px', color: '#718096' }}>{h.category}</td>
                    <td style={{ padding: '16px 12px', fontSize: '12px', color: '#718096' }}>{h.date}</td>
                    <td style={{ padding: '16px 12px', fontSize: '12px', color: '#718096' }}>{h.resolvedDate}</td>
                    <td style={{ padding: '16px 12px', fontSize: '12px', fontWeight: '700', color: '#38A169' }}>{h.days}d</td>
                    <td style={{ padding: '16px 12px', fontSize: '12px' }}>
                      {h.rating ? '⭐'.repeat(h.rating) : '—'}
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '700',
                        background: h.status === 'resolved' ? '#c6f6d5' : '#fed7d7',
                        color: h.status === 'resolved' ? '#276749' : '#9b2c2c',
                        textTransform: 'capitalize'
                      }}>
                        {h.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <button
                        onClick={() => navigate(`/citizen/complaint/${h.id}`)}
                        style={{ padding: '6px 12px', background: '#f7fafc', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '11px', fontWeight: '700', color: '#FF6B35', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '56px', marginBottom: '12px' }}>📭</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c' }}>No History Found</h3>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: '20px', padding: '20px', background: 'linear-gradient(135deg, #FFF5F0, #FFE8D6)', borderLeft: '4px solid #FF6B35', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c', marginBottom: '4px' }}>
              📋 Looking for current complaints?
            </div>
            <div style={{ fontSize: '13px', color: '#744210' }}>
              View your active complaints and their live status
            </div>
          </div>
          <Link to="/citizen/complaints" style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', borderRadius: '10px', fontWeight: '700', fontSize: '13px', textDecoration: 'none', boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)' }}>
            My Complaints →
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ComplaintHistory