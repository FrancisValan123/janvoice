import React, { useState, useEffect } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const OfficerPerformance = () => {
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

  const [officers, setOfficers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // ✅ CHANGED: Default sort by SLA (best first) instead of Name
  const [sortBy, setSortBy] = useState('sla')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchOfficersAndStats = async () => {
      try {
        setLoading(true)
        
        // 1. Fetch officers
        const usersRes = await api.get('/admin/users?role=officer')
        const officersData = usersRes.data?.users || []

        // 2. Fetch complaints to calculate stats
        const complaintsRes = await api.get('/complaints?limit=1000')
        const allComplaints = complaintsRes.data?.complaints || []

        // 3. Map officers and calculate their real metrics
        const mappedOfficers = officersData.map(o => {
          const officerComplaints = allComplaints.filter(
            c => c.assignedTo?._id === o._id || c.assignedTo === o._id
          )
          
          const total = officerComplaints.length
          const resolvedCases = officerComplaints.filter(c => c.status === 'resolved')
          const resolved = resolvedCases.length
          
          // Calculate Average Resolution Days
          let totalDays = 0
          let validResolved = 0
          resolvedCases.forEach(c => {
            if (c.createdAt && c.resolvedAt) {
              totalDays += (new Date(c.resolvedAt) - new Date(c.createdAt)) / (1000 * 60 * 60 * 24)
              validResolved++
            }
          })
          const avgDays = validResolved > 0 ? Math.round((totalDays / validResolved) * 10) / 10 : 0

          // Calculate Average Rating (from feedback)
          let totalRating = 0
          let ratedCount = 0
          resolvedCases.forEach(c => {
            if (c.feedback && c.feedback.rating) {
              totalRating += c.feedback.rating
              ratedCount++
            }
          })
          const rating = ratedCount > 0 ? parseFloat((totalRating / ratedCount).toFixed(1)) : 0

          // Calculate SLA % (Resolved / Total)
          const sla = total > 0 ? Math.round((resolved / total) * 100) : 0

          return {
            id: o._id,
            name: o.name,
            email: o.email,
            dept: o.department || 'Unassigned',
            zone: o.zone || 'General',
            total,
            resolved,
            avgDays,
            rating,
            sla,
            status: o.isActive ? 'active' : 'inactive'
          }
        })

        setOfficers(mappedOfficers)
      } catch (err) {
        console.error('Failed to load officers:', err)
        setError('Failed to load officer data from the database.')
      } finally {
        setLoading(false)
      }
    }

    fetchOfficersAndStats()
  }, [])

  const filtered = officers.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.dept.toLowerCase().includes(search.toLowerCase()) ||
      o.zone.toLowerCase().includes(search.toLowerCase())
  )

  // ✅ UPDATED: Sorting logic to handle highest SLA first, then resolved, then rating
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'sla') return b.sla - a.sla || b.resolved - a.resolved
    if (sortBy === 'resolved') return b.resolved - a.resolved
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'avgDays') return a.avgDays - b.avgDays
    return a.name.localeCompare(b.name)
  })

  // Find Top Performers (Sort by rating, then resolved count, then SLA)
  const topPerformers = [...officers]
    .filter((o) => o.status === 'active') 
    .sort((a, b) => b.rating - a.rating || b.resolved - a.resolved || b.sla - a.sla) 
    .slice(0, 3)

  const getInitials = (name) => name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)

  if (loading) {
    return (
      <DashboardLayout role="department_admin" menuItems={menuItems} title="Officer Performance">
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>⏳ Loading officers & calculating stats...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="Officer Performance">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header Banner */}
        <div style={{ background: 'linear-gradient(135deg, #1a202c, #2d3748)', borderRadius: '20px', padding: '32px', color: 'white', marginBottom: '24px', boxShadow: '0 12px 32px rgba(45, 55, 72, 0.25)' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
            👨‍💼 Officer Performance
          </h2>
          <p style={{ fontSize: '15px', opacity: 0.95, color: '#FFFFFF', fontWeight: '500', textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
            Track and compare officer efficiency and ratings
          </p>
        </div>

        {/* Top Performers */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>🏆 Top Performers</h3>
          
          {topPerformers.length === 0 ? (
             <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No active officers found.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {topPerformers.map((o, i) => (
                <div key={o.id} style={{ background: i === 0 ? 'linear-gradient(135deg, #FFF5F0, #FFE8D6)' : 'var(--bg-surface-secondary)', borderRadius: '12px', padding: '20px', border: i === 0 ? '2px solid #FF6B35' : '2px solid transparent', position: 'relative' }}>
                  {i === 0 && (
                    <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: 'white', padding: '3px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: '800', letterSpacing: '0.5px' }}>
                      🥇 TOP
                    </span>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                    <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', flexShrink: 0 }}>
                      {getInitials(o.name)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{o.dept} • {o.zone}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#38A169' }}>{o.resolved}</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700' }}>Resolved</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#F7931E' }}>⭐ {o.rating > 0 ? o.rating : 'N/A'}</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700' }}>Rating</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#4299E1' }}>{o.sla}%</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700' }}>SLA</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '16px', marginBottom: '16px', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface-secondary)', border: '2px solid var(--border-light)', borderRadius: '10px', padding: '0 12px' }}>
            <span style={{ fontSize: '15px', opacity: 0.6 }}>🔍</span>
            <input type="text" placeholder="Search officers..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, padding: '11px 0', border: 'none', background: 'transparent', fontSize: '13px', outline: 'none', fontFamily: 'inherit', color: 'var(--text-primary)' }} />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '11px 16px', border: '2px solid var(--border-light)', borderRadius: '10px', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '600', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            <option value="sla">Sort: Best SLA</option>
            <option value="resolved">Sort: Most Resolved</option>
            <option value="rating">Sort: Highest Rating</option>
            <option value="avgDays">Sort: Fastest</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>

        {error && (
          <div style={{ background: 'rgba(229, 62, 62, 0.1)', color: '#C53030', padding: '14px 20px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Table */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', overflowX: 'auto', minHeight: '300px' }}>
          {sorted.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <p>No officers found matching your search.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['#', 'Officer', 'Department', 'Zone', 'Total', 'Resolved', 'Avg Days', 'Rating', 'SLA', 'Status'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid var(--border-light)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((o, i) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px', fontSize: '12px', fontWeight: '800', color: 'var(--text-tertiary)' }}>#{i + 1}</td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #805AD5, #6B46C1)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px', flexShrink: 0 }}>
                          {getInitials(o.name)}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{o.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{o.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{o.dept}</td>
                    <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>📍 {o.zone}</td>
                    <td style={{ padding: '14px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{o.total}</td>
                    <td style={{ padding: '14px', fontSize: '13px', fontWeight: '700', color: '#38A169' }}>{o.resolved}</td>
                    <td style={{ padding: '14px', fontSize: '12px', color: '#4299E1', fontWeight: '700' }}>{o.avgDays > 0 ? `${o.avgDays}d` : '—'}</td>
                    <td style={{ padding: '14px', fontSize: '12px', fontWeight: '700', color: '#F7931E' }}>⭐ {o.rating > 0 ? o.rating : '—'}</td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '60px', height: '6px', background: 'var(--bg-surface-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${o.sla}%`, height: '100%', background: o.sla >= 90 ? '#38A169' : o.sla >= 80 ? '#ED8936' : '#E53E3E' }}></div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: o.sla >= 90 ? '#38A169' : o.sla >= 80 ? '#ED8936' : '#E53E3E' }}>{o.sla}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: o.status === 'active' ? 'rgba(56, 161, 105, 0.15)' : 'rgba(229, 62, 62, 0.15)', color: o.status === 'active' ? '#38A169' : '#E53E3E' }}>
                        {o.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default OfficerPerformance