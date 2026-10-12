import React, { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'

const SystemHealth = () => {
  const [metrics, setMetrics] = useState({
    cpu: 24,
    memory: 62,
    disk: 47,
    uptime: '14 days, 6 hours',
    activeUsers: 156,
    requests: 12847,
    responseTime: 245,
    errorRate: 0.2
  })

  // Simulate live updates
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '6px',
          fontSize: '13px',
          fontWeight: '600'
        }}
      >
        <span style={{ color: '#4a5568' }}>{label}</span>
        <span style={{ color, fontWeight: '800' }}>
          {value}{unit}
        </span>
      </div>
      <div
        style={{
          height: '8px',
          background: '#edf2f7',
          borderRadius: '4px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${Math.min(value, 100)}%`,
            height: '100%',
            background: color,
            borderRadius: '4px',
            transition: 'width 0.5s ease'
          }}
        ></div>
      </div>
    </div>
  )

  return (
    <AdminLayout title="System Health">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#38A169', lineHeight: '1', marginBottom: '6px' }}>
            🟢
          </div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '4px' }}>Operational</div>
          <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '600' }}>System Status</div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#4299E1', lineHeight: '1', marginBottom: '6px' }}>
            {metrics.uptime.split(',')[0]}
          </div>
          <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '600' }}>Uptime</div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#805AD5', lineHeight: '1', marginBottom: '6px' }}>
            {metrics.activeUsers}
          </div>
          <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '600' }}>Active Users</div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#38A169', lineHeight: '1', marginBottom: '6px' }}>
            {metrics.uptime.includes('14') ? '99.98' : '99.95'}%
          </div>
          <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '600' }}>Uptime SLA</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* System Metrics */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>
            ⚡ System Resources
          </h3>
          <MetricBar
            label="CPU Usage"
            value={metrics.cpu}
            color={getStatusColor(metrics.cpu, { good: 60, warning: 80 })}
          />
          <MetricBar
            label="Memory Usage"
            value={metrics.memory}
            color={getStatusColor(metrics.memory, { good: 70, warning: 85 })}
          />
          <MetricBar
            label="Disk Usage"
            value={metrics.disk}
            color={getStatusColor(metrics.disk, { good: 70, warning: 85 })}
          />
        </div>

        {/* API Metrics */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>
            📡 API Metrics
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
              <span style={{ fontSize: '13px', color: '#4a5568' }}>Total Requests</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#1a202c' }}>
                {metrics.requests.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
              <span style={{ fontSize: '13px', color: '#4a5568' }}>Avg Response Time</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: metrics.responseTime < 300 ? '#38A169' : '#ED8936' }}>
                {metrics.responseTime} ms
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
              <span style={{ fontSize: '13px', color: '#4a5568' }}>Error Rate</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: metrics.errorRate < 1 ? '#38A169' : '#E53E3E' }}>
                {metrics.errorRate}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
              <span style={{ fontSize: '13px', color: '#4a5568' }}>Database Connection</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#38A169' }}>
                🟢 Healthy
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
              <span style={{ fontSize: '13px', color: '#4a5568' }}>Email Service</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#38A169' }}>
                🟢 Connected
              </span>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)', gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>
            🚨 Recent System Alerts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: '✅', color: '#38A169', bg: '#c6f6d5', message: 'Database backup completed successfully', time: '2 hours ago' },
              { icon: 'ℹ️', color: '#4299E1', bg: '#bee3f8', message: 'Scheduled maintenance in 3 days', time: '6 hours ago' },
              { icon: '⚠️', color: '#ED8936', bg: '#feebc8', message: 'High memory usage detected (78%)', time: '12 hours ago' },
              { icon: '✅', color: '#38A169', bg: '#c6f6d5', message: 'SSL certificate renewed for 90 days', time: '2 days ago' }
            ].map((alert, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px',
                  background: '#f7fafc',
                  borderRadius: '10px'
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: alert.bg,
                    color: alert.color,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0
                  }}
                >
                  {alert.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: '#1a202c', fontWeight: '600' }}>
                    {alert.message}
                  </div>
                  <div style={{ fontSize: '11px', color: '#a0aec0', marginTop: '2px' }}>
                    {alert.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default SystemHealth