import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api' // ✅ Import the API service

const EmergencyComplaint = () => {
  const navigate = useNavigate()

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '🚨', label: 'Emergency', path: '/citizen/emergency' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications' },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  const emergencyTypes = [
    { id: 'fire', icon: '🔥', label: 'Fire', desc: 'Fire or smoke' },
    { id: 'accident', icon: '🚗', label: 'Accident', desc: 'Road accident' },
    { id: 'medical', icon: '🚑', label: 'Medical', desc: 'Health emergency' },
    { id: 'gas', icon: '💨', label: 'Gas Leak', desc: 'Gas or chemical leak' },
    { id: 'electric', icon: '⚡', label: 'Electrical', desc: 'Live wire / shock' },
    { id: 'flood', icon: '🌊', label: 'Flood', desc: 'Water logging' },
    { id: 'collapse', icon: '🏚️', label: 'Collapse', desc: 'Building / tree fall' },
    { id: 'crime', icon: '🚨', label: 'Crime', desc: 'Ongoing crime' },
    { id: 'other', icon: '⚠️', label: 'Other', desc: 'Other emergency' }
  ]

  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [contact, setContact] = useState('')
  
  // State for submission process
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [complaintId, setComplaintId] = useState('')

  // ✅ REAL SUBMISSION TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!type || !description.trim() || !location.trim()) {
      setError('Please fill all required fields (Type, Description, Location)')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Find the label for the selected type to use as a category
      const selectedType = emergencyTypes.find(t => t.id === type)
      
      // Prepare the payload matching your backend's expected format
      const payload = {
        title: `🚨 EMERGENCY: ${selectedType?.label || 'Urgent Issue'}`,
        description: `EMERGENCY TYPE: ${type.toUpperCase()}\n\n${description}`,
        category: 'other', // Emergency complaints usually don't have a specific civic category
        priority: 'emergency', // Force the priority to emergency
        location: {
          address: location,
          city: 'Chennai', // Default or try to parse
          state: 'Tamil Nadu',
          pincode: '600001'
        },
        affectedPeople: 10, // Assume a high number for emergencies
        evidence: [] 
      }

      // Send to backend
      const response = await api.post('/complaints', payload)

      if (response.data.success) {
        setComplaintId(response.data.complaint.complaintId)
        setSubmitted(true)
      } else {
        setError(response.data.message || 'Failed to submit emergency report.')
      }
    } catch (err) {
      console.error('Emergency submission error:', err)
      setError(
        err.response?.data?.message || 
        'Failed to connect to the server. Please call 112 immediately if this is life-threatening.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <DashboardLayout role="citizen" menuItems={menuItems} title="Emergency Reported">
        <div style={{ maxWidth: '600px', margin: '40px auto', background: 'white', borderRadius: '16px', padding: '48px 40px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)' }}>
          <div style={{ fontSize: '72px', marginBottom: '20px' }}>🚨</div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1a202c', marginBottom: '12px' }}>
            Emergency Reported!
          </h2>
          <p style={{ fontSize: '15px', color: '#4a5568', marginBottom: '16px' }}>
            Your emergency has been logged in the system and sent to the relevant authorities.
          </p>
          
          <div style={{ background: '#F0FFF4', border: '2px dashed #38A169', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', color: '#276749', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Reference ID</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#2F855A', fontFamily: 'monospace' }}>{complaintId}</div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #FED7D7, #FC8181)', borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ fontSize: '13px', color: '#742A2A', fontWeight: '700', marginBottom: '10px' }}>
              ⚠️ IMPORTANT — While waiting for help:
            </div>
            <ul style={{ fontSize: '13px', color: '#742A2A', paddingLeft: '20px', lineHeight: 1.7 }}>
              <li>Stay calm and move to a safe location</li>
              <li>Call 112 for immediate emergency response</li>
              <li>Keep your phone accessible</li>
              <li>Don't attempt to fix dangerous situations yourself</li>
            </ul>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:112" style={{ padding: '14px 24px', background: '#E53E3E', color: 'white', borderRadius: '10px', fontWeight: '700', fontSize: '14px', textDecoration: 'none', boxShadow: '0 4px 12px rgba(229, 62, 62, 0.3)' }}>
              📞 Call 112
            </a>
            <button onClick={() => navigate('/citizen/dashboard')} style={{ padding: '14px 24px', background: 'white', color: '#4a5568', border: '2px solid #e2e8f0', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="Emergency Complaint">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Warning Banner */}
        <div style={{ background: 'linear-gradient(135deg, #E53E3E, #C53030)', color: 'white', borderRadius: '14px', padding: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 8px 24px rgba(197, 48, 48, 0.25)' }}>
          <div style={{ fontSize: '42px', flexShrink: 0 }}>🚨</div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>
              EMERGENCY REPORT
            </h2>
            <p style={{ fontSize: '13px', opacity: 0.95 }}>
              Only use this for life-threatening situations. For non-emergency issues,{' '}
              <a href="/citizen/submit" style={{ color: 'white', textDecoration: 'underline', fontWeight: '700' }}>
                use the regular complaint form
              </a>.
            </p>
          </div>
        </div>

        {/* Quick Call */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <a href="tel:112" style={{ flex: 1, minWidth: '150px', padding: '16px', background: '#E53E3E', color: 'white', borderRadius: '12px', textDecoration: 'none', textAlign: 'center', fontWeight: '800', fontSize: '15px', boxShadow: '0 4px 12px rgba(229, 62, 62, 0.3)' }}>
            📞 Call 112 (All Emergencies)
          </a>
          <a href="tel:101" style={{ flex: 1, minWidth: '150px', padding: '16px', background: '#ED8936', color: 'white', borderRadius: '12px', textDecoration: 'none', textAlign: 'center', fontWeight: '800', fontSize: '15px', boxShadow: '0 4px 12px rgba(237, 137, 54, 0.3)' }}>
            🚒 Fire: 101
          </a>
          <a href="tel:100" style={{ flex: 1, minWidth: '150px', padding: '16px', background: '#4299E1', color: 'white', borderRadius: '12px', textDecoration: 'none', textAlign: 'center', fontWeight: '800', fontSize: '15px', boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)' }}>
            🚔 Police: 100
          </a>
        </div>

        {/* Form */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1a202c', marginBottom: '24px' }}>
            🚨 Report Emergency
          </h3>

          {error && (
            <div style={{ background: 'rgba(229, 62, 62, 0.1)', color: '#C53030', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', fontWeight: '600' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Emergency Type */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '12px' }}>
                What is the emergency? *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                {emergencyTypes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    style={{
                      padding: '14px 10px',
                      background: type === t.id ? 'linear-gradient(135deg, #FED7D7, #FC8181)' : '#f7fafc',
                      border: type === t.id ? '2px solid #E53E3E' : '2px solid #e2e8f0',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{t.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#1a202c' }}>{t.label}</span>
                    <span style={{ fontSize: '10px', color: '#718096' }}>{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the emergency situation..."
                rows="4"
                maxLength="500"
                style={{ width: '100%', padding: '14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', resize: 'vertical' }}
              />
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#a0aec0', marginTop: '4px' }}>
                {description.length}/500
              </div>
            </div>

            {/* Location */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
                Location *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Exact address or landmark"
                style={{ width: '100%', padding: '14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
              />
            </div>

            {/* Contact */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
                Your Contact Number (Optional)
              </label>
              <input
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="So we can reach you for updates"
                maxLength="10"
                style={{ width: '100%', padding: '14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ padding: '18px', background: 'linear-gradient(135deg, #E53E3E, #C53030)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1, boxShadow: '0 6px 20px rgba(229, 62, 62, 0.4)' }}
            >
              {loading ? '⏳ Sending Alert...' : '🚨 SEND EMERGENCY ALERT'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EmergencyComplaint