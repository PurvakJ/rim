import React, { useState, useEffect } from 'react';
import { getReviews, addReview } from '../api';
import './Reviews.css';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: ''
  });

  // Updated Contact Numbers for RiM
  const phoneNumber1 = '9876243773';
  const phoneNumber2 = '9876243773';
  const whatsappNumber = '919876243773';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello RiM, I'd like to share my experience with your electrical switchgear products. Here's my review:")}`;

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.comment) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await addReview(formData);
      setSuccess(true);
      setFormData({ name: '', rating: 5, comment: '' });
      setHoverRating(0);
      setShowForm(false);
      loadReviews();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating: rating });
  };

  const handleRatingHover = (rating) => {
    setHoverRating(rating);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, percentage };
  });

  const getRatingText = (rating) => {
    switch(rating) {
      case 5: return "Excellent! Top quality products! ⚡";
      case 4: return "Very Good! Reliable switchgear 👍";
      case 3: return "Good quality, satisfied 😊";
      case 2: return "Fair, could be better 🤔";
      case 1: return "Needs improvement 😞";
      default: return "Select rating";
    }
  };

  return (
    <div className="reviews-page">
      <section className="reviews-hero">
        <div className="container">
          <div className="hero-badge" style={{ color: 'white' }}>Customer Stories</div>
          <div className="hero-icon">⚡</div>
          <h1>What Our <span>Customers Say</span></h1>
          <p>Real experiences from 500+ industrial clients and electricians who trust RiM switchgear products</p>
          <div className="hero-contact">
            <a href={`tel:${phoneNumber1}`} className="hero-phone">📞 {phoneNumber1} | {phoneNumber2}</a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hero-wa">💬 Share on WhatsApp</a>
          </div>
        </div>
      </section>

      <section className="reviews-stats">
        <div className="container">
          <div className="stats-container">
            <div className="rating-summary">
              <div className="average-rating">{averageRating}</div>
              <div className="stars-display">
                {'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}
              </div>
              <div className="total-reviews">Based on {reviews.length} customer reviews</div>
              <div className="trust-badge">
                <span>✓ 500+ Satisfied Customers</span>
              </div>
            </div>

            <div className="rating-distribution">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="distribution-bar">
                  <span className="star-label">{star} ★</span>
                  <div className="bar-container">
                    <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="count-label">{count}</span>
                </div>
              ))}
            </div>

            <button className="btn-write-review" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '✍️ Write a Review'}
            </button>
          </div>
        </div>
      </section>

      {showForm && (
        <section className="review-form-section">
          <div className="container">
            <div className="review-form-container">
              <div className="form-header">
                <div className="form-icon">✨</div>
                <h2>Share Your Experience</h2>
                <p>Tell us how RiM products performed for your electrical needs</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Your Name / Company Name <span>*</span></label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter your name or company name"
                  />
                </div>

                <div className="form-group">
                  <label>Rating <span>*</span></label>
                  <div className="rating-select-wrapper">
                    <div className="rating-select">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`rating-star ${
                            (hoverRating || formData.rating) >= star ? 'active' : ''
                          }`}
                          onClick={() => handleRatingClick(star)}
                          onMouseEnter={() => handleRatingHover(star)}
                          onMouseLeave={handleRatingLeave}
                          aria-label={`Rate ${star} stars`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <span className="rating-help-text">
                      {getRatingText(hoverRating || formData.rating)}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Review <span>*</span></label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    rows="5"
                    required
                    placeholder="Share your experience with RiM switchgear products - quality, durability, performance, service support, etc."
                  />
                </div>

                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Review →'}
                </button>
              </form>
              <p className="form-note">Your review will be published after admin approval. Thank you for sharing!</p>
            </div>
          </div>
        </section>
      )}

      {success && (
        <div className="success-message">
          <div className="success-content">
            <span className="success-icon">✓</span>
            <div>
              <strong>Thank you for your review!</strong>
              <p>Your feedback will appear after admin approval.</p>
            </div>
          </div>
        </div>
      )}

      <section className="reviews-list-section">
        <div className="container">
          <div className="section-badge">Testimonials</div>
          <h2>What Our Customers Say</h2>
          <p className="section-subtitle">Real stories from electricians, contractors, and industrial clients who trust RiM</p>
          <div className="reviews-grid">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="review-card">
                  {review.featured && (
                    <div className="featured-ribbon">⭐ Featured Review</div>
                  )}
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3>{review.name}</h3>
                        <div className="rating-stars">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                    </div>
                    <div className="review-date">
                      {new Date(review.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <p className="review-comment">"{review.comment}"</p>
                  <div className="review-footer">
                    <span className="verified-badge">✓ Verified RiM Customer</span>
                    {review.rating >= 4 && <span className="quality-badge">⚡ Quality Assured</span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-reviews">
                <div className="no-reviews-icon">⚡</div>
                <h3>No Reviews Yet</h3>
                <p>Be the first to share your experience with RiM switchgear products!</p>
                <button className="btn-be-first" onClick={() => setShowForm(true)}>
                  Write Your Review
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="contact-cta">
        <div className="container">
          <div className="cta-content">
            <div className="cta-icon">🔧</div>
            <h3>Need Technical Support or Bulk Pricing?</h3>
            <p>Our electrical experts are here to help you find the right switchgear solution for your project</p>
            <div className="cta-buttons">
              <a href={`tel:${phoneNumber1}`} className="cta-phone">📞 Call Now: {phoneNumber1}</a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="cta-wa">💬 Chat on WhatsApp</a>
              <a href="/contact" className="cta-consult">Request a Quote →</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Reviews;