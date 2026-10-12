import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import './FeedbackForm.css'

const FeedbackForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications' },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const feedbackTags = [
    'Fast Resolution',
    'Helpful Officer',
    'Clear Communication',
    'Professional',
    'Good Follow-up',
    'Needs Improvement'
  ]

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating === 0) {
      alert('Please provide a rating')
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1200)
  }

  if (submitted) {
    return (
      <DashboardLayout role="citizen" menuItems={menuItems} title="Feedback Submitted">
        <div className="feedback-success">
          <div className="feedback-success-icon">🎉</div>
          <h2>Thank You for Your Feedback!</h2>
          <p>Your feedback helps us improve our services.</p>
          <div className="thank-you-card">
            <div className="ty-icon">💚</div>
            <div className="ty-text">
              Your voice matters. Together, we can build a better India.
            </div>
          </div>
          <button className="btn-primary" onClick={() => navigate('/citizen/complaints')}>
            ← Back to My Complaints
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="Give Feedback">
      <div className="feedback-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="feedback-card">
          <div className="feedback-header">
            <div className="feedback-icon-large">⭐</div>
            <h2>Rate Your Experience</h2>
            <p>Help us improve by sharing your feedback for complaint <strong>{id}</strong></p>
          </div>

          <form onSubmit={handleSubmit} className="feedback-form">
            {/* Rating */}
            <div className="rating-section">
              <label className="form-label">Overall Rating *</label>
              <div className="stars-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="star-btn"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <span
                      className={`star ${
                        star <= (hoverRating || rating) ? 'filled' : ''
                      }`}
                    >
                      ⭐
                    </span>
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <div className="rating-text">
                  {rating === 1 && '😞 Very Poor'}
                  {rating === 2 && '😐 Poor'}
                  {rating === 3 && '🙂 Good'}
                  {rating === 4 && '😀 Very Good'}
                  {rating === 5 && '🤩 Excellent'}
                </div>
              )}
            </div>

            {/* Feedback Tags */}
            <div className="form-group">
              <label className="form-label">What did you like?</label>
              <div className="tags-grid">
                {feedbackTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`tag-btn ${selectedTags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="form-group">
              <label className="form-label">Additional Comments (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience in detail..."
                rows="5"
                maxLength="500"
              ></textarea>
              <div className="char-count">{comment.length}/500</div>
            </div>

            {/* Submit */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? '⏳ Submitting...' : '✅ Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default FeedbackForm