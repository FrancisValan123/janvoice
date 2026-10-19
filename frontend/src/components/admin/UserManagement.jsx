import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import './UserManagement.css'

// ===================================
// ROLE HIERARCHY — mirrors backend
// ===================================
const CAN_CREATE = {
  system_admin: ['officer', 'department_admin', 'higher_authority', 'system_admin'],
  higher_authority: ['officer', 'department_admin'],
  department_admin: ['officer']
}

const ROLE_META = {
  citizen: { label: 'Citizen', icon: '👤', color: '#4299E1' },
  officer: { label: 'Officer', icon: '👨‍💼', color: '#805AD5' },
  department_admin: { label: 'Dept Admin', icon: '🏛️', color: '#ED8936' },
  higher_authority: { label: 'Authority', icon: '⭐', color: '#E53E3E' },
  system_admin: { label: 'System Admin', icon: '⚙️', color: '#1a202c' }
}

const ROLES_REQUIRING_DEPT = ['officer', 'department_admin']

const DEPARTMENTS = [
  'Public Works',
  'Water Supply',
  'Sanitation',
  'Electricity',
  'Transport',
  'Health',
  'Education',
  'Environment',
  'General'
]

const UserManagement = () => {
  const { user } = useAuth()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    department: ''
  })

  // ✅ NEW: State for tracking dept updates
  const [updatingDept, setUpdatingDept] = useState(null)

  const creatableRoles = CAN_CREATE[user?.role] || []

  // ===================================
  // FETCH USERS
  // ===================================
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/admin/users')
      setUsers(res.data?.users || [])
    } catch (err) {
      console.error('Fetch users error:', err)
      setError(err.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // ===================================
  // MODAL HANDLERS
  // ===================================
  const openCreate = () => {
    setSelectedUser(null)
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: creatableRoles[0] || '',
      department: ''
    })
    setFormError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedUser(null)
    setFormError('')
  }

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'role' && !ROLES_REQUIRING_DEPT.includes(value)) {
        next.department = ''
      }
      return next
    })
    setFormError('')
  }

  // ===================================
  // SUBMIT NEW USER
  // ===================================
  const handleSubmit = async () => {
    setFormError('')
    if (!formData.name.trim()) return setFormError('Name is required')
    if (!formData.email.trim()) return setFormError('Email is required')
    if (!selectedUser && !formData.password) return setFormError('Password is required for new users')
    if (!formData.role) return setFormError('Role is required')
    if (ROLES_REQUIRING_DEPT.includes(formData.role) && !formData.department) {
      return setFormError('Department is required for this role')
    }

    setSaving(true)
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone || undefined,
        role: formData.role
      }
      if (ROLES_REQUIRING_DEPT.includes(formData.role)) {
        payload.department = formData.department
      }

      await api.post('/admin/users', payload)
      await fetchUsers()
      closeModal()
    } catch (err) {
      console.error('Create user error:', err)
      setFormError(err.response?.data?.message || 'Failed to create user')
    } finally {
      setSaving(false)
    }
  }

  // ===================================
  // ✅ NEW: UPDATE USER DEPARTMENT
  // ===================================
  const handleUpdateDepartment = async (userId, newDept) => {
    try {
      setUpdatingDept(userId)
      await api.patch(`/admin/users/${userId}/department`, { department: newDept })
      await fetchUsers() // Refresh the list
    } catch (err) {
      console.error('Update department error:', err)
      alert(err.response?.data?.message || 'Failed to update department')
    } finally {
      setUpdatingDept(null)
    }
  }

  // ===================================
  // TOGGLE ACTIVE
  // ===================================
  const handleToggleActive = async (u) => {
    if (!window.confirm(`${u.isActive ? 'Deactivate' : 'Activate'} ${u.name}?`)) return
    try {
      await api.patch(`/admin/users/${u._id}/toggle-active`)
      await fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle user')
    }
  }

  // ===================================
  // RESET PASSWORD
  // ===================================
  const handleResetPassword = async (u) => {
    const newPassword = window.prompt(`Enter new password for ${u.name} (min 6 chars):`)
    if (!newPassword) return
    if (newPassword.length < 6) return alert('Password must be at least 6 characters')
    
    try {
      await api.patch(`/admin/users/${u._id}/reset-password`, { newPassword })
      alert('Password reset successfully')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reset password')
    }
  }

  // ===================================
  // FILTER
  // ===================================
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === 'all' || u.role === filterRole
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && u.isActive) ||
      (filterStatus === 'inactive' && !u.isActive)
    return matchSearch && matchRole && matchStatus
  })

  const getRoleConfig = (role) => ROLE_META[role] || ROLE_META.citizen

  return (
    <div className="dashboard-content">
      {/* Stats */}
      <div className="user-stats">
        <div className="mini-stat">
          <span className="mini-icon">👥</span>
          <div>
            <div className="mini-value">{users.length}</div>
            <div className="mini-label">Total Users</div>
          </div>
        </div>
        <div className="mini-stat">
          <span className="mini-icon">🟢</span>
          <div>
            <div className="mini-value">{users.filter((u) => u.isActive).length}</div>
            <div className="mini-label">Active</div>
          </div>
        </div>
        <div className="mini-stat">
          <span className="mini-icon">🔴</span>
          <div>
            <div className="mini-value">{users.filter((u) => !u.isActive).length}</div>
            <div className="mini-label">Inactive</div>
          </div>
        </div>
        <div className="mini-stat">
          <span className="mini-icon">✔️</span>
          <div>
            <div className="mini-value">{users.filter((u) => u.isVerified).length}</div>
            <div className="mini-label">Verified</div>
          </div>
        </div>
      </div>

      {/* Users Card */}
      <div className="users-card">
        <div className="card-header">
          <div className="card-title-group">
            <h3 className="card-title">👥 All Users</h3>
            <p className="card-subtitle">{filteredUsers.length} users found</p>
          </div>
          {creatableRoles.length > 0 && (
            <button className="btn-primary" onClick={openCreate}>
              ➕ Add User
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            {Object.entries(ROLE_META).map(([id, meta]) => (
              <option key={id} value={id}>
                {meta.icon} {meta.label}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">🟢 Active</option>
            <option value="inactive">🔴 Inactive</option>
          </select>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(229, 62, 62, 0.1)', color: '#C53030', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Department</th> {/* ✅ NEW COLUMN */}
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const role = getRoleConfig(u.role)
                  const needsDept = ROLES_REQUIRING_DEPT.includes(u.role)
                  
                  return (
                    <tr key={u._id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-mini">
                            {u.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="user-name">{u.name}</div>
                            <div className="user-email">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="role-badge" style={{ background: role.color + '20', color: role.color }}>
                          {role.icon} {role.label}
                        </span>
                      </td>
                      
                      {/* ✅ NEW: DEPARTMENT DROPDOWN */}
                      <td>
                        {needsDept ? (
                          <select
                            value={u.department || ''}
                            onChange={(e) => handleUpdateDepartment(u._id, e.target.value)}
                            disabled={updatingDept === u._id}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-light)',
                              fontSize: '12px',
                              background: 'var(--bg-surface)',
                              color: 'var(--text-primary)',
                              cursor: updatingDept === u._id ? 'wait' : 'pointer'
                            }}
                          >
                            <option value="">-- Select --</option>
                            {DEPARTMENTS.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>

                      <td>{u.phone || '—'}</td>
                      <td>
                        <button
                          className={`status-toggle ${u.isActive ? 'active' : 'inactive'}`}
                          onClick={() => handleToggleActive(u)}
                          title="Click to toggle"
                        >
                          {u.isActive ? '🟢 Active' : '🔴 Inactive'}
                        </button>
                      </td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="icon-action"
                            onClick={() => handleResetPassword(u)}
                            title="Reset password"
                          >
                            🔑
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <p>No users match your filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Add User</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              {formError && (
                <div style={{ background: 'rgba(229, 62, 62, 0.1)', color: '#C53030', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px' }}>
                  ⚠️ {formError}
                </div>
              )}

              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Enter full name" />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="user@janvoice.gov.in" />
              </div>
              <div className="form-group">
                <label>Password * (min 6 chars)</label>
                <input type="text" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} placeholder="Temporary password" />
              </div>
              <div className="form-group">
                <label>Phone (optional)</label>
                <input type="tel" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="10-digit number" />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select value={formData.role} onChange={(e) => handleChange('role', e.target.value)}>
                  <option value="">Select a role...</option>
                  {creatableRoles.map((r) => (
                    <option key={r} value={r}>{ROLE_META[r].icon} {ROLE_META[r].label}</option>
                  ))}
                </select>
              </div>
              {ROLES_REQUIRING_DEPT.includes(formData.role) && (
                <div className="form-group">
                  <label>Department *</label>
                  <select value={formData.department} onChange={(e) => handleChange('department', e.target.value)}>
                    <option value="">Select a department...</option>
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
                {saving ? '⏳ Saving...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement