import React, { useEffect } from 'react'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnOverlayClick = true,
  showCloseButton = true
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = {
    small: '400px',
    medium: '540px',
    large: '720px',
    xlarge: '960px'
  }

  const maxWidth = sizes[size] || sizes.medium

  return (
    <div
      onClick={closeOnOverlayClick ? onClose : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        animation: 'modalOverlayFade 0.2s ease',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '16px',
          width: '100%',
          maxWidth: maxWidth,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'modalSlideIn 0.3s ease',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            {title && (
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#1a202c',
                  margin: 0
                }}
              >
                {title}
              </h2>
            )}

            {showCloseButton && (
              <button
                onClick={onClose}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#f7fafc',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#718096',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fed7d7'
                  e.currentTarget.style.color = '#c53030'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f7fafc'
                  e.currentTarget.style.color = '#718096'
                }}
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            flex: 1
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}
          >
            {footer}
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes modalOverlayFade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes modalSlideIn {
            from { opacity: 0; transform: translateY(20px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}
      </style>
    </div>
  )
}

export default Modal