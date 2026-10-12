import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'

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

  const [filter, setFilter] = useState('all')
  const [appliedRecs, setAppliedRecs] = useState([])

  const recommendations = [
    {
      id: 'R1',
      category: 'performance',
      priority: 'high',
      icon: '📈',
      color: '#4299E1',
      title: 'Improve Public Works SLA',
      description:
        'Public Works department has an SLA of 84%, below the acceptable 90% threshold. Avg resolution time is 6.2 days, 24% higher than other departments.',
      impact: 'Reduce avg resolution from 6.2d to 5.0d',
      action: 'Reassign 2 officers from Transport to Public Works',
      confidence: 87,
      department: 'Public Works'
    },
    {
      id: 'R2',
      category: 'workload',
      priority: 'critical',
      icon: '⚖️',
      color: '#C53030',
      title: 'Balance Officer Workload',
      description:
        'Officer Suresh Rajan has 7 active cases (87% capacity) while Officer Meena Rao has only 4 (50%). Workload imbalance is causing delays.',
      impact: 'Improve SLA from 82% to 88%',
      action: 'Redistribute 3 cases from Suresh to Meena',
      confidence: 92,
      department: 'Public Works / Sanitation'
    },
    {
      id: 'R3',
      category: 'escalation',
      priority: 'high',
      icon: '🚨',
      color: '#E53E3E',
      title: 'Address Repeated Escalations',
      description:
        '4 cases from Sanitation dept were escalated in the last 30 days. Pattern suggests systemic issue with complaint handling.',
      impact: 'Reduce escalations by 60%',
      action: 'Conduct departmental review and retraining',
      confidence: 78,
      department: 'Sanitation'
    },
    {
      id: 'R4',
      category: 'efficiency',
      priority: 'medium',
      icon: '⏱️',
      color: '#ED8936',
      title: 'Optimize Response Times',
      description:
        'Emergency complaint response time is currently 1.5 hours, exceeding the target of 1 hour in 18% of cases.',
      impact: 'Achieve 95% within 1-hour target',
      action: 'Enable auto-assignment for emergency cases',
      confidence: 84,
      department: 'All'
    },
    {
      id: 'R5',
      category: 'satisfaction',
      priority: 'medium',
      icon: '⭐',
      color: '#F7931E',
      title: 'Boost Citizen Satisfaction',
      description:
        'Electricity department has the lowest satisfaction rating at 4.2/5.0. Citizen feedback cites communication issues.',
      impact: 'Increase satisfaction to 4.5+',
      action: 'Enable real-time status notifications',
      confidence: 81,
      department: 'Electricity'
    },
    {
      id: 'R6',
      category: 'resource',
      priority: 'low',
      icon: '📦',
      color: '#38A169',
      title: 'Optimize Resource Allocation',
      description:
        'Water Supply dept has 4 idle vehicles while Public Works dept is at 100% capacity utilization.',
      impact: 'Improve resource utilization by 25%',
      action: 'Reallocate 2 vehicles to Public Works',
      confidence: 76,
      department: 'Cross-department'
    }
  ]

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
    avgConfidence: Math.round(recommendations.reduce((s, r) => s + r.confidence, 0) / recommendations.length)
  }

  const handleApply = (id) => {
    if (appliedRecs.includes(id)) {
      setAppliedRecs(appliedRecs.filter((i) => i !== id))
    } else {
      setAppliedRecs([...appliedRecs, id])
    }
  }

  return (
    <DashboardLayout role="higher_authority" menuItems={menuItems} title="Recommendations">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #975A16, #F7931E)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <span style={{ fontSize: '40px' }}>💡</span>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Smart Recommendations</h2>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>AI-powered suggestions to improve system performance</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Total Suggestions', value: stats.total, color: '#F7931E' },
            { label: 'Applied', value: stats.applied, color: '#38A169' },
            { label: 'Critical', value: stats.critical, color: '#C53030' },
            { label: 'High Priority', value: stats.high, color: '#ED8936' },
            { label: 'Avg Confidence', value: `${stats.avgConfidence}%`, color: '#4299E1' }
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '26px', fontWeight: '800', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>{s.label}</div>
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
            { id: 'efficiency', label: '⏱️ Efficiency' },
            { id: 'satisfaction', label: '⭐ Satisfaction' },
            { id: 'resource', label: '📦 Resources' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '10px 18px',
                background: filter === tab.id ? 'linear-gradient(135deg, #F7931E, #ED8936)' : 'white',
                color: filter === tab.id ? 'white' : '#4a5568',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: filter === tab.id ? '0 4px 12px rgba(247, 147, 30, 0.3)' : '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Recommendations */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {filtered.map((rec) => {
            const priority = getPriorityConfig(rec.priority)
            const applied = appliedRecs.includes(rec.id)
            return (
              <div
                key={rec.id}
                style={{
                  background: 'white',
                  borderRadius: '14px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  borderTop: `4px solid ${rec.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  transition: 'all 0.3s ease',
                  opacity: applied ? 0.85 : 1
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <div style={{ width: '48px', height: '48px', background: rec.color + '20', color: rec.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                      {rec.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '800', background: priority.bg, color: priority.color }}>
                          {priority.icon} {priority.label}
                        </span>
                        {applied && (
                          <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '800', background: '#C6F6D5', color: '#276749' }}>
                            ✓ Applied
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1a202c', lineHeight: 1.3 }}>{rec.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: '13px', color: '#4a5568', lineHeight: 1.6, margin: 0 }}>
                  {rec.description}
                </p>

                {/* Impact + Action */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: '#f7fafc', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ fontSize: '14px', flexShrink: 0 }}>🎯</span>
                    <div style={{ fontSize: '12px' }}>
                      <div style={{ fontWeight: '800', color: '#2d3748', marginBottom: '2px' }}>Expected Impact</div>
                      <div style={{ color: '#4a5568' }}>{rec.impact}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ fontSize: '14px', flexShrink: 0 }}>⚡</span>
                    <div style={{ fontSize: '12px' }}>
                      <div style={{ fontWeight: '800', color: '#2d3748', marginBottom: '2px' }}>Suggested Action</div>
                      <div style={{ color: '#4a5568' }}>{rec.action}</div>
                    </div>
                  </div>
                </div>

                {/* Confidence */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                    <span style={{ color: '#718096', fontWeight: '700' }}>AI Confidence</span>
                    <span style={{ color: rec.color, fontWeight: '800' }}>{rec.confidence}%</span>
                  </div>
                  <div style={{ height: '6px', background: '#edf2f7', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${rec.confidence}%`, height: '100%', background: rec.color, borderRadius: '3px' }}></div>
                  </div>
                </div>

                {/* Department */}
                <div style={{ fontSize: '11px', color: '#718096', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🏛️ <strong style={{ color: '#2d3748' }}>{rec.department}</strong>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <button
                    onClick={() => handleApply(rec.id)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: applied ? '#C6F6D5' : `linear-gradient(135deg, ${rec.color}, ${rec.color})`,
                      color: applied ? '#276749' : 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      boxShadow: applied ? 'none' : `0 4px 12px ${rec.color}40`
                    }}
                  >
                    {applied ? '✓ Applied' : '⚡ Apply Recommendation'}
                  </button>
                  <button
                    style={{
                      padding: '12px 16px',
                      background: 'white',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#4a5568',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}
                    title="Dismiss"
                  >
                    ✖
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Info Banner */}
        <div style={{ marginTop: '24px', padding: '20px', background: 'linear-gradient(135deg, #EBF8FF, #BEE3F8)', borderRadius: '14px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '32px', flexShrink: 0 }}>🤖</span>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#2C5282', marginBottom: '4px' }}>
              How Recommendations Work
            </div>
            <div style={{ fontSize: '13px', color: '#2A4365', lineHeight: 1.5 }}>
              Our AI analyzes complaint patterns, SLA trends, officer workload, and citizen satisfaction to generate data-driven recommendations. Review each suggestion carefully before applying.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default RecommendationSystem