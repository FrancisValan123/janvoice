/* ===================================
   JANVOICE — APP CONSTANTS
   =================================== */

// ===================================
// USER ROLES
// ===================================
export const USER_ROLES = {
  CITIZEN: 'citizen',
  OFFICER: 'officer',
  DEPARTMENT_ADMIN: 'department_admin',
  HIGHER_AUTHORITY: 'higher_authority',
  SYSTEM_ADMIN: 'system_admin'
}

export const ROLE_LABELS = {
  citizen: { label: 'Citizen', icon: '👤', color: '#4299E1' },
  officer: { label: 'Officer', icon: '👨‍💼', color: '#805AD5' },
  department_admin: { label: 'Dept Admin', icon: '🏛️', color: '#ED8936' },
  higher_authority: { label: 'Authority', icon: '⭐', color: '#E53E3E' },
  system_admin: { label: 'System Admin', icon: '⚙️', color: '#1a202c' }
}

// ===================================
// COMPLAINT PRIORITY
// ===================================
export const PRIORITY_LEVELS = {
  EMERGENCY: 'emergency',
  HIGH: 'high',
  NORMAL: 'normal',
  LOW: 'low'
}

export const PRIORITY_CONFIG = {
  emergency: {
    label: 'Emergency',
    icon: '🔴',
    color: '#E53E3E',
    bg: '#FED7D7',
    sla: 1, // hours
    severity: 4
  },
  high: {
    label: 'High Priority',
    icon: '🟠',
    color: '#F7931E',
    bg: '#FEEBC8',
    sla: 4,
    severity: 3
  },
  normal: {
    label: 'Normal',
    icon: '🟡',
    color: '#ECC94B',
    bg: '#FEFCBF',
    sla: 24,
    severity: 2
  },
  low: {
    label: 'Low',
    icon: '🔵',
    color: '#4299E1',
    bg: '#BEE3F8',
    sla: 48,
    severity: 1
  }
}

// ===================================
// COMPLAINT STATUS
// ===================================
export const COMPLAINT_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  INVESTIGATING: 'investigating',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
  ESCALATED: 'escalated',
  CLOSED: 'closed'
}

export const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#ED8936', bg: '#FEEBC8', icon: '⏳' },
  assigned: { label: 'Assigned', color: '#4299E1', bg: '#BEE3F8', icon: '👤' },
  investigating: {
    label: 'Investigating',
    color: '#805AD5',
    bg: '#E9D8FD',
    icon: '🔍'
  },
  'in-progress': {
    label: 'In Progress',
    color: '#3182CE',
    bg: '#BEE3F8',
    icon: '🚧'
  },
  resolved: { label: 'Resolved', color: '#38A169', bg: '#C6F6D5', icon: '✅' },
  rejected: { label: 'Rejected', color: '#E53E3E', bg: '#FED7D7', icon: '❌' },
  escalated: { label: 'Escalated', color: '#C53030', bg: '#FED7D7', icon: '🚨' },
  closed: { label: 'Closed', color: '#718096', bg: '#EDF2F7', icon: '🔒' }
}

// ===================================
// COMPLAINT CATEGORIES
// ===================================
export const COMPLAINT_CATEGORIES = [
  { id: 'roads', name: 'Roads & Infrastructure', icon: '🛣️' },
  { id: 'water', name: 'Water Supply', icon: '💧' },
  { id: 'sanitation', name: 'Sanitation & Waste', icon: '🗑️' },
  { id: 'electricity', name: 'Electricity', icon: '⚡' },
  { id: 'safety', name: 'Public Safety', icon: '🚨' },
  { id: 'transport', name: 'Transport', icon: '🚌' },
  { id: 'health', name: 'Health', icon: '🏥' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'environment', name: 'Environment', icon: '🌳' },
  { id: 'other', name: 'Other', icon: '📁' }
]

// ===================================
// API ENDPOINTS
// ===================================
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  COMPLAINTS: {
    BASE: '/complaints',
    ASSIGNED: '/complaints/assigned',
    STATS: '/complaints/officer-stats',
    STATUS: (id) => `/complaints/${id}/status`,
    EVIDENCE: (id) => `/complaints/${id}/action-evidence`,
    REASSIGN: (id) => `/complaints/${id}/request-reassign`
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read'
  }
}

// ===================================
// STORAGE KEYS
// ===================================
export const STORAGE_KEYS = {
  TOKEN: 'janvoice_token',
  USER: 'janvoice_user',
  REMEMBER_ME: 'janvoice_remember',
  THEME: 'janvoice_theme',
  SIDEBAR_STATE: 'janvoice_sidebar',
  LOCALE: 'janvoice_locale',
  DRAFT_COMPLAINT: 'janvoice_complaint_draft'
}

// ===================================
// APP METADATA
// ===================================
export const APP_INFO = {
  NAME: 'JanVoice',
  TAGLINE: 'Your Voice, Our Action',
  DESCRIPTION: 'National Public Complaint & Action Platform',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@janvoice.gov.in',
  SUPPORT_PHONE: '1800-XXX-XXXX'
}

// ===================================
// PAGINATION
// ===================================
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
}

// ===================================
// DATE FORMATS
// ===================================
export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'DD MMM YYYY',
  FULL: 'DD MMMM YYYY',
  TIME: 'hh:mm A',
  DATETIME: 'DD/MM/YYYY hh:mm A',
  ISO: 'YYYY-MM-DDTHH:mm:ss'
}

// ===================================
// FILE UPLOAD
// ===================================
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  MAX_FILES: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/quicktime'],
  ALLOWED_DOC_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
}

// ===================================
// REGEX PATTERNS
// ===================================
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/, // Indian mobile
  PINCODE: /^[1-9][0-9]{5}$/,
  AADHAR: /^\d{12}$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  COMPLAINT_ID: /^JV\d{8}$/,
  URL: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/
}