// pages/Home.js or components/Home.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getReviews, addReview } from '../api';
import './Home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviewFormData, setReviewFormData] = useState({
    name: '',
    rating: 5,
    comment: ''
  });

  // Updated Contact Numbers & Social Links
  const phoneNumber1 = '9815097851';
  const phoneNumber2 = '7986295488';
  const whatsappNumber = '919815097851';
  const whatsappMessage = encodeURIComponent("Hello RIM, I'm interested in your electrical switchgear products. I need industrial-grade solutions for changeovers, MCB boxes, and control panels.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  
  const instagramLink = "https://www.instagram.com/rimmansa/";
  const facebookLink = "https://www.facebook.com/steelk001/";
  const justdialLink = "https://www.justdial.com/Mansa/Royal-Industries-Mansa-Kot-Lallu/9999P1652-1652-171230152122-Z2M7_BZDET";

  // Updated Carousel for Electrical Switchgear Industry
  const carouselImages = [
    {
      url: "https://i.postimg.cc/hj9pHW40/close-up-circuit-breakers-wire-control-panel.jpg",
      title: "Heavy Duty Switchgears",
      subtitle: "Precision Engineering for Industrial Safety"
    },
    {
      url: "https://i.postimg.cc/SsVvtbxs/woman-turning-off-light-switch.jpg",
      title: "Quality Control Panels",
      subtitle: "Reveres Forward & LT Control Solutions"
    },
    {
      url: "https://i.postimg.cc/66jPrKPr/concrete-wall-with-meters-pipes.jpg",
      title: "Complete Switchgear Solutions",
      subtitle: "From Busbar Chambers to Submersible Controllers"
    },
    {
      url: "https://i.postimg.cc/Bbmc0Jrc/electrical-panel-electric-meter-circuit-breakers-electric-frequency-converter-motor-speed-controller.jpg",
      title: "Trusted Since Decades",
      subtitle: "ISI Marked & Premium Quality Components"
    }
  ];

  // Helper Functions
  const getCategoryDisplayName = useCallback((categoryValue) => {
    const displayNames = {
      'changeover': 'Changeover Switches',
      'mcb': 'MCBs & Distribution Boxes',
      'panel': 'Control Panels',
      'motor-starters': 'Motor Starters (R/F)',
      'busbar': 'Busbar Chambers',
      'connectors': 'DMC Connectors & Thimbles',
      'protective': 'Immersion Rods & Anti-Mosquito',
      'wiring': 'Plugs, Sockets & Power Strips',
      'capacitors': 'Power Capacitors',
      'mccb': 'MCCB & Moulded Case Breakers'
    };
    return displayNames[categoryValue] || categoryValue?.replace(/-/g, ' ').toUpperCase();
  }, []);

  const getCategoryIcon = useCallback((category) => {
    const icons = {
      'changeover': '🔄',
      'mcb': '⚡',
      'panel': '📟',
      'motor-starters': '⏪⏩',
      'busbar': '〰️',
      'connectors': '🔗',
      'protective': '🛡️',
      'wiring': '🔌',
      'capacitors': '⚛️',
      'mccb': '🔒'
    };
    return icons[category] || '🔌';
  }, []);

  const openWhatsApp = (productName) => {
    const message = encodeURIComponent(`Hello RIM, I'm interested in the "${productName}" for my electrical project. Could you please share technical details and best price?`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const nextImage = (e) => { 
    e.stopPropagation(); 
    if (selectedProduct?.images?.length) 
      setCurrentImageIndex((prev) => (prev + 1) % selectedProduct.images.length); 
  };
  
  const prevImage = (e) => { 
    e.stopPropagation(); 
    if (selectedProduct?.images?.length) 
      setCurrentImageIndex((prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length); 
  };

  // Gallery Items (Switchgear Themed)
  const galleryItems = [
    { id: 1, image: "https://i.postimg.cc/4x9t8vxv/voltage-distributor-with-automatic-switches-electrical-background.jpg", title: "M C C B", fullTitle: "MCCB", description: "Moulded Case Circuit Breakers" },
    { id: 2, image: "https://thumbs.dreamstime.com/b/switchgear-switch-disconnector-fuse-unit-triple-pole-neutral-metalclad-manual-changeover-box-hand-switches-electric-knife-250766405.jpg", title: "C H A N G E O V E R", fullTitle: "CHANGEOVER", description: "Rotary & Auto Changeovers" },
    { id: 3, image: "https://m.media-amazon.com/images/I/61oL5bdQ7uL._AC_UF1000,1000_QL80_.jpg", title: "B U S B A R", fullTitle: "BUS BAR", description: "High Conductivity Chambers" },
    { id: 4, image: "https://www.energy.gov/sites/default/files/styles/full_article_width/public/Powerstrip.jpeg?itok=6eTAyAc_", title: "P O W E R  S T R I P S", fullTitle: "POWER STRIPS", description: "To Power Up Your Devices" }
  ];

  // Features Data
  const RimFeatures = [
    { icon: "⚡", title: "ISI Marked Quality", description: "All MCBs, Changeovers, and Panels meet BIS standards for complete electrical safety." },
    { icon: "🔧", title: "Heavy Duty Build", description: "Industrial-grade components designed for high current loads and continuous operation." },
    { icon: "🛡️", title: "15+ Year Experience", description: "Comprehensive warranty on MCB boxes, MCCB, and Kit-Kat series products." }
  ];


  // Alternative: Even more random - picks from different segments
  const getRandomFeaturedProductsV2 = (allProducts) => {
    if (!allProducts || allProducts.length === 0) return [];
    
    const totalProducts = allProducts.length;
    
    if (totalProducts < 3) return allProducts;
    
    // Define segment sizes (dividing products into 3 segments logically)
    const segmentSize = Math.floor(totalProducts / 3);
    
    const segments = {
      segment1: allProducts.slice(0, segmentSize),
      segment2: allProducts.slice(segmentSize, 2 * segmentSize),
      segment3: allProducts.slice(2 * segmentSize, totalProducts)
    };
    
    const selectedProducts = [];
    
    // Pick random product from segment 1 (first 1/3)
    if (segments.segment1.length > 0) {
      const idx1 = Math.floor(Math.random() * segments.segment1.length);
      selectedProducts.push(segments.segment1[idx1]);
    }
    
    // Pick random product from segment 2 (middle 1/3)
    if (segments.segment2.length > 0) {
      const idx2 = Math.floor(Math.random() * segments.segment2.length);
      selectedProducts.push(segments.segment2[idx2]);
    }
    
    // Pick random product from segment 3 (last 1/3)
    if (segments.segment3.length > 0) {
      const idx3 = Math.floor(Math.random() * segments.segment3.length);
      selectedProducts.push(segments.segment3[idx3]);
    }
    
    return selectedProducts;
  };

  // Load Products with truly random selection
  const loadProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      
      // Filter valid products
      const validProducts = data.filter(product => product && product.id);
      const totalCount = validProducts.length;
      
      console.log(`Total products available: ${totalCount}`);
      
      let productsToShow = [];
      
      if (validProducts.length >= 3) {
        // Method 1: Use the segment-based random pick
        productsToShow = getRandomFeaturedProductsV2(validProducts);
        
        // Optional: Shuffle the selected products for order randomness
        for (let i = productsToShow.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [productsToShow[i], productsToShow[j]] = [productsToShow[j], productsToShow[i]];
        }
      } else {
        productsToShow = validProducts;
      }
      
      setFeaturedProducts(productsToShow);
      
      console.log("Selected featured products (from different ranges):", productsToShow.map(p => ({ id: p.id, name: p.name })));
      
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback products with varied indices to simulate randomness
      const fallbackProducts = [
        { id: 1, name: "Auto Changeover Switch (63A/100A)", price: 3850, description: "Automatic transfer switch for generators & mains. Suitable for submersible pumps and home automation.", images: ["https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format"], category: "changeover", featured: true },
        { id: 67, name: "Double Door MCB Box (24 Way)", price: 2850, description: "Industrial grade distribution box with heavy duty build.", images: ["https://images.unsplash.com/photo-1562408590-e32931084e23?w=600&auto=format"], category: "mcb", featured: true },
        { id: 189, name: "Reverse Forward Control Panel (15 HP)", price: 12500, description: "Complete motor starter with overload protection.", images: ["https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=600&auto=format"], category: "panel", featured: true }
      ];
      setFeaturedProducts(fallbackProducts);
    }
  }, []);

  const loadReviews = useCallback(async () => {
    try {
      const allReviews = await getReviews();
      if (allReviews && Array.isArray(allReviews)) {
        const shuffled = [...allReviews];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setReviews(shuffled.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadReviews();
  }, [loadProducts, loadReviews]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedProduct]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewFormData.name || !reviewFormData.comment) {
      alert('Please fill in all fields');
      return;
    }
    setReviewSubmitting(true);
    try {
      await addReview(reviewFormData);
      setReviewSuccess(true);
      setReviewFormData({ name: '', rating: 5, comment: '' });
      setTimeout(() => { setReviewSuccess(false); setShowReviewForm(false); }, 3000);
      loadReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Carousel Section */}
      <section className="carousel-section">
        <div className="carousel-container">
          <div className="carousel-slide" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {carouselImages.map((image, index) => (
              <div key={index} className="carousel-item">
                <div className="carousel-image-wrapper">
                  <img src={image.url} alt={image.title} className="carousel-image" loading={index === 0 ? "eager" : "lazy"} />
                  <div className="carousel-overlay">
                    <div className="carousel-content">
                      <span className="carousel-badge">RIM - Royal Industries Mansa</span>
                      <h2>{image.title}</h2>
                      <p>{image.subtitle}</p>
                      <Link to="/products" className="btn-primary">Explore Switchgear →</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-btn prev" onClick={prevSlide} aria-label="Previous slide">❮</button>
          <button className="carousel-btn next" onClick={nextSlide} aria-label="Next slide">❯</button>
          <div className="carousel-dots">
            {carouselImages.map((_, index) => (
              <button key={index} className={`dot ${currentSlide === index ? 'active' : ''}`} onClick={() => setCurrentSlide(index)} aria-label={`Go to slide ${index + 1}`} />
            ))}
          </div>
        </div>
      </section>

{/* Welcome Section */}
<section className="welcome-section">
  <div className="container">
    <div className="welcome-grid">
      <div className="welcome-image">
        <img 
          src="https://i.postimg.cc/4x9t8vxv/voltage-distributor-with-automatic-switches-electrical-background.jpg" 
          alt="RIM Electrical Switchgear Manufacturing" 
          className="welcome-img"
        />
        <div className="welcome-image-badge">
          <span>⚡</span>
          <p>ISI Certified Products</p>
        </div>
      </div>
      <div className="welcome-content">
        <div className="welcome-badge">Powering Industries & Homes Since Decades</div>
        <h1>Welcome to <span>RIM</span> <span style={{ fontSize: '1.8rem', display: 'block' }}>Royal Industries Mansa</span></h1>
        <p>Your trusted partner for high-quality electrical switchgear solutions. We manufacture a complete range of Changeovers, Main Switches, Busbar Chambers, Control Panels, MCB Boxes, and Industrial Safety Components that meet stringent BIS standards.</p>
        <div className="welcome-buttons">
          <Link to="/products" className="btn-primary">Browse Products</Link>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-secondary">WhatsApp Inquiry</a>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-badge">Why Choose RIM</div>
          <h2>The Royal <span>Advantage</span></h2>
          <div className="features-grid">
            {RimFeatures.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Section */}
      <section className="parallax-section">
        <div className="parallax-overlay"></div>
        <div className="container">
          <div className="parallax-content">
            <span className="parallax-badge">Industrial Grade Quality</span>
            <h2>Premium <span>Switchgear Solutions</span></h2>
            <p>From heavy-duty Changeover switches and MCCBs to precision-engineered Busbar chambers and Submersible Control Panels, every RIM product is crafted for safety, durability, and peak performance.</p>
            <div className="parallax-features">
              <div className="parallax-feature"><span>✓</span><p>Full Range of MCB Boxes</p></div>
              <div className="parallax-feature"><span>✓</span><p>Reverse/Forward & LT Panels</p></div>
              <div className="parallax-feature"><span>✓</span><p>DMC Connectors & Thimbles</p></div>
            </div>
            <Link to="/products" className="btn-parallax">Get Catalog →</Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section - Now truly random */}
      <section className="featured-products">
        <div className="container">
          <div className="section-badge">Best Sellers</div>
          <h2>Featured <span>Electrical Products</span></h2>
          <div className="products-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <div key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
                  <div className="product-image-container">
                    {product.images && product.images[0] ? 
                      <img src={product.images[0]} alt={product.name} className="product-image" loading="lazy" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&auto=format'; }} />
                      : <div className="image-placeholder"><span>⚡</span></div>
                    }
                    {product.featured && <div className="product-badge">Bestseller</div>}
                  </div>
                  <div className="product-info">
                    <span className="product-category">{getCategoryIcon(product.category)} {getCategoryDisplayName(product.category)}</span>
                    <h3 className="product-title">{product.name}</h3>
                    <div className="product-price">₹{product.price?.toLocaleString() || '0'}</div>
                    <p className="product-description">{product.description?.substring(0, 70)}...</p>
                    <div className="product-footer"><button className="view-details-btn">View Details →</button></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products"><div className="loading-container"><div className="spinner"></div><p>Loading industrial products...</p></div></div>
            )}
          </div>
          <div className="view-all-container"><Link to="/products" className="btn-view-all">View Complete Range →</Link></div>
        </div>
      </section>

      {/* Product Modal - Same structure */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content product-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedProduct(null)}>×</button>
            <div className="product-detail-gallery">
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <div className="image-slider-container">
                  <div className="main-slider-image">
                    <img src={selectedProduct.images[currentImageIndex]} alt={selectedProduct.name} />
                    {selectedProduct.images.length > 1 && (<><button className="slider-nav prev-nav" onClick={prevImage}>❮</button><button className="slider-nav next-nav" onClick={nextImage}>❯</button></>)}
                  </div>
                  <div className="slider-dots">{selectedProduct.images.map((_, idx) => (<button key={idx} className={`slider-dot ${currentImageIndex === idx ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }} />))}</div>
                  <div className="thumbnail-strip">{selectedProduct.images.map((img, idx) => (<div key={idx} className={`thumbnail ${currentImageIndex === idx ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}><img src={img} alt={`Thumb ${idx + 1}`} /></div>))}</div>
                </div>
              ) : (<div className="gallery-placeholder"><span>⚡</span></div>)}
            </div>
            <div className="product-detail-info">
              <span className="product-category-tag">{getCategoryIcon(selectedProduct.category)} {getCategoryDisplayName(selectedProduct.category)}</span>
              <h2>{selectedProduct.name}</h2>
              <div className="price-tag">₹{selectedProduct.price?.toLocaleString() || '0'}</div>
              <p className="full-description">{selectedProduct.description || 'Heavy-duty electrical switchgear designed for safety and long life. Comes with ISI marking and industry-leading quality.'}</p>
              <div className="contact-actions">
                <a href={`tel:${phoneNumber1}`} className="call-now-btn">📞 Call for Best Price</a>
                <button onClick={() => openWhatsApp(selectedProduct.name)} className="wa-consult-btn">💬 Chat on WhatsApp</button>
                <Link to="/contact" className="consult-btn">Get Quote →</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item"><div className="stat-number">500<span>+</span></div><div className="stat-label">Projects Supplied</div></div>
            <div className="stat-item"><div className="stat-number">15<span>+</span></div><div className="stat-label">Years Experience*</div></div>
            <div className="stat-item"><div className="stat-number">24<span>/7</span></div><div className="stat-label">Tech Support</div></div>
            <div className="stat-item"><div className="stat-number">50<span>+</span></div><div className="stat-label">Product Categories</div></div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <div className="gallery-container">
        {galleryItems.map((item) => (
          <div key={item.id} className="gallery-item" style={{ backgroundImage: `url(${item.image})` }}>
            <div className="gallery-overlay"><h3><span className="vertical-text">{item.title}</span><span className="horizontal-text">{item.fullTitle}</span></h3><p>{item.description}</p></div>
          </div>
        ))}
      </div>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="container">
          <div className="section-badge">Testimonials</div>
          <h2>What Our <span>Customers Say</span></h2>
          <div className="review-form-wrapper">
            {!showReviewForm ? (<button className="btn-write-review" onClick={() => setShowReviewForm(true)}>✍️ Write a Review</button>) : (
              <div className="review-form-container"><h3>Share Your Experience with RIM Products</h3>
                <form onSubmit={handleReviewSubmit}>
                  <div className="form-group"><input type="text" placeholder="Your Name *" value={reviewFormData.name} onChange={(e) => setReviewFormData({ ...reviewFormData, name: e.target.value })} required /></div>
                  <div className="form-group"><div className="rating-input">{[...Array(5)].map((_, i) => (<button key={i} type="button" className={`star-btn ${i+1 <= reviewFormData.rating ? 'active' : ''}`} onClick={() => setReviewFormData({ ...reviewFormData, rating: i+1 })}>★</button>))}</div></div>
                  <div className="form-group"><textarea placeholder="Your Review *" value={reviewFormData.comment} onChange={(e) => setReviewFormData({ ...reviewFormData, comment: e.target.value })} rows="3" required /></div>
                  <div className="form-actions"><button type="submit" className="btn-submit" disabled={reviewSubmitting}>{reviewSubmitting ? 'Submitting...' : 'Submit Review'}</button><button type="button" className="btn-cancel" onClick={() => setShowReviewForm(false)}>Cancel</button></div>
                </form>
              </div>
            )}
          </div>
          {reviewSuccess && <div className="success-message">✓ Thank you for your valuable feedback!</div>}
          <div className="reviews-grid">
            {reviews.length > 0 ? (reviews.map((review) => (<div key={review.id} className="review-card"><div className="review-header"><div className="reviewer-info"><div className="reviewer-avatar">{review.name.charAt(0)}</div><div><h3>{review.name}</h3><div className="rating-stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div></div></div></div><p>{review.comment}</p></div>))) : (<div className="no-reviews"><p>No reviews yet. Be the first to share your experience!</p></div>)}
          </div>
          <div className="view-all-reviews"><Link to="/reviews" className="btn-view-all">View All Reviews →</Link></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Need a Bulk Quote or Custom Solution?</h2>
          <p>Get the best rates for industrial projects, housing societies, or panel builders. We supply across India.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn-primary">Request a Quote</Link>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-wa">💬 Chat on WhatsApp</a>
          </div>
          <div className="cta-features">
            <span>✓ GST Invoice</span>
            <span>✓ Pan India Shipping</span>
            <span>✓ Technical Support</span>
          </div>
        </div>
      </section>

      {/* Contact Bar */}
      <section className="contact-bar">
        <div className="container">
          <div className="contact-bar-content">
            <div className="contact-item"><span className="contact-icon">📞</span><div><h4>Call Our Experts</h4><a href={`tel:${phoneNumber1}`}>{phoneNumber1}</a> | <a href={`tel:${phoneNumber2}`}>{phoneNumber2}</a></div></div>
            <div className="contact-divider"></div>
            <div className="contact-item"><span className="contact-icon">💬</span><div><h4>WhatsApp Us</h4><a href={whatsappLink} target="_blank" rel="noopener noreferrer">Click to Chat →</a></div></div>
            <div className="contact-divider"></div>
            <div className="contact-item"><span className="contact-icon">📍</span><div><h4>RIM - Royal Industries</h4><p>Mansa, Punjab (Village Chakerian Road, Mansa, Punjab)</p></div></div>
            <div className="contact-divider"></div>
            <div className="contact-item social-icons"><span className="contact-icon">📱</span><div><h4>Follow Us</h4><div><a href={instagramLink} target="_blank" rel="noopener noreferrer">Instagram</a> | <a href={facebookLink} target="_blank" rel="noopener noreferrer">Facebook</a> | <a href={justdialLink} target="_blank" rel="noopener noreferrer">Justdial</a></div></div></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;