import React from 'react'
import { Link } from 'react-router-dom'

const TermsOfService = () => {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing or using JanVoice, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.'
    },
    {
      title: '2. User Accounts',
      content: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to: (a) provide accurate, current, and complete information during registration; (b) maintain and promptly update your information; (c) maintain the security of your password; (d) notify us immediately of any unauthorized access.'
    },
    {
      title: '3. Acceptable Use',
      content: 'You agree NOT to: (a) submit false, misleading, or fraudulent complaints; (b) upload malicious files or viruses; (c) use the platform for any illegal purpose; (d) attempt to gain unauthorized access to any part of the system; (e) harass, abuse, or harm other users or officers; (f) use automated systems to submit complaints.'
    },
    {
      title: '4. Complaint Submission',
      content: 'By submitting a complaint, you warrant that: (a) the information is true and accurate to the best of your knowledge; (b) you have the right to submit such information; (c) the complaint is not defamatory or invasive of another\'s privacy. False complaints may result in account suspension and legal action.'
    },
    {
      title: '5. Intellectual Property',
      content: 'The JanVoice platform, including its original content, features, and functionality, is owned by the Ministry of Housing & Urban Affairs and is protected by Indian and international copyright, trademark, and other intellectual property laws.'
    },
    {
      title: '6. User Content License',
      content: 'By submitting content (complaints, evidence, comments), you grant JanVoice a non-exclusive, royalty-free, worldwide license to use, reproduce, and display such content for the purpose of resolving complaints and improving the platform.'
    },
    {
      title: '7. Disclaimer of Warranties',
      content: 'JanVoice is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.'
    },
    {
      title: '8. Limitation of Liability',
      content: 'In no event shall JanVoice or its affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the platform, even if advised of the possibility of such damages.'
    },
    {
      title: '9. Complaint Resolution Timelines',
      content: 'While we strive to resolve complaints within defined SLAs (Emergency: 1 hour, High: 4 hours, Normal: 24 hours, Low: 48 hours), these are best-effort targets and not guaranteed. Complex issues may require extended timelines.'
    },
    {
      title: '10. Account Termination',
      content: 'We reserve the right to suspend or terminate your account at any time, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason in our sole discretion.'
    },
    {
      title: '11. Governing Law',
      content: 'These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts of New Delhi.'
    },
    {
      title: '12. Changes to Terms',
      content: 'We may revise these Terms at any time without notice. By using this platform, you are agreeing to be bound by the then-current version of these Terms of Service.'
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
            📜 Terms of Service
          </h1>
          <p style={{ fontSize: '15px', color: '#4a5568' }}>
            Last Updated: January 1, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '60px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '20px', background: '#FFF5F0', borderRadius: '10px', borderLeft: '4px solid #FF6B35', marginBottom: '32px' }}>
            <p style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.7', margin: 0 }}>
              <strong>Important:</strong> Please read these Terms of Service carefully before using JanVoice. By using the platform, you agree to these terms.
            </p>
          </div>

          {sections.map((section, idx) => (
            <div key={idx} style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1a202c', marginBottom: '12px' }}>
                {section.title}
              </h2>
              <p style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.8', margin: 0 }}>
                {section.content}
              </p>
            </div>
          ))}

          <div style={{ padding: '20px', background: '#EBF8FF', borderRadius: '10px', borderLeft: '4px solid #4299E1', marginTop: '32px' }}>
            <p style={{ fontSize: '14px', color: '#2C5282', lineHeight: '1.7', margin: 0 }}>
              <strong>Questions about these terms?</strong> Email us at{' '}
              <a href="mailto:legal@janvoice.gov.in" style={{ color: '#FF6B35', fontWeight: '700' }}>
                legal@janvoice.gov.in
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsOfService