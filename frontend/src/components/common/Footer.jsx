import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const linkStyle = {
    color: 'rgba(255, 255, 255, 0.75)',
    textDecoration: 'none',
    fontSize: '13px',
    transition: 'color 0.3s ease'
  }

  const columnTitleStyle = {
    fontSize: '13px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }

  const columnStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  }

  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #1a202c 0%, #2d3748 100%)',
        color: 'white',
        padding: '48px 40px 24px',
        marginTop: 'auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}
          >
            <div
              style={{
                fontSize: '32px',
                background: 'rgba(255, 107, 53, 0.15)',
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              🇮🇳
            </div>
            <div>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                JanVoice
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontWeight: '600'
                }}
              >
                Your Voice, Our Action
              </div>
            </div>
          </div>

          <p
            style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}
          >
            National Public Complaint & Action Platform. Report civic issues,
            track resolutions, and build a better India together.
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            {['📘', '🐦', '📸', '▶️'].map((icon, i) => (
              <a
                key={i}
                href="#"
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FF6B35'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div>
          <div style={columnTitleStyle}>Platform</div>
          <div style={columnStyle}>
            <Link to="/citizen/dashboard" style={linkStyle}>Dashboard</Link>
            <Link to="/citizen/submit" style={linkStyle}>Submit Complaint</Link>
            <Link to="/citizen/track" style={linkStyle}>Track Complaint</Link>
            <Link to="/citizen/emergency" style={linkStyle}>Emergency Report</Link>
            <Link to="/citizen/history" style={linkStyle}>Complaint History</Link>
          </div>
        </div>

        {/* Support */}
        <div>
          <div style={columnTitleStyle}>Support</div>
          <div style={columnStyle}>
            <a href="#" style={linkStyle}>Help Center</a>
            <a href="#" style={linkStyle}>FAQs</a>
            <a href="#" style={linkStyle}>Contact Us</a>
            <a href="tel:1800-XXX-XXXX" style={linkStyle}>📞 1800-XXX-XXXX</a>
            <a href="mailto:support@janvoice.gov.in" style={linkStyle}>
              ✉️ support@janvoice.gov.in
            </a>
          </div>
        </div>

        {/* Legal */}
        <div>
          <div style={columnTitleStyle}>Legal</div>
          <div style={columnStyle}>
            <a href="#" style={linkStyle}>Privacy Policy</a>
            <a href="#" style={linkStyle}>Terms of Service</a>
            <a href="#" style={linkStyle}>Cookie Policy</a>
            <a href="#" style={linkStyle}>Accessibility</a>
            <a href="#" style={linkStyle}>Sitemap</a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)'
        }}
      >
        <div>© {currentYear} JanVoice | Government of India Initiative</div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <span>🇮🇳 Made in India</span>
          <span>🚀 Version 1.0.0</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer