import React from 'react'

const LoadingSpinner = ({
  size = 'medium',
  color = '#FF6B35',
  text = '',
  fullScreen = false
}) => {
  const sizes = {
    small: 20,
    medium: 40,
    large: 60,
    xlarge: 80
  }

  const borderWidths = {
    small: 2,
    medium: 4,
    large: 5,
    xlarge: 6
  }

  const spinnerSize = sizes[size] || sizes.medium
  const borderWidth = borderWidths[size] || borderWidths.medium

  const spinner = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
      }}
    >
      <div
        style={{
          width: `${spinnerSize}px`,
          height: `${spinnerSize}px`,
          border: `${borderWidth}px solid #e2e8f0`,
          borderTopColor: color,
          borderRadius: '50%',
          animation: 'spinnerRotate 0.8s linear infinite'
        }}
      ></div>

      {text && (
        <div
          style={{
            fontSize: size === 'small' ? '12px' : '14px',
            color: '#718096',
            fontWeight: '600'
          }}
        >
          {text}
        </div>
      )}

      <style>
        {`
          @keyframes spinnerRotate {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )

  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}
      >
        {spinner}
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner