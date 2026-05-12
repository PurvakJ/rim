import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { bookAppointment } from '../api';
import './BookAppointment.css';

function BookAppointment() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
    appointmentType: 'factory'
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Updated Contact Numbers for RIM
  const phoneNumber1 = '9815097851';
  const phoneNumber2 = '7986295488';
  const whatsappNumber = '919815097851';
  const whatsappMessage = encodeURIComponent("Hello RIM, I'm interested in visiting your factory to discuss electrical switchgear requirements. Please share more details.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await bookAppointment(formData);
      setSubmitted(true);
      setFormData({ 
        name: '', 
        phone: '', 
        email: '', 
        preferredDate: '',
        preferredTime: '',
        message: '',
        appointmentType: 'factory'
      });
    } catch (error) {
      console.error('Error booking consultation:', error);
      alert('Sorry, there was an error booking your consultation. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="appointment-success">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2>Consultation Request Sent!</h2>
          <p>Thank you for your interest in RIM - Royal Industries Mansa.</p>
          <p>Our sales team will contact you shortly at <strong>{formData.phone}</strong> to discuss your requirements and confirm the appointment.</p>
          <div className="success-actions">
            <button className="btn-primary" onClick={() => setSubmitted(false)}>
              Send Another Request
            </button>
            <Link to="/" className="btn-secondary">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-page">
      {/* Hero Section */}
      <section className="appointment-hero">
        <div className="container">
          <div className="hero-badge">RIM - Royal Industries Mansa</div>
          <h1>Schedule a <span>Product Consultation</span></h1>
          <p>Visit our manufacturing facility or request a technical meeting to discuss your electrical switchgear requirements</p>
          <div className="contact-badge">
            <span>📞 Need help? Call our sales experts: <a href={`tel:${phoneNumber1}`}>{phoneNumber1}</a> | <a href={`tel:${phoneNumber2}`}>{phoneNumber2}</a></span>
          </div>
        </div>
      </section>

      <div className="appointment-container">
        <div className="container">
          <div className="appointment-grid">
            {/* Left Side - Info Cards */}
            <div className="appointment-info">
              <div className="info-card">
                <div className="card-icon">⚡</div>
                <h3>Why Schedule a Visit?</h3>
                <ul>
                  <li>✓ See our complete product range firsthand</li>
                  <li>✓ Discuss custom requirements & bulk orders</li>
                  <li>✓ Get technical specifications & certification details</li>
                  <li>✓ Understand quality testing & ISI standards</li>
                  <li>✓ Exclusive pricing for direct customers</li>
                </ul>
              </div>

              <div className="info-card">
                <div className="card-icon">🔧</div>
                <h3>Our Product Range</h3>
                <ul>
                  <li>🔄 Changeover Switches (Auto/Manual)</li>
                  <li>⚡ MCB & Distribution Boxes</li>
                  <li>📟 Control Panels (Submersible/LT)</li>
                  <li>⏪⏩ Reverse/Forward Starters</li>
                  <li>〰️ Busbar Chambers</li>
                  <li>🔗 DMC Connectors & Thimbles</li>
                  <li>🔒 MCCB & Moulded Case Breakers</li>
                  <li>🥈 Kit-Kat Series (Copper/Brass)</li>
                </ul>
              </div>

              <div className="info-card experience-card">
                <div className="card-icon">🏭</div>
                <h3>Manufacturing Facility</h3>
                <p>Visit our factory to experience RIM quality firsthand</p>
                <div className="address">
                  <span>📍 Royal Industries Mansa</span>
                  <span>Near Ganga Oil Mill, J.K. Road</span>
                  <span>Mansa, Punjab - 151505</span>
                </div>
                <div className="hours">
                  <span>🕐 Monday - Saturday: 9:00 AM - 7:00 PM</span>
                  <span>✨ Sunday: By Appointment Only</span>
                </div>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="wa-direction-link">
                  💬 Get Directions on WhatsApp
                </a>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="appointment-form-wrapper">
              <div className="form-header">
                <div className="form-icon-wrapper">
                  <span className="form-icon">📅</span>
                </div>
                <h2>Request a Consultation</h2>
                <p>Fill out the form below and our team will reach out within 24 hours</p>
              </div>

              <form onSubmit={handleSubmit} className="appointment-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name / Company Name <span>*</span></label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name or company name"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number <span>*</span></label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Consultation Type <span>*</span></label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="appointmentType"
                          value="factory"
                          checked={formData.appointmentType === 'factory'}
                          onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                        />
                        <span>🏭 Factory Visit</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="appointmentType"
                          value="online"
                          checked={formData.appointmentType === 'online'}
                          onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                        />
                        <span>💻 Online / Phone Consultation</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="appointmentType"
                          value="site"
                          checked={formData.appointmentType === 'site'}
                          onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                        />
                        <span>📍 Site Visit (For Large Projects)</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Preferred Date <span>*</span></label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Preferred Time</label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    >
                      <option value="">Select a time slot</option>
                      <option value="9:00 AM - 11:00 AM">9:00 AM - 11:00 AM</option>
                      <option value="11:00 AM - 1:00 PM">11:00 AM - 1:00 PM</option>
                      <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                      <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Requirements / Product Interest</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your electrical project requirements, products you're interested in, approximate quantity, or any specific technical specifications."
                    rows="4"
                  />
                </div>

                <div className="form-note">
                  <p>⚡ Our sales team will contact you within 24 hours to discuss your requirements, share pricing, and confirm the consultation schedule.</p>
                </div>
                
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span> Sending Request...
                    </>
                  ) : (
                    'Request Consultation →'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <div>
                <h4>ISI Marked Quality</h4>
                <p>BIS certified products</p>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🇮🇳</span>
              <div>
                <h4>Made in India</h4>
                <p>Manufactured in Mansa, Punjab</p>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <div>
                <h4>5+ Year Warranty*</h4>
                <p>On select products</p>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🏭</span>
              <div>
                <h4>500+ Clients Served</h4>
                <p>Across India</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BookAppointment;