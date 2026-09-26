import React, { useState, useMemo } from 'react'
import './DepartmentManagement.css'

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Public Works', code: 'PWD', head: 'Rajesh Kumar', email: 'pwd@janvoice.gov.in', officers: 12, complaints: 45, sla: 84, status: 'active' },
    { id: 2, name: 'Water Supply', code: 'WTR', head: 'Anitha Sharma', email: 'water@janvoice.gov.in', officers: 8, complaints: 32, sla: 88, status: 'active' },
    { id: 3, name: 'Sanitation', code: 'SAN', head: 'Mohan Rao', email: 'sanitation@janvoice.gov.in', officers: 15, complaints: 58, sla: 90, status: 'active' },
    { id: 4, name: 'Electricity', code: 'ELC', head: 'Priya Nair', email: 'power@janvoice.gov.in', officers: 6, complaints: 22, sla: 82, status: 'active' },
    { id: 5, name: 'Roads & Transport', code: 'RDT', head: 'Suresh Reddy', email: 'roads@janvoice.gov.in', officers: 10, complaints: 38, sla: 86, status: 'active' },
    { id: 6, name: 'Parks & Recreation', code: 'PRK', head: 'Lakshmi Iyer', email: 'parks@janvoice.gov.in', officers: 4, complaints: 12, sla: 92, status: 'inactive' }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingDept, setEditingDept] = useState(null)
  const [toast, setToast] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    head: '',
    email: '',
    status: 'active'
  })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const filteredDepts = useMemo(() => {
    return departments.filter((d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.head.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [departments, searchTerm])

  const stats = useMemo(() => ({
    total: departments.length,
    active: departments.filter((d) => d.status === 'active').length,
    totalOfficers: departments.reduce((sum, d) => sum + d.officers, 0),
    totalComplaints: departments.reduce((sum, d) => sum + d.complaints, 0)
  }), [departments])

  const openAddModal = () => {
    setEditingDept(null)
    setFormData({ name: '', code: '', head: '', email: '', status: 'active' })
    setShowModal(true)
  }

  const openEditModal = (dept) => {
    setEditingDept(dept)
    setFormData({
      name: dept.name,
      code: dept.code,
      head: dept.head,
      email: dept.email,
      status: dept.status
    })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingDept) {
      setDepartments(departments.map((d) =>
        d.id === editingDept.id ? { ...d, ...formData } : d
      ))
      showToast('Department updated successfully! ✅')
    } else {
      const newDept = {
        id: departments.length + 1,
        ...formData,
        officers: 0,
        complaints: 0,
        sla: 100
      }
      setDepartments([...departments, newDept])
      showToast('Department added successfully! ✅')
    }
    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this department? All associated data will be affected.')) {
      setDepartments(departments.filter((d) => d.id !== id))
      showToast('Department deleted! 🗑️', 'danger')
    }
  }

  const toggleStatus = (id) => {
    setDepartments(departments.map((d) =>
      d.id === id ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' } : d
    ))
    showToast('Status updated! ✅')
  }

  return (
    <div className="dept-management">
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

      <div className="page-header">
        <div>
          <h2>🏛️ Department Management</h2>
          <p>Manage all government departments</p>
        </div>
        <button className="btn-add" onClick={openAddModal}>
          <span>➕</span> Add Department
        </button>
      </div>

      <div className="quick-stats">
        <div className="quick-stat">
          <span className="qs-icon">🏛️</span>
          <div>
            <div className="qs-value">{stats.total}</div>
            <div className="qs-label">Total</div>
          </div>
        </div>
        <div className="quick-stat">
          <span className="qs-icon">✅</span>
          <div>
            <div className="qs-value">{stats.active}</div>
            <div className="qs-label">Active</div>
          </div>
        </div>
        <div className="quick-stat">
          <span className="qs-icon">👥</span>
          <div>
            <div className="qs-value">{stats.totalOfficers}</div>
            <div className="qs-label">Officers</div>
          </div>
        </div>
        <div className="quick-stat">
          <span className="qs-icon">📋</span>
          <div>
            <div className="qs-value">{stats.totalComplaints}</div>
            <div className="qs-label">Complaints</div>
          </div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search departments by name, code or head..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="dept-grid">
        {filteredDepts.map((dept) => (
          <div key={dept.id} className="dept-card">
            <div className="dept-card-header">
              <div className="dept-title">
                <div className="dept-code-badge">{dept.code}</div>
                <div>
                  <h3>{dept.name}</h3>
                  <span className={`dept-status status-${dept.status}`}>
                    ● {dept.status}
                  </span>
                </div>
              </div>
              <div className="dept-actions">
                <button className="btn-icon edit" onClick={() => openEditModal(dept)} title="Edit">
                  ✏️
                </button>
                <button className="btn-icon toggle" onClick={() => toggleStatus(dept.id)} title="Toggle">
                  {dept.status === 'active' ? '🔒' : '🔓'}
                </button>
                <button className="btn-icon delete" onClick={() => handleDelete(dept.id)} title="Delete">
                  🗑️
                </button>
              </div>
            </div>

            <div className="dept-head">
              <span className="head-icon">👤</span>
              <div>
                <div className="head-name">{dept.head}</div>
                <div className="head-email">{dept.email}</div>
              </div>
            </div>

            <div className="dept-stats-row">
              <div className="dept-stat-mini">
                <div className="dsm-value">{dept.officers}</div>
                <div className="dsm-label">Officers</div>
              </div>
              <div className="dept-stat-mini">
                <div className="dsm-value">{dept.complaints}</div>
                <div className="dsm-label">Complaints</div>
              </div>
              <div className="dept-stat-mini">
                <div className="dsm-value">{dept.sla}%</div>
                <div className="dsm-label">SLA</div>
              </div>
            </div>

            <div className="dept-progress">
              <div
                className="dept-progress-fill"
                style={{
                  width: `${dept.sla}%`,
                  background: dept.sla >= 90 ? '#38A169' : dept.sla >= 80 ? '#F7931E' : '#E53E3E'
                }}
              ></div>
            </div>
          </div>
        ))}

        {filteredDepts.length === 0 && (
          <div className="empty-state-full">
            <span className="empty-icon">🔍</span>
            <p>No departments found</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingDept ? '✏️ Edit Department' : '➕ Add Department'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Department Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Public Works"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., PWD"
                    maxLength="5"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Department Head *</label>
                  <input
                    type="text"
                    value={formData.head}
                    onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                    placeholder="Full name"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="dept@janvoice.gov.in"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingDept ? '💾 Update' : '➕ Add'} Department
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