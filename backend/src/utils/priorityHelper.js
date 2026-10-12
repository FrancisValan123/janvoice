/* ===================================
   JANVOICE — PRIORITY HELPER
   Priority calculation for complaints
   =================================== */

// ===================================
// KEYWORDS
// ===================================
const EMERGENCY_KEYWORDS = [
  'fire', 'explosion', 'collapse', 'collapsed', 'flood', 'flooding',
  'electrocution', 'electrocuted', 'gas leak', 'gas leakage',
  'chemical', 'toxic', 'death', 'dead', 'dying', 'injur', 'injured',
  'accident', 'emergency', 'urgent', 'danger', 'hazard',
  'building collapse', 'bridge collapse', 'live wire', 'drowning',
  'critical', 'severely', 'life-threatening', 'immediate'
]

const HIGH_KEYWORDS = [
  'severe', 'major', 'broken', 'blocked', 'overflow', 'flooded',
  'damaged', 'disease', 'contamination', 'contaminated', 'outbreak',
  'school', 'hospital', 'children', 'elderly', 'pregnant'
]

const LOW_KEYWORDS = [
  'minor', 'cosmetic', 'small', 'slight', 'notice', 'aesthetic',
  'paint', 'cleanliness', 'beautification'
]

// ===================================
// CATEGORY WEIGHTS
// ===================================
const CATEGORY_WEIGHTS = {
  safety: 30,
  health: 25,
  water: 20,
  electricity: 15,
  roads: 12,
  sanitation: 10,
  environment: 8,
  transport: 6,
  education: 4,
  other: 0
}

// ===================================
// SLA HOURS PER PRIORITY
// ===================================
const SLA_HOURS = {
  emergency: 1,
  high: 4,
  normal: 24,
  low: 48
}

// ===================================
// PRIORITY CONFIG
// ===================================
const PRIORITY_CONFIG = {
  emergency: {
    label: 'Emergency',
    icon: '🔴',
    color: '#E53E3E',
    bg: '#FED7D7',
    severity: 4
  },
  high: {
    label: 'High Priority',
    icon: '🟠',
    color: '#F7931E',
    bg: '#FEEBC8',
    severity: 3
  },
  normal: {
    label: 'Normal',
    icon: '🟡',
    color: '#ECC94B',
    bg: '#FEFCBF',
    severity: 2
  },
  low: {
    label: 'Low',
    icon: '🔵',
    color: '#4299E1',
    bg: '#BEE3F8',
    severity: 1
  }
}

// ===================================
// DETECT KEYWORDS
// ===================================
const detectKeywords = (text, keywords) => {
  if (!text) return []
  const lower = text.toLowerCase()
  return keywords.filter((k) => lower.includes(k.toLowerCase()))
}

// ===================================
// CALCULATE PRIORITY
// ===================================
const calculatePriority = (complaint) => {
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

  // 1. Emergency keywords
  const emergencyMatches = detectKeywords(fullText, EMERGENCY_KEYWORDS)
  if (emergencyMatches.length > 0) {
    score += 100
    reasons.push(`Emergency keywords: ${emergencyMatches.slice(0, 3).join(', ')}`)
  }

  // 2. High keywords
  const highMatches = detectKeywords(fullText, HIGH_KEYWORDS)
  if (highMatches.length > 0) {
    score += highMatches.length * 15
    reasons.push(`High-priority keywords: ${highMatches.slice(0, 3).join(', ')}`)
  }

  // 3. Low keywords (deduct)
  const lowMatches = detectKeywords(fullText, LOW_KEYWORDS)
  if (lowMatches.length > 0 && emergencyMatches.length === 0) {
    score -= lowMatches.length * 10
  }

  // 4. Affected people
  if (affectedPeople >= 500) score += 50
  else if (affectedPeople >= 100) score += 30
  else if (affectedPeople >= 20) score += 15
  else if (affectedPeople >= 5) score += 5

  // 5. Evidence
  if (evidence.length >= 3) score += 10
  else if (evidence.length > 0) score += 5

  // 6. Category
  score += CATEGORY_WEIGHTS[category] || 0

  // Determine priority
  let priority
  if (score >= 100 || emergencyMatches.length > 0) priority = 'emergency'
  else if (score >= 50) priority = 'high'
  else if (score >= 15) priority = 'normal'
  else priority = 'low'

  return {
    priority,
    score,
    reasons,
    config: PRIORITY_CONFIG[priority]
  }
}

// ===================================
// GET SLA DEADLINE
// ===================================
const getSlaDeadline = (priority, from = new Date()) => {
  const hours = SLA_HOURS[priority] || SLA_HOURS.normal
  const deadline = new Date(from)
  deadline.setHours(deadline.getHours() + hours)
  return deadline
}

// ===================================
// SLA CHECKS
// ===================================
const isSlaBreached = (complaint) => {
  if (!complaint.deadline) return false
  if (['resolved', 'closed', 'rejected'].includes(complaint.status)) return false
  return new Date(complaint.deadline) < new Date()
}

const calculateSlaCompliance = (complaints = []) => {
  const resolved = complaints.filter((c) =>
    ['resolved', 'closed'].includes(c.status)
  )
  if (resolved.length === 0) return 100

  const onTime = resolved.filter((c) => {
    if (!c.resolvedAt || !c.deadline) return false
    return new Date(c.resolvedAt) <= new Date(c.deadline)
  })

  return Math.round((onTime.length / resolved.length) * 100)
}

// ===================================
// SORTING
// ===================================
const sortByPriority = (complaints = []) => {
  const order = { emergency: 0, high: 1, normal: 2, low: 3 }
  return [...complaints].sort(
    (a, b) => (order[a.priority] ?? 4) - (order[b.priority] ?? 4)
  )
}

// ===================================
// GET PRIORITY CONFIG
// ===================================
const getPriorityConfig = (priority) => {
  return PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.normal
}

module.exports = {
  calculatePriority,
  detectKeywords,
  getSlaDeadline,
  isSlaBreached,
  calculateSlaCompliance,
  sortByPriority,
  getPriorityConfig,
  EMERGENCY_KEYWORDS,
  HIGH_KEYWORDS,
  LOW_KEYWORDS,
  CATEGORY_WEIGHTS,
  SLA_HOURS,
  PRIORITY_CONFIG
}