import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'
import './DepartmentManagement.css'

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    head: '',
    contactEmail: '',
    contactPhone: '',
    color: '#FF6B35'
  })

  // ===================================
  // FETCH REAL DEPARTMENTS
  // ===================================
  const fetchDepartments = async () => {
    try {
      setLoading(true)
      setError('')
      // ✅ Fetch from the new endpoint
      const res = await api.get('/admin/departments-stats')
      setDepartments(res.data?.departments || [])
    } catch (err) {
      console.error('Failed to fetch departments:', err)
      setError('Failed to load departments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  // ===================================
  // HANDLE SAVE
  // ===================================
  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.code) {
      alert('Name and Code are required')
      return
    }

    setSaving(true)
    try {
      if (editing) {
        await api.patch(`/departments/${editing._id}`, formData)
      } else {
        await api.post('/departments', formData)
      }
      
      await fetchDepartments()
      setShowModal(false)
      setEditing(null)
    } catch (err) {
      console.error('Failed to save department:', err)
      alert(err.response?.data?.message || 'Failed to save department.')
    } finally {
      setSaving(false)
    }
  }

  // ===================================
  // HANDLE DELETE
  // ===================================
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await api.delete(`/departments/${id}`)
        await fetchDepartments()
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete department.')
      }
    }
  }

  const openEdit = (dept) => {
    setEditing(dept)
    setFormData({
      name: dept.name || '',
      code: dept.code || '',
      head: dept.head || '',
      contactEmail: dept.contactEmail || '',
      contactPhone: dept.contactPhone || '',
      color: dept.color || '#FF6B35'
    })
    setShowModal(true)
  }

  const openCreate = () => {
    setEditing(null)
    setFormData({
      name: '',
      code: '',
      head: '',
      contactEmail: '',
      contactPhone: '',
      color: '#FF6B35'
    })
    setShowModal(true)
  }

  // Calculate totals for the top cards
  const totalOfficers = departments.reduce((sum, d) => sum + (d.officers || 0), 0)
  const totalComplaints = departments.reduce((sum, d) => sum + (d.complaints || 0), 0)
  const overallSla = departments.length > 0 
    ? Math.round(departments.reduce((sum, d) => sum + (d.sla || 0), 0) / departments.length)
    : 0

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading departments...</div>

  return (
    <div className="dashboard-content">
      
      {error && (
        <div style={{ background: 'rgba(229, 62, 62, 0.1)', color: '#C53030', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* KPI Summary */}
      <div className="dept-summary">
        <div className="summary-card">
          <div className="summary-value">{departments.length}</div>
          <div className="summary-label">Total Departments</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{totalOfficers}</div>
          <div className="summary-label">Total Officers</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{totalComplaints}</div>
          <div className="summary-label">Total Complaints</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{overallSla}%</div>
          <div className="summary-label">Overall SLA</div>
        </div>
      </div>

      {/* Main List */}
      <div className="dept-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">🏛️ All Departments</h3>
            <p className="card-subtitle">Manage government departments and their performance</p>
          </div>
          <button className="btn-primary" onClick={openCreate}>
            ➕ Add Department
          </button>
        </div>

        <div className="dept-grid">
          {departments.map((dept) => (
            <div key={dept._id} className="dept-item">
              <div className="dept-item-header">
                <div
                  className="dept-badge"
                  style={{ background: (dept.color || '#FF6B35') + '20', color: dept.color || '#FF6B35' }}
                >
                  {dept.code}
                </div>
                <div className="dept-actions">
                  <button className="icon-action" onClick={() => openEdit(dept)}>
                    ✏️
                  </button>
                  <button className="icon-action danger" onClick={() => handleDelete(dept._id)}>
                    🗑️
                  </button>
                </div>
              </div>

              <h4 className="dept-item-name">{dept.name}</h4>
              <p className="dept-head">👤 Head: {dept.head || 'Not assigned'}</p>

              <div className="dept-metrics">
                <div className="dept-metric">
                  <div className="metric-value">{dept.officers || 0}</div>
                  <div className="metric-label">Officers</div>
                </div>
                <div className="dept-metric">
                  <div className="metric-value">{dept.complaints || 0}</div>
                  <div className="metric-label">Complaints</div>
                </div>
                <div className="dept-metric">
                  <div className="metric-value" style={{ color: dept.color || '#FF6B35' }}>{dept.sla || 0}%</div>
                  <div className="metric-label">SLA</div>
                </div>
              </div>

              <div className="dept-progress">
                <div
                  className="dept-progress-fill"
                  style={{ width: `${dept.sla || 0}%`, background: dept.color || '#FF6B35' }}
                ></div>
              </div>
            </div>
          ))}
          
          {departments.length === 0 && (
             <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#718096' }}>
               No departments found. Click "Add Department" to create one.
             </div>
          )}
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? '✏️ Edit Department' : '➕ Add Department'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Department Name *</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="e.g., Public Works"
                  />
                </div>
                <div className="form-group">
                  <label>Department Code *</label>
                  <input 
                    type="text" 
                    value={formData.code} 
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
                    placeholder="e.g., PW" 
                    maxLength="4" 
                  />
                </div>
                <div className="form-group">
                  <label>Department Head</label>
                  <input 
                    type="text" 
                    value={formData.head} 
                    onChange={(e) => setFormData({ ...formData, head: e.target.value })} 
                    placeholder="Head officer name" 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : (editing ? 'Save' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DepartmentManagement