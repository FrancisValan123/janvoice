import React from 'react'
import { Link } from 'react-router-dom'

const PrivacyPolicy = () => {
  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        'Personal Information: Name, email, phone number, and address provided during registration or complaint submission.',
        'Complaint Data: Description of issues, locations, evidence files (photos, videos, documents), and priority levels.',
        'Usage Data: Pages visited, features used, device information, and IP addresses for security and analytics.',
        'Communication Data: Messages exchanged with officers or support staff regarding complaints.'
      ]
    },
    {
      title: '2. How We Use Your Information',
      content: [
        'To register and authenticate your account.',
        'To process, track, and resolve your complaints.',
        'To send notifications about complaint status updates.',
        'To generate anonymized analytics for department performance monitoring.',
        'To comply with legal obligations under Indian law.',
        'To improve platform functionality and user experience.'
      ]
    },
    {
      title: '3. Data Sharing & Disclosure',
      content: [
        'We NEVER sell your personal information to third parties.',
        'Complaint details are shared only with relevant government departments and assigned officers.',
        'Public analytics include anonymized aggregated data only.',
        'We may disclose information if required by law, court order, or government authority.',
        'In case of platform merger or acquisition, user data may transfer with prior notice.'
      ]
    },
    {
      title: '4. Data Security',
      content: [
        'Passwords are hashed using bcrypt with 10 salt rounds (industry standard).',
        'Session tokens use JWT with 7-day expiry and are never stored in plain text.',
        'All data transmission uses HTTPS/TLS 1.3 encryption.',
        'Database access is restricted to authorized personnel only.',
        'Regular security audits and vulnerability assessments are conducted.',
        'File uploads are scanned for malware before storage.'
      ]
    },
    {
      title: '5. Data Retention',
      content: [
        'Account data is retained while your account is active.',
        'Complaint records are retained for 5 years for audit and legal purposes.',
        'Deleted accounts have personal data removed within 30 days.',
        'Backup copies may persist for up to 90 days post-deletion.'
      ]
    },
    {
      title: '6. Your Rights',
      content: [
        'Right to Access: Request a copy of all personal data we hold about you.',
        'Right to Correction: Update incorrect information through your profile.',
        'Right to Deletion: Request account deletion and data removal.',
        'Right to Portability: Export your complaint history in PDF/CSV format.',
        'Right to Object: Opt out of non-essential communications.'
      ]
    },
    {
      title: '7. Cookies & Tracking',
      content: [
        'We use essential cookies for authentication and session management.',
        'Analytics cookies help us understand usage patterns (anonymized).',
        'You can disable cookies in browser settings, but some features may not work.',
        'We do NOT use third-party advertising or tracking cookies.'
      ]
    },
    {
      title: '8. Children\'s Privacy',
      content: [
        'JanVoice is not intended for users under 13 years of age.',
        'We do not knowingly collect data from children under 13.',
        'If we discover such data, it will be immediately deleted.'
      ]
    },
    {
      title: '9. Changes to This Policy',
      content: [
        'We may update this policy to reflect changes in law or practices.',
        'Significant changes will be notified via email or in-app notification.',
        'Continued use after changes implies acceptance of the updated policy.'
      ]
    },
    {
      title: '10. Contact Us',
      content: [
        'For privacy-related questions: privacy@janvoice.gov.in',
        'For data access/deletion requests: dpo@janvoice.gov.in',
        'Postal: Data Protection Officer, JanVoice, Ministry of Housing & Urban Affairs, Nirman Bhawan, New Delhi - 110011'
      ]
    }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Navbar */}
      <nav style={{ background: 'white', padding: '16px 40px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <span style={{ fontSize: '28px' }}>🇮🇳</span>
          <span style={{ fontSize: '22px', fontWeight: '800', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            JanVoice
          </span>
        </Link>
        <Link to="/" style={{ padding: '10px 20px', color: '#4a5568', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ padding: '60px 40px', background: 'linear-gradient(135deg, #FFF5F0 0%, #FFE8D6 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#1a202c', marginBottom: '16px', letterSpacing: '-1px' }}>
            🔒 Privacy Policy
          </h1>
          <p style={{ fontSize: '15px', color: '#4a5568' }}>
            Last Updated: January 1, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '60px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: '1.8', marginBottom: '32px', padding: '20px', background: '#FFF5F0', borderRadius: '10px', borderLeft: '4px solid #FF6B35' }}>
            <strong>Summary:</strong> We respect your privacy. Your personal data is never sold, is encrypted at rest and in transit, and is used only to provide and improve JanVoice services. You have full control over your data.
          </p>

          {sections.map((section, idx) => (
            <div key={idx} style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a202c', marginBottom: '16px' }}>
                {section.title}
              </h2>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                {section.content.map((item, i) => (
                  <li key={i} style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.8', marginBottom: '8px' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div style={{ padding: '20px', background: '#EBF8FF', borderRadius: '10px', borderLeft: '4px solid #4299E1', marginTop: '32px' }}>
            <p style={{ fontSize: '14px', color: '#2C5282', lineHeight: '1.7', margin: 0 }}>
              <strong>Questions?</strong> Contact our Data Protection Officer at{' '}
              <a href="mailto:privacy@janvoice.gov.in" style={{ color: '#FF6B35', fontWeight: '700' }}>
                privacy@janvoice.gov.in
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicy