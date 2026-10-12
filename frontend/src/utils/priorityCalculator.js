/* ===================================
   JANVOICE — PRIORITY CALCULATOR
   =================================== */

import { PRIORITY_LEVELS, PRIORITY_CONFIG } from './constants'

/**
 * Emergency keywords that auto-escalate to emergency priority
 */
const EMERGENCY_KEYWORDS = [
  'fire',
  'explosion',
  'collapse',
  'collapsed',
  'flood',
  'flooding',
  'electrocution',
  'electrocuted',
  'gas leak',
  'gas leakage',
  'chemical',
  'toxic',
  'death',
  'dead',
  'dying',
  'injur',
  'accident',
  'emergency',
  'urgent',
  'danger',
  'hazard',
  'building collapse',
  'bridge collapse',
  'live wire',
  'drowning',
  'critical',
  'severely'
]

/**
 * High priority keywords
 */
const HIGH_KEYWORDS = [
  'severe',
  'major',
  'broken',
  'blocked',
  'overflow',
  'flooded',
  'damaged',
  'disease',
  'contamination',
  'contaminated',
  'outbreak',
  'school',
  'hospital',
  'children',
  'elderly'
]

/**
 * Low priority keywords
 */
const LOW_KEYWORDS = [
  'minor',
  'cosmetic',
  'small',
  'slight',
  'notice',
  'paint',
  'cleanliness',
  'aesthetic'
]

/**
 * Detect keywords in text
 * @param {string} text
 * @param {string[]} keywords
 * @returns {string[]} - Matched keywords
 */
const detectKeywords = (text, keywords) => {
  if (!text) return []
  const lowerText = text.toLowerCase()
  return keywords.filter((k) => lowerText.includes(k))
}

/**
 * Calculate priority based on multiple factors
 *
 * Factors:
 * - Emergency keywords (highest weight)
 * - High keywords
 * - Affected people count
 * - Evidence count
 * - Category type
 *
 * @param {Object} complaint
 * @returns {Object} { priority, score, reasons }
 */
export const calculatePriority = (complaint) => {
  const {
    title = '',
    description = '',
    affectedPeople = 1,
    evidence = [],
    category = ''
  } = complaint

  const fullText = `${title} ${description}`
  let score = 0
  const reasons = []

  // ============================================
  // 1. Emergency keywords
  // ============================================
  const emergencyMatches = detectKeywords(fullText, EMERGENCY_KEYWORDS)
  if (emergencyMatches.length > 0) {
    score += 100
    reasons.push(`Emergency keywords detected: ${emergencyMatches.join(', ')}`)
  }

  // ============================================
  // 2. High priority keywords
  // ============================================
  const highMatches = detectKeywords(fullText, HIGH_KEYWORDS)
  if (highMatches.length > 0) {
    score += highMatches.length * 15
    reasons.push(`High-priority keywords: ${highMatches.join(', ')}`)
  }

  // ============================================
  // 3. Low priority keywords
  // ============================================
  const lowMatches = detectKeywords(fullText, LOW_KEYWORDS)
  if (lowMatches.length > 0 && emergencyMatches.length === 0) {
    score -= lowMatches.length * 10
    reasons.push(`Low-priority keywords: ${lowMatches.join(', ')}`)
  }

  // ============================================
  // 4. Affected people count
  // ============================================
  if (affectedPeople >= 500) {
    score += 50
    reasons.push(`${affectedPeople} people affected (critical mass)`)
  } else if (affectedPeople >= 100) {
    score += 30
    reasons.push(`${affectedPeople} people affected (high impact)`)
  } else if (affectedPeople >= 20) {
    score += 15
    reasons.push(`${affectedPeople} people affected`)
  }

  // ============================================
  // 5. Evidence provided
  // ============================================
  if (evidence.length >= 3) {
    score += 10
    reasons.push(`${evidence.length} evidence files provided`)
  } else if (evidence.length > 0) {
    score += 5
  }

  // ============================================
  // 6. Category weight
  // ============================================
  const categoryWeights = {
    safety: 30,
    health: 25,
    water: 20,
    electricity: 15,
    roads: 10,
    sanitation: 10,
    environment: 5,
    transport: 5,
    education: 0,
    other: 0
  }

  const categoryWeight = categoryWeights[category] || 0
  if (categoryWeight > 0) {
    score += categoryWeight
    reasons.push(`Category "${category}" has elevated importance`)
  }

  // ============================================
  // Determine priority level based on score
  // ============================================
  let priority
  if (score >= 100 || emergencyMatches.length > 0) {
    priority = PRIORITY_LEVELS.EMERGENCY
  } else if (score >= 50) {
    priority = PRIORITY_LEVELS.HIGH
  } else if (score >= 15) {
    priority = PRIORITY_LEVELS.NORMAL
  } else {
    priority = PRIORITY_LEVELS.LOW
  }

  return {
    priority,
    score,
    reasons,
    config: PRIORITY_CONFIG[priority]
  }
}

/**
 * Get SLA deadline for a complaint
 * @param {string} priority
 * @param {Date} from - Starting date (default: now)
 * @returns {Date}
 */
export const getSlaDeadline = (priority, from = new Date()) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.normal
  const deadline = new Date(from)
  deadline.setHours(deadline.getHours() + config.sla)
  return deadline
}

/**
 * Check if a complaint has breached SLA
 */
export const isSlaBreached = (complaint) => {
  if (!complaint.deadline) return false
  if (complaint.status === 'resolved' || complaint.status === 'closed') {
    return false
  }
  return new Date(complaint.deadline) < new Date()
}

/**
 * Get SLA compliance percentage
 */
export const getSlaCompliance = (complaints = []) => {
  if (complaints.length === 0) return 100
  const resolved = complaints.filter(
    (c) => c.status === 'resolved' || c.status === 'closed'
  )
  if (resolved.length === 0) return 0

  const onTime = resolved.filter((c) => {
    if (!c.resolvedAt || !c.deadline) return false
    return new Date(c.resolvedAt) <= new Date(c.deadline)
  })

  return Math.round((onTime.length / resolved.length) * 100)
}

/**
 * Sort complaints by priority (highest first)
 */
export const sortByPriority = (complaints) => {
  const order = {
    [PRIORITY_LEVELS.EMERGENCY]: 0,
    [PRIORITY_LEVELS.HIGH]: 1,
    [PRIORITY_LEVELS.NORMAL]: 2,
    [PRIORITY_LEVELS.LOW]: 3
  }
  return [...complaints].sort(
    (a, b) => (order[a.priority] ?? 4) - (order[b.priority] ?? 4)
  )
}