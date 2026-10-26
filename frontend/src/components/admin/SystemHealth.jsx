import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'

const SystemHealth = () => {
  const [loading, setLoading] = useState(true)
  const [health, setHealth] = useState(null)
  const [error, setError] = useState('')

  // ===================================
  // FETCH REAL SYSTEM HEALTH
  // ===================================
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setLoading(true)
        const res = await api.get('/admin/health')
        if (res.data?.success) {
          setHealth(res.data.health)
        }
      } catch (err) {
        console.error('Failed to fetch health:', err)
        setError('Failed to load system health metrics.')
      } finally {
        setLoading(false)
      }
    }

    // Fetch immediately, then every 30 seconds
    fetchHealth()
    const interval = setInterval(fetchHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Loading system health...</div>
  }

  if (error || !health) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#E53E3E' }}>⚠️ {error || 'Failed to load data'}</div>
  }

  // Calculate real memory usage percentage
  const memoryPercentage = health.memory?.total > 0 
    ? Math.round((health.memory.used / health.memory.total) * 100)
    : 0

  // Format uptime into days and hours
  const uptimeDays = Math.floor(health.uptime / (60 * 60 * 24))
  const uptimeHours = Math.floor((health.uptime % (60 * 60 * 24)) / (60 * 60))

  const getStatusColor = (value, thresholds) => {
    if (value < thresholds.good) return '#38A169'
    if (value < thresholds.warning) return '#ED8936'
    return '#E53E3E'
  }

  const MetricBar = ({ label, value, unit = '%', color }) => (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ color, fontWeight: '800' }}>{value}{unit}</span>
      </div>
      <div style={{ height: '8px', background: 'var(--bg-surface-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(value, 100)}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
      </div>
    </div>
  )

  const StatCard = ({ children }) => (
    <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
      {children}
    </div>
  )

  return (
    <div className="dashboard-content" style={{ padding: '24px' }}>
      
      {/* Top Stats Grid - Real Data */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <StatCard>
          <div style={{ fontSize: '28px', fontWeight: '800', color: health.database?.isHealthy ? '#38A169' : '#E53E3E', lineHeight: '1', marginBottom: '6px' }}>
            {health.database?.isHealthy ? '🟢' : '🔴'}
          </div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {health.database?.isHealthy ? 'Operational' : 'Degraded'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '600' }}>System Status</div>
        </StatCard>
        
        <StatCard>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#4299E1', lineHeight: '1', marginBottom: '6px' }}>
            {uptimeDays}d {uptimeHours}h
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '600' }}>Uptime</div>
        </StatCard>
        
        <StatCard>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#805AD5', lineHeight: '1', marginBottom: '6px' }}>
            {health.nodeVersion}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '600' }}>Node Version</div>
        </StatCard>
        
        <StatCard>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#38A169', lineHeight: '1', marginBottom: '6px' }}>
            {health.environment?.toUpperCase()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '600' }}>Environment</div>
        </StatCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* System Resources - Real Memory Usage */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>
            ⚡ System Resources
          </h3>
          
          {/* Note: Node.js can't directly get CPU/Disk without native libraries, 
              so we show Memory (Heap) which is tracked by the backend natively. */}
          <MetricBar 
            label="Memory Usage (Heap)" 
            value={memoryPercentage} 
            color={getStatusColor(memoryPercentage, { good: 70, warning: 85 })} 
          />
          
          <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
            <div>Used: <strong>{health.memory?.used} MB</strong></div>
            <div>Total Allocated: <strong>{health.memory?.total} MB</strong></div>
          </div>
        </div>

        {/* API Metrics - Real DB & Status */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>
            📡 Service Metrics
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Database Status', value: health.database?.status || 'Unknown', color: health.database?.isHealthy ? '#38A169' : '#E53E3E' },
              { label: 'Uptime (Seconds)', value: Math.floor(health.uptime), color: 'var(--text-primary)' },
              { label: 'Node Environment', value: health.environment, color: '#805AD5' }
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-surface-secondary)', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{row.label}</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts (Static for now until alert system is built) */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow-sm)', gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>
            🚨 System Alerts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: 'var(--bg-surface-secondary)', borderRadius: '10px' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(56, 161, 105, 0.2)', color: '#38A169', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                ✅
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600' }}>System is running optimally. No alerts.</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SystemHealth