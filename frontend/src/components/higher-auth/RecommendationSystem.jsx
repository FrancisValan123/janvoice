import React, { useState, useEffect } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const RecommendationSystem = () => {
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

  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [appliedRecs, setAppliedRecs] = useState([])

  // ===================================
  // FETCH REAL DATA
  // ===================================
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        const res = await api.get('/authority/recommendations')
        setRecommendations(res.data?.recommendations || [])
      } catch (err) {
        console.error('Failed to load recommendations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  const getPriorityConfig = (priority) => {
    const map = {
      critical: { label: 'Critical', color: '#C53030', bg: '#FED7D7', icon: '🔴' },
      high: { label: 'High', color: '#9C4221', bg: '#FEEBC8', icon: '🟠' },
      medium: { label: 'Medium', color: '#975A16', bg: '#FEFCBF', icon: '🟡' },
      low: { label: 'Low', color: '#2C5282', bg: '#BEE3F8', icon: '🔵' }
    }
    return map[priority] || map.medium
  }

  const filtered = filter === 'all' ? recommendations : recommendations.filter((r) => r.category === filter)

  const stats = {
    total: recommendations.length,
    applied: appliedRecs.length,
    critical: recommendations.filter((r) => r.priority === 'critical').length,
    high: recommendations.filter((r) => r.priority === 'high').length,
    avgConfidence: recommendations.length > 0 
      ? Math.round(recommendations.reduce((s, r) => s + (r.confidence || 0), 0) / recommendations.length) 
      : 0
  }

  const handleApply = (id) => {
    if (appliedRecs.includes(id)) {
      setAppliedRecs(appliedRecs.filter((i) => i !== id))
    } else {
      setAppliedRecs([...appliedRecs, id])
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="higher_authority" menuItems={menuItems} title="Recommendations">
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>⏳ Loading AI recommendations...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="higher_authority" menuItems={menuItems} title="Recommendations">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* ✅ Header Banner - Fixed white text */}
        <div style={{ background: 'linear-gradient(135deg, #975A16, #F7931E)', borderRadius: '20px', padding: '32px', color: 'white', marginBottom: '24px', boxShadow: '0 12px 32px rgba(247, 147, 30, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <span style={{ fontSize: '40px' }}>💡</span>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px', color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                Smart Recommendations
              </h2>
              <p style={{ fontSize: '15px', opacity: 0.95, color: '#FFFFFF', fontWeight: '500', textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
                AI-powered suggestions to improve system performance
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'Total Suggestions', value: stats.total, color: '#F7931E' },
            { label: 'Applied', value: stats.applied, color: '#38A169' },
            { label: 'Critical', value: stats.critical, color: '#C53030' },
            { label: 'High Priority', value: stats.high, color: '#ED8936' },
            { label: 'Avg Confidence', value: `${stats.avgConfidence}%`, color: '#4299E1' }
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: '💡 All' },
            { id: 'performance', label: '📈 Performance' },
            { id: 'workload', label: '⚖️ Workload' },
            { id: 'escalation', label: '🚨 Escalation' },
            { id: 'efficiency', label: '⏱️ Efficiency' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '10px 18px', background: filter === tab.id ? 'linear-gradient(135deg, #F7931E, #ED8936)' : 'var(--bg-surface)',
                color: filter === tab.id ? 'white' : 'var(--text-secondary)', border: 'none', borderRadius: '10px', fontWeight: '700',
                fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: filter === tab.id ? '0 4px 12px rgba(247, 147, 30, 0.3)' : 'var(--shadow-sm)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Recommendations */}
        {filtered.length === 0 ? (
          <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>All Good!</h3>
            <p>There are no recommendations at this time. The system is performing optimally.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {filtered.map((rec) => {
              const priority = getPriorityConfig(rec.priority)
              const applied = appliedRecs.includes(rec.id)
              return (
                <div key={rec.id} style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', borderTop: `4px solid ${priority.color}`, display: 'flex', flexDirection: 'column', gap: '14px', opacity: applied ? 0.85 : 1 }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <div style={{ width: '48px', height: '48px', background: priority.bg, color: priority.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                      {rec.icon || '💡'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '800', background: priority.bg, color: priority.color }}>
                          {priority.icon} {priority.label}
                        </span>
                        {applied && (
                          <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '800', background: '#C6F6D5', color: '#276749' }}>
                            ✓ Applied
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.3 }}>{rec.title}</h3>
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{rec.description}</p>

                  <div style={{ padding: '12px', background: 'var(--bg-surface-secondary)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '12px' }}>
                      <span style={{ fontWeight: '800', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>🎯 Expected Impact</span>
                      <span style={{ color: 'var(--text-tertiary)' }}>{rec.impact}</span>
                    </div>
                    <div style={{ fontSize: '12px' }}>
                      <span style={{ fontWeight: '800', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>⚡ Suggested Action</span>
                      <span style={{ color: 'var(--text-tertiary)' }}>{rec.action}</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-tertiary)', fontWeight: '700' }}>AI Confidence</span>
                      <span style={{ color: priority.color, fontWeight: '800' }}>{rec.confidence || 0}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-surface-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${rec.confidence || 0}%`, height: '100%', background: priority.color, borderRadius: '3px' }}></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApply(rec.id)}
                    style={{ padding: '12px', background: applied ? '#C6F6D5' : 'linear-gradient(135deg, #F7931E, #ED8936)', color: applied ? '#276749' : 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', marginTop: 'auto', boxShadow: applied ? 'none' : '0 4px 12px rgba(247, 147, 30, 0.3)' }}
                  >
                    {applied ? '✓ Applied' : '⚡ Apply Recommendation'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default RecommendationSystem