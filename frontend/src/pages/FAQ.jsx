import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      category: 'Getting Started',
      items: [
        { q: 'How do I register on JanVoice?', a: 'Click the "Get Started" button on the home page, fill in your name, email, phone number, and password. Verify your email and you\'re ready to submit complaints.' },
        { q: 'Is JanVoice free to use?', a: 'Yes! JanVoice is completely free for all Indian citizens. It\'s a government initiative under the Ministry of Housing and Urban Affairs.' },
        { q: 'Do I need an Aadhar number to register?', a: 'No, Aadhar is not mandatory. We only require your name, email, and phone number for registration.' }
      ]
    },
    {
      category: 'Submitting Complaints',
      items: [
        { q: 'How do I submit a complaint?', a: 'After logging in, click "Submit Complaint" in the sidebar. Fill in the title, category, description, location, and upload evidence. Choose a priority level and submit.' },
        { q: 'What types of evidence can I upload?', a: 'You can upload images (JPG, PNG), videos (MP4, MOV), and documents (PDF, DOC). Maximum 10 MB per file, up to 10 files per complaint.' },
        { q: 'Can I edit my complaint after submitting?', a: 'Currently, complaints cannot be edited after submission. However, you can add additional information through the comments section or contact support.' },
        { q: 'What does the priority level mean?', a: 'Emergency (🔴) for life-threatening issues, High (🟠) for significant impact, Normal (🟡) for routine issues, and Low (🔵) for minor issues.' }
      ]
    },
    {
      category: 'Tracking & Resolution',
      items: [
        { q: 'How do I track my complaint?', a: 'Go to "Track Complaint" in the sidebar and enter your complaint ID. You can also view all your complaints in "My Complaints".' },
        { q: 'How long does it take to resolve a complaint?', a: 'Resolution times vary by priority: Emergency (1 hour), High (4 hours), Normal (24 hours), Low (48 hours). Complex issues may take longer.' },
        { q: 'What if my complaint is not resolved?', a: 'If your complaint is overdue, it automatically escalates to the department admin and then to higher authorities.' },
        { q: 'Can I give feedback on resolution?', a: 'Yes! Once your complaint is marked as resolved, you can rate the resolution from 1-5 stars and provide comments.' }
      ]
    },
    {
      category: 'Account & Security',
      items: [
        { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page. Enter your email and we\'ll send you a reset link valid for 15 minutes.' },
        { q: 'Is my personal data safe?', a: 'Yes. We use bank-grade encryption (bcrypt) for passwords and JWT tokens for sessions. Your data is never shared with third parties.' },
        { q: 'How do I delete my account?', a: 'Contact support@janvoice.gov.in to request account deletion. Your data will be permanently removed within 7 working days.' }
      ]
    },
    {
      category: 'For Officers & Departments',
      items: [
        { q: 'How do I become an officer?', a: 'Officer accounts are created by department administrators. Contact your department head for registration.' },
        { q: 'What is SLA compliance?', a: 'Service Level Agreement (SLA) measures the percentage of complaints resolved within the target time frame. Higher is better.' },
        { q: 'Can I reassign a case?', a: 'Yes, if you lack jurisdiction, expertise, or have a conflict of interest, you can request reassignment from your admin.' }
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
            ❓ Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '16px', color: '#4a5568', lineHeight: '1.7' }}>
            Find answers to common questions about JanVoice
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section style={{ padding: '60px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {faqs.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#FF6B35', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {section.category}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {section.items.map((item, iIdx) => {
                  const globalIdx = `${sIdx}-${iIdx}`
                  const isOpen = openIndex === globalIdx
                  return (
                    <div key={iIdx} style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                        style={{ width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        <span style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', flex: 1 }}>
                          {item.q}
                        </span>
                        <span style={{ fontSize: '18px', color: '#FF6B35', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease', flexShrink: 0 }}>
                          ▼
                        </span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 24px 20px', fontSize: '14px', color: '#4a5568', lineHeight: '1.7' }}>
                          {item.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 40px', background: 'white', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1a202c', marginBottom: '12px' }}>
          Still have questions?
        </h2>
        <p style={{ fontSize: '15px', color: '#718096', marginBottom: '24px' }}>
          Our support team is here to help.
        </p>
        <Link to="/contact" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', borderRadius: '12px', fontWeight: '700', fontSize: '14px', textDecoration: 'none', boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)' }}>
          📬 Contact Support
        </Link>
      </section>
    </div>
  )
}

export default FAQ