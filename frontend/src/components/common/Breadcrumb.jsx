import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Breadcrumb = ({ customItems }) => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  const formatName = (name) => {
    return name
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const items = customItems || pathnames

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 0',
    fontSize: '13px',
    flexWrap: 'wrap'
  }

  const linkStyle = {
    color: '#FF6B35',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  }

  const currentStyle = {
    color: '#718096',
    fontWeight: '600'
  }

  const separatorStyle = {
    color: '#cbd5e0',
    fontSize: '14px'
  }

  return (
    <nav style={containerStyle} aria-label="breadcrumb">
      <Link to="/" style={linkStyle}>
        🏠 Home
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const label = typeof item === 'string' ? formatName(item) : item.label
        const path = typeof item === 'string' ? `/${items.slice(0, index + 1).join('/')}` : item.path

        return (
          <React.Fragment key={index}>
            <span style={separatorStyle}>/</span>
            {isLast || !path ? (
              <span style={currentStyle}>{label}</span>
            ) : (
              <Link to={path} style={linkStyle}>
                {label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

export default Breadcrumb