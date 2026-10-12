/* ===================================
   JANVOICE — THEME CONFIGURATION
   =================================== */

// ===================================
// COLOR PALETTE
// ===================================
export const COLORS = {
  // Brand
  primary: '#FF6B35',
  primaryDark: '#E55A2B',
  primaryLight: '#FF8A5B',
  primarySoft: '#FFF5F0',

  secondary: '#F7931E',
  secondaryDark: '#DD7A0F',
  secondaryLight: '#FFB84D',
  secondarySoft: '#FEF5E7',

  accent: '#FFC107',

  // Semantic
  success: '#38A169',
  successLight: '#48BB78',
  successSoft: '#F0FFF4',

  warning: '#ED8936',
  warningLight: '#F6AD55',
  warningSoft: '#FFFAF0',

  danger: '#E53E3E',
  dangerLight: '#FC8181',
  dangerSoft: '#FFF5F5',

  info: '#4299E1',
  infoLight: '#63B3ED',
  infoSoft: '#EBF8FF',

  purple: '#805AD5',
  purpleLight: '#B794F4',
  purpleSoft: '#FAF5FF',

  // Neutrals
  dark: '#1a202c',
  gray900: '#1a202c',
  gray800: '#2d3748',
  gray700: '#4a5568',
  gray600: '#718096',
  gray500: '#a0aec0',
  gray400: '#cbd5e0',
  gray300: '#e2e8f0',
  gray200: '#edf2f7',
  gray100: '#f7fafc',
  white: '#ffffff',

  // Backgrounds
  bg: '#f5f7fa',
  bgCard: '#ffffff',
  bgHover: '#f7fafc',
  bgActive: '#edf2f7',

  // Borders
  border: '#e2e8f0',
  borderHover: '#cbd5e0',
  borderFocus: '#FF6B35'
}

// ===================================
// TYPOGRAPHY
// ===================================
export const TYPOGRAPHY = {
  fontFamily: {
    base: "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif",
    mono: "'Courier New', 'Monaco', 'Menlo', monospace"
  },

  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    md: '15px',
    lg: '16px',
    xl: '18px',
    xxl: '20px',
    xxxl: '24px',
    huge: '28px',
    massive: '32px'
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900
  },

  lineHeight: {
    tight: 1.2,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.75
  }
}

// ===================================
// SPACING
// ===================================
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
  xxxl: '48px',
  huge: '64px'
}

// ===================================
// BORDER RADIUS
// ===================================
export const RADIUS = {
  xs: '4px',
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '20px',
  full: '9999px'
}

// ===================================
// SHADOWS
// ===================================
export const SHADOWS = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.05)',
  md: '0 2px 8px rgba(0, 0, 0, 0.06)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.1)',
  xl: '0 12px 40px rgba(0, 0, 0, 0.15)',
  primary: '0 4px 12px rgba(255, 107, 53, 0.3)',
  primaryLg: '0 8px 24px rgba(255, 107, 53, 0.4)'
}

// ===================================
// TRANSITIONS
// ===================================
export const TRANSITIONS = {
  fast: 'all 0.15s ease',
  normal: 'all 0.25s ease',
  slow: 'all 0.4s ease'
}

// ===================================
// BREAKPOINTS
// ===================================
export const BREAKPOINTS = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536
}

// ===================================
// ROLE THEMES
// ===================================
export const ROLE_THEMES = {
  citizen: {
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    color: '#FF6B35',
    label: '👤 Citizen',
    badge: 'Citizen Portal'
  },
  officer: {
    gradient: 'linear-gradient(135deg, #2C5282 0%, #4299E1 100%)',
    color: '#4299E1',
    label: '👨‍💼 Officer',
    badge: 'Officer Portal'
  },
  department_admin: {
    gradient: 'linear-gradient(135deg, #553C9A 0%, #805AD5 100%)',
    color: '#805AD5',
    label: '🏛️ Dept Admin',
    badge: 'Department Admin'
  },
  higher_authority: {
    gradient: 'linear-gradient(135deg, #742A2A 0%, #C53030 100%)',
    color: '#C53030',
    label: '⭐ Higher Authority',
    badge: 'Higher Authority'
  },
  system_admin: {
    gradient: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
    color: '#2d3748',
    label: '⚙️ System Admin',
    badge: 'System Admin'
  }
}

// ===================================
// STATUS COLORS
// ===================================
export const STATUS_COLORS = {
  pending: { color: '#ED8936', bg: '#FEEBC8', icon: '⏳' },
  assigned: { color: '#4299E1', bg: '#BEE3F8', icon: '👤' },
  investigating: { color: '#805AD5', bg: '#E9D8FD', icon: '🔍' },
  'in-progress': { color: '#3182CE', bg: '#BEE3F8', icon: '🚧' },
  resolved: { color: '#38A169', bg: '#C6F6D5', icon: '✅' },
  rejected: { color: '#E53E3E', bg: '#FED7D7', icon: '❌' },
  escalated: { color: '#C53030', bg: '#FED7D7', icon: '🚨' },
  closed: { color: '#718096', bg: '#EDF2F7', icon: '🔒' }
}

// ===================================
// PRIORITY COLORS
// ===================================
export const PRIORITY_COLORS = {
  emergency: { color: '#E53E3E', bg: '#FED7D7', icon: '🔴', label: 'Emergency' },
  high: { color: '#F7931E', bg: '#FEEBC8', icon: '🟠', label: 'High' },
  normal: { color: '#ECC94B', bg: '#FEFCBF', icon: '🟡', label: 'Normal' },
  low: { color: '#4299E1', bg: '#BEE3F8', icon: '🔵', label: 'Low' }
}

// ===================================
// DARK MODE OVERRIDES
// ===================================
export const DARK_MODE_OVERRIDES = {
  bg: '#0f1419',
  bgCard: '#1a202c',
  bgHover: '#2d3748',
  bgActive: '#4a5568',
  text: '#f7fafc',
  textMuted: '#a0aec0',
  border: '#2d3748',
  borderHover: '#4a5568'
}

// ===================================
// SHARED STYLE OBJECTS
// ===================================

/**
 * Reusable style objects for inline styles
 */
export const STYLES = {
  // Card
  card: {
    background: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    boxShadow: SHADOWS.md,
    transition: TRANSITIONS.normal
  },

  // Button — Primary
  buttonPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: `${SPACING.md} ${SPACING.xl}`,
    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
    color: 'white',
    border: 'none',
    borderRadius: RADIUS.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    cursor: 'pointer',
    boxShadow: SHADOWS.primary,
    transition: TRANSITIONS.normal,
    fontFamily: 'inherit'
  },

  // Button — Secondary
  buttonSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: `${SPACING.md} ${SPACING.xl}`,
    background: COLORS.white,
    color: COLORS.gray700,
    border: `2px solid ${COLORS.gray300}`,
    borderRadius: RADIUS.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    cursor: 'pointer',
    transition: TRANSITIONS.normal,
    fontFamily: 'inherit'
  },

  // Input
  input: {
    width: '100%',
    padding: `${SPACING.md} ${SPACING.lg}`,
    background: COLORS.white,
    border: `2px solid ${COLORS.gray300}`,
    borderRadius: RADIUS.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.dark,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: TRANSITIONS.normal
  },

  // Welcome banner (orange)
  welcomeBanner: {
    position: 'relative',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    color: 'white',
    overflow: 'hidden',
    boxShadow: SHADOWS.lg
  },

  // Stat card
  statCard: {
    background: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    boxShadow: SHADOWS.md,
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.lg,
    transition: TRANSITIONS.normal
  }
}

// ===================================
// HELPER FUNCTIONS
// ===================================

/**
 * Get status color config
 */
export const getStatusStyle = (status) =>
  STATUS_COLORS[status] || STATUS_COLORS.pending

/**
 * Get priority color config
 */
export const getPriorityStyle = (priority) =>
  PRIORITY_COLORS[priority] || PRIORITY_COLORS.normal

/**
 * Get role theme
 */
export const getRoleTheme = (role) =>
  ROLE_THEMES[role] || ROLE_THEMES.citizen

/**
 * Create a color with alpha transparency
 * @example withAlpha('#FF6B35', 0.2) → 'rgba(255, 107, 53, 0.2)'
 */
export const withAlpha = (hex, alpha = 1) => {
  const cleaned = hex.replace('#', '')
  const r = parseInt(cleaned.substring(0, 2), 16)
  const g = parseInt(cleaned.substring(2, 4), 16)
  const b = parseInt(cleaned.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Get responsive value based on screen width
 */
export const getResponsiveValue = (values, screenWidth) => {
  if (typeof values !== 'object') return values
  if (screenWidth >= BREAKPOINTS.lg) return values.lg || values.md || values.sm || values.xs
  if (screenWidth >= BREAKPOINTS.md) return values.md || values.sm || values.xs
  if (screenWidth >= BREAKPOINTS.sm) return values.sm || values.xs
  return values.xs
}

// ===================================
// EXPORT DEFAULT THEME
// ===================================
const theme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
  transitions: TRANSITIONS,
  breakpoints: BREAKPOINTS,
  roleThemes: ROLE_THEMES,
  statusColors: STATUS_COLORS,
  priorityColors: PRIORITY_COLORS,
  styles: STYLES,
  helpers: {
    getStatusStyle,
    getPriorityStyle,
    getRoleTheme,
    withAlpha,
    getResponsiveValue
  }
}

export default theme