import React from 'react'

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange
}) => {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    return pages
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const btnStyle = (disabled, active) => ({
    minWidth: '38px',
    height: '38px',
    padding: '0 12px',
    borderRadius: '8px',
    border: active ? 'none' : '2px solid #e2e8f0',
    background: active ? 'linear-gradient(135deg, #FF6B35, #F7931E)' : 'white',
    color: active ? 'white' : disabled ? '#cbd5e0' : '#4a5568',
    fontSize: '13px',
    fontWeight: '700',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  })

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '16px 0',
        flexWrap: 'wrap',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <div style={{ fontSize: '13px', color: '#718096', fontWeight: '600' }}>
        Showing <strong style={{ color: '#1a202c' }}>{startItem}</strong> to{' '}
        <strong style={{ color: '#1a202c' }}>{endItem}</strong> of{' '}
        <strong style={{ color: '#1a202c' }}>{totalItems}</strong> results
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button
          style={btnStyle(currentPage === 1, false)}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Prev
        </button>

        {getPageNumbers().map((page, i) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${i}`}
                style={{ padding: '0 8px', color: '#a0aec0', fontWeight: '700' }}
              >
                ...
              </span>
            )
          }
          return (
            <button
              key={page}
              style={btnStyle(false, page === currentPage)}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        })}

        <button
          style={btnStyle(currentPage === totalPages, false)}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default Pagination