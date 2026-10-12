import React, { useState, useEffect } from 'react'

const SearchBar = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  debounceMs = 300,
  showClear = true,
  size = 'medium',
  icon = '🔍'
}) => {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange?.(localValue)
        onSearch?.(localValue)
      }
    }, debounceMs)
    return () => clearTimeout(timer)
  }, [localValue, debounceMs])

  const handleChange = (e) => {
    setLocalValue(e.target.value)
  }

  const handleClear = () => {
    setLocalValue('')
    onChange?.('')
    onSearch?.('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(localValue)
  }

  const sizes = {
    small: { padding: '10px 14px', fontSize: '13px' },
    medium: { padding: '12px 16px', fontSize: '14px' },
    large: { padding: '16px 20px', fontSize: '15px' }
  }

  const sizeStyles = sizes[size] || sizes.medium

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'white',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = '#FF6B35'
        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(255, 107, 53, 0.1)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = '#e2e8f0'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <span
        style={{
          paddingLeft: '16px',
          fontSize: '16px',
          color: '#a0aec0',
          pointerEvents: 'none'
        }}
      >
        {icon}
      </span>

      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          flex: 1,
          border: 'none',
          background: 'transparent',
          outline: 'none',
          color: '#1a202c',
          fontFamily: 'inherit',
          fontWeight: '500',
          ...sizeStyles
        }}
      />

      {showClear && localValue && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#f7fafc',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            color: '#718096',
            marginRight: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✖
        </button>
      )}

      {onSearch && (
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            margin: '4px',
            background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          Search
        </button>
      )}
    </form>
  )
}

export default SearchBar