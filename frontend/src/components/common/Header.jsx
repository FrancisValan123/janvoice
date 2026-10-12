import React from 'react'
import { Link } from 'react-router-dom'

const Header = ({ title, subtitle, icon, actions }) => {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '14px',
        padding: '24px 28px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '200px' }}>
        {icon && (
          <div
            style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
            }}
          >
            {icon}
          </div>
        )}

        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: '800',
              color: '#1a202c',
              marginBottom: subtitle ? '4px' : 0,
              lineHeight: 1.2
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: '13px',
                color: '#718096',
                lineHeight: 1.4
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  )
}

export default Header