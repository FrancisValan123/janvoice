import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { useComplaints } from '../../context/ComplaintContext'
import './FeedbackForm.css'

const FeedbackForm = () => {
  const { complaintId } = useParams()
  const navigate = useNavigate()
  const { getComplaintById, addNotification } = useComplaints()
  const complaint = getComplaintById(complaintId)

  const [overallRating, setOverallRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [categoryRatings, setCategoryRatings] = useState({
    responseTime: 0,
    officerBehavior: 0,
    resolutionQuality: 0
  })
  const [comments, setComments] = useState('')
  const [wouldRecommend, setWouldRecommend] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications' },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  const handleCategoryChange = (key, value) => {
    setCategoryRatings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (overallRating === 0) {
      setError('Please provide an overall rating')
      return
    }
    if (categoryRatings.responseTime === 0) {
      setError('Please rate response time')
      return
    }
    if (categoryRatings.officerBehavior === 0) {
      setError('Please rate officer behavior')
      return
    }
    if (categoryRatings.resolutionQuality === 0) {
      setError('Please rate resolution quality')
      return
    }
    if (wouldRecommend === null) {
      setError('Please tell us if you would recommend JanVoice')
      return
    }

    // Save feedback
    const feedbackData = {
      complaintId,
      overallRating,
      categoryRatings,
      comments,
      wouldRecommend,
      submittedAt: new Date().toISOString()
    }

    localStorage.setItem(`janvoice_feedback_${complaintId}`, JSON.stringify(feedbackData))

    // Add notification
    addNotification({
      type: 'success',
      title: 'Feedback Submitted ✅',
      message: `Thank you! Your feedback for complaint ${complaintId} has been recorded.`,
      complaintId
    })

    setSubmitted(true)
  }

  const renderStars = (rating, setRating, hoverVal, setHoverVal, size = 'large') => {
    return (
      <div className={`star-rating star-rating-${size}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-btn ${
              star <= (hoverVal || rating) ? 'filled' : ''
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverVal && setHoverVal(star)}
            onMouseLeave={() => setHoverVal && setHoverVal(0)}
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
        {rating > 0 && (
          <span className="rating-label">
            {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1]}
          </span>
        )}
      </div>
    )
  }

  // Success screen
  if (submitted) {
    return (
      <DashboardLayout role="citizen" menuItems={menuItems} title="Feedback">
        <div className="feedback-success">
          <div className="success-icon">🎉</div>
          <h1>Thank You for Your Feedback!</h1>
          <p>Your feedback helps us improve government services for everyone.</p>

          <div className="feedback-summary">
            <div className="summary-item">
              <span className="summary-label">Overall Rating</span>
              <span className="summary-value">
                {'★'.repeat(overallRating)}
                {'☆'.repeat(5 - overallRating)}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Complaint ID</span>
              <span className="summary-value">{complaintId}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Would Recommend</span>
              <span className="summary-value">
                {wouldRecommend ? '✅ Yes' : '❌ No'}
              </span>
            </div>
          </div>

          <div className="success-actions">
            <button
              className="btn-primary"
              onClick={() => navigate('/citizen/complaints')}
            >
              ← Back to My Complaints
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate('/citizen/dashboard')}
            >
              🏠 Go to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="Give Feedback">
      <div className="feedback-page">
        {/* Header */}
        <div className="feedback-header">
          <div className="feedback-header-icon">⭐</div>
          <div>
            <h1>How was your experience?</h1>
            <p>
              Your feedback for complaint{' '}
              <strong>{complaintId}</strong> helps us serve you better.
            </p>
          </div>
        </div>

        {/* Complaint Summary (if available) */}
        {complaint && (
          <div className="complaint-summary">
            <h3>📋 Complaint Summary</h3>
            <div className="summary-row">
              <span className="summary-key">Title:</span>
              <span className="summary-val">{complaint.title}</span>
            </div>
            <div className="summary-row">
              <span className="summary-key">Category:</span>
              <span className="summary-val">{complaint.category || 'General'}</span>
            </div>
            <div className="summary-row">
              <span className="summary-key">Status:</span>
              <span className="summary-val status-resolved">
                {complaint.status || 'Resolved'}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="feedback-form">
          {/* Overall Rating */}
          <div className="form-section">
            <label className="form-label-large">
              Overall Satisfaction <span className="required">*</span>
            </label>
            <p className="form-hint">How satisfied are you with the resolution?</p>
            {renderStars(
              overallRating,
              setOverallRating,
              hoverRating,
              setHoverRating,
              'large'
            )}
          </div>

          {/* Category Ratings */}
          <div className="form-section">
            <label className="form-label-large">Rate Each Aspect</label>
            <p className="form-hint">Help us understand what went well and what didn't.</p>

            <div className="category-list">
              <div className="category-item">
                <div className="category-info">
                  <span className="category-icon">⏱️</span>
                  <div>
                    <div className="category-name">Response Time</div>
                    <div className="category-desc">
                      How quickly was your complaint addressed?
                    </div>
                  </div>
                </div>
                {renderStars(
                  categoryRatings.responseTime,
                  (v) => handleCategoryChange('responseTime', v),
                  0,
                  null,
                  'small'
                )}
              </div>

              <div className="category-item">
                <div className="category-info">
                  <span className="category-icon">👨‍💼</span>
                  <div>
                    <div className="category-name">Officer Behavior</div>
                    <div className="category-desc">
                      Was the officer professional and helpful?
                    </div>
                  </div>
                </div>
                {renderStars(
                  categoryRatings.officerBehavior,
                  (v) => handleCategoryChange('officerBehavior', v),
                  0,
                  null,
                  'small'
                )}
              </div>

              <div className="category-item">
                <div className="category-info">
                  <span className="category-icon">✅</span>
                  <div>
                    <div className="category-name">Resolution Quality</div>
                    <div className="category-desc">
                      Was the issue resolved to your satisfaction?
                    </div>
                  </div>
                </div>
                {renderStars(
                  categoryRatings.resolutionQuality,
                  (v) => handleCategoryChange('resolutionQuality', v),
                  0,
                  null,
                  'small'
                )}
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="form-section">
            <label className="form-label-large" htmlFor="comments">
              Additional Comments (Optional)
            </label>
            <p className="form-hint">
              Share more details that could help us improve.
            </p>
            <textarea
              id="comments"
              className="comments-textarea"
              rows="5"
              maxLength="500"
              placeholder="Tell us about your experience..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
            <div className="char-count">{comments.length}/500</div>
          </div>

          {/* Would Recommend */}
          <div className="form-section">
            <label className="form-label-large">
              Would you recommend JanVoice to others? <span className="required">*</span>
            </label>
            <div className="recommend-buttons">
              <button
                type="button"
                className={`recommend-btn ${wouldRecommend === true ? 'active yes' : ''}`}
                onClick={() => setWouldRecommend(true)}
              >
                <span className="rec-icon">👍</span>
                <span>Yes, I would</span>
              </button>
              <button
                type="button"
                className={`recommend-btn ${wouldRecommend === false ? 'active no' : ''}`}
                onClick={() => setWouldRecommend(false)}
              >
                <span className="rec-icon">👎</span>
                <span>No, I wouldn't</span>
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/citizen/complaints')}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit-feedback">
              Submit Feedback →
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default FeedbackForm