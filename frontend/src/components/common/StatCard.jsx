import React from 'react'
import './StatCard.css'

const StatCard = ({ icon, label, value, color = '#FF6B35', trend }) => {
  return (
    <div className="stat-card" style={{ '--accent-color': color }}>
      <div className="stat-card-header">
        <div className="stat-icon" style={{ background: `${color}20` }}>
          {icon}
        </div>
        {trend && (
          <span className={`stat-trend ${trend > 0 ? 'up' : 'down'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default StatCard