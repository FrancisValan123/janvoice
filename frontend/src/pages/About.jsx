import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  const values = [
    { icon: '🤝', title: 'Transparency', desc: 'Every complaint and action is publicly trackable.' },
    { icon: '⚡', title: 'Accountability', desc: 'Departments are held to strict SLA timelines.' },
    { icon: '🎯', title: 'Efficiency', desc: 'Smart routing ensures faster resolution times.' },
    { icon: '👥', title: 'Inclusion', desc: 'Accessible to every citizen, regardless of background.' },
    { icon: '🛡️', title: 'Security', desc: 'Bank-grade encryption protects all user data.' },
    { icon: '📱', title: 'Accessibility', desc: 'Works on any device — mobile, tablet, or desktop.' }
  ]

  const milestones = [
    { year: '2024', title: 'Foundation', desc: 'JanVoice concept developed in partnership with MoHUA' },
    { year: '2025', title: 'Pilot Launch', desc: 'Deployed in 5 major cities with 10,000+ early users' },
    { year: '2026', title: 'National Rollout', desc: 'Expanding to all states with 25+ government departments' }
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
      <section style={{ padding: '80px 40px', background: 'linear-gradient(135deg, #FFF5F0 0%, #FFE8D6 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', padding: '8px 16px', background: 'white', borderRadius: '24px', fontSize: '13px', fontWeight: '700', color: '#FF6B35', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            📖 About JanVoice
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#1a202c', lineHeight: '1.15', marginBottom: '20px', letterSpacing: '-1px' }}>
            Empowering Citizens, <br />
            <span style={{ background: 'linear-gradient(135deg, #FF6B35, #F7931E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Enabling Action
            </span>
          </h1>
          <p style={{ fontSize: '17px', color: '#4a5568', lineHeight: '1.7' }}>
            JanVoice is India's national platform for public complaints and government action. We connect citizens with the authorities responsible for resolving their issues.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '80px 40px', background: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1a202c', marginBottom: '24px', textAlign: 'center' }}>
            Our Mission
          </h2>
          <p style={{ fontSize: '16px', color: '#4a5568', lineHeight: '1.8', textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
            To create a transparent, accountable, and responsive governance system where every citizen's voice is heard, every complaint is tracked, and every issue is resolved within a defined timeframe. We believe technology can bridge the gap between citizens and government, creating a more inclusive and efficient India.
          </p>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1a202c', marginBottom: '48px', textAlign: 'center' }}>
            Our Core Values
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {values.map((v, i) => (
              <div key={i} style={{ padding: '24px', background: 'white', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{v.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1a202c', marginBottom: '8px' }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#718096', lineHeight: '1.6' }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '80px 40px', background: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1a202c', marginBottom: '48px', textAlign: 'center' }}>
            Our Journey
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {milestones.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ width: '80px', flexShrink: 0, textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#FF6B35' }}>
                    {m.year}
                  </div>
                </div>
                <div style={{ width: '16px', height: '16px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', borderRadius: '50%', flexShrink: 0, marginTop: '6px', boxShadow: '0 0 0 4px rgba(255, 107, 53, 0.15)' }} />
                <div style={{ flex: 1, paddingBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1a202c', marginBottom: '6px' }}>
                    {m.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#718096', lineHeight: '1.6' }}>
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 40px', background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'white', marginBottom: '16px' }}>
            Join the Movement
          </h2>
          <p style={{ fontSize: '16px', color: '#cbd5e0', marginBottom: '32px', lineHeight: '1.7' }}>
            Be part of India's largest civic engagement platform.
          </p>
          <Link to="/register" style={{ display: 'inline-block', padding: '16px 36px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', borderRadius: '12px', fontWeight: '800', fontSize: '15px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(255, 107, 53, 0.4)' }}>
            Get Started →
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About