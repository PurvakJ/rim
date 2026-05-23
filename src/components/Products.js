import React, { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../api';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([{ value: 'all', label: 'All Products', icon: '⚡' }]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productImageIndices, setProductImageIndices] = useState({});

  // Updated Contact Numbers for RiM
  const phoneNumber1 = '7973417773';
  const whatsappNumber = '917973417773';

  // Helper function to safely get product name as string
  const getProductName = (product) => {
    if (product && product.name !== undefined && product.name !== null) {
      return String(product.name);
    }
    return '';
  };

  // Helper function to safely get product description as string
  const getProductDescription = (product) => {
    if (product && product.description !== undefined && product.description !== null) {
      return String(product.description);
    }
    return '';
  };

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

  const getCategoryDisplayName = useCallback((categoryValue) => {
    const displayNames = {
      'changeover': 'Changeover Switches',
      'mcb': 'MCB & Distribution Boxes',
      'panel': 'Control Panels',
      'motor-starters': 'Reverse/Forward & LT Control',
      'busbar': 'Busbar Chambers',
      'connectors': 'DMC Connectors & Thimbles',
      'protective': 'Immersion Rods & Anti-Mosquito',
      'wiring': 'Plugs, Sockets & Power Strips',
      'capacitors': 'Power Capacitors',
      'mccb': 'MCCB & Moulded Case Breakers',
      'main-switch': 'Main Switches',
      'submersible': 'Submersible Control Panels',
      'multiplug': 'Multiplugs & Power Strips',
      'kitkat': 'Kit-Kat Series (Copper/Brass)',
      'kvr': 'KVR Heavy Duty Boxes',
      'exhaust': 'Fan Exhaust Louvers',
      'holder': 'Holders & Sockets'
    };
    if (!categoryValue) return 'Products';
    return displayNames[categoryValue] || 
           categoryValue?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
      'main-switch': '🔘',
      'submersible': '💧',
      'multiplug': '🔌',
      'kitkat': '🥈',
      'kvr': '📦',
      'exhaust': '🌀',
      'holder': '💡'
    };
    return icons[category] || '⚡';
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      const validProducts = data.filter(product => product && product.id);
      
      // Ensure all products have valid name strings
      const sanitizedProducts = validProducts.map(product => ({
        ...product,
        name: getProductName(product),
        description: getProductDescription(product)
      }));
      
      setProducts(sanitizedProducts);
      
      // Get unique categories in the order they appear in the database
      const seenCategories = new Set();
      const uniqueCategories = [];
      
      // Preserve the original order from the database
      for (const product of sanitizedProducts) {
        if (product.category && !seenCategories.has(product.category)) {
          seenCategories.add(product.category);
          uniqueCategories.push(product.category);
        }
      }
      
      // Create category objects WITHOUT sorting - keep database order
      const dynamicCategories = uniqueCategories.map(cat => ({
        value: cat,
        label: getCategoryDisplayName(cat),
        icon: getCategoryIcon(cat)
      }));
      
      setCategories([
        { value: 'all', label: 'All Products', icon: '⚡' },
        ...dynamicCategories
      ]);
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback products for RiM Switchgear
      const fallbackProducts = [
        { id: 1, name: "Auto Changeover Switch (63A/100A)", price: 3850, description: "Automatic transfer switch for generators & mains. Suitable for submersible pumps and home automation. ISI marked with silver alloy contacts.", images: ["https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format"], category: "changeover", featured: true },
        { id: 2, name: "16 Way Single Door MCB Box", price: 1250, description: "Modular distribution box with transparent window. Accepts all standard MCBs. Double insulation with IP40 protection.", images: ["https://images.unsplash.com/photo-1562408590-e32931084e23?w=600&auto=format"], category: "mcb", featured: true },
        { id: 3, name: "Submersible Control Panel (7.5 HP)", price: 6250, description: "Auto start/stop with dry run protection and overload relay. Heavy duty contactor with thermal overload protection.", images: ["https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=600&auto=format"], category: "submersible", featured: true },
        { id: 4, name: "Three Phase MCCB (100A-800A)", price: 2850, description: "Moulded case circuit breaker with adjustable thermal magnetic trip unit. 50kA breaking capacity.", images: ["https://images.unsplash.com/photo-1562408590-e32931084e23?w=600&auto=format"], category: "mccb", featured: false },
        { id: 5, name: "Copper Busbar Chamber (400A)", price: 4250, description: "High conductivity copper busbars with silver-plated contacts. Complete with insulated supports.", images: ["https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=600&auto=format"], category: "busbar", featured: false },
        { id: 6, name: "Reverse/Forward Starter (7.5 HP)", price: 4850, description: "Industrial grade motor starter for reverse/forward operation. Complete with overload protection.", images: ["https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format"], category: "motor-starters", featured: true }
      ];
      setProducts(fallbackProducts);
      
      // Get unique categories in order from fallback products
      const seenCategories = new Set();
      const uniqueCategories = [];
      for (const product of fallbackProducts) {
        if (product.category && !seenCategories.has(product.category)) {
          seenCategories.add(product.category);
          uniqueCategories.push(product.category);
        }
      }
      
      const dynamicCategories = uniqueCategories.map(cat => ({
        value: cat,
        label: getCategoryDisplayName(cat),
        icon: getCategoryIcon(cat)
      }));
      
      setCategories([
        { value: 'all', label: 'All Products', icon: '⚡' },
        ...dynamicCategories
      ]);
    } finally {
      setLoading(false);
    }
  }, [getCategoryDisplayName, getCategoryIcon]);

  const filterProducts = useCallback(() => {
    let filtered = products.filter(product => {
      const matchesCategory = category === 'all' || product.category === category;
      const productName = getProductName(product);
      const productDescription = getProductDescription(product);
      const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           productDescription.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    setFilteredProducts(filtered);
  }, [products, category, searchTerm]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedProduct]);

  const getCategoryName = useCallback((category) => {
    return getCategoryDisplayName(category);
  }, [getCategoryDisplayName]);

  const nextImage = (e) => {
    e.stopPropagation();
    if (selectedProduct && selectedProduct.images && selectedProduct.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedProduct.images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (selectedProduct && selectedProduct.images && selectedProduct.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedProduct.images.length) % selectedProduct.images.length);
    }
  };

  const openWhatsApp = (productName) => {
    const safeProductName = productName ? String(productName) : 'this product';
    const message = encodeURIComponent(`Hello RiM, I'm interested in the "${safeProductName}" switchgear product. Could you please share more details and the best price for bulk/retail?`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  // Safe render of product name
  const renderProductName = (product) => {
    const name = getProductName(product);
    return name || 'Product';
  };

  // Safe render of product description
  const renderProductDescription = (product, maxLength = 70) => {
    const desc = getProductDescription(product);
    if (!desc) return 'Premium quality electrical switchgear for reliable performance';
    return desc.length > maxLength ? `${desc.substring(0, maxLength)}...` : desc;
  };

  return (
    <div className="products-page">
      <section className="products-hero">
        <div className="container">
          <div className="hero-badge" style={{ color: 'white' }}>RiM - Royal Industries Mansa</div>
          <div className="hero-icon">⚡</div>
          <h1>Our <span>Switchgear Range</span></h1>
          <p>Discover premium quality electrical products for industrial and residential needs. ISI marked with 5+ year warranty.</p>
        </div>
      </section>

      <div className="products-container">
        <div className="filters-section">
          <div className="filter-group">
            <label>Category:</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>
        
          <div className="filter-group search-group">
            <label>Search:</label>
            <input
              type="text"
              placeholder="Search products (MCB, Changeover, Panel...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="results-count">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading our premium switchgear collection...</p>
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <div className="no-products-icon">⚡</div>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button 
                  className="btn-reset"
                  onClick={() => {
                    setCategory('all');
                    setSearchTerm('');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(product => {
                  const currentImgIndex = productImageIndices[product.id] || 0;
                  const hasMultipleImages = product.images && product.images.length > 1;
                  
                  return (
                    <div key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
                      <div className="product-image-container">
                        {product.images && product.images[0] ? (
                          <>
                            <img 
                              src={product.images[currentImgIndex]} 
                              alt={renderProductName(product)} 
                              className="product-image"
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=600&auto=format';
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
                        ) : (
                          <div className="image-placeholder">
                            <span>⚡</span>
                          </div>
                        )}
                      </div>
                      <div className="product-info">
                        <span className="product-category">
                          {getCategoryIcon(product.category)} {getCategoryName(product.category)}
                        </span>
                        <h3 className="product-title" style={{
                          fontFamily: "'Poppins', 'Montserrat', 'Segoe UI', sans-serif",
                          fontSize: 'clamp(0.9rem, 2vw, 1.3rem)',
                          fontWeight: '600',
                          lineHeight: '1.4',
                          color: '#1f2937',
                          marginBottom: '0.5rem',
                          letterSpacing: '-0.01em'
                        }}>
                          {renderProductDescription(product)}
                        </h3>
                        <p className="product-description">
                          Code - {renderProductName(product)} 
                        </p>
                        <div className="product-footer">
                          <button className="view-details-btn">View Details →</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Modal with Image Slider */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content product-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedProduct(null)}>×</button>
            
            <div className="product-detail-gallery">
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <div className="image-slider-container">
                  <div className="main-slider-image">
                    <img 
                      src={selectedProduct.images[currentImageIndex]} 
                      alt={`${renderProductName(selectedProduct)} - ${currentImageIndex + 1}`}
                    />
                    {selectedProduct.images.length > 1 && (
                      <>
                        <button className="slider-nav prev-nav" onClick={prevImage}>❮</button>
                        <button className="slider-nav next-nav" onClick={nextImage}>❯</button>
                      </>
                    )}
                  </div>
                  <div className="slider-dots">
                    {selectedProduct.images.map((_, idx) => (
                      <button
                        key={idx}
                        className={`slider-dot ${currentImageIndex === idx ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                        }}
                      />
                    ))}
                  </div>
                  <div className="thumbnail-strip">
                    {selectedProduct.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`thumbnail ${currentImageIndex === idx ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                        }}
                      >
                        <img src={img} alt={`Thumbnail ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="gallery-placeholder">
                  <span>⚡</span>
                </div>
              )}
            </div>
            
            <div className="product-detail-info">
              <span className="product-category-tag">
                {getCategoryIcon(selectedProduct.category)} {getCategoryName(selectedProduct.category)}
              </span>
              <h2 style={{
                fontFamily: "'Poppins', 'Montserrat', 'Segoe UI', sans-serif",
                fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
                fontWeight: '600',
                lineHeight: '1.3',
                color: '#1e293b',
                marginBottom: '1rem',
                letterSpacing: '-0.02em'
              }}>
                {renderProductDescription(selectedProduct)}
              </h2>
              <p className="full-description">
                Code - {renderProductName(selectedProduct)} 
              </p>
              <div className="contact-actions">
                <a href={`tel:${phoneNumber1}`} className="call-now-btn">📞 Call for Best Price</a>
                <button onClick={() => openWhatsApp(renderProductName(selectedProduct))} className="wa-consult-btn">
                  💬 Chat on WhatsApp
                </button>
                <a href="/contact" className="consult-btn">Request a Quote →</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;