import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Updated Contact Numbers for RiM
  const phoneNumber1 = '9815097851';
  const phoneNumber2 = '7986295488';
  const whatsappNumber = '919815097851';
  const whatsappMessage = encodeURIComponent("Hello RiM, I'm interested in your electrical switchgear products. I'd like to know more about your changeovers, MCB boxes, and control panels.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isOpen]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <div className="logo-icon">
            <img 
              src="https://i.postimg.cc/qByxbLtZ/images-removebg-preview.png" 
              alt="RiM Logo" 
            />
          </div>
          <div className="logo-text">
            <span className="logo-main">RiM</span>
            <span className="logo-sub">Royal Industries Mansa</span>
          </div>
        </Link>
        
        <button 
          className={`menu-toggle ${isOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <ul className={`nav-links ${isOpen ? 'mobile-open' : ''}`}>
          <li><NavLink to="/" onClick={closeMenu} end>Home</NavLink></li>
          <li><NavLink to="/about" onClick={closeMenu}>About</NavLink></li>
          <li><NavLink to="/products" onClick={closeMenu}>Products</NavLink></li>
          <li><NavLink to="/catalog" onClick={closeMenu}>Catalog</NavLink></li>
          <li><NavLink to="/reviews" onClick={closeMenu}>Reviews</NavLink></li>
          <li><NavLink to="/contact" onClick={closeMenu}>Contact</NavLink></li>
          <li className="mobile-contact">
            <a href={`tel:${phoneNumber1}`} className="mobile-phone-btn">
              📞 {phoneNumber1} | {phoneNumber2}
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="mobile-wa-btn">
              💬 WhatsApp
            </a>
          </li>
        </ul>
        
        <div className="nav-contact">
          <a href={`tel:${phoneNumber1}`} className="phone-btn">
            📞 {phoneNumber1}
          </a>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="wa-btn" aria-label="WhatsApp">
            💬
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;