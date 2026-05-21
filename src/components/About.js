import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {



  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-badge">EST. 2005</div>
          <h1>RiM</h1>
          <div className="hero-tagline">Royal Industries Mansa</div>
          <p>Powering Industries • Protecting Homes • Precision Switchgear Solutions</p>
          <div className="hero-cta">
            <Link to="/products" className="hero-btn primary">Explore Products</Link>
            <a href="#story" className="hero-btn secondary">Our Story</a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">5000+</span>
              <span className="stat-label">Projects Supplied</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">15+</span>
              <span className="stat-label">Years Experience*</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Authentic Product</span>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story" id="story">
        <div className="container">
          <div className="story-content">
            <div className="section-badge">Our Journey</div>
            <h2>The <span>RiM</span> Story</h2>
            <p><strong>Royal Industries Mansa (RiM)</strong> was established with a vision to provide high-quality, reliable, and affordable electrical switchgear solutions to industries and households across India. From humble beginnings in Mansa, Punjab, we've grown into a trusted name in the electrical industry.</p>
            <p>Our product range includes <strong>Changeover Switches, Main Switches, Busbar Chambers, Reverse/Forward & LT Control Panels, Submersible Controllers, MCBs, Distribution Boxes, Power Strips, Industrial Sockets, DMC Connectors, MCCBs, Kit-Kat Series (Copper/Brass), Capacitors, KVR Heavy Duty Boxes, Thimbles, Immersion Rods, Anti-Mosquito Racquets, Fan Exhaust Louvers, and all related spare parts.</strong></p>
            <div className="story-highlight">
              <div className="highlight-icon">🇮🇳</div>
              <div className="highlight-text">
                <strong>Proudly Made in India - Mansa, Punjab</strong>
                <span>Manufactured in state-of-the-art facilities with  quality components</span>
              </div>
            </div>
          </div>
          <div className="story-image">
            <div className="image-overlay"></div>
          </div>
        </div>
      </section>


      {/* Mission Section */}
      <section className="about-mission">
        <div className="container">
          <div className="section-badge center">Our Purpose</div>
          <h2>Mission & Vision</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">⚡</div>
              <h3>Our Mission</h3>
              <p>To provide reliable, safe, and affordable electrical switchgear solutions that power industries and protect homes across India with uncompromising quality.</p>
              <div className="mission-stats">
                <div>✓ 500+ Industrial Projects</div>
                <div>✓ 98% Customer Satisfaction</div>
              </div>
            </div>
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <h3>Our Vision</h3>
              <p>To become India's most trusted electrical switchgear brand, recognized for  quality, innovation, and commitment to electrical safety.</p>
              <div className="mission-stats">
                <div>✓ #1 Switchgear Brand in Region</div>
                <div>✓ 500+ Cities Served</div>
              </div>
            </div>
            <div className="mission-card">
              <div className="mission-icon">💎</div>
              <h3>Core Values</h3>
              <p>Quality First • Safety Always • Customer Trust • Innovation • Made in India</p>
              <div className="mission-stats">
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="about-features">
        <div className="container">
          <div className="section-badge center">Why Choose Us</div>
          <h2>RiM Stands Apart</h2>
          <p className="section-subtitle">
            Engineered with precision. Built for safety. Designed for durability.
          </p>

          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon">⚡</div>
              <h3> Quality</h3>
              <p>All our products meet BIS standards for complete electrical safety and performance assurance.</p>
              <div className="feature-tag">ISI Certified</div>
            </div>

            <div className="feature-box">
              <div className="feature-icon">🔧</div>
              <h3>Heavy Duty Build</h3>
              <p>Industrial-grade components designed for high current loads and continuous operation.</p>
              <div className="feature-tag">15+ Year Experience*</div>
            </div>

            <div className="feature-box">
              <div className="feature-icon">🛡️</div>
              <h3>Complete Protection</h3>
              <p>Overload, short circuit, and thermal protection built into every switchgear solution.</p>
              <div className="feature-tag">Safety First</div>
            </div>

            <div className="feature-box">
              <div className="feature-icon">🇮🇳</div>
              <h3>Made in India</h3>
              <p>Proudly manufactured in Mansa, Punjab with premium materials and strict quality checks.</p>
              <div className="feature-tag">Proudly Indian</div>
            </div>

            <div className="feature-box">
              <div className="feature-icon">🔌</div>
              <h3>Complete Range</h3>
              <p>From Changeovers to Control Panels, we have everything under one roof.</p>
              <div className="feature-tag">One Stop Shop</div>
            </div>

            <div className="feature-box">
              <div className="feature-icon">📞</div>
              <h3>24/7 Tech Support</h3>
              <p>Expert technical support available for installation and troubleshooting.</p>
              <div className="feature-tag">Pan India Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">15<span>+</span></div>
              <div className="stat-label">Years Experience*</div>
              <div className="stat-desc">Comprehensive coverage</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500<span>+</span></div>
              <div className="stat-label">Projects Supplied</div>
              <div className="stat-desc">Across India</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100<span>%</span></div>
              <div className="stat-label"></div>
              <div className="stat-desc">Quality assured</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">30<span>+</span></div>
              <div className="stat-label">Product Categories</div>
              <div className="stat-desc">Complete range</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="about-testimonials">
        <div className="container">
          <div className="section-badge center">Testimonials</div>
          <h2>What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="quote-icon">“</div>
              <p>RiM's changeover switches and control panels have been excellent for our industrial needs. The quality is top-notch and after-sales support is great!</p>
              <div className="customer-info">
                <div className="customer-avatar">RK</div>
                <div className="customer-details">
                  <h4>Rajesh Khanna</h4>
                  <div className="rating">★★★★★</div>
                  <small>Industrial Consultant</small>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="quote-icon">“</div>
              <p>We've been using RiM's MCB boxes and distribution panels for our housing projects. The quality and pricing are very competitive.</p>
              <div className="customer-info">
                <div className="customer-avatar">SP</div>
                <div className="customer-details">
                  <h4>Sunil Patel</h4>
                  <div className="rating">★★★★★</div>
                  <small>Builder & Developer</small>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="quote-icon">“</div>
              <p>The DMC connectors and terminal blocks from RiM are excellent quality. Their Kit-Kat series is our go-to choice for residential work.</p>
              <div className="customer-info">
                <div className="customer-avatar">AM</div>
                <div className="customer-details">
                  <h4>Amit Mehta</h4>
                  <div className="rating">★★★★★</div>
                  <small>Electrical Contractor</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <h2>Ready to Power Your Project?</h2>
          <p>Get the best quality switchgear solutions at competitive prices. Pan India shipping available.</p>
          <div className="cta-buttons">
            <Link to="/products" className="btn-primary">Explore Products</Link>
            <a href="tel:+919815097851" className="btn-primary">Request a Quote</a>
          </div>
          <div className="cta-features">
            <span>✓ Free Shipping on Bulk Orders</span>
            <span>✓ GST Invoice Available</span>
            <span>✓ Technical Support</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;