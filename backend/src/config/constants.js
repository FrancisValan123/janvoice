/* ===================================
   JANVOICE — BACKEND CONSTANTS
   =================================== */

const USER_ROLES = {
  CITIZEN: 'citizen',
  OFFICER: 'officer',
  DEPARTMENT_ADMIN: 'department_admin',
  HIGHER_AUTHORITY: 'higher_authority',
  SYSTEM_ADMIN: 'system_admin'
}

const PRIORITY = {
  EMERGENCY: 'emergency',
  HIGH: 'high',
  NORMAL: 'normal',
  LOW: 'low'
}

const PRIORITY_SLA_HOURS = {
  emergency: 1,
  high: 4,
  normal: 24,
  low: 48
}

const STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  INVESTIGATING: 'investigating',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
  ESCALATED: 'escalated',
  CLOSED: 'closed'
}

const CATEGORIES = {
  ROADS: 'roads',
  WATER: 'water',
  SANITATION: 'sanitation',
  ELECTRICITY: 'electricity',
  SAFETY: 'safety',
  TRANSPORT: 'transport',
  HEALTH: 'health',
  EDUCATION: 'education',
  ENVIRONMENT: 'environment',
  OTHER: 'other'
}

const FILE_LIMITS = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  MAX_FILES: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/quicktime'],
  ALLOWED_DOC_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
}

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
}

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500
}

module.exports = {
  USER_ROLES,
  PRIORITY,
  PRIORITY_SLA_HOURS,
  STATUS,
  CATEGORIES,
  FILE_LIMITS,
  PAGINATION,
  HTTP_STATUS,
  ROLES: USER_ROLES
}