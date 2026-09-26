import React, { useState, useMemo } from 'react'
import './CategoryManagement.css'

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Street Light', icon: '💡', dept: 'Electricity', priority: 'normal', complaints: 234, status: 'active' },
    { id: 2, name: 'Garbage Collection', icon: '🗑️', dept: 'Sanitation', priority: 'normal', complaints: 456, status: 'active' },
    { id: 3, name: 'Water Leakage', icon: '💧', dept: 'Water Supply', priority: 'high', complaints: 189, status: 'active' },
    { id: 4, name: 'Road Damage', icon: '🛣️', dept: 'Public Works', priority: 'emergency', complaints: 312, status: 'active' },
    { id: 5, name: 'Drainage Block', icon: '🚰', dept: 'Sanitation', priority: 'high', complaints: 145, status: 'active' },
    { id: 6, name: 'Illegal Construction', icon: '🏗️', dept: 'Public Works', priority: 'high', complaints: 98, status: 'active' },
    { id: 7, name: 'Stray Animals', icon: '🐕', dept: 'Sanitation', priority: 'low', complaints: 76, status: 'active' },
    { id: 8, name: 'Noise Pollution', icon: '🔊', dept: 'Sanitation', priority: 'low', complaints: 54, status: 'active' },
    { id: 9, name: 'Traffic Signal Issue', icon: '🚦', dept: 'Roads & Transport', priority: 'high', complaints: 112, status: 'active' },
    { id: 10, name: 'Park Maintenance', icon: '🌳', dept: 'Parks & Recreation', priority: 'low', complaints: 45, status: 'inactive' }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterDept, setFilterDept] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [toast, setToast] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    icon: '📋',
    dept: 'Public Works',
    priority: 'normal',
    status: 'active'
  })

  const priorityConfig = {
    emergency: { label: '🔴 Emergency', color: '#E53E3E' },
    high: { label: '🟠 High', color: '#F7931E' },
    normal: { label: '🟡 Normal', color: '#ECC94B' },
    low: { label: '🔵 Low', color: '#4299E1' }
  }

  const departments = ['Public Works', 'Water Supply', 'Sanitation', 'Electricity', 'Roads & Transport', 'Parks & Recreation']
  const icons = ['💡', '🗑️', '💧', '🛣️', '🚰', '🏗️', '🐕', '🔊', '🚦', '🌳', '📋', '🏠', '🚗', '⚡', '🔥', '📡']

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const filteredCats = useMemo(() => {
    return categories.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDept = filterDept === 'all' || c.dept === filterDept
      const matchesPriority = filterPriority === 'all' || c.priority === filterPriority
      return matchesSearch && matchesDept && matchesPriority
    })
  }, [categories, searchTerm, filterDept, filterPriority])

  const stats = useMemo(() => ({
    total: categories.length,
    active: categories.filter((c) => c.status === 'active').length,
    emergency: categories.filter((c) => c.priority === 'emergency').length,
    totalComplaints: categories.reduce((sum, c) => sum + c.complaints, 0)
  }), [categories])

  const openAddModal = () => {
    setEditingCat(null)
    setFormData({ name: '', icon: '📋', dept: 'Public Works', priority: 'normal', status: 'active' })
    setShowModal(true)
  }

  const openEditModal = (cat) => {
    setEditingCat(cat)
    setFormData({
      name: cat.name,
      icon: cat.icon,
      dept: cat.dept,
      priority: cat.priority,
      status: cat.status
    })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingCat) {
      setCategories(categories.map((c) => (c.id === editingCat.id ? { ...c, ...formData } : c)))
      showToast('Category updated successfully! ✅')
    } else {
      const newCat = { id: categories.length + 1, ...formData, complaints: 0 }
      setCategories([...categories, newCat])
      showToast('Category added successfully! ✅')
    }
    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this category?')) {
      setCategories(categories.filter((c) => c.id !== id))
      showToast('Category deleted! 🗑️', 'danger')
    }
  }

  const toggleStatus = (id) => {
    setCategories(categories.map((c) =>
      c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
    ))
    showToast('Status updated! ✅')
  }

  return (
    <div className="cat-management">
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

      <div className="page-header">
        <div>
          <h2>📂 Category Management</h2>
          <p>Manage complaint categories</p>
        </div>
        <button className="btn-add" onClick={openAddModal}>
          <span>➕</span> Add Category
        </button>
      </div>

      <div className="quick-stats">
        <div className="quick-stat">
          <span className="qs-icon">📂</span>
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
          <span className="qs-icon">🔴</span>
          <div>
            <div className="qs-value">{stats.emergency}</div>
            <div className="qs-label">Emergency</div>
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
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="all">All Priorities</option>
          <option value="emergency">🔴 Emergency</option>
          <option value="high">🟠 High</option>
          <option value="normal">🟡 Normal</option>
          <option value="low">🔵 Low</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="cats-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Department</th>
              <th>Priority</th>
              <th>Complaints</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCats.map((c) => {
              const p = priorityConfig[c.priority]
              return (
                <tr key={c.id}>
                  <td>
                    <div className="cat-cell">
                      <span className="cat-icon">{c.icon}</span>
                      <span className="cat-name">{c.name}</span>
                    </div>
                  </td>
                  <td>{c.dept}</td>
                  <td>
                    <span className="priority-badge" style={{ background: `${p.color}20`, color: p.color }}>
                      {p.label}
                    </span>
                  </td>
                  <td className="complaints-cell">{c.complaints}</td>
                  <td>
                    <span className={`status-pill status-${c.status}`}>
                      {c.status === 'active' ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon edit" onClick={() => openEditModal(c)} title="Edit">✏️</button>
                      <button className="btn-icon toggle" onClick={() => toggleStatus(c.id)} title="Toggle">
                        {c.status === 'active' ? '🔒' : '🔓'}
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(c.id)} title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filteredCats.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>No categories found</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCat ? '✏️ Edit Category' : '➕ Add Category'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-field">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Street Light"
                  required
                />
              </div>

              <div className="form-field">
                <label>Icon *</label>
                <div className="icon-picker">
                  {icons.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      className={`icon-option ${formData.icon === ic ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, icon: ic })}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Department *</label>
                  <select
                    value={formData.dept}
                    onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Default Priority *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="emergency">🔴 Emergency</option>
                    <option value="high">🟠 High</option>
                    <option value="normal">🟡 Normal</option>
                    <option value="low">🔵 Low</option>
                  </select>
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
                  {editingCat ? '💾 Update' : '➕ Add'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryManagement