import { useState, useMemo, useCallback } from 'react'

/**
 * usePagination - Manages pagination state for lists
 *
 * @param {Object} options - Pagination options
 * @param {number} options.totalItems - Total number of items
 * @param {number} options.itemsPerPage - Items per page (default: 10)
 * @param {number} options.initialPage - Starting page (default: 1)
 * @param {number} options.siblingCount - Pages shown around current (default: 1)
 * @returns {Object} {
 *   currentPage,    // Current page number
 *   totalPages,     // Total pages
 *   pageNumbers,    // Array of page numbers (with '...' for gaps)
 *   startIndex,     // Index of first item on current page
 *   endIndex,       // Index of last item on current page
 *   hasPrevPage,    // Whether there's a previous page
 *   hasNextPage,    // Whether there's a next page
 *   goToPage,       // Jump to specific page
 *   nextPage,       // Go to next page
 *   prevPage,       // Go to previous page
 *   firstPage,      // Go to first page
 *   lastPage,       // Go to last page
 *   setCurrentPage  // Direct setter
 * }
 *
 * @example
 * const pagination = usePagination({ totalItems: 100, itemsPerPage: 10 })
 * const pageItems = items.slice(pagination.startIndex, pagination.endIndex)
 */
const usePagination = ({
  totalItems = 0,
  itemsPerPage = 10,
  initialPage = 1,
  siblingCount = 1
} = {}) => {
  const [currentPage, setCurrentPage] = useState(initialPage)

  // Total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))

  // Clamp currentPage if totalPages changes
  const safePage = Math.min(Math.max(1, currentPage), totalPages)

  // Range of items on current page
  const startIndex = (safePage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  // Navigation helpers
  const hasPrevPage = safePage > 1
  const hasNextPage = safePage < totalPages

  const goToPage = useCallback(
    (page) => {
      const target = Math.min(Math.max(1, page), totalPages)
      setCurrentPage(target)
    },
    [totalPages]
  )

  const nextPage = useCallback(() => {
    if (hasNextPage) setCurrentPage((p) => Math.min(p + 1, totalPages))
  }, [hasNextPage, totalPages])

  const prevPage = useCallback(() => {
    if (hasPrevPage) setCurrentPage((p) => Math.max(p - 1, 1))
  }, [hasPrevPage])

  const firstPage = useCallback(() => setCurrentPage(1), [])
  const lastPage = useCallback(
    () => setCurrentPage(totalPages),
    [totalPages]
  )

  // Compute visible page numbers with ellipsis
  const pageNumbers = useMemo(() => {
    const totalNumbers = siblingCount * 2 + 5 // First + Last + Current + 2*siblings + 2 dots

    // If total pages is small, show all
    if (totalPages <= totalNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const leftSiblingIndex = Math.max(safePage - siblingCount, 1)
    const rightSiblingIndex = Math.min(safePage + siblingCount, totalPages)

    const showLeftDots = leftSiblingIndex > 2
    const showRightDots = rightSiblingIndex < totalPages - 2

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
      return [...leftRange, '...', totalPages]
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      )
      return [1, '...', ...rightRange]
    }

    if (showLeftDots && showRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      )
      return [1, '...', ...middleRange, '...', totalPages]
    }

    return []
  }, [safePage, totalPages, siblingCount])

  return {
    currentPage: safePage,
    totalPages,
    pageNumbers,
    startIndex,
    endIndex,
    hasPrevPage,
    hasNextPage,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setCurrentPage
  }
}

export default usePagination