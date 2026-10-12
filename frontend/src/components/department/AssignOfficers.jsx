import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { useNavigate } from 'react-router-dom'

const AssignOfficers = () => {
  const navigate = useNavigate()

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

  const [unassigned, setUnassigned] = useState([
    { id: 'JV2026100', title: 'Broken footpath near school', category: 'Roads', priority: 'high', location: 'Anna Nagar', affected: 120, createdAt: '2 hours ago' },
    { id: 'JV2026101', title: 'Water tank leakage', category: 'Water', priority: 'emergency', location: 'T Nagar', affected: 300, createdAt: '30 min ago' },
    { id: 'JV2026102', title: 'Streetlight outage', category: 'Electricity', priority: 'normal', location: 'Velachery', affected: 45, createdAt: '5 hours ago' },
    { id: 'JV2026103', title: 'Garbage bin overflow', category: 'Sanitation', priority: 'normal', location: 'Adyar', affected: 80, createdAt: '1 day ago' }
  ])

  const [officers] = useState([
    { id: '1', name: 'Ravi Kumar', dept: 'Public Works', active: 5, capacity: 8, rating: 4.8, zone: 'North' },
    { id: '2', name: 'Priya Sharma', dept: 'Water Supply', active: 3, capacity: 8, rating: 4.9, zone: 'Central' },
    { id: '3', name: 'Suresh Rajan', dept: 'Public Works', active: 7, capacity: 8, rating: 4.5, zone: 'South' },
    { id: '4', name: 'Meena Rao', dept: 'Sanitation', active: 4, capacity: 8, rating: 4.7, zone: 'Central' },
    { id: '5', name: 'Anand Verma', dept: 'Electricity', active: 2, capacity: 8, rating: 4.6, zone: 'West' }
  ])

  const [selectedCase, setSelectedCase] = useState(null)
  const [selectedOfficer, setSelectedOfficer] = useState(null)
  const [searchOfficer, setSearchOfficer] = useState('')
  const [success, setSuccess] = useState(false)

  const getPriorityConfig = (p) => {
    const map = {
      emergency: { icon: '🔴', label: 'Emergency', color: '#E53E3E', bg: '#FED7D7' },
      high: { icon: '🟠', label: 'High', color: '#F7931E', bg: '#FEEBC8' },
      normal: { icon: '🟡', label: 'Normal', color: '#ECC94B', bg: '#FEFCBF' },
      low: { icon: '🔵', label: 'Low', color: '#4299E1', bg: '#BEE3F8' }
    }
    return map[p] || map.normal
  }

  const handleAssign = () => {
    if (!selectedCase || !selectedOfficer) {
      alert('Please select both a case and an officer')
      return
    }
    setUnassigned((prev) => prev.filter((c) => c.id !== selectedCase.id))
    setSuccess(true)
    setSelectedCase(null)
    setSelectedOfficer(null)
    setTimeout(() => setSuccess(false), 3000)
  }

  const filteredOfficers = officers.filter(
    (o) =>
      o.name.toLowerCase().includes(searchOfficer.toLowerCase()) ||
      o.dept.toLowerCase().includes(searchOfficer.toLowerCase())
  )

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="Assign Officers">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {success && (
          <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#38A169', color: 'white', padding: '14px 24px', borderRadius: '10px', fontWeight: '700', boxShadow: '0 8px 24px rgba(56,161,105,0.3)', zIndex: 1000 }}>
            ✅ Case assigned successfully!
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1a202c', marginBottom: '8px' }}>
            👥 Assign Officers to Cases
          </h2>
          <p style={{ fontSize: '14px', color: '#718096' }}>
            Match unassigned complaints with the best available officer based on zone and workload
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Left: Unassigned Cases */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>
                📋 Unassigned Cases ({unassigned.length})
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {unassigned.map((c) => {
                const priority = getPriorityConfig(c.priority)
                const isSelected = selectedCase?.id === c.id
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    style={{
                      padding: '14px',
                      background: isSelected ? '#FFF5F0' : '#f7fafc',
                      border: isSelected ? '2px solid #FF6B35' : '2px solid transparent',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10px', fontWeight: '800', background: '#1a202c', color: 'white', padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.5px' }}>
                        {c.id}
                      </span>
                      <span style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: '700', background: priority.bg, color: priority.color }}>
                        {priority.icon} {priority.label}
                      </span>
                      <span style={{ fontSize: '10px', color: '#a0aec0', fontWeight: '600' }}>{c.createdAt}</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c', marginBottom: '6px' }}>
                      {c.title}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#718096', flexWrap: 'wrap' }}>
                      <span>📁 {c.category}</span>
                      <span>📍 {c.location}</span>
                      <span>👥 {c.affected}</span>
                    </div>
                  </div>
                )
              })}
              {unassigned.length === 0 && (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#718096' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                  <p style={{ fontSize: '14px', fontWeight: '600' }}>All cases assigned!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Officers */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>
                👨‍💼 Available Officers
              </h3>
              <input
                type="text"
                placeholder="Search..."
                value={searchOfficer}
                onChange={(e) => setSearchOfficer(e.target.value)}
                style={{ padding: '8px 12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', minWidth: '180px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredOfficers.map((o) => {
                const isSelected = selectedOfficer?.id === o.id
                const workload = Math.round((o.active / o.capacity) * 100)
                const workloadColor = workload > 80 ? '#E53E3E' : workload > 50 ? '#ED8936' : '#38A169'
                return (
                  <div
                    key={o.id}
                    onClick={() => setSelectedOfficer(o)}
                    style={{
                      padding: '14px',
                      background: isSelected ? '#EDF2FF' : '#f7fafc',
                      border: isSelected ? '2px solid #805AD5' : '2px solid transparent',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #805AD5, #6B46C1)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px', flexShrink: 0 }}>
                        {o.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c' }}>{o.name}</div>
                        <div style={{ fontSize: '11px', color: '#718096' }}>
                          {o.dept} • {o.zone} zone • ⭐ {o.rating}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#718096', marginBottom: '4px', fontWeight: '600' }}>
                        <span>Workload: {o.active}/{o.capacity}</span>
                        <span style={{ color: workloadColor }}>{workload}%</span>
                      </div>
                      <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${workload}%`, height: '100%', background: workloadColor, borderRadius: '3px' }}></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Assignment Footer */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', marginTop: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            {selectedCase && selectedOfficer ? (
              <div style={{ fontSize: '14px', color: '#2d3748' }}>
                Assign <strong>{selectedCase.id}</strong> to <strong>{selectedOfficer.name}</strong>?
              </div>
            ) : (
              <div style={{ fontSize: '14px', color: '#718096' }}>
                Select a case and an officer to proceed
              </div>
            )}
          </div>
          <button
            onClick={handleAssign}
            disabled={!selectedCase || !selectedOfficer}
            style={{
              padding: '14px 32px',
              background: selectedCase && selectedOfficer ? 'linear-gradient(135deg, #805AD5, #6B46C1)' : '#cbd5e0',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: selectedCase && selectedOfficer ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              boxShadow: selectedCase && selectedOfficer ? '0 4px 12px rgba(128, 90, 213, 0.3)' : 'none'
            }}
          >
            ✅ Assign Officer
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AssignOfficers