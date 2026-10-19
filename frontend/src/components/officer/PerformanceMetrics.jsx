import React, { useState, useEffect } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const PerformanceMetrics = () => {
  // ✅ FIXED: Removed "Investigate" from sidebar
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/officer/dashboard' },
    { icon: '📋', label: 'Assigned Cases', path: '/officer/assigned' },
    { icon: '📤', label: 'Upload Evidence', path: '/officer/evidence' },
    { icon: '📝', label: 'Complaint Notes', path: '/officer/notes' },
    { icon: '🔄', label: 'Reassignment', path: '/officer/reassign' },
    { icon: '🚨', label: 'Escalate Case', path: '/officer/escalate' },
    { icon: '📈', label: 'My Performance', path: '/officer/performance' },
    { icon: '📄', label: 'Resolution Report', path: '/officer/report' }
  ]

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    resolutionRate: 0,
    avgResolutionDays: 0,
    avgRating: 0,
    active: 0
  })
  const [monthlyData, setMonthlyData] = useState([])
  const [categoryPerformance, setCategoryPerformance] = useState([])

  // ===================================
  // FETCH REAL PERFORMANCE DATA
  // ===================================
  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true)

        // 1. Fetch official stats
        const statsRes = await api.get('/complaints/officer-stats')
        const officialStats = statsRes.data?.stats || {}

        // 2. Fetch assigned complaints for detailed analysis
        const complaintsRes = await api.get('/complaints/assigned')
        const rawData = complaintsRes.data?.complaints || complaintsRes.data?.data || []

        // --- Calculate real metrics ---
        const resolvedData = rawData.filter(c => c.status === 'resolved')
        const activeData = rawData.filter(c => ['pending', 'assigned', 'investigating', 'in-progress'].includes(c.status))

        // Calculate avg resolution days
        let totalDays = 0
        let validResolvedCount = 0
        resolvedData.forEach(c => {
          if (c.createdAt && c.resolvedAt) {
            const days = (new Date(c.resolvedAt) - new Date(c.createdAt)) / (1000 * 60 * 60 * 24)
            totalDays += days
            validResolvedCount++
          }
        })
        const avgResolutionDays = validResolvedCount > 0 ? (totalDays / validResolvedCount).toFixed(1) : 0

        // Calculate avg rating
        const ratedComplaints = resolvedData.filter(c => c.feedback?.rating)
        const avgRating = ratedComplaints.length > 0 
          ? (ratedComplaints.reduce((sum, c) => sum + c.feedback.rating, 0) / ratedComplaints.length).toFixed(1)
          : 0

        setStats({
          total: officialStats.total || rawData.length,
          resolved: officialStats.resolved || resolvedData.length,
          pending: officialStats.pending || activeData.length,
          resolutionRate: officialStats.resolutionRate || (rawData.length > 0 ? Math.round((resolvedData.length / rawData.length) * 100) : 0),
          active: activeData.length,
          avgResolutionDays,
          avgRating
        })

        // --- Group by Month (for chart) ---
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const currentYear = new Date().getFullYear()
        const monthlyCounts = {}

        resolvedData.forEach(c => {
          if (c.resolvedAt) {
            const d = new Date(c.resolvedAt)
            if (d.getFullYear() === currentYear) {
              const monthName = months[d.getMonth()]
              monthlyCounts[monthName] = (monthlyCounts[monthName] || 0) + 1
            }
          }
        })

        // Convert to array for rendering (last 6 months)
        const monthlyArray = Object.keys(monthlyCounts).map(month => ({
          month,
          resolved: monthlyCounts[month]
        })).slice(-6) // Just show last 6 months with data
        setMonthlyData(monthlyArray.length > 0 ? monthlyArray : [{ month: 'No Data', resolved: 0 }])

        // --- Group by Category (for chart) ---
        const categoryCounts = {}
        resolvedData.forEach(c => {
          const cat = c.category || 'other'
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
        })

        const categoryColors = {
          roads: '#FF6B35', water: '#4299E1', sanitation: '#38A169',
          electricity: '#ED8936', safety: '#E53E3E', transport: '#805AD5',
          health: '#E53E3E', education: '#3182CE', environment: '#38A169', other: '#718096'
        }

        const categoryArray = Object.keys(categoryCounts).map(cat => ({
          name: cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' '),
          resolved: categoryCounts[cat],
          color: categoryColors[cat] || '#718096'
        })).sort((a, b) => b.resolved - a.resolved) // Sort highest first

        setCategoryPerformance(categoryArray.length > 0 ? categoryArray : [{ name: 'No Data', resolved: 0, color: '#718096' }])

      } catch (err) {
        console.error('Failed to load performance metrics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPerformance()
  }, [])

  if (loading) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="My Performance">
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>
          Loading your performance data...
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="My Performance">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a202c, #2d3748)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            {/* ✅ FIXED: Explicit white color for readability on dark background */}
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF' }}>📈 My Performance</h2>
            <p style={{ fontSize: '14px', opacity: 0.9, color: '#E2E8F0' }}>Track your efficiency and resolution stats</p>
          </div>
        </div>

        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          
          <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '22px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #38A169' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(56, 161, 105, 0.1)', color: '#38A169', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>✅</div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Resolved</div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '4px' }}>{stats.resolved}</div>
            <div style={{ fontSize: '11px', color: '#38A169', fontWeight: '700' }}>Total resolved cases</div>
          </div>

          <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '22px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #4299E1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(66, 153, 225, 0.1)', color: '#4299E1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⏱️</div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Resolution</div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '4px' }}>{stats.avgResolutionDays}d</div>
            <div style={{ fontSize: '11px', color: '#4299E1', fontWeight: '700' }}>Average time to close</div>
          </div>

          <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '22px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #805AD5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(128, 90, 213, 0.1)', color: '#805AD5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📈</div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Resolution Rate</div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '4px' }}>{stats.resolutionRate}%</div>
            <div style={{ fontSize: '11px', color: '#805AD5', fontWeight: '700' }}>Percentage of cases closed</div>
          </div>

          <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '22px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #F7931E' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(247, 147, 30, 0.1)', color: '#F7931E', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⭐</div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Citizen Rating</div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '4px' }}>{stats.avgRating > 0 ? stats.avgRating : '—'}</div>
            <div style={{ fontSize: '11px', color: '#F7931E', fontWeight: '700' }}>From citizen feedback</div>
          </div>
        </div>

        {/* Two Column */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Monthly Trend */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>📊 Monthly Progress</h3>
            {monthlyData.length === 0 || monthlyData[0].month === 'No Data' ? (
              <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>No resolved cases yet to chart.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {monthlyData.map((m) => (
                  <div key={m.month} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '40px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', flexShrink: 0 }}>{m.month}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--text-tertiary)' }}>Resolved</span>
                        <span style={{ fontWeight: '800', color: '#38A169' }}>{m.resolved}</span>
                      </div>
                      <div style={{ height: '8px', background: 'var(--bg-surface-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                        {/* Max value for scaling: use 10 or highest count */}
                        <div style={{ width: `${Math.min((m.resolved / 10) * 100, 100)}%`, height: '100%', background: '#38A169', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* By Category */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>📁 By Category</h3>
            {categoryPerformance.length === 0 || categoryPerformance[0].name === 'No Data' ? (
              <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>No resolved cases to categorize.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {categoryPerformance.map((c) => (
                  <div key={c.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>{c.name}</span>
                      <span style={{ fontWeight: '800', color: c.color }}>{c.resolved} resolved</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-surface-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min((c.resolved / stats.resolved) * 100, 100)}%`, height: '100%', background: c.color, borderRadius: '3px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rating Box */}
        <div style={{ background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.05), rgba(247, 147, 30, 0.1))', borderRadius: '14px', padding: '24px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', border: '1px solid rgba(255, 107, 53, 0.2)' }}>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: '56px', fontWeight: '800', color: '#FF6B35', lineHeight: 1 }}>{stats.avgRating > 0 ? stats.avgRating : '—'}</div>
            <div style={{ fontSize: '20px', color: '#F7931E', marginTop: '6px' }}>
              {stats.avgRating > 0 ? '⭐⭐⭐⭐⭐' : 'No ratings yet'}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>Citizen Feedback</div>
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
              {stats.avgRating > 0 
                ? `You have an average rating of ${stats.avgRating}/5 based on the feedback submitted by citizens for your resolved cases.`
                : `Citizens haven't submitted feedback for your resolved cases yet. When they do, their ratings will appear here.`}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default PerformanceMetrics