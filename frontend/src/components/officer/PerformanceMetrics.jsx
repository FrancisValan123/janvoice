import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'

const PerformanceMetrics = () => {
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

  const [period, setPeriod] = useState('month')

  const stats = {
    totalResolved: 168,
    avgResolution: 3.8,
    sla: 92,
    rating: 4.7,
    totalAssigned: 180,
    resolved: 168,
    pending: 8,
    escalated: 4,
    resolutionRate: 93
  }

  const monthlyData = [
    { month: 'Apr', resolved: 22, sla: 88, rating: 4.5, avgDays: 4.2 },
    { month: 'May', resolved: 26, sla: 90, rating: 4.6, avgDays: 4.0 },
    { month: 'Jun', resolved: 28, sla: 91, rating: 4.6, avgDays: 3.9 },
    { month: 'Jul', resolved: 30, sla: 92, rating: 4.7, avgDays: 3.8 },
    { month: 'Aug', resolved: 32, sla: 93, rating: 4.8, avgDays: 3.7 },
    { month: 'Sep', resolved: 30, sla: 94, rating: 4.8, avgDays: 3.6 }
  ]

  const categoryPerformance = [
    { name: 'Roads & Infrastructure', resolved: 48, avgDays: 3.9, color: '#FF6B35' },
    { name: 'Water Supply', resolved: 32, avgDays: 3.5, color: '#4299E1' },
    { name: 'Sanitation', resolved: 42, avgDays: 3.6, color: '#38A169' },
    { name: 'Electricity', resolved: 28, avgDays: 4.2, color: '#ED8936' },
    { name: 'Public Safety', resolved: 18, avgDays: 4.5, color: '#E53E3E' }
  ]

  const achievements = [
    { icon: '🏆', title: 'Top Performer', desc: 'Ranked #1 in department', color: '#FFD700' },
    { icon: '⚡', title: 'Fast Responder', desc: 'Avg 3.8 days resolution', color: '#FF6B35' },
    { icon: '⭐', title: 'Highly Rated', desc: '4.7+ citizen rating', color: '#F7931E' },
    { icon: '🎯', title: 'SLA Champion', desc: '92% SLA compliance', color: '#38A169' }
  ]

  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="My Performance">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a202c, #2d3748)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>📈 My Performance</h2>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>Track your efficiency and achievements</p>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.15)', padding: '4px', borderRadius: '10px' }}>
            {['week', 'month', 'quarter', 'year'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{ padding: '8px 16px', background: period === p ? 'white' : 'transparent', color: period === p ? '#1a202c' : 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #38A169' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ width: '44px', height: '44px', background: '#38A16920', color: '#38A169', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>✅</div>
              <div style={{ fontSize: '12px', color: '#718096', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Resolved</div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#1a202c', lineHeight: 1, marginBottom: '4px' }}>{stats.resolved}</div>
            <div style={{ fontSize: '11px', color: '#38A169', fontWeight: '700' }}>↑ 12% vs last period</div>
          </div>

          <div style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #4299E1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ width: '44px', height: '44px', background: '#4299E120', color: '#4299E1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⏱️</div>
              <div style={{ fontSize: '12px', color: '#718096', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Resolution</div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#1a202c', lineHeight: 1, marginBottom: '4px' }}>{stats.avgResolution}d</div>
            <div style={{ fontSize: '11px', color: '#38A169', fontWeight: '700' }}>↓ 0.4d faster than avg</div>
          </div>

          <div style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #805AD5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ width: '44px', height: '44px', background: '#805AD520', color: '#805AD5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📈</div>
              <div style={{ fontSize: '12px', color: '#718096', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SLA Compliance</div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#1a202c', lineHeight: 1, marginBottom: '4px' }}>{stats.sla}%</div>
            <div style={{ fontSize: '11px', color: '#38A169', fontWeight: '700' }}>↑ 6 points</div>
          </div>

          <div style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #F7931E' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ width: '44px', height: '44px', background: '#F7931E20', color: '#F7931E', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⭐</div>
              <div style={{ fontSize: '12px', color: '#718096', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Citizen Rating</div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#1a202c', lineHeight: 1, marginBottom: '4px' }}>{stats.rating}</div>
            <div style={{ fontSize: '11px', color: '#38A169', fontWeight: '700' }}>Top 10% rated</div>
          </div>
        </div>

        {/* Achievements */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>🏆 Achievements</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {achievements.map((a, i) => (
              <div key={i} style={{ padding: '16px', background: '#f7fafc', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center', borderLeft: `3px solid ${a.color}` }}>
                <div style={{ width: '48px', height: '48px', background: a.color + '20', color: a.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                  {a.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a202c', marginBottom: '2px' }}>{a.title}</div>
                  <div style={{ fontSize: '11px', color: '#718096' }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Monthly Trend */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>📊 Monthly Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {monthlyData.map((m) => (
                <div key={m.month} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', fontSize: '13px', fontWeight: '700', color: '#1a202c', flexShrink: 0 }}>{m.month}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span style={{ color: '#718096' }}>Resolved</span>
                      <span style={{ fontWeight: '800', color: '#38A169' }}>{m.resolved}</span>
                    </div>
                    <div style={{ height: '8px', background: '#edf2f7', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(m.resolved / 35) * 100}%`, height: '100%', background: '#38A169', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By Category */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>📁 By Category</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {categoryPerformance.map((c) => (
                <div key={c.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '600', color: '#2d3748' }}>{c.name}</span>
                    <span style={{ fontWeight: '800', color: c.color }}>{c.resolved} resolved</span>
                  </div>
                  <div style={{ height: '6px', background: '#edf2f7', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${(c.resolved / 50) * 100}%`, height: '100%', background: c.color, borderRadius: '3px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rating */}
        <div style={{ background: 'linear-gradient(135deg, #FFF5F0, #FFE8D6)', borderRadius: '14px', padding: '24px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: '56px', fontWeight: '800', color: '#FF6B35', lineHeight: 1 }}>{stats.rating}</div>
            <div style={{ fontSize: '20px', color: '#F7931E', marginTop: '6px' }}>⭐⭐⭐⭐⭐</div>
          </div>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#1a202c', marginBottom: '6px' }}>Excellent Rating!</div>
            <div style={{ fontSize: '13px', color: '#744210', lineHeight: 1.6 }}>
              You're in the top 10% of officers with a {stats.rating}/5 average. Citizens consistently praise your timely and professional service.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default PerformanceMetrics