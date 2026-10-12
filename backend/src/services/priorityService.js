/* ===================================
   JANVOICE — PRIORITY SERVICE
   Smart priority calculation with ML-like scoring
   =================================== */

// ===================================
// KEYWORD LISTS
// ===================================
const EMERGENCY_KEYWORDS = [
  'fire', 'explosion', 'collapse', 'collapsed', 'flood', 'flooding',
  'electrocution', 'electrocuted', 'gas leak', 'gas leakage',
  'chemical', 'toxic', 'death', 'dead', 'dying', 'injur', 'injured',
  'accident', 'emergency', 'urgent', 'danger', 'dangerous', 'hazard',
  'building collapse', 'bridge collapse', 'live wire', 'drowning',
  'critical', 'severely', 'life-threatening', 'life threatening',
  'immediate', 'sos', 'help'
]

const HIGH_KEYWORDS = [
  'severe', 'major', 'broken', 'blocked', 'overflow', 'flooded',
  'damaged', 'disease', 'contamination', 'contaminated', 'outbreak',
  'school', 'hospital', 'children', 'elderly', 'disabled',
  'pregnant', 'sick', 'injury', 'pain', 'suffering', 'vulnerable'
]

const LOW_KEYWORDS = [
  'minor', 'cosmetic', 'small', 'slight', 'notice', 'aesthetic',
  'paint', 'cleanliness', 'beautification', 'cosmetic', 'nuisance'
]

// ===================================
// CATEGORY WEIGHTS (importance factor)
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
// DETECT KEYWORDS
// ===================================
const detectKeywords = (text, keywords) => {
  if (!text) return []
  const lowerText = text.toLowerCase()
  return keywords.filter((k) => lowerText.includes(k.toLowerCase()))
}

// ===================================
// CALCULATE PRIORITY SCORE
// ===================================
const calculatePriorityScore = (complaint) => {
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
    reasons.push(`🚨 Emergency keywords: ${emergencyMatches.slice(0, 3).join(', ')}`)
  }

  // 2. High-priority keywords
  const highMatches = detectKeywords(fullText, HIGH_KEYWORDS)
  if (highMatches.length > 0) {
    score += highMatches.length * 15
    reasons.push(`⚠️ High-priority keywords: ${highMatches.slice(0, 3).join(', ')}`)
  }

  // 3. Low-priority keywords (reduces score)
  const lowMatches = detectKeywords(fullText, LOW_KEYWORDS)
  if (lowMatches.length > 0 && emergencyMatches.length === 0) {
    score -= lowMatches.length * 10
    reasons.push(`ℹ️ Low-priority keywords: ${lowMatches.slice(0, 3).join(', ')}`)
  }

  // 4. Affected people
  if (affectedPeople >= 500) {
    score += 50
    reasons.push(`👥 ${affectedPeople} people affected (critical mass)`)
  } else if (affectedPeople >= 100) {
    score += 30
    reasons.push(`👥 ${affectedPeople} people affected (high impact)`)
  } else if (affectedPeople >= 20) {
    score += 15
    reasons.push(`👥 ${affectedPeople} people affected`)
  } else if (affectedPeople >= 5) {
    score += 5
  }

  // 5. Evidence provided
  if (evidence.length >= 3) {
    score += 10
    reasons.push(`📎 ${evidence.length} evidence files provided`)
  } else if (evidence.length > 0) {
    score += 5
  }

  // 6. Category weight
  const categoryWeight = CATEGORY_WEIGHTS[category] || 0
  if (categoryWeight > 0) {
    score += categoryWeight
    reasons.push(`📁 Category "${category}" (+${categoryWeight})`)
  }

  return { score, reasons, emergencyMatches, highMatches, lowMatches }
}

// ===================================
// CALCULATE PRIORITY (main function)
// ===================================
const calculatePriority = (complaint) => {
  const { score, reasons, emergencyMatches } = calculatePriorityScore(complaint)

  let priority
  if (score >= 100 || emergencyMatches.length > 0) {
    priority = 'emergency'
  } else if (score >= 50) {
    priority = 'high'
  } else if (score >= 15) {
    priority = 'normal'
  } else {
    priority = 'low'
  }

  return {
    priority,
    score,
    reasons,
    config: getPriorityConfig(priority)
  }
}

// ===================================
// PRIORITY CONFIG
// ===================================
const getPriorityConfig = (priority) => {
  const configs = {
    emergency: {
      label: 'Emergency',
      icon: '🔴',
      color: '#E53E3E',
      bg: '#FED7D7',
      slaHours: 1,
      severity: 4
    },
    high: {
      label: 'High Priority',
      icon: '🟠',
      color: '#F7931E',
      bg: '#FEEBC8',
      slaHours: 4,
      severity: 3
    },
    normal: {
      label: 'Normal',
      icon: '🟡',
      color: '#ECC94B',
      bg: '#FEFCBF',
      slaHours: 24,
      severity: 2
    },
    low: {
      label: 'Low',
      icon: '🔵',
      color: '#4299E1',
      bg: '#BEE3F8',
      slaHours: 48,
      severity: 1
    }
  }
  return configs[priority] || configs.normal
}

// ===================================
// GET SLA DEADLINE
// ===================================
const getSlaDeadline = (priority, from = new Date()) => {
  const config = getPriorityConfig(priority)
  const deadline = new Date(from)
  deadline.setHours(deadline.getHours() + config.slaHours)
  return deadline
}

// ===================================
// CHECK IF SLA BREACHED
// ===================================
const isSlaBreached = (complaint) => {
  if (!complaint.deadline) return false
  if (['resolved', 'closed', 'rejected'].includes(complaint.status)) {
    return false
  }
  return new Date(complaint.deadline) < new Date()
}

// ===================================
// COMPUTE SLA COMPLIANCE
// ===================================
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
// SORT BY PRIORITY
// ===================================
const sortByPriority = (complaints = []) => {
  const order = { emergency: 0, high: 1, normal: 2, low: 3 }
  return [...complaints].sort(
    (a, b) => (order[a.priority] ?? 4) - (order[b.priority] ?? 4)
  )
}

module.exports = {
  calculatePriority,
  calculatePriorityScore,
  getPriorityConfig,
  getSlaDeadline,
  isSlaBreached,
  calculateSlaCompliance,
  sortByPriority,
  detectKeywords,
  EMERGENCY_KEYWORDS,
  HIGH_KEYWORDS,
  LOW_KEYWORDS,
  CATEGORY_WEIGHTS
}