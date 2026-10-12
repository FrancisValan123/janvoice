import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const features = [
    {
      icon: '📢',
      title: 'Voice Your Concern',
      desc: 'Report civic issues with photos, videos, and detailed descriptions.'
    },
    {
      icon: '📍',
      title: 'Real-Time Tracking',
      desc: 'Follow your complaint status from submission to resolution.'
    },
    {
      icon: '⚡',
      title: 'Priority Handling',
      desc: 'Emergency complaints get immediate attention from authorities.'
    },
    {
      icon: '🏛️',
      title: 'Multi-Role Access',
      desc: 'Citizens, officers, and authorities work together seamlessly.'
    },
    {
      icon: '📊',
      title: 'Transparent Analytics',
      desc: 'Track department performance and SLA compliance publicly.'
    },
    {
      icon: '🔔',
      title: 'Instant Notifications',
      desc: 'Receive updates on every action taken on your complaint.'
    }
  ]

  const stats = [
    { value: '50K+', label: 'Complaints Registered' },
    { value: '42K+', label: 'Issues Resolved' },
    { value: '85%', label: 'SLA Compliance' },
    { value: '4.7★', label: 'Citizen Rating' }
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
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/login" style={{ padding: '10px 20px', color: '#FF6B35', fontWeight: '700', fontSize: '14px', textDecoration: 'none', borderRadius: '10px', border: '2px solid #FF6B35' }}>
            Login
          </Link>
          <Link to="/register" style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', fontWeight: '700', fontSize: '14px', textDecoration: 'none', borderRadius: '10px', boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '80px 40px', textAlign: 'center', background: 'linear-gradient(135deg, #FFF5F0 0%, #FFE8D6 100%)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', padding: '8px 16px', background: 'white', borderRadius: '24px', fontSize: '13px', fontWeight: '700', color: '#FF6B35', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            🚀 National Public Complaint & Action Platform
          </div>
          <h1 style={{ fontSize: '56px', fontWeight: '900', color: '#1a202c', lineHeight: '1.15', marginBottom: '24px', letterSpacing: '-1.5px' }}>
            Your Voice, <br />
            <span style={{ background: 'linear-gradient(135deg, #FF6B35, #F7931E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Our Action
            </span>
          </h1>
          <p style={{ fontSize: '18px', color: '#4a5568', lineHeight: '1.7', marginBottom: '40px', maxWidth: '640px', margin: '0 auto 40px' }}>
            Report civic issues, track resolutions in real-time, and build a better India together. JanVoice bridges the gap between citizens and government.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ padding: '16px 36px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', borderRadius: '12px', fontWeight: '700', fontSize: '15px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(255, 107, 53, 0.35)' }}>
              📝 Submit a Complaint
            </Link>
            <Link to="/login" style={{ padding: '16px 36px', background: 'white', color: '#4a5568', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: '700', fontSize: '15px', textDecoration: 'none' }}>
              👤 Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '60px 40px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', fontWeight: '900', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1, marginBottom: '8px' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '13px', color: '#718096', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '900', color: '#1a202c', marginBottom: '12px', letterSpacing: '-1px' }}>
              Everything You Need
            </h2>
            <p style={{ fontSize: '16px', color: '#718096', maxWidth: '600px', margin: '0 auto' }}>
              A complete platform for civic engagement and grievance redressal
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ padding: '28px', background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderTop: '4px solid #FF6B35', transition: 'all 0.3s ease' }}>
                <div style={{ width: '56px', height: '56px', background: '#FFF5F0', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '20px' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1a202c', marginBottom: '8px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#718096', lineHeight: '1.6' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 40px', background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '900', color: 'white', marginBottom: '16px', letterSpacing: '-1px' }}>
            Ready to Make a Difference?
          </h2>
          <p style={{ fontSize: '17px', color: '#cbd5e0', lineHeight: '1.7', marginBottom: '36px' }}>
            Join thousands of citizens who are actively building a better India through JanVoice.
          </p>
          <Link to="/register" style={{ display: 'inline-block', padding: '18px 40px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', borderRadius: '12px', fontWeight: '800', fontSize: '16px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(255, 107, 53, 0.4)' }}>
            🚀 Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 40px', background: '#1a202c', color: '#a0aec0', fontSize: '13px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>© 2026 JanVoice | Government of India Initiative</div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/about" style={{ color: '#a0aec0', textDecoration: 'none' }}>About</Link>
            <Link to="/contact" style={{ color: '#a0aec0', textDecoration: 'none' }}>Contact</Link>
            <Link to="/faq" style={{ color: '#a0aec0', textDecoration: 'none' }}>FAQ</Link>
            <Link to="/privacy" style={{ color: '#a0aec0', textDecoration: 'none' }}>Privacy</Link>
            <Link to="/terms" style={{ color: '#a0aec0', textDecoration: 'none' }}>Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home