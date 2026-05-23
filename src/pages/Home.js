// pages/Home.js - Updated with 3 random + 3 static featured products
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getReviews, addReview } from '../api';
import './Home.css';

const Home = () => {
  const [, setCurrentSlide] = useState(0);
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

  // Add these with your other useState declarations
  const [welcomeCarouselIndex, setWelcomeCarouselIndex] = useState(0);
  
  // Track current image index for each featured product
  const [productImageIndices, setProductImageIndices] = useState({});

  // Static Featured Products (Always Shown) - Wrapped in useMemo to prevent recreation on every render
  const staticFeaturedProducts = useMemo(() => [
    {
      id: 'static-1',
      name: "KIT KAT 63 AMP",
      price: 4850,
      description: "DMC KIT KAT 63 AMP",
      images: ["https://res.cloudinary.com/dm9gg8yss/image/upload/v1779348519/WhatsApp_Image_2026-05-21_at_12.47.05_3_cwfj0g.jpg", "https://res.cloudinary.com/dm9gg8yss/image/upload/v1779348521/WhatsApp_Image_2026-05-21_at_12.47.06_j0erls.jpg", "https://res.cloudinary.com/dm9gg8yss/image/upload/v1779348521/WhatsApp_Image_2026-05-21_at_12.47.05_4_pqucau.jpg", "https://res.cloudinary.com/dm9gg8yss/image/upload/v1779348521/WhatsApp_Image_2026-05-21_at_12.47.06_1_vgp5fu.jpg"],
      category: "DMC KIT KAT",
      featured: true,
      displayName: "KIT KAT 63 AMP"
    },
    {
      id: 'static-2',
      name: "KIT KAT 132 AMP",
      price: 1850,
      description: "DMC KIT KAT 132 AMP",
      images: ["https://res.cloudinary.com/dm9gg8yss/image/upload/v1779348523/WhatsApp_Image_2026-05-21_at_12.47.05-removebg-preview_1_vgeliy.png", "https://res.cloudinary.com/dm9gg8yss/image/upload/v1779348522/WhatsApp_Image_2026-05-21_at_12.47.05__1_-removebg-preview_coooiy.png", "https://res.cloudinary.com/dm9gg8yss/image/upload/v1779348521/WhatsApp_Image_2026-05-21_at_12.47.05__2_-removebg-preview_s2o2g0.png"],
      category: "DMC KIT KAT",
      featured: true,
      displayName: "KIT KAT 132 AMP"
    },
    {
      id: 'static-3',
      name: "KIT KAT 100 AMP",
      price: 6250,
      description: "DMC KIT KAT 100 AMP",
      images: ["https://res.cloudinary.com/dm9gg8yss/image/upload/v1779349598/IMG_2703-removebg-preview_qnuubh.png", "https://res.cloudinary.com/dm9gg8yss/image/upload/v1779349598/IMG_2705-removebg-preview_gtwdhn.png", "https://res.cloudinary.com/dm9gg8yss/image/upload/v1779349598/IMG_2704-removebg-preview_qcndje.png"],
      category: "DMC KIT KAT",
      featured: true,
      displayName: "KIT KAT 100 AMP"
    }
  ], []); // Empty dependency array since this data never changes

  // Welcome Carousel Images - Also wrapped in useMemo for consistency
  const welcomeCarouselImages = useMemo(() => [
    {
      url: "https://res.cloudinary.com/dm9gg8yss/image/upload/v1779348519/WhatsApp_Image_2026-05-21_at_12.47.05_3_cwfj0g.jpg",
      alt: "Submersible Control Panel",
      caption: "Control Panels"
    }, 
    {
      url: "https://res.cloudinary.com/dm9gg8yss/image/upload/v1779348523/WhatsApp_Image_2026-05-21_at_12.47.05-removebg-preview_1_vgeliy.png",
      alt: "Submersible Control Panel",
      caption: "Control Panels"
    }, 
    {
      url: "https://res.cloudinary.com/dm9gg8yss/image/upload/v1779536707/WhatsApp_Image_2026-05-23_at_17.10.03_g2hsfd.jpg",
      alt: "Submersible Control Panel",
      caption: "Control Panels"
    },    
    {
      url: "https://i.postimg.cc/jdx5BHqZ/SP4-3.jpg",
      alt: "Submersible Control Panel",
      caption: "Control Panels"
    },
    {
      url: "https://i.postimg.cc/CLshNzjd/611.jpg",
      alt: "MCB Boxes",
      caption: "MCB Distribution Boxes"
    },
    {
      url: "https://i.postimg.cc/Jz8QfdDY/DD23-3.jpg",
      alt: "MCB Boxes",
      caption: "MCB Distribution Boxes"
    },
    {
      url: "https://i.postimg.cc/Vvcw98vZ/705-2.jpg",
      alt: "Busbar Chambers",
      caption: "Busbar Chambers"
    }
  ], []);

  // Auto-slide for welcome carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setWelcomeCarouselIndex((prev) => (prev + 1) % welcomeCarouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [welcomeCarouselImages.length]);

  // Function to navigate product images without opening modal
  const nextProductImage = (e, productId, totalImages) => {
    e.stopPropagation(); // Prevent opening modal
    setProductImageIndices(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages
    }));
  };

  const prevProductImage = (e, productId, totalImages) => {
    e.stopPropagation(); // Prevent opening modal
    setProductImageIndices(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  // Refs for lazy loading animations
  const lazyElementsRef = useRef([]);
  const sectionHeadersRef = useRef([]);
  const productCardsRef = useRef([]);
  const featureCardsRef = useRef([]);
  const galleryItemsRef = useRef([]);

  // Updated Contact Numbers & Social Links
  const phoneNumber1 = '7973417773';
  const phoneNumber2 = '9815097851';
  const whatsappNumber = '917973417773';
  const whatsappMessage = encodeURIComponent("Hello RiM, I'm interested in your electrical switchgear products. I need industrial-grade solutions for changeovers, MCB boxes, and control panels.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  
  const instagramLink = "https://www.instagram.com/rimmansa/";
  const facebookLink = "https://www.facebook.com/steelk001/";
  const justdialLink = "https://www.justdial.com/Mansa/Royal-Industries-Mansa-Kot-Lallu/9999P1652-1652-171230152122-Z2M7_BZDET";

  // Updated Carousel for Electrical Switchgear Industry
  const carouselImages = useMemo(() => [
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
  ], []);

  // --- New Images Array for Testimonials Section ---
  const testimonialImages = useMemo(() => [
    { url: "https://i.postimg.cc/QdNXnhmD/702-8.jpg", name: "702" },
    { url: "https://i.postimg.cc/MpZWrqD9/614-4.jpg", name: "614" },
    { url: "https://i.postimg.cc/yxwVbZfq/601-1.png", name: "601" },
    { url: "https://i.postimg.cc/bw1QL0mH/DD21-2.jpg", name: "DD21" },
    { url: "https://i.postimg.cc/sg5pKPT6/APC22-1.jpg", name: "APC22" },
    { url: "https://i.postimg.cc/3Rk6kbBH/KVR-1.jpg", name: "KVR" },
    { url: "https://i.postimg.cc/SQ7RZT4W/SD3-1.jpg", name: "SD3" },
    { url: "https://i.postimg.cc/ZncqCRHQ/SP1-2.jpg", name: "SP1" }
  ], []);

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
      'mccb': 'MCCB & Moulded Case Breakers',
      'submersible': 'Submersible Control Panels',
      'main-switch': 'Main Switches'
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
      'mccb': '🔒',
      'submersible': '💧',
      'main-switch': '🔘'
    };
    return icons[category] || '🔌';
  }, []);

  const openWhatsApp = (productName) => {
    const message = encodeURIComponent(`Hello RiM, I'm interested in the "${productName}" for my electrical project. Could you please share technical details and best price?`);
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
  const galleryItems = useMemo(() => [
    { id: 1, image: "https://i.postimg.cc/HkLr8Qfy/MCCB1-1.jpg", title: "M C C B", fullTitle: "MCCB", description: "Moulded Case Circuit Breakers" },
    { id: 2, image: "https://i.postimg.cc/YSsqWZQz/609-3.jpg", title: "C H A N G E O V E R", fullTitle: "CHANGEOVER", description: "Rotary & Auto Changeovers" },
    { id: 3, image: "https://i.postimg.cc/Vvcw98vZ/705-2.jpg", title: "B U S B A R", fullTitle: "BUS BAR", description: "High Conductivity Chambers" },
    { id: 4, image: "https://images.thdstatic.com/productImages/356d4bac-8d66-4c13-9824-2bd05c716a2b/svn/power-strips-ylpt-90-64_1000.jpg", title: "P O W E R  S T R I P S", fullTitle: "POWER STRIPS", description: "To Power Up Your Devices" }
  ], []);

  // Get random products from the list
  const getRandomProducts = (allProducts, count = 3) => {
    if (!allProducts || allProducts.length === 0) return [];
    
    // Shuffle array and take first 'count' items
    const shuffled = [...allProducts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
  };

  // Load Products with 3 random + 3 static products
  const loadProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      
      const validProducts = data.filter(product => product && product.id);
      const totalCount = validProducts.length;
      
      console.log(`Total products available: ${totalCount}`);
      
      // Get 3 random products from the backend
      let randomProducts = [];
      if (validProducts.length > 0) {
        randomProducts = getRandomProducts(validProducts, 3);
        console.log("Selected 3 random products:", randomProducts.map(p => ({ id: p.id, name: p.name })));
      }
      
      // Combine static products (always shown) with random products (dynamically selected)
      const combinedFeaturedProducts = [
        ...staticFeaturedProducts,
        ...randomProducts
      ];
      
      setFeaturedProducts(combinedFeaturedProducts);
      console.log("Total featured products:", combinedFeaturedProducts.length);
      
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback - use only static products if API fails
      setFeaturedProducts(staticFeaturedProducts);
    }
  }, [staticFeaturedProducts]); // Now staticFeaturedProducts is stable due to useMemo

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

  // Intersection Observer for lazy animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Handle section headers with children
            if (entry.target.classList.contains('section-header')) {
              const h2 = entry.target.querySelector('h2');
              const subtitle = entry.target.querySelector('.section-subtitle');
              if (h2) h2.classList.add('visible');
              if (subtitle) subtitle.classList.add('visible');
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const allElements = [
      ...lazyElementsRef.current,
      ...sectionHeadersRef.current,
      ...productCardsRef.current,
      ...featureCardsRef.current,
      ...galleryItemsRef.current
    ];

    allElements.forEach(el => {
      if (el) observer.observe(el);
    });

    // Scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      progressBar.style.transform = `scaleX(${scrollPercent})`;
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();

    return () => {
      allElements.forEach(el => {
        if (el) observer.unobserve(el);
      });
      if (progressBar && progressBar.parentNode) {
        document.body.removeChild(progressBar);
      }
      window.removeEventListener('scroll', updateProgress);
    };
  }, []);

  const addToLazyRefs = (el, className = 'lazy-fade-in') => {
    if (el && !lazyElementsRef.current.includes(el)) {
      lazyElementsRef.current.push(el);
      el.classList.add(className);
    }
  };

  const addToProductCards = (el) => {
    if (el && !productCardsRef.current.includes(el)) {
      productCardsRef.current.push(el);
      el.classList.add('lazy-scale-up');
    }
  };

  const addToGalleryItems = (el, idx) => {
    if (el && !galleryItemsRef.current.includes(el)) {
      galleryItemsRef.current.push(el);
      el.classList.add('lazy-slide-up');
      el.style.transitionDelay = `${idx * 0.1}s`;
    }
  };

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
      {/* Scroll Progress Indicator */}
      <div className="scroll-progress"></div>

      {/* Welcome Section with Image Carousel */}
      <section className="welcome-section">
        <div className="container">
          <div className="welcome-grid">
            <div className="welcome-image-carousel lazy-slide-left" ref={el => addToLazyRefs(el, 'lazy-slide-left')}>
              <div className="carousel-container-small">
                <div className="carousel-track-small" style={{ transform: `translateX(-${welcomeCarouselIndex * 100}%)` }}>
                  {welcomeCarouselImages.map((image, index) => (
                    <div key={index} className="carousel-item-small">
                      <img 
                        src={image.url} 
                        alt={image.alt}
                        className="welcome-img"
                      />

                    </div>
                  ))}
                </div>
                <button className="carousel-nav-small prev" onClick={() => {
                  setWelcomeCarouselIndex((prev) => (prev - 1 + welcomeCarouselImages.length) % welcomeCarouselImages.length);
                }}>❮</button>
                <button className="carousel-nav-small next" onClick={() => {
                  setWelcomeCarouselIndex((prev) => (prev + 1) % welcomeCarouselImages.length);
                }}>❯</button>
                <div className="carousel-dots-small">
                  {welcomeCarouselImages.map((_, index) => (
                    <button 
                      key={index} 
                      className={`dot-small ${welcomeCarouselIndex === index ? 'active' : ''}`}
                      onClick={() => setWelcomeCarouselIndex(index)}
                    />
                  ))}
                </div>
              </div>

            </div>
            <div className="welcome-content lazy-slide-right" ref={el => addToLazyRefs(el, 'lazy-slide-right')}>
  <h1>Welcome To <span style={{ fontSize: '2rem', display: 'block' , fontFamily:'arial-black', color:'red'}}>Royal Industries Mansa (RiM)</span></h1>
  <h3>AN ISO 9001:2015 CERTIFIED COMPANY</h3>
  <Link to="/products" className="browse-products-btn">Browse Products</Link>
</div>
          </div>
        </div>
      </section>

      {/* Featured Products Section - 3 Static + 3 Random = 6 Products */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header lazy-fade-in" ref={el => addToLazyRefs(el)}>
            <h2>Featured <span>Products</span></h2>
            <p className="section-subtitle">Premium Quality Switchgear for Every Need</p>
          </div>
          <div className="products-grid products-grid-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, idx) => {
                // Check if this is a static product (has 'static-' in id)
                const isStaticProduct = product.id && product.id.toString().startsWith('static-');
                // Get the display name (for static products, use displayName or name, for dynamic use name)
                const displayProductName = isStaticProduct ? (product.displayName || product.name) : product.name;
                // Get current image index for this product
                const currentImgIndex = productImageIndices[product.id] || 0;
                const hasMultipleImages = product.images && product.images.length > 1;
                
                return (
                  <div 
                    key={product.id} 
                    className={`product-card ${isStaticProduct ? 'static-product' : 'random-product'}`} 
                    onClick={() => setSelectedProduct(product)} 
                    ref={el => addToProductCards(el)} 
                    style={{ transitionDelay: `${idx * 0.05}s` }}
                  >
<div className="product-image-container">
  {product.images && product.images[0] ? 
    <>
      <img 
        src={product.images[currentImgIndex]} 
        alt={displayProductName} 
        className="product-image" 
        loading="lazy"
        style={{
          objectFit: 'contain',
          width: '100%',
          height: '100%',
          padding: '20px'
        }}
        onError={(e) => { 
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          e.target.style.objectFit = 'cover';
        }} 
      />
      {hasMultipleImages && (
        <>
          <button 
            className="product-image-nav prev-nav" 
            onClick={(e) => prevProductImage(e, product.id, product.images.length)}
            aria-label="Previous image"
          >
            ❮
          </button>
          <button 
            className="product-image-nav next-nav" 
            onClick={(e) => nextProductImage(e, product.id, product.images.length)}
            aria-label="Next image"
          >
            ❯
          </button>
          <div className="image-counter">
            {currentImgIndex + 1} / {product.images.length}
          </div>
        </>
      )}
    </>
    : <div className="image-placeholder">
        <span>⚡</span>
        <p style={{fontSize: '14px', marginTop: '10px'}}>No Image</p>
      </div>
  }
</div>
                    <div className="product-info">
                      <span className="product-category">{getCategoryIcon(product.category)} {getCategoryDisplayName(product.category)}</span>
                      <h3 className="product-title" style={{
                        fontFamily: "'Poppins', 'Montserrat', 'Segoe UI', sans-serif",
                        fontSize: '1.3rem',
                        fontWeight: '600',
                        lineHeight: '1.4',
                        color: '#1a1a1a',
                        marginBottom: '0.5rem'
                      }}>
                        {isStaticProduct ? displayProductName : (product.description?.substring(0, 70) || product.name)}
                      </h3>
                      <p className="product-description">
                        {isStaticProduct ? `Model: ${product.name}` : `Code - ${product.name}`}
                      </p>

                      <div className="product-footer">
                        <button className="view-details-btn">View Details →</button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-products">
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Loading industrial products...</p>
                </div>
              </div>
            )}
          </div>
          <div className="view-all-container">
            <Link to="/products" className="btn-view-all">View Complete Range →</Link>
          </div>
        </div>
      </section>

      {/* Parallax Section */}
      <section className="parallax-section">
        <div className="parallax-overlay"></div>
        <div className="container">
          <div className="parallax-content lazy-fade-in" ref={el => addToLazyRefs(el)}>
            <span className="parallax-badge">Industrial Grade Quality</span>
            <h2>Premium <span>Switchgear Solutions</span></h2>
            <p>From heavy-duty Changeover switches and MCCBs to precision-engineered Busbar chambers and Submersible Control Panels, every RiM product is crafted for safety, durability, and peak performance.</p>
            <div className="parallax-features">
              <div className="parallax-feature"><span>✓</span><p>Full Range of MCB Boxes</p></div>
              <div className="parallax-feature"><span>✓</span><p>Reverse/Forward & LT Panels</p></div>
              <div className="parallax-feature"><span>✓</span><p>DMC Connectors & Thimbles</p></div>
            </div>
            <Link to="/catalog" className="btn-parallax">Get Catalog →</Link>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <div className="gallery-container">
        {galleryItems.map((item, idx) => (
          <div key={item.id} className="gallery-item" style={{ backgroundImage: `url(${item.image})` }} ref={el => addToGalleryItems(el, idx)}>
            <div className="gallery-overlay">
              <h3><span className="vertical-text">{item.title}</span><span className="horizontal-text">{item.fullTitle}</span></h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- Image Strip Section with Hover Product Names --- */}
      <section className="image-strip-section">
        <div className="container">
          <div className="section-header lazy-fade-in" ref={el => addToLazyRefs(el)}>
            <div className="section-badge">Our Works</div>
            <h2>Project <span>Showcase</span></h2>
            <p className="section-subtitle">Glimpses of our installations and products</p>
          </div>
          <div className="image-strip-grid">
            {testimonialImages.map((item, idx) => (
              <div key={idx} className="strip-item lazy-scale-up" ref={el => addToLazyRefs(el, 'lazy-scale-up')} style={{ transitionDelay: `${idx * 0.05}s` }}>
                <img src={item.url} alt={item.name} loading="lazy" />
                <div className="strip-overlay">
                  <span className="product-name">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="container">
          <div className="section-header lazy-fade-in" ref={el => addToLazyRefs(el)}>
            <div className="section-badge">Testimonials</div>
            <h2>What Our <span>Customers Say</span></h2>
            <p className="section-subtitle">Trusted by Industry Leaders</p>
          </div>
          <div className="review-form-wrapper">
            {!showReviewForm ? (<button className="btn-write-review lazy-fade-in" ref={el => addToLazyRefs(el)} onClick={() => setShowReviewForm(true)}>✍️ Write a Review</button>) : (
              <div className="review-form-container"><h3>Share Your Experience with RiM Products</h3>
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
            {reviews.length > 0 ? (reviews.map((review, idx) => (<div key={review.id} className="review-card lazy-scale-up" ref={el => addToLazyRefs(el, 'lazy-scale-up')} style={{ transitionDelay: `${idx * 0.1}s` }}><div className="review-header"><div className="reviewer-info"><div className="reviewer-avatar">{review.name.charAt(0)}</div><div><h3>{review.name}</h3><div className="rating-stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div></div></div></div><p>{review.comment}</p></div>))) : (<div className="no-reviews"><p>No reviews yet. Be the first to share your experience!</p></div>)}
          </div>
          <div className="view-all-reviews"><Link to="/reviews" className="btn-view-all">View All Reviews →</Link></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content lazy-fade-in" ref={el => addToLazyRefs(el)}>
            <h2>Need a Bulk Quote or Custom Solution?</h2>
            <p>Get the best rates for industrial projects, housing societies, or panel builders. We supply across India.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn-primary">Request a Quote</Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-wa">💬 Chat on WhatsApp</a>
            </div>
            <div className="cta-features">
  <span style={{ color: '#ffffff' }}>✓ GST Invoice</span>
  <span style={{ color: '#ffffff' }}>✓ Pan India Shipping</span>
  <span style={{ color: '#ffffff' }}>✓ Technical Support</span>
</div>
          </div>
        </div>
      </section>

      {/* Contact Bar - With Actual Social Media Logos */}
      <section className="contact-bar">
        <div className="container">
          <div className="contact-bar-content">
            {/* Phone Icon */}
            <div className="contact-item">
              <span className="contact-icon phone-icon">📞</span>
              <div>
                <h4>Call Our Experts</h4>
                <a href={`tel:${phoneNumber1}`}>{phoneNumber1}</a> | <a href={`tel:${phoneNumber2}`}>{phoneNumber2}</a>
              </div>
            </div>
            
            <div className="contact-divider"></div>
            
            {/* WhatsApp Icon - Actual Logo */}
            <div className="contact-item">
              <span className="contact-icon whatsapp-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24" height="24" fill="currentColor">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
              </span>
              <div>
                <h4>WhatsApp Us</h4>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">Click to Chat →</a>
              </div>
            </div>
            
            <div className="contact-divider"></div>
            
            {/* Location Icon */}
            <div className="contact-item">
              <span className="contact-icon location-icon">📍</span>
              <div>
                <h4>RiM - Royal Industries</h4>
                <p>Mansa, Punjab (Village Chakerian Road, Mansa, Punjab)</p>
              </div>
            </div>
            
            <div className="contact-divider"></div>
            
            {/* Social Icons - Actual Logos */}
            <div className="contact-item social-icons">
              <span className="contact-icon social-icon-label">📱</span>
              <div>
                <h4>Follow Us</h4>
                <div className="social-links">
                  <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="social-link instagram" aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" fill="currentColor">
                      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                    </svg>
                  </a>
                  <a href={facebookLink} target="_blank" rel="noopener noreferrer" className="social-link facebook" aria-label="Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" fill="currentColor">
                      <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/>
                    </svg>
                  </a>
                  <a href={justdialLink} target="_blank" rel="noopener noreferrer" className="social-link justdial" aria-label="Justdial">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Modal */}
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
              <h2 style={{ 
                fontFamily: 'Arial, sans-serif',
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#333'
              }}>
                {selectedProduct.description || selectedProduct.name}
              </h2>
              <p className="full-description">
                {selectedProduct.name
                  ? `Code - ${selectedProduct.name} `
                  : 'Heavy-duty electrical switchgear designed for safety and long life. Comes with ISI marking and industry-leading quality.'}
              </p>
              <div className="contact-actions">
                <a href={`tel:${phoneNumber1}`} className="call-now-btn">📞 Call for Best Price</a>
                <button onClick={() => openWhatsApp(selectedProduct.name)} className="wa-consult-btn">💬 Chat on WhatsApp</button>
                <Link to="/contact" className="consult-btn">Get Quote →</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;