import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const contactMethods = [
    { icon: '📞', title: 'Phone Support', value: '1800-XXX-XXXX', desc: 'Mon-Sat, 9 AM - 6 PM IST' },
    { icon: '📧', title: 'Email', value: 'support@janvoice.gov.in', desc: 'Response within 24 hours' },
    { icon: '💬', title: 'Live Chat', value: 'Available 24/7', desc: 'Instant support in-app' },
    { icon: '📍', title: 'Head Office', value: 'New Delhi, India', desc: 'Ministry of Housing & Urban Affairs' }
  ]

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim() || formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitted(true)
  }

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
            Get in Touch
          </h1>
          <p style={{ fontSize: '16px', color: '#4a5568', lineHeight: '1.7' }}>
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '60px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
          {/* Contact Info */}
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1a202c', marginBottom: '24px' }}>
              Contact Information
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {contactMethods.map((c, i) => (
                <div key={i} style={{ padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '24px' }}>{c.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {c.title}
                    </span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', marginBottom: '4px' }}>
                    {c.value}
                  </div>
                  <div style={{ fontSize: '12px', color: '#a0aec0' }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ padding: '32px', background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                <div style={{ fontSize: '72px', marginBottom: '20px' }}>✅</div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1a202c', marginBottom: '12px' }}>
                  Message Sent!
                </h3>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: '24px' }}>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: '', email: '', subject: '', message: '' })
                  }}
                  style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1a202c', marginBottom: '24px' }}>
                  📬 Send Us a Message
                </h2>

                {['name', 'email', 'subject'].map((field) => (
                  <div key={field} style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#2d3748', marginBottom: '6px', textTransform: 'capitalize' }}>
                      {field} *
                    </label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      value={formData[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                      placeholder={`Enter your ${field}`}
                      style={{ width: '100%', padding: '12px 14px', border: `2px solid ${errors[field] ? '#FC8181' : '#e2e8f0'}`, borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                    {errors[field] && <span style={{ fontSize: '12px', color: '#E53E3E', marginTop: '4px', display: 'block' }}>{errors[field]}</span>}
                  </div>
                ))}

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#2d3748', marginBottom: '6px' }}>
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="How can we help you?"
                    rows="5"
                    style={{ width: '100%', padding: '12px 14px', border: `2px solid ${errors.message ? '#FC8181' : '#e2e8f0'}`, borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                  {errors.message && <span style={{ fontSize: '12px', color: '#E53E3E', marginTop: '4px', display: 'block' }}>{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)' }}
                >
                  📤 Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact