import React, { useEffect } from 'react'

const NotificationToast = ({
  message,
  type = 'info',
  duration = 4000,
  onClose,
  position = 'top-right',
  title
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose?.(), duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const getConfig = () => {
    const configs = {
      success: {
        icon: '✅',
        color: '#38A169',
        bg: '#F0FFF4',
        border: '#9AE6B4'
      },
      error: {
        icon: '❌',
        color: '#E53E3E',
        bg: '#FFF5F5',
        border: '#FEB2B2'
      },
      warning: {
        icon: '⚠️',
        color: '#ED8936',
        bg: '#FFFAF0',
        border: '#FBD38D'
      },
      info: {
        icon: 'ℹ️',
        color: '#4299E1',
        bg: '#EBF8FF',
        border: '#90CDF4'
      }
    }
    return configs[type] || configs.info
  }

  const getPosition = () => {
    const positions = {
      'top-right': { top: '20px', right: '20px' },
      'top-left': { top: '20px', left: '20px' },
      'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)' },
      'bottom-right': { bottom: '20px', right: '20px' },
      'bottom-left': { bottom: '20px', left: '20px' },
      'bottom-center': {
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)'
      }
    }
    return positions[position] || positions['top-right']
  }

  const config = getConfig()
  const posStyle = getPosition()

  return (
    <div
      style={{
        position: 'fixed',
        ...posStyle,
        background: config.bg,
        border: `2px solid ${config.border}`,
        borderLeft: `5px solid ${config.color}`,
        borderRadius: '12px',
        padding: '14px 18px',
        minWidth: '300px',
        maxWidth: '420px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        zIndex: 10000,
        animation: 'toastSlideIn 0.3s ease',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <div style={{ fontSize: '20px', flexShrink: 0 }}>
        {config.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div
            style={{
              fontSize: '14px',
              fontWeight: '800',
              color: config.color,
              marginBottom: '4px'
            }}
          >
            {title}
          </div>
        )}
        <div
          style={{
            fontSize: '13px',
            color: '#2d3748',
            lineHeight: '1.5',
            fontWeight: '500'
          }}
        >
          {message}
        </div>
      </div>

      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          color: '#a0aec0',
          padding: 0,
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontFamily: 'inherit'
        }}
      >
        ×
      </button>

      <style>
        {`
          @keyframes toastSlideIn {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}
      </style>
    </div>
  )
}

export default NotificationToast