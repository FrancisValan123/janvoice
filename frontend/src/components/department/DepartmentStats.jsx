import React, { useState, useEffect } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const DepartmentStats = () => {
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

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    departmentName: '',
    totalComplaints: 0,
    resolved: 0,
    pending: 0,
    officers: 0,
    slaPercent: 0,
    avgDays: 0,
    categories: []
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const res = await api.get('/department/stats')
        if (res.data.success) {
          setData(res.data.data)
        }
      } catch (err) {
        console.error('Failed to load stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const getCategoryMeta = (cat) => {
    const map = {
      roads: { name: 'Roads & Infrastructure', color: '#FF6B35', icon: '🛣️' },
      water: { name: 'Water Supply', color: '#4299E1', icon: '💧' },
      sanitation: { name: 'Sanitation & Waste', color: '#38A169', icon: '🗑️' },
      electricity: { name: 'Electricity', color: '#ED8936', icon: '⚡' },
      safety: { name: 'Public Safety', color: '#E53E3E', icon: '🚨' },
      transport: { name: 'Transport', color: '#805AD5', icon: '🚌' },
      health: { name: 'Health', color: '#E53E3E', icon: '🏥' },
      education: { name: 'Education', color: '#3182CE', icon: '📚' },
      environment: { name: 'Environment', color: '#38A169', icon: '🌳' },
      other: { name: 'Other', color: '#718096', icon: '📁' }
    }
    return map[cat.toLowerCase()] || map.other
  }

  if (loading) {
    return (
      <DashboardLayout role="department_admin" menuItems={menuItems} title="Department Statistics">
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>
          ⏳ Loading statistics...
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="Department Statistics">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* ✅ FIXED: Header Banner with explicit white text */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1a202c, #2d3748)', 
          borderRadius: '14px', 
          padding: '28px', 
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF' }}>
            📊 Department Statistics
          </h2>
          <p style={{ fontSize: '14px', opacity: 0.9, color: '#E2E8F0' }}>
            Comprehensive performance overview of {data.departmentName}
          </p>
        </div>

        {/* Overall Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', textAlign: 'center', borderLeft: '4px solid #FF6B35' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#FF6B35', lineHeight: 1, marginBottom: '4px' }}>{data.totalComplaints}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Total Complaints</div>
          </div>
          
          <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', textAlign: 'center', borderLeft: '4px solid #38A169' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#38A169', lineHeight: 1, marginBottom: '4px' }}>{data.resolved}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Resolved</div>
          </div>
          
          <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', textAlign: 'center', borderLeft: '4px solid #ED8936' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#ED8936', lineHeight: 1, marginBottom: '4px' }}>{data.pending}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Pending</div>
          </div>
          
          <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', textAlign: 'center', borderLeft: '4px solid #805AD5' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#805AD5', lineHeight: 1, marginBottom: '4px' }}>{data.officers}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Officers</div>
          </div>
          
          <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', textAlign: 'center', borderLeft: '4px solid #38A169' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#38A169', lineHeight: 1, marginBottom: '4px' }}>{data.slaPercent}%</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Avg SLA</div>
          </div>
        </div>

        {/* Category Breakdown */}
        {data.categories.length === 0 ? (
          <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '60px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>No Data Yet</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>No complaints have been registered for your department yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {data.categories.map((cat) => {
              const meta = getCategoryMeta(cat._id)
              const sla = cat.total > 0 ? Math.round((cat.resolved / cat.total) * 100) : 0
              return (
                <div key={cat._id} style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '22px', boxShadow: 'var(--shadow-sm)', borderTop: `4px solid ${meta.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', background: meta.color + '20', color: meta.color, letterSpacing: '1px' }}>
                        {meta.icon} {cat._id || 'Other'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>{cat.total}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', marginTop: '4px' }}>Total</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: '#38A169', lineHeight: 1 }}>{cat.resolved}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', marginTop: '4px' }}>Resolved</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: '#ED8936', lineHeight: 1 }}>{cat.pending}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', marginTop: '4px' }}>Pending</div>
                    </div>
                  </div>

                  <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                      <span style={{ color: 'var(--text-tertiary)', fontWeight: '600' }}>Resolution Rate</span>
                      <span style={{ color: meta.color, fontWeight: '800' }}>{sla}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--border-light)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${sla}%`, height: '100%', background: meta.color, borderRadius: '3px' }}></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default DepartmentStats