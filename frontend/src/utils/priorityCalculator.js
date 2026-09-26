// ============================================
// JANVOICE - Priority Auto Calculator
// ============================================

export const PRIORITY_LEVELS = {
  EMERGENCY: { id: 'emergency', label: '🔴 Emergency', sla: '1 hour' },
  HIGH: { id: 'high', label: '🟠 High Priority', sla: '4 hours' },
  NORMAL: { id: 'normal', label: '🟡 Normal', sla: '24 hours' },
  LOW: { id: 'low', label: '🔵 Low', sla: '48 hours' }
}

const CATEGORY_SCORES = {
  'Public Safety': 5,
  'Electricity': 4,
  'Water Supply': 4,
  'Roads & Potholes': 3,
  'Drainage': 3,
  'Illegal Construction': 3,
  'Sanitation & Garbage': 2,
  'Street Lights': 2,
  'Other': 1
}

const EMERGENCY_KEYWORDS = [
  'fire', 'accident', 'death', 'died', 'danger', 'dangerous',
  'collapse', 'electrocution', 'flood', 'gas leak', 'explosion',
  'life threatening', 'injury', 'injured', 'emergency', 'urgent',
  'hazard', 'toxic', 'contamination', 'immediate'
]

const HIGH_KEYWORDS = [
  'broken', 'blocked', 'overflow', 'severe', 'major',
  'critical', 'unsafe', 'damaged', 'burst'
]

export const calculatePriority = (complaint) => {
  const { category = '', title = '', description = '', affectedPeople = '' } = complaint

  let score = 0
  const reasons = []

  const catScore = CATEGORY_SCORES[category] || 1
  score += catScore * 1.5
  if (catScore >= 4) {
    reasons.push(`High-risk category: ${category}`)
  }

  const affected = parseInt(affectedPeople) || 0
  if (affected >= 500) {
    score += 5
    reasons.push(`${affected}+ people affected`)
  } else if (affected >= 100) {
    score += 3
    reasons.push(`${affected}+ people affected`)
  } else if (affected >= 20) {
    score += 1
    reasons.push(`${affected}+ people affected`)
  }

  const text = `${title} ${description}`.toLowerCase()

  const emergencyHits = EMERGENCY_KEYWORDS.filter((kw) => text.includes(kw))
  const highHits = HIGH_KEYWORDS.filter((kw) => text.includes(kw))

  if (emergencyHits.length > 0) {
    score += 6
    reasons.push(`Emergency keywords: "${emergencyHits.join(', ')}"`)
  }
  if (highHits.length > 0) {
    score += 2
    reasons.push(`Priority keywords: "${highHits.join(', ')}"`)
  }

  const hour = new Date().getHours()
  if ((hour >= 22 || hour <= 5) && score >= 5) {
    score += 1
    reasons.push('Late night — higher urgency')
  }

  let priority = 'low'
  if (score >= 12) priority = 'emergency'
  else if (score >= 8) priority = 'high'
  else if (score >= 4) priority = 'normal'

  return {
    priority,
    score: Math.round(score * 10) / 10,
    reasons
  }
}