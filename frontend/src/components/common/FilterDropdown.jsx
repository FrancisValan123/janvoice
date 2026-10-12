import React, { useState, useRef, useEffect } from 'react'

const FilterDropdown = ({
  label = 'Filter',
  options = [],
  value,
  onChange,
  multiple = false,
  icon = '⚙️',
  placeholder = 'Select...'
}) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (optionValue) => {
    if (multiple) {
      const current = Array.isArray(value) ? value : []
      const updated = current.includes(optionValue)
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue]
      onChange(updated)
    } else {
      onChange(optionValue)
      setOpen(false)
    }
  }

  const isSelected = (optionValue) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue)
    }
    return value === optionValue
  }

  const displayValue = () => {
    if (multiple) {
      if (!Array.isArray(value) || value.length === 0) return placeholder
      if (value.length === 1) {
        const opt = options.find((o) => o.value === value[0])
        return opt?.label || value[0]
      }
      return `${value.length} selected`
    }
    if (!value) return placeholder
    const opt = options.find((o) => o.value === value)
    return opt?.label || value
  }

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'relative',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '700',
            color: '#2d3748',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '12px 16px',
          background: 'white',
          border: `2px solid ${open ? '#FF6B35' : '#e2e8f0'}`,
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '600',
          color: value ? '#1a202c' : '#a0aec0',
          cursor: 'pointer',
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          transition: 'all 0.3s ease',
          textAlign: 'left'
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {icon && <span>{icon}</span>}
          {displayValue()}
        </span>
        <span
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.3s ease',
            fontSize: '11px',
            color: '#718096'
          }}
        >
          ▼
        </span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            border: '1px solid #e2e8f0',
            maxHeight: '260px',
            overflowY: 'auto',
            zIndex: 100,
            animation: 'dropdownFade 0.15s ease'
          }}
        >
          {multiple && (
            <div
              style={{
                padding: '10px 14px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#4a5568'
                }}
              >
                Select options
              </span>
              {Array.isArray(value) && value.length > 0 && (
                <button
                  onClick={() => onChange([])}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FF6B35',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {options.map((opt) => {
            const selected = isSelected(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  background: selected ? '#fff5f0' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: selected ? '700' : '500',
                  color: selected ? '#FF6B35' : '#2d3748',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  borderBottom: '1px solid #f1f5f9'
                }}
                onMouseEnter={(e) => {
                  if (!selected) e.currentTarget.style.background = '#f7fafc'
                }}
                onMouseLeave={(e) => {
                  if (!selected) e.currentTarget.style.background = 'transparent'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {opt.icon && <span>{opt.icon}</span>}
                  {opt.label}
                </span>
                {selected && <span>✓</span>}
              </button>
            )
          })}

          {options.length === 0 && (
            <div
              style={{
                padding: '20px 16px',
                textAlign: 'center',
                fontSize: '13px',
                color: '#a0aec0'
              }}
            >
              No options available
            </div>
          )}
        </div>
      )}

      <style>
        {`
          @keyframes dropdownFade {
            from { opacity: 0; transform: translateY(-6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  )
}

export default FilterDropdown