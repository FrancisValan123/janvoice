import { useMemo, useCallback } from 'react'
import useAuth from './useAuth'

/**
 * usePermission - Role-based permission checks
 *
 * Role hierarchy:
 *   citizen < officer < department_admin < higher_authority < system_admin
 *
 * @returns {Object} {
 *   role,            // Current user's role
 *   permissions,     // Array of permissions
 *   can,             // Check specific permission
 *   canAny,          // Check any of the permissions
 *   canAll,          // Check all permissions
 *   isRole,          // Check specific role
 *   isAnyRole,       // Check any of the roles
 *   isAtLeast,       // Check if role >= given level
 *   isAdmin,         // Is system admin
 *   isOfficer,       // Is officer or above
 *   isDepartmentAdmin,
 *   isHigherAuthority,
 *   isCitizen
 * }
 */

// Role hierarchy (higher number = more permissions)
const ROLE_HIERARCHY = {
  citizen: 1,
  officer: 2,
  department_admin: 3,
  higher_authority: 4,
  system_admin: 5
}

// Permission matrix — what each role can do
const PERMISSIONS = {
  citizen: [
    'submit_complaint',
    'view_own_complaints',
    'track_complaint',
    'give_feedback',
    'upload_evidence'
  ],
  officer: [
    'submit_complaint',
    'view_own_complaints',
    'track_complaint',
    'give_feedback',
    'upload_evidence',
    'view_assigned_cases',
    'update_status',
    'upload_action_evidence',
    'request_reassignment',
    'escalate_case',
    'view_performance'
  ],
  department_admin: [
    'view_all_complaints',
    'assign_officers',
    'monitor_deadlines',
    'escalate_cases',
    'view_analytics',
    'view_officer_performance',
    'manage_department_settings'
  ],
  higher_authority: [
    'view_all_complaints',
    'view_escalated_cases',
    'view_overdue_cases',
    'monitor_performance',
    'compare_departments',
    'generate_reports',
    'view_recommendations'
  ],
  system_admin: [
    'manage_users',
    'manage_departments',
    'manage_categories',
    'manage_roles',
    'view_audit_log',
    'manage_backups',
    'view_system_health',
    'manage_settings'
  ]
}

const usePermission = () => {
  const { user } = useAuth()
  const role = user?.role || null

  // Get combined permissions for current role (includes inherited from lower roles)
  const permissions = useMemo(() => {
    if (!role) return []

    const level = ROLE_HIERARCHY[role] || 0
    const combined = new Set()

    // System admin gets everything
    if (role === 'system_admin') {
      Object.values(PERMISSIONS).forEach((perms) => {
        perms.forEach((p) => combined.add(p))
      })
      return Array.from(combined)
    }

    // Add permissions for current level and below
    Object.entries(ROLE_HIERARCHY).forEach(([r, lvl]) => {
      if (lvl <= level) {
        ;(PERMISSIONS[r] || []).forEach((p) => combined.add(p))
      }
    })

    return Array.from(combined)
  }, [role])

  // ============================================
  // Permission checks
  // ============================================
  const can = useCallback(
    (permission) => permissions.includes(permission),
    [permissions]
  )

  const canAny = useCallback(
    (permList) => permList.some((p) => permissions.includes(p)),
    [permissions]
  )

  const canAll = useCallback(
    (permList) => permList.every((p) => permissions.includes(p)),
    [permissions]
  )

  // ============================================
  // Role checks
  // ============================================
  const isRole = useCallback((r) => role === r, [role])

  const isAnyRole = useCallback(
    (roles) => roles.includes(role),
    [role]
  )

  const isAtLeast = useCallback(
    (r) => {
      if (!role) return false
      return (ROLE_HIERARCHY[role] || 0) >= (ROLE_HIERARCHY[r] || 0)
    },
    [role]
  )

  // Convenience getters
  const isCitizen = role === 'citizen'
  const isOfficer = role === 'officer'
  const isDepartmentAdmin = role === 'department_admin'
  const isHigherAuthority = role === 'higher_authority'
  const isAdmin = role === 'system_admin'

  return {
    role,
    permissions,
    can,
    canAny,
    canAll,
    isRole,
    isAnyRole,
    isAtLeast,
    isCitizen,
    isOfficer,
    isDepartmentAdmin,
    isHigherAuthority,
    isAdmin
  }
}

export default usePermission