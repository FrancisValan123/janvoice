import React, { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import './UserManagement.css'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Demo data - replace with real API call
  useEffect(() => {
    setTimeout(() => {
      setUsers([
        { _id: '1', name: 'Francis Valan', email: 'francis@janvoice.gov.in', phone: '9876543210', role: 'citizen', isActive: true, isVerified: true, createdAt: '2026-09-15' },
        { _id: '2', name: 'Officer Ravi', email: 'ravi@janvoice.gov.in', phone: '9876543211', role: 'officer', isActive: true, isVerified: true, createdAt: '2026-09-12' },
        { _id: '3', name: 'Admin Priya', email: 'priya@janvoice.gov.in', phone: '9876543212', role: 'department_admin', isActive: true, isVerified: true, createdAt: '2026-09-10' },
        { _id: '4', name: 'Authority Suresh', email: 'suresh@janvoice.gov.in', phone: '9876543213', role: 'higher_authority', isActive: true, isVerified: true, createdAt: '2026-09-08' },
        { _id: '5', name: 'Citizen Kumar', email: 'kumar@janvoice.gov.in', phone: '9876543214', role: 'citizen', isActive: false, isVerified: false, createdAt: '2026-09-05' },
        { _id: '6', name: 'Officer Meena', email: 'meena@janvoice.gov.in', phone: '9876543215', role: 'officer', isActive: true, isVerified: true, createdAt: '2026-09-03' },
        { _id: '7', name: 'System Admin', email: 'admin@janvoice.gov.in', phone: '9876543216', role: 'system_admin', isActive: true, isVerified: true, createdAt: '2026-09-01' }
      ])
      setLoading(false)
    }, 500)
  }, [])

  const getRoleConfig = (role) => {
    const config = {
      citizen: { label: 'Citizen', icon: '👤', color: '#4299E1' },
      officer: { label: 'Officer', icon: '👨‍💼', color: '#805AD5' },
      department_admin: { label: 'Dept Admin', icon: '🏛️', color: '#ED8936' },
      higher_authority: { label: 'Authority', icon: '⭐', color: '#E53E3E' },
      system_admin: { label: 'System Admin', icon: '⚙️', color: '#1a202c' }
    }
    return config[role] || config.citizen
  }

  const handleToggleActive = (userId) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, isActive: !u.isActive } : u))
    )
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers((prev) => prev.filter((u) => u._id !== userId))
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === 'all' || u.role === filterRole
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && u.isActive) ||
      (filterStatus === 'inactive' && !u.isActive)
    return matchSearch && matchRole && matchStatus
  })

  return (
    <AdminLayout title="User Management">
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

      <div className="users-card">
        <div className="card-header">
          <div className="card-title-group">
            <h3 className="card-title">👥 All Users</h3>
            <p className="card-subtitle">{filteredUsers.length} users found</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            ➕ Add User
          </button>
        </div>

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
            <option value="citizen">👤 Citizen</option>
            <option value="officer">👨‍💼 Officer</option>
            <option value="department_admin">🏛️ Dept Admin</option>
            <option value="higher_authority">⭐ Authority</option>
            <option value="system_admin">⚙️ Admin</option>
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
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const role = getRoleConfig(user.role)
                  return (
                    <tr key={user._id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-mini">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="user-name">{user.name}</div>
                            <div className="user-email">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className="role-badge"
                          style={{ background: role.color + '20', color: role.color }}
                        >
                          {role.icon} {role.label}
                        </span>
                      </td>
                      <td>{user.phone || '—'}</td>
                      <td>
                        <button
                          className={`status-toggle ${user.isActive ? 'active' : 'inactive'}`}
                          onClick={() => handleToggleActive(user._id)}
                          title="Click to toggle"
                        >
                          {user.isActive ? '🟢 Active' : '🔴 Inactive'}
                        </button>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="icon-action"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowModal(true)
                            }}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="icon-action danger"
                            onClick={() => handleDeleteUser(user._id)}
                            title="Delete"
                          >
                            🗑️
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

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedUser ? '✏️ Edit User' : '➕ Add User'}</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowModal(false)
                  setSelectedUser(null)
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  defaultValue={selectedUser?.name || ''}
                  placeholder="Enter full name"
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  defaultValue={selectedUser?.email || ''}
                  placeholder="user@example.com"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  defaultValue={selectedUser?.phone || ''}
                  placeholder="10-digit number"
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select defaultValue={selectedUser?.role || 'citizen'}>
                  <option value="citizen">👤 Citizen</option>
                  <option value="officer">👨‍💼 Officer</option>
                  <option value="department_admin">🏛️ Dept Admin</option>
                  <option value="higher_authority">⭐ Authority</option>
                  <option value="system_admin">⚙️ System Admin</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowModal(false)
                  setSelectedUser(null)
                }}
              >
                Cancel
              </button>
              <button className="btn-primary">
                {selectedUser ? 'Save Changes' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default UserManagement