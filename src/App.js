import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// Import all pages
import Home from './pages/Home';
import Products from './components/Products';
import About from './components/About';
import Contact from './components/Contact';
import Reviews from './components/Reviews';
import Admin from './components/Admin';
import BookAppointment from './components/BookAppointment';
import Catalog from './components/Catalog'; // Added Catalog import
import './App.css';

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

// Loading Screen Component - Updated for RIM
function LoadingScreen({ onLoad }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(-1);

  useEffect(() => {
    // Show letters one by one (RIM has 3 letters)
    let index = 0;
    const letterInterval = setInterval(() => {
      if (index < 3) {
        setCurrentLetterIndex(index);
        index++;
      } else {
        clearInterval(letterInterval);
      }
    }, 150);

    // After 2.5 seconds, start fade out
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // After 3 seconds, complete loading
    const completeTimer = setTimeout(() => {
      if (onLoad) {
        onLoad();
      }
    }, 3000);

    return () => {
      clearInterval(letterInterval);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onLoad]);

  // Letters for RIM and full brand name
  const rimLetters = ['R', 'I', 'M'];

  return (
    <div className={`loader-container ${fadeOut ? 'fade-out' : ''}`}>
      {/* Background decoration */}
      <div className="loader-background">
        <span>ROYAL INDUSTRIES MANSA</span>
        <span>ELECTRICAL SWITCHGEAR</span>
        <span>ISI MARKED • QUALITY ASSURED</span>
      </div>
      
      {/* Floating icons - Electrical theme */}
      <div className="floating-icon">⚡</div>
      <div className="floating-icon">🔌</div>
      <div className="floating-icon">🔄</div>
      <div className="floating-icon">📟</div>
      <div className="floating-icon">🔒</div>
      <div className="floating-icon">〰️</div>

      <div className="loader-content">
        {/* Logo */}
        <div className="logo-wrapper">
          <div className="loader-logo">
            <img 
              src="https://i.postimg.cc/qByxbLtZ/images-removebg-preview.png" 
              alt="RIM Logo" 
            />
          </div>
          <div className="logo-ring"></div>
          <div className="logo-ring-outer"></div>
        </div>
        
        {/* Text container with sequential letter reveal */}
        <div className="text-container">
          {rimLetters.map((letter, index) => (
            <span 
              key={index} 
              className={`letter ${currentLetterIndex >= index ? 'revealed' : ''}`}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Full Brand Name */}
        <div className="brand-name-container">
          <span className="brand-full">Royal Industries Mansa</span>
        </div>

        {/* Tagline */}
        <div className="tagline-container">
          <span className="tagline">Quality Switchgear Solutions Since 2005</span>
        </div>

        {/* Loading bar */}
        <div className="loading-bar-container">
          <div className="loading-bar">
            <div className="loading-bar-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Layout component that conditionally shows Navbar and Footer
function Layout({ children }) {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  
  return (
    <div className="App">
      {!isAdminPage && <Navbar />}
      <main className={`main-content ${isAdminPage ? 'admin-main' : ''}`}>
        {children}
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen onLoad={handleLoadingComplete} />;
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/products" element={
          <Layout>
            <Products />
          </Layout>
        } />
        <Route path="/about" element={
          <Layout>
            <About />
          </Layout>
        } />
        <Route path="/contact" element={
          <Layout>
            <Contact />
          </Layout>
        } />
        <Route path="/reviews" element={
          <Layout>
            <Reviews />
          </Layout>
        } />
        <Route path="/book-appointment" element={
          <Layout>
            <BookAppointment />
          </Layout>
        } />
        <Route path="/catalog" element={
          <Layout>
            <Catalog />
          </Layout>
        } />
        <Route path="/admin" element={
          <Layout>
            <Admin />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;