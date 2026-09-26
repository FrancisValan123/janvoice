import React, { useState, useMemo } from 'react'
import './UserManagement.css'

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Ravi Kumar', email: 'ravi@janvoice.gov.in', phone: '9876543210', role: 'officer', dept: 'Public Works', status: 'active', joined: '2026-01-15' },
    { id: 2, name: 'Priya Sharma', email: 'priya@janvoice.gov.in', phone: '9876543211', role: 'department_admin', dept: 'Sanitation', status: 'active', joined: '2026-02-10' },
    { id: 3, name: 'Suresh Reddy', email: 'suresh@janvoice.gov.in', phone: '9876543212', role: 'officer', dept: 'Water Supply', status: 'active', joined: '2026-03-05' },
    { id: 4, name: 'Anita Desai', email: 'anita@example.com', phone: '9876543213', role: 'citizen', dept: '-', status: 'active', joined: '2026-04-20' },
    { id: 5, name: 'Mohan Verma', email: 'mohan@janvoice.gov.in', phone: '9876543214', role: 'officer', dept: 'Electricity', status: 'inactive', joined: '2026-05-12' },
    { id: 6, name: 'Lakshmi Iyer', email: 'lakshmi@janvoice.gov.in', phone: '9876543215', role: 'higher_authority', dept: '-', status: 'active', joined: '2026-06-01' },
    { id: 7, name: 'Vijay Singh', email: 'vijay@example.com', phone: '9876543216', role: 'citizen', dept: '-', status: 'active', joined: '2026-07-15' },
    { id: 8, name: 'Deepa Nair', email: 'deepa@janvoice.gov.in', phone: '9876543217', role: 'officer', dept: 'Sanitation', status: 'active', joined: '2026-08-20' }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [toast, setToast] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'citizen',
    dept: '-',
    status: 'active'
  })

  const roleConfig = {
    citizen: { label: 'Citizen', icon: '👤', color: '#4299E1' },
    officer: { label: 'Officer', icon: '👨‍💼', color: '#38A169' },
    department_admin: { label: 'Dept Admin', icon: '🏛️', color: '#805AD5' },
    higher_authority: { label: 'Authority', icon: '⭐', color: '#F7931E' },
    system_admin: { label: 'System Admin', icon: '⚙️', color: '#E53E3E' }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = filterRole === 'all' || u.role === filterRole
      const matchesStatus = filterStatus === 'all' || u.status === filterStatus
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchTerm, filterRole, filterStatus])

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    officers: users.filter((u) => u.role === 'officer').length,
    citizens: users.filter((u) => u.role === 'citizen').length
  }), [users])

  const openAddModal = () => {
    setEditingUser(null)
    setFormData({ name: '', email: '', phone: '', role: 'citizen', dept: '-', status: 'active' })
    setShowModal(true)
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      dept: user.dept,
      status: user.status
    })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)))
      showToast('User updated successfully! ✅')
    } else {
      const newUser = {
        id: users.length + 1,
        ...formData,
        joined: new Date().toISOString().split('T')[0]
      }
      setUsers([...users, newUser])
      showToast('User added successfully! ✅')
    }
    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== id))
      showToast('User deleted! 🗑️', 'danger')
    }
  }

  const toggleStatus = (id) => {
    setUsers(users.map((u) =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ))
    showToast('Status updated! ✅')
  }

  return (
    <div className="user-management">
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

      <div className="page-header">
        <div>
          <h2>👥 User Management</h2>
          <p>Manage all users across the platform</p>
        </div>
        <button className="btn-add" onClick={openAddModal}>
          <span>➕</span> Add New User
        </button>
      </div>

      <div className="quick-stats">
        <div className="quick-stat">
          <span className="qs-icon">👥</span>
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
          <span className="qs-icon">👨‍💼</span>
          <div>
            <div className="qs-value">{stats.officers}</div>
            <div className="qs-label">Officers</div>
          </div>
        </div>
        <div className="quick-stat">
          <span className="qs-icon">👤</span>
          <div>
            <div className="qs-value">{stats.citizens}</div>
            <div className="qs-label">Citizens</div>
          </div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="citizen">Citizen</option>
          <option value="officer">Officer</option>
          <option value="department_admin">Dept Admin</option>
          <option value="higher_authority">Authority</option>
          <option value="system_admin">System Admin</option>
        </select>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => {
              const role = roleConfig[u.role]
              return (
                <tr key={u.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-cell-avatar" style={{ background: role.color }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="user-cell-name">{u.name}</div>
                        <div className="user-cell-id">ID: #{u.id.toString().padStart(4, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <div>{u.email}</div>
                      <div className="contact-phone">📱 {u.phone}</div>
                    </div>
                  </td>
                  <td>
                    <span className="role-badge" style={{ background: `${role.color}20`, color: role.color }}>
                      {role.icon} {role.label}
                    </span>
                  </td>
                  <td>{u.dept}</td>
                  <td>
                    <span className={`status-pill status-${u.status}`}>
                      {u.status === 'active' ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  <td className="date-cell">{u.joined}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon edit" onClick={() => openEditModal(u)} title="Edit">
                        ✏️
                      </button>
                      <button
                        className="btn-icon toggle"
                        onClick={() => toggleStatus(u.id)}
                        title={u.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {u.status === 'active' ? '🔒' : '🔓'}
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(u.id)} title="Delete">
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
            <p>No users found matching your filters</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingUser ? '✏️ Edit User' : '➕ Add New User'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit number"
                    maxLength="10"
                  />
                </div>

                <div className="form-field">
                  <label>Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="citizen">👤 Citizen</option>
                    <option value="officer">👨‍💼 Officer</option>
                    <option value="department_admin">🏛️ Dept Admin</option>
                    <option value="higher_authority">⭐ Authority</option>
                    <option value="system_admin">⚙️ System Admin</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Department</label>
                  <select
                    value={formData.dept}
                    onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                  >
                    <option value="-">None</option>
                    <option value="Public Works">Public Works</option>
                    <option value="Water Supply">Water Supply</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Roads & Transport">Roads & Transport</option>
                  </select>
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
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingUser ? '💾 Update User' : '➕ Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement