import React, { useState } from 'react'
import './CategoryManagement.css'

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    { _id: '1', name: 'Roads & Infrastructure', icon: '🛣️', color: '#FF6B35', complaints: 45, active: true },
    { _id: '2', name: 'Water Supply', icon: '💧', color: '#4299E1', complaints: 32, active: true },
    { _id: '3', name: 'Sanitation & Waste', icon: '🗑️', color: '#38A169', complaints: 58, active: true },
    { _id: '4', name: 'Electricity', icon: '⚡', color: '#ED8936', complaints: 22, active: true },
    { _id: '5', name: 'Public Safety', icon: '🚨', color: '#E53E3E', complaints: 18, active: true },
    { _id: '6', name: 'Transport', icon: '🚌', color: '#805AD5', complaints: 15, active: true },
    { _id: '7', name: 'Health', icon: '🏥', color: '#E53E3E', complaints: 12, active: true },
    { _id: '8', name: 'Education', icon: '📚', color: '#3182CE', complaints: 8, active: false },
    { _id: '9', name: 'Environment', icon: '🌳', color: '#38A169', complaints: 10, active: true },
    { _id: '10', name: 'Other', icon: '📁', color: '#718096', complaints: 5, active: true }
  ])

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({ name: '', icon: '', color: '#FF6B35' })

  const handleSave = () => {
    if (editing) {
      setCategories((prev) =>
        prev.map((c) => (c._id === editing._id ? { ...c, ...formData } : c))
      )
    } else {
      setCategories((prev) => [
        ...prev,
        { _id: String(Date.now()), ...formData, complaints: 0, active: true }
      ])
    }
    setShowModal(false)
    setEditing(null)
    setFormData({ name: '', icon: '', color: '#FF6B35' })
  }

  const handleToggleActive = (id) => {
    setCategories((prev) =>
      prev.map((c) => (c._id === id ? { ...c, active: !c.active } : c))
    )
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this category?')) {
      setCategories((prev) => prev.filter((c) => c._id !== id))
    }
  }

  return (
    <div className="dashboard-content">
      <div className="cat-summary">
        <div className="summary-card">
          <div className="summary-value">{categories.length}</div>
          <div className="summary-label">Total Categories</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{categories.filter((c) => c.active).length}</div>
          <div className="summary-label">Active</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">
            {categories.reduce((s, c) => s + c.complaints, 0)}
          </div>
          <div className="summary-label">Total Complaints</div>
        </div>
      </div>

      <div className="cat-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">📂 Complaint Categories</h3>
            <p className="card-subtitle">Manage categories for citizen complaints</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              setEditing(null)
              setFormData({ name: '', icon: '', color: '#FF6B35' })
              setShowModal(true)
            }}
          >
            ➕ Add Category
          </button>
        </div>

        <div className="cat-grid">
          {categories.map((cat) => (
            <div key={cat._id} className={`cat-item ${!cat.active ? 'inactive' : ''}`}>
              <div className="cat-icon-wrapper" style={{ background: cat.color + '20' }}>
                <span className="cat-icon">{cat.icon}</span>
              </div>
              <div className="cat-info">
                <div className="cat-name">{cat.name}</div>
                <div className="cat-count">{cat.complaints} complaints</div>
              </div>
              <div className="cat-actions">
                <button
                  className={`status-pill ${cat.active ? 'active' : 'inactive'}`}
                  onClick={() => handleToggleActive(cat._id)}
                >
                  {cat.active ? 'Active' : 'Inactive'}
                </button>
                <button
                  className="icon-action"
                  onClick={() => {
                    setEditing(cat)
                    setFormData({ name: cat.name, icon: cat.icon, color: cat.color })
                    setShowModal(true)
                  }}
                >
                  ✏️
                </button>
                <button
                  className="icon-action danger"
                  onClick={() => handleDelete(cat._id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? '✏️ Edit Category' : '➕ Add Category'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Roads & Infrastructure"
                />
              </div>
              <div className="form-group">
                <label>Icon (Emoji)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🛣️"
                  maxLength="2"
                />
              </div>
              <div className="form-group">
                <label>Color</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>
                {editing ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryManagement