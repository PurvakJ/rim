import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Updated Contact Numbers for RIM
  const phoneNumber1 = '9815097851';
  const phoneNumber2 = '7986295488';
  const whatsappNumber = '919815097851';
  const whatsappMessage = encodeURIComponent("Hello RIM, I'm interested in your electrical switchgear products. I'd like to know more about your changeovers, MCB boxes, control panels, and bulk pricing.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Social Media Links
  const instagramLink = "https://www.instagram.com/rimmansa/";
  const facebookLink = "https://www.facebook.com/steelk001/";
  const justdialLink = "https://www.justdial.com/Mansa/Royal-Industries-Mansa-Kot-Lallu/9999P1652-1652-171230152122-Z2M7_BZDET";
  const indiamartLink = "https://www.indiamart.com/royalindustries-mansa/";

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <div className="logo-icon">
              <img 
                src="https://i.postimg.cc/qByxbLtZ/images-removebg-preview.png" 
                alt="RIM Logo" 
              />
            </div>
            <h3>RIM</h3>
          </div>
          <p className="brand-tagline">Royal Industries Mansa | Since 2005</p>
          <p className="brand-description">Leading manufacturer of premium electrical switchgear products including Changeover Switches, MCB Boxes, Control Panels, Busbar Chambers, and complete industrial electrical solutions. ISI marked with 5+ year warranty.</p>
          <div className="trust-badges">
            <span>🇮🇳 Made in India</span>
            <span>⚡ ISI Marked</span>
            <span>🛡️ 5+ Year Warranty*</span>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/about">About RIM</Link></li>
            <li><Link to="/catalog">Product Catalog</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/reviews">Customer Reviews</Link></li>
            <li><Link to="/admin">Admin</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Our Products</h3>
          <ul>
            <li><Link to="/products?category=changeover">🔄 Changeover Switches</Link></li>
            <li><Link to="/products?category=mcb">⚡ MCB & Distribution Boxes</Link></li>
            <li><Link to="/products?category=panel">📟 Control Panels</Link></li>
            <li><Link to="/products?category=motor-starters">⏪⏩ Reverse/Forward Starters</Link></li>
            <li><Link to="/products?category=busbar">〰️ Busbar Chambers</Link></li>
            <li><Link to="/products?category=connectors">🔗 DMC Connectors & Thimbles</Link></li>
            <li><Link to="/products?category=protective">🛡️ Protection Devices</Link></li>
            <li><Link to="/products">View All Products →</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact & Location</h3>
          <ul className="contact-info">
            <li>
              <span className="contact-icon">📍</span>
              <span>Village Chakerian Road, Mansa 151505<br />Punjab, India</span>
            </li>
            <li>
              <span className="contact-icon">📞</span>
              <span>
                <a href={`tel:${phoneNumber1}`}>{phoneNumber1}</a>
                <br />
                <a href={`tel:${phoneNumber2}`}>{phoneNumber2}</a>
              </span>
            </li>
            <li>
              <span className="contact-icon">💬</span>
              <span>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
              </span>
            </li>
            <li>
              <span className="contact-icon">🕒</span>
              <span>Monday - Saturday: 9:00 AM - 7:00 PM<br />Sunday: By Appointment Only</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} RIM - Royal Industries Mansa. All rights reserved.</p>
          <p className="footer-tagline">⚡ Quality Switchgear Solutions | ISI Marked | Industrial & Residential ⚡</p>
          <div className="footer-links">
            <a href={instagramLink} target="_blank" rel="noopener noreferrer">Instagram</a>
            <span className="separator">|</span>
            <a href={facebookLink} target="_blank" rel="noopener noreferrer">Facebook</a>
            <span className="separator">|</span>
            <a href={justdialLink} target="_blank" rel="noopener noreferrer">Justdial</a>
            <span className="separator">|</span>
            <a href={indiamartLink} target="_blank" rel="noopener noreferrer">IndiaMART</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;