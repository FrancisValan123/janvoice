/* ===================================
   JANVOICE — ROUTE PATHS
   =================================== */

// ===================================
// PUBLIC ROUTES
// ===================================
export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  NOT_FOUND: '*'
}

// ===================================
// AUTH ROUTES
// ===================================
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_OTP: '/verify-otp',
  LOGOUT: '/logout'
}

// ===================================
// CITIZEN ROUTES
// ===================================
export const CITIZEN_ROUTES = {
  DASHBOARD: '/citizen/dashboard',
  PROFILE: '/citizen/profile',
  SUBMIT: '/citizen/submit',
  COMPLAINTS: '/citizen/complaints',
  COMPLAINT_DETAILS: (id) => `/citizen/complaints/${id}`,
  COMPLAINT_LIST: '/citizen/complaints/list',
  HISTORY: '/citizen/history',
  TRACK: '/citizen/track',
  EMERGENCY: '/citizen/emergency',
  EVIDENCE: '/citizen/evidence',
  NOTIFICATIONS: '/citizen/notifications',
  FEEDBACK: (complaintId) => `/citizen/feedback/${complaintId}`
}

// ===================================
// OFFICER ROUTES
// ===================================
export const OFFICER_ROUTES = {
  DASHBOARD: '/officer/dashboard',
  ASSIGNED: '/officer/assigned',
  CASE: (id) => `/officer/case/${id}`,
  INVESTIGATE: (id) => `/officer/investigate/${id}`,
  STATUS: (id) => `/officer/status/${id}`,
  EVIDENCE: (id) => `/officer/evidence/${id}`,
  REASSIGN: (id) => `/officer/reassign/${id}`,
  NOTES: (id) => `/officer/notes/${id}`,
  ESCALATE: (id) => `/officer/escalate/${id}`,
  PERFORMANCE: '/officer/performance',
  REPORT: (id) => `/officer/report/${id}`
}

// ===================================
// DEPARTMENT ADMIN ROUTES
// ===================================
export const DEPARTMENT_ROUTES = {
  DASHBOARD: '/department/dashboard',
  ASSIGN: '/department/assign',
  DEADLINES: '/department/deadlines',
  ESCALATE: '/department/escalate',
  STATS: '/department/stats',
  ANALYTICS: '/department/analytics',
  OFFICERS: '/department/officers',
  ALLOCATION: '/department/allocation',
  SLA: '/department/sla',
  SETTINGS: '/department/settings'
}

// ===================================
// HIGHER AUTHORITY ROUTES
// ===================================
export const AUTHORITY_ROUTES = {
  DASHBOARD: '/authority/dashboard',
  ESCALATED: '/authority/escalated',
  PERFORMANCE: '/authority/performance',
  OVERDUE: '/authority/overdue',
  DEPARTMENTS: '/authority/departments',
  REPORTS: '/authority/reports',
  STATISTICS: '/authority/statistics',
  RECOMMENDATIONS: '/authority/recommendations'
}

// ===================================
// SYSTEM ADMIN ROUTES
// ===================================
export const ADMIN_ROUTES = {
  BASE: '/admin',
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/users',
  DEPARTMENTS: '/admin/departments',
  CATEGORIES: '/admin/categories',
  ROLES: '/admin/roles',
  AUDIT: '/admin/audit',
  BACKUPS: '/admin/backups',
  ANALYTICS: '/admin/analytics',
  HEALTH: '/admin/health',
  SETTINGS: '/admin/settings'
}

// ===================================
// ERROR ROUTES
// ===================================
export const ERROR_ROUTES = {
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500'
}

// ===================================
// ROLE-BASED DASHBOARD MAP
// ===================================
export const ROLE_DASHBOARD_MAP = {
  citizen: CITIZEN_ROUTES.DASHBOARD,
  officer: OFFICER_ROUTES.DASHBOARD,
  department_admin: DEPARTMENT_ROUTES.DASHBOARD,
  higher_authority: AUTHORITY_ROUTES.DASHBOARD,
  system_admin: ADMIN_ROUTES.DASHBOARD
}

// ===================================
// NAVIGATION MENU (SIDEBAR)
// ===================================
export const SIDEBAR_MENUS = {
  citizen: [
    { icon: '📊', label: 'Dashboard', path: CITIZEN_ROUTES.DASHBOARD },
    { icon: '📝', label: 'Submit Complaint', path: CITIZEN_ROUTES.SUBMIT },
    { icon: '📋', label: 'My Complaints', path: CITIZEN_ROUTES.COMPLAINTS, badge: 3 },
    { icon: '🔍', label: 'Track Complaint', path: CITIZEN_ROUTES.TRACK },
    { icon: '🚨', label: 'Emergency', path: CITIZEN_ROUTES.EMERGENCY },
    { icon: '🔔', label: 'Notifications', path: CITIZEN_ROUTES.NOTIFICATIONS, badge: 5 },
    { icon: '👤', label: 'My Profile', path: CITIZEN_ROUTES.PROFILE }
  ],

  officer: [
    { icon: '📊', label: 'Dashboard', path: OFFICER_ROUTES.DASHBOARD },
    { icon: '📋', label: 'Assigned Cases', path: OFFICER_ROUTES.ASSIGNED, badge: 8 },
    { icon: '🔍', label: 'Investigate', path: '/officer/investigate' },
    { icon: '📤', label: 'Upload Evidence', path: '/officer/evidence' },
    { icon: '📝', label: 'Complaint Notes', path: '/officer/notes' },
    { icon: '🔄', label: 'Reassignment', path: '/officer/reassign' },
    { icon: '🚨', label: 'Escalate Case', path: '/officer/escalate' },
    { icon: '📈', label: 'My Performance', path: OFFICER_ROUTES.PERFORMANCE },
    { icon: '📄', label: 'Resolution Report', path: '/officer/report' }
  ],

  department_admin: [
    { icon: '📊', label: 'Dashboard', path: DEPARTMENT_ROUTES.DASHBOARD },
    { icon: '👥', label: 'Assign Officers', path: DEPARTMENT_ROUTES.ASSIGN },
    { icon: '⏰', label: 'Monitor Deadlines', path: DEPARTMENT_ROUTES.DEADLINES, badge: 5 },
    { icon: '🚨', label: 'Escalate Cases', path: DEPARTMENT_ROUTES.ESCALATE },
    { icon: '📈', label: 'Analytics', path: DEPARTMENT_ROUTES.ANALYTICS },
    { icon: '📄', label: 'SLA Reports', path: DEPARTMENT_ROUTES.SLA },
    { icon: '👨‍💼', label: 'Officer Performance', path: DEPARTMENT_ROUTES.OFFICERS },
    { icon: '📦', label: 'Resource Allocation', path: DEPARTMENT_ROUTES.ALLOCATION },
    { icon: '⚙️', label: 'Settings', path: DEPARTMENT_ROUTES.SETTINGS }
  ],

  higher_authority: [
    { icon: '📊', label: 'Dashboard', path: AUTHORITY_ROUTES.DASHBOARD },
    { icon: '🚨', label: 'Escalated Cases', path: AUTHORITY_ROUTES.ESCALATED, badge: 12 },
    { icon: '📈', label: 'Performance', path: AUTHORITY_ROUTES.PERFORMANCE },
    { icon: '⏰', label: 'Overdue Review', path: AUTHORITY_ROUTES.OVERDUE, badge: 5 },
    { icon: '🏛️', label: 'Departments', path: AUTHORITY_ROUTES.DEPARTMENTS },
    { icon: '📄', label: 'Action Reports', path: AUTHORITY_ROUTES.REPORTS },
    { icon: '📊', label: 'Statistics', path: AUTHORITY_ROUTES.STATISTICS },
    { icon: '💡', label: 'Recommendations', path: AUTHORITY_ROUTES.RECOMMENDATIONS }
  ],

  system_admin: [
    { icon: '📊', label: 'Dashboard', path: ADMIN_ROUTES.DASHBOARD },
    { icon: '👥', label: 'Users', path: ADMIN_ROUTES.USERS },
    { icon: '🏛️', label: 'Departments', path: ADMIN_ROUTES.DEPARTMENTS },
    { icon: '📂', label: 'Categories', path: ADMIN_ROUTES.CATEGORIES },
    { icon: '🔐', label: 'Roles', path: ADMIN_ROUTES.ROLES },
    { icon: '📋', label: 'Audit Log', path: ADMIN_ROUTES.AUDIT },
    { icon: '💾', label: 'Backups', path: ADMIN_ROUTES.BACKUPS },
    { icon: '📈', label: 'Analytics', path: ADMIN_ROUTES.ANALYTICS },
    { icon: '🖥️', label: 'System Health', path: ADMIN_ROUTES.HEALTH },
    { icon: '⚙️', label: 'Settings', path: ADMIN_ROUTES.SETTINGS }
  ]
}

// ===================================
// HELPER FUNCTIONS
// ===================================

/**
 * Get sidebar menu for a role
 */
export const getMenuForRole = (role) => SIDEBAR_MENUS[role] || []

/**
 * Get dashboard path for a role
 */
export const getDashboardForRole = (role) =>
  ROLE_DASHBOARD_MAP[role] || PUBLIC_ROUTES.HOME

/**
 * Check if a path is active
 */
export const isActiveRoute = (currentPath, targetPath) => {
  if (targetPath === '/') return currentPath === '/'
  return currentPath === targetPath || currentPath.startsWith(targetPath + '/')
}

// ===================================
// EXPORT ALL (for convenience)
// ===================================
export const ROUTES = {
  PUBLIC: PUBLIC_ROUTES,
  AUTH: AUTH_ROUTES,
  CITIZEN: CITIZEN_ROUTES,
  OFFICER: OFFICER_ROUTES,
  DEPARTMENT: DEPARTMENT_ROUTES,
  AUTHORITY: AUTHORITY_ROUTES,
  ADMIN: ADMIN_ROUTES,
  ERROR: ERROR_ROUTES
}

export default ROUTES