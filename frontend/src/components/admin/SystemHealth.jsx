import React, { useState, useEffect } from 'react'

const SystemHealth = () => {
  const [metrics, setMetrics] = useState({
    cpu: 24, memory: 62, disk: 47, uptime: '14 days, 6 hours',
    activeUsers: 156, requests: 12847, responseTime: 245, errorRate: 0.2
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpu: Math.round(20 + Math.random() * 20),
        memory: Math.round(55 + Math.random() * 15),
        requests: prev.requests + Math.round(Math.random() * 50),
        responseTime: Math.round(200 + Math.random() * 100)
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

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
    <div className="dashboard-content">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <StatCard>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#38A169', lineHeight: '1', marginBottom: '6px' }}>🟢</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Operational</div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '600' }}>System Status</div>
        </StatCard>
        <StatCard>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#4299E1', lineHeight: '1', marginBottom: '6px' }}>
            {metrics.uptime.split(',')[0]}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '600' }}>Uptime</div>
        </StatCard>
        <StatCard>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#805AD5', lineHeight: '1', marginBottom: '6px' }}>
            {metrics.activeUsers}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '600' }}>Active Users</div>
        </StatCard>
        <StatCard>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#38A169', lineHeight: '1', marginBottom: '6px' }}>99.98%</div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '600' }}>Uptime SLA</div>
        </StatCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>
            ⚡ System Resources
          </h3>
          <MetricBar label="CPU Usage" value={metrics.cpu} color={getStatusColor(metrics.cpu, { good: 60, warning: 80 })} />
          <MetricBar label="Memory Usage" value={metrics.memory} color={getStatusColor(metrics.memory, { good: 70, warning: 85 })} />
          <MetricBar label="Disk Usage" value={metrics.disk} color={getStatusColor(metrics.disk, { good: 70, warning: 85 })} />
        </div>

        <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>
            📡 API Metrics
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Total Requests', value: metrics.requests.toLocaleString(), color: 'var(--text-primary)' },
              { label: 'Avg Response Time', value: `${metrics.responseTime} ms`, color: metrics.responseTime < 300 ? '#38A169' : '#ED8936' },
              { label: 'Error Rate', value: `${metrics.errorRate}%`, color: metrics.errorRate < 1 ? '#38A169' : '#E53E3E' },
              { label: 'Database Connection', value: '🟢 Healthy', color: '#38A169' },
              { label: 'Email Service', value: '🟢 Connected', color: '#38A169' }
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-surface-secondary)', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{row.label}</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow-sm)', gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>
            🚨 Recent System Alerts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: '✅', color: '#38A169', bg: 'rgba(56, 161, 105, 0.2)', message: 'Database backup completed successfully', time: '2 hours ago' },
              { icon: 'ℹ️', color: '#4299E1', bg: 'rgba(66, 153, 225, 0.2)', message: 'Scheduled maintenance in 3 days', time: '6 hours ago' },
              { icon: '⚠️', color: '#ED8936', bg: 'rgba(237, 137, 54, 0.2)', message: 'High memory usage detected (78%)', time: '12 hours ago' },
              { icon: '✅', color: '#38A169', bg: 'rgba(56, 161, 105, 0.2)', message: 'SSL certificate renewed for 90 days', time: '2 days ago' }
            ].map((alert, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: 'var(--bg-surface-secondary)', borderRadius: '10px' }}>
                <div style={{ width: '40px', height: '40px', background: alert.bg, color: alert.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  {alert.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600' }}>{alert.message}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{alert.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemHealth