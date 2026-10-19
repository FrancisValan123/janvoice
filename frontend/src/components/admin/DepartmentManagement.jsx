import React, { useState } from 'react'
import './DepartmentManagement.css'

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([
    { _id: '1', name: 'Public Works', code: 'PW', head: 'Eng. Suresh Kumar', officers: 12, complaints: 45, resolved: 38, color: '#FF6B35' },
    { _id: '2', name: 'Water Supply', code: 'WS', head: 'Eng. Meena Rao', officers: 8, complaints: 32, resolved: 28, color: '#4299E1' },
    { _id: '3', name: 'Sanitation', code: 'SN', head: 'Dr. Priya Sharma', officers: 15, complaints: 58, resolved: 52, color: '#38A169' },
    { _id: '4', name: 'Electricity', code: 'EL', head: 'Er. Ravi Verma', officers: 6, complaints: 22, resolved: 18, color: '#ED8936' },
    { _id: '5', name: 'Transport', code: 'TR', head: 'Mr. Anand Raj', officers: 4, complaints: 15, resolved: 12, color: '#805AD5' }
  ])

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)

  const handleDelete = (id) => {
    if (window.confirm('Delete this department?')) {
      setDepartments((prev) => prev.filter((d) => d._id !== id))
    }
  }

  return (
    <div className="dashboard-content">
      <div className="dept-summary">
        <div className="summary-card">
          <div className="summary-value">{departments.length}</div>
          <div className="summary-label">Total Departments</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{departments.reduce((s, d) => s + d.officers, 0)}</div>
          <div className="summary-label">Total Officers</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{departments.reduce((s, d) => s + d.complaints, 0)}</div>
          <div className="summary-label">Total Complaints</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">
            {Math.round(
              (departments.reduce((s, d) => s + d.resolved, 0) /
                departments.reduce((s, d) => s + d.complaints, 0)) *
                100
            )}
            %
          </div>
          <div className="summary-label">Overall SLA</div>
        </div>
      </div>

      <div className="dept-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">🏛️ All Departments</h3>
            <p className="card-subtitle">Manage government departments and their performance</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              setEditing(null)
              setShowModal(true)
            }}
          >
            ➕ Add Department
          </button>
        </div>

        <div className="dept-grid">
          {departments.map((dept) => {
            const sla = Math.round((dept.resolved / dept.complaints) * 100)
            return (
              <div key={dept._id} className="dept-item">
                <div className="dept-item-header">
                  <div
                    className="dept-badge"
                    style={{ background: dept.color + '20', color: dept.color }}
                  >
                    {dept.code}
                  </div>
                  <div className="dept-actions">
                    <button
                      className="icon-action"
                      onClick={() => {
                        setEditing(dept)
                        setShowModal(true)
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="icon-action danger"
                      onClick={() => handleDelete(dept._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <h4 className="dept-item-name">{dept.name}</h4>
                <p className="dept-head">👤 Head: {dept.head}</p>

                <div className="dept-metrics">
                  <div className="dept-metric">
                    <div className="metric-value">{dept.officers}</div>
                    <div className="metric-label">Officers</div>
                  </div>
                  <div className="dept-metric">
                    <div className="metric-value">{dept.complaints}</div>
                    <div className="metric-label">Complaints</div>
                  </div>
                  <div className="dept-metric">
                    <div className="metric-value" style={{ color: dept.color }}>{sla}%</div>
                    <div className="metric-label">SLA</div>
                  </div>
                </div>

                <div className="dept-progress">
                  <div
                    className="dept-progress-fill"
                    style={{ width: `${sla}%`, background: dept.color }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? '✏️ Edit Department' : '➕ Add Department'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Department Name</label>
                <input type="text" defaultValue={editing?.name || ''} placeholder="e.g., Public Works" />
              </div>
              <div className="form-group">
                <label>Department Code</label>
                <input type="text" defaultValue={editing?.code || ''} placeholder="e.g., PW" maxLength="4" />
              </div>
              <div className="form-group">
                <label>Department Head</label>
                <input type="text" defaultValue={editing?.head || ''} placeholder="Head officer name" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary">{editing ? 'Save' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DepartmentManagement