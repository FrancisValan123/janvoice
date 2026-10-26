import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'

const AnalyticsOverview = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Existing KPI state
  const [kpis, setKpis] = useState({ total: 0, resolved: 0, pending: 0, avgDays: 0 })
  const [trend, setTrend] = useState([])
  const [byCategory, setByCategory] = useState([])

  // ✅ STATE: For the complaint list
  const [complaints, setComplaints] = useState([])
  const [deletingId, setDeletingId] = useState(null)

  // ✅ Extracted fetch function so we can call it again after deleting
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const res = await api.get('/analytics/overview?range=30d')
      const data = res.data

      if (data.success) {
        setKpis({
          total: data.kpis.totalComplaints || 0,
          resolved: data.kpis.resolvedComplaints || 0,
          pending: data.kpis.pendingComplaints || 0,
          avgDays: data.kpis.avgResolutionDays || 0
        })
        setTrend(data.trend || [])
        
        const catColors = { roads: '#FF6B35', water: '#4299E1', sanitation: '#38A169', electricity: '#ED8936', safety: '#E53E3E', other: '#718096' }
        const formattedCats = (data.byCategory || []).map(c => ({
          name: c._id ? c._id.charAt(0).toUpperCase() + c._id.slice(1) : 'Unknown',
          count: c.count,
          color: catColors[c._id] || '#718096'
        }))
        setByCategory(formattedCats)
      }

      // ✅ FIXED: Increased limit to 100 so all complaints show up
      const compRes = await api.get('/complaints?limit=100')
      // ✅ FIXED: Read from 'complaints' property, not 'data'
      setComplaints(compRes.data?.complaints || [])

    } catch (err) {
      console.error('Failed to load analytics:', err)
      setError('Failed to load analytics from the server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  // ✅ Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this complaint? This action cannot be undone.')) return

    setDeletingId(id)
    try {
      await api.delete(`/complaints/${id}`)
      
      // Re-fetch everything so the KPI cards update automatically
      await fetchAnalyticsData()
      alert('Complaint deleted successfully.')
      
    } catch (err) {
      console.error('Delete failed:', err)
      alert(err.response?.data?.message || 'Failed to delete complaint.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading && complaints.length === 0) {
    return <div className="p-6" style={{ padding: '40px', textAlign: 'center' }}>Loading analytics...</div>
  }

  return (
    <div className="p-6" style={{ padding: '24px' }}>
      
      {error && (
        <div style={{ background: 'rgba(229, 62, 62, 0.1)', color: '#C53030', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontWeight: 600 }}>
          ⚠️ {error}
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontSize: '24px', fontWeight: '800', color: '#1a202c', marginBottom: '24px' }}>
        Analytics Overview
      </h1>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ color: '#718096', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Total Complaints</h3>
          <p style={{ fontSize: '32px', fontWeight: '800', color: '#1a202c', margin: 0 }}>{kpis.total}</p>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ color: '#718096', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Resolved</h3>
          <p style={{ fontSize: '32px', fontWeight: '800', color: '#38A169', margin: 0 }}>{kpis.resolved}</p>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ color: '#718096', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Pending</h3>
          <p style={{ fontSize: '32px', fontWeight: '800', color: '#ED8936', margin: 0 }}>{kpis.pending}</p>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ color: '#718096', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Avg. Resolution Time</h3>
          <p style={{ fontSize: '32px', fontWeight: '800', color: '#4299E1', margin: 0 }}>{kpis.avgDays} days</p>
        </div>
      </div>

      {/* Manage Complaints Table */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '24px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', margin: 0 }}>🗑️ Manage Complaints</h2>
          <span style={{ fontSize: '12px', color: '#718096', fontWeight: '600' }}>Showing {complaints.length} records</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#718096', textTransform: 'uppercase' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#718096', textTransform: 'uppercase' }}>Title</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#718096', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#718096', textTransform: 'uppercase' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c._id} style={{ borderBottom: '1px solid #edf2f7' }}>
                <td style={{ padding: '12px', fontSize: '13px', fontWeight: '700', color: '#FF6B35' }}>{c.complaintId}</td>
                <td style={{ padding: '12px', fontSize: '13px', color: '#2d3748' }}>{c.title}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: c.status === 'resolved' ? '#C6F6D5' : '#FEEBC8', color: c.status === 'resolved' ? '#276749' : '#9C4221' }}>
                    {c.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleDelete(c._id)}
                    disabled={deletingId === c._id}
                    style={{ 
                      padding: '6px 12px', 
                      background: '#FFF5F5', 
                      border: '1px solid #FED7D7', 
                      color: '#E53E3E', 
                      borderRadius: '6px', 
                      fontSize: '12px', 
                      fontWeight: '700', 
                      cursor: deletingId === c._id ? 'not-allowed' : 'pointer',
                      opacity: deletingId === c._id ? 0.6 : 1
                    }}
                  >
                    {deletingId === c._id ? 'Deleting...' : '🗑️ Delete'}
                  </button>
                </td>
              </tr>
            ))}
            {complaints.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#a0aec0' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default AnalyticsOverview