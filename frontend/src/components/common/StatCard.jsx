import React from 'react'
import { Link } from 'react-router-dom'
import './StatCard.css'

const StatCard = ({
  icon = '📊',
  label = 'Stat',
  value = 0,
  color = '#FF6B35',
  trend = null,
  subtitle = null,
  suffix = '',
  prefix = '',
  variant = 'default',
  clickable = false,
  to = null,
  onClick = null,
  loading = false,
  animated = true
}) => {
  // Format large numbers (1000 → 1K, 1000000 → 1M)
  const formatValue = (val) => {
    if (typeof val !== 'number') return val
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M'
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K'
    return val.toLocaleString('en-IN')
  }

  // Get trend styling
  const getTrendConfig = () => {
    if (trend === null || trend === undefined) return null
    const isUp = trend > 0
    return {
      isUp,
      icon: isUp ? '↑' : '↓',
      value: Math.abs(trend),
      label: isUp ? 'up' : 'down'
    }
  }

  const trendConfig = getTrendConfig()

  // Loading state
  if (loading) {
    return (
      <div className="stat-card stat-card-loading" style={{ '--accent': color }}>
        <div className="stat-skeleton stat-skeleton-icon"></div>
        <div className="stat-skeleton-body">
          <div className="stat-skeleton stat-skeleton-value"></div>
          <div className="stat-skeleton stat-skeleton-label"></div>
        </div>
      </div>
    )
  }

  const cardContent = (
    <>
      {/* Decorative gradient */}
      <div className="stat-card-glow" style={{ background: color }}></div>

      {/* Icon */}
      <div
        className="stat-card-icon"
        style={{
          background: `${color}15`,
          color: color
        }}
      >
        <span className="stat-icon-emoji">{icon}</span>
      </div>

      {/* Content */}
      <div className="stat-card-body">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value-row">
          <span className="stat-card-value">
            {prefix}
            {animated ? formatValue(value) : value}
            {suffix}
          </span>
          {trendConfig && (
            <span className={`stat-card-trend ${trendConfig.label}`}>
              {trendConfig.icon} {trendConfig.value}%
            </span>
          )}
        </div>

        {subtitle && (
          <div className="stat-card-subtitle">{subtitle}</div>
        )}
      </div>
    </>
  )

  const cardClass = `stat-card stat-card-${variant} ${clickable ? 'stat-card-clickable' : ''}`

  // If `to` prop is provided, render as Link
  if (to) {
    return (
      <Link to={to} className={cardClass} style={{ '--accent': color }}>
        {cardContent}
      </Link>
    )
  }

  // If `onClick` provided, render as button-like div
  if (onClick) {
    return (
      <div
        className={cardClass}
        style={{ '--accent': color }}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick(e)
          }
        }}
      >
        {cardContent}
      </div>
    )
  }

  // Default: plain div
  return (
    <div className={cardClass} style={{ '--accent': color }}>
      {cardContent}
    </div>
  )
}

export default StatCard