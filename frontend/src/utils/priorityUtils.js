/* ===================================
   JANVOICE — PRIORITY STYLING HELPERS
   =================================== */

import { PRIORITY_CONFIG, STATUS_CONFIG } from './constants'

/**
 * Get priority config (icon, color, label, bg)
 */
export const getPriorityConfig = (priority) => {
  return PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.normal
}

/**
 * Get status config
 */
export const getStatusConfig = (status) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG.pending
}

/**
 * Get priority color
 */
export const getPriorityColor = (priority) => {
  return getPriorityConfig(priority).color
}

/**
 * Get priority background color
 */
export const getPriorityBg = (priority) => {
  return getPriorityConfig(priority).bg
}

/**
 * Get priority icon (emoji)
 */
export const getPriorityIcon = (priority) => {
  return getPriorityConfig(priority).icon
}

/**
 * Get priority label
 */
export const getPriorityLabel = (priority) => {
  return getPriorityConfig(priority).label
}

/**
 * Get priority level number (higher = more severe)
 */
export const getPriorityLevel = (priority) => {
  return getPriorityConfig(priority).severity
}

/**
 * Get inline style object for priority badge
 */
export const getPriorityBadgeStyle = (priority) => {
  const config = getPriorityConfig(priority)
  return {
    background: config.bg,
    color: config.color,
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    whiteSpace: 'nowrap'
  }
}

/**
 * Get inline style object for status badge
 */
export const getStatusBadgeStyle = (status) => {
  const config = getStatusConfig(status)
  return {
    background: config.bg,
    color: config.color,
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    whiteSpace: 'nowrap'
  }
}

/**
 * Get inline style object for priority bar (left border)
 */
export const getPriorityBarStyle = (priority) => {
  return {
    width: '4px',
    borderRadius: '2px',
    background: getPriorityColor(priority),
    flexShrink: 0
  }
}

/**
 * Get CSS class for priority
 */
export const getPriorityClass = (priority) => {
  const map = {
    emergency: 'priority-emergency',
    high: 'priority-high',
    normal: 'priority-normal',
    low: 'priority-low'
  }
  return map[priority] || 'priority-normal'
}

/**
 * Get CSS class for status
 */
export const getStatusClass = (status) => {
  return `status-${status?.replace('_', '-') || 'pending'}`
}

/**
 * Get color for SLA compliance percentage
 */
export const getSlaColor = (percentage) => {
  if (percentage >= 90) return '#38A169' // green
  if (percentage >= 80) return '#ED8936' // orange
  if (percentage >= 70) return '#DD6B20' // dark orange
  return '#E53E3E' // red
}

/**
 * Get label for SLA compliance
 */
export const getSlaLabel = (percentage) => {
  if (percentage >= 90) return 'Excellent'
  if (percentage >= 80) return 'Good'
  if (percentage >= 70) return 'Fair'
  return 'Poor'
}

/**
 * Priority badge component styles (as JSX style objects)
 */
export const priorityStyles = {
  emergency: {
    icon: '🔴',
    label: 'Emergency',
    color: '#E53E3E',
    bg: '#FED7D7'
  },
  high: {
    icon: '🟠',
    label: 'High',
    color: '#F7931E',
    bg: '#FEEBC8'
  },
  normal: {
    icon: '🟡',
    label: 'Normal',
    color: '#ECC94B',
    bg: '#FEFCBF'
  },
  low: {
    icon: '🔵',
    label: 'Low',
    color: '#4299E1',
    bg: '#BEE3F8'
  }
}

/**
 * Get trend color (for up/down indicators)
 */
export const getTrendColor = (trend) => {
  if (trend > 0) return '#38A169' // green for positive
  if (trend < 0) return '#E53E3E' // red for negative
  return '#718096' // gray for neutral
}

/**
 * Get trend icon
 */
export const getTrendIcon = (trend) => {
  if (trend > 0) return '↑'
  if (trend < 0) return '↓'
  return '→'
}