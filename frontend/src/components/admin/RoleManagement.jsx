import React from 'react'
import AdminLayout from './AdminLayout'

const RoleManagement = () => {
  const roles = [
    {
      id: 'citizen',
      name: 'Citizen',
      icon: '👤',
      color: '#4299E1',
      description: 'Regular citizens who submit complaints and track them',
      permissions: [
        'Register & login',
        'Submit complaints',
        'Upload evidence',
        'Track complaints',
        'Give feedback'
      ]
    },
    {
      id: 'officer',
      name: 'Officer',
      icon: '👨‍💼',
      color: '#805AD5',
      description: 'Field officers who investigate and resolve complaints',
      permissions: [
        'View assigned cases',
        'Investigate complaints',
        'Update status',
        'Upload action evidence',
        'Request reassignment'
      ]
    },
    {
      id: 'department_admin',
      name: 'Department Admin',
      icon: '🏛️',
      color: '#ED8936',
      description: 'Manages a specific department and assigns officers',
      permissions: [
        'Assign officers',
        'Monitor deadlines',
        'Escalate cases',
        'View department analytics',
        'Manage department settings'
      ]
    },
    {
      id: 'higher_authority',
      name: 'Higher Authority',
      icon: '⭐',
      color: '#E53E3E',
      description: 'Reviews escalated cases and monitors departments',
      permissions: [
        'View escalated complaints',
        'Monitor department performance',
        'Review overdue cases',
        'Generate reports',
        'Approve escalations'
      ]
    },
    {
      id: 'system_admin',
      name: 'System Admin',
      icon: '⚙️',
      color: '#1a202c',
      description: 'Full system access and administration',
      permissions: [
        'Manage users',
        'Manage departments',
        'Manage categories',
        'View audit logs',
        'System configuration',
        'Backups & restore'
      ]
    }
  ]

  return (
    <AdminLayout title="Role Management">
      <div
        style={{
          background: 'white',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
            🔐 System Roles & Permissions
          </h3>
          <p style={{ fontSize: '13px', color: '#718096' }}>
            Overview of all user roles and their access permissions
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px'
          }}
        >
          {roles.map((role) => (
            <div
              key={role.id}
              style={{
                background: '#f7fafc',
                borderRadius: '12px',
                padding: '20px',
                borderLeft: `4px solid ${role.color}`,
                transition: 'all 0.3s ease'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '14px'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: role.color + '20',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    flexShrink: 0
                  }}
                >
                  {role.icon}
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#1a202c',
                      marginBottom: '2px'
                    }}
                  >
                    {role.name}
                  </h4>
                  <span
                    style={{
                      fontSize: '11px',
                      color: role.color,
                      fontWeight: '700',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {role.id}
                  </span>
                </div>
              </div>

              <p
                style={{
                  fontSize: '13px',
                  color: '#718096',
                  lineHeight: '1.5',
                  marginBottom: '16px'
                }}
              >
                {role.description}
              </p>

              <div
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#4a5568',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Permissions ({role.permissions.length})
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  {role.permissions.map((perm, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        color: '#2d3748'
                      }}
                    >
                      <span style={{ color: '#38A169', fontSize: '14px' }}>✓</span>
                      {perm}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

export default RoleManagement