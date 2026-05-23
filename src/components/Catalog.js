// components/Catalog.js
import React, { useState, useEffect, useRef } from 'react';
import './Catalog.css';

// Static data moved outside component to prevent recreation on every render
const CATALOG_IMAGES = [
    'https://i.postimg.cc/DwTjPz2w/Rim-Presentation-2025-page-0001.jpg',
    'https://i.postimg.cc/T367JPRw/Rim-Presentation-2025-page-0002.jpg',
    'https://i.postimg.cc/6pXjfQ95/Rim-Presentation-2025-page-0003.jpg',
    'https://i.postimg.cc/L8pC3sHs/Rim-Presentation-2025-page-0004.jpg',
    'https://i.postimg.cc/nhGdRtzB/Rim-Presentation-2025-page-0005.jpg',
    'https://i.postimg.cc/T3Jk7Xwr/Rim-Presentation-2025-page-0006.jpg',
    'https://i.postimg.cc/bw96CjJ1/Rim-Presentation-2025-page-0007.jpg',
    'https://i.postimg.cc/7ZnBsy67/Rim-Presentation-2025-page-0008.jpg',
    'https://i.postimg.cc/nhGdRtzk/Rim-Presentation-2025-page-0009.jpg',
    'https://i.postimg.cc/jjqMBkwm/Rim-Presentation-2025-page-0010.jpg',
    'https://i.postimg.cc/FKPTvg3B/Rim-Presentation-2025-page-0011.jpg',
    'https://i.postimg.cc/TPktxqn2/Rim-Presentation-2025-page-0012.jpg',
    'https://i.postimg.cc/SKZg47cR/Rim-Presentation-2025-page-0013.jpg',
    'https://i.postimg.cc/63yYp2hz/Rim-Presentation-2025-page-0014.jpg',
    'https://i.postimg.cc/XJpQYGgL/Rim-Presentation-2025-page-0015.jpg',
    'https://i.postimg.cc/26MTbkH7/Rim-Presentation-2025-page-0016.jpg',
    'https://i.postimg.cc/xChgJfst/Rim-Presentation-2025-page-0017.jpg',
    'https://i.postimg.cc/k4zw6Jj1/Rim-Presentation-2025-page-0018.jpg'
];

const PDF_URL = 'https://drive.google.com/file/d/1m6Q5w0Olc3tXFSytef3AHOnbUrcCbNIY/view?usp=sharing';

const Catalog = () => {
  const [visiblePairs, setVisiblePairs] = useState(5); // Show 5 pairs initially (10 images)
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const scrollContainerRef = useRef(null);

  // Group images into pairs
  const getImagePairs = () => {
    const pairs = [];
    for (let i = 0; i < CATALOG_IMAGES.length; i += 2) {
      pairs.push({
        left: CATALOG_IMAGES[i],
        right: CATALOG_IMAGES[i + 1] || null // Handle odd number of images
      });
    }
    return pairs;
  };

  const imagePairs = getImagePairs();
  const totalPairs = imagePairs.length;
  const visiblePairsData = imagePairs.slice(0, visiblePairs);

  // Detect iOS device
  useEffect(() => {
    const checkIOS = () => {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    };
    setIsIOS(checkIOS());
  }, []);

  // Progressive loading with Intersection Observer
  useEffect(() => {
    let observer;
    let loadingTimeout;
    
    const loadMorePairs = () => {
      if (isLoadingMore) return;
      if (visiblePairs >= totalPairs) return;
      
      setIsLoadingMore(true);
      
      loadingTimeout = setTimeout(() => {
        setVisiblePairs(prev => Math.min(prev + 3, totalPairs)); // Load 3 more pairs at a time
        setIsLoadingMore(false);
      }, 500);
    };
    
    const setupObserver = () => {
      const lastPair = document.querySelector('.catalog-pair:last-child');
      if (lastPair) {
        observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting && visiblePairs < totalPairs) {
              loadMorePairs();
            }
          },
          { threshold: 0.1, rootMargin: '100px' }
        );
        
        observer.observe(lastPair);
      }
    };
    
    const timeoutId = setTimeout(setupObserver, 100);
    
    return () => {
      if (observer) observer.disconnect();
      clearTimeout(timeoutId);
      clearTimeout(loadingTimeout);
    };
  }, [visiblePairs, totalPairs, isLoadingMore]);

  // Manual scroll listener as fallback
  useEffect(() => {
    let scrollTimeout;
    
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        
        const { scrollTop, scrollHeight, clientHeight } = container;
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
        
        if (scrollPercentage > 0.8 && !isLoadingMore && visiblePairs < totalPairs) {
          setIsLoadingMore(true);
          
          setTimeout(() => {
            setVisiblePairs(prev => Math.min(prev + 3, totalPairs));
            setIsLoadingMore(false);
          }, 300);
        }
      }, 150);
    };
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      clearTimeout(scrollTimeout);
    };
  }, [visiblePairs, totalPairs, isLoadingMore]);

  // Lazy load images with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            if (src && !img.src) {
              img.src = src;
              img.classList.add('loaded');
            }
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '100px', threshold: 0.01 }
    );
    
    const images = document.querySelectorAll('.catalog-page-image[data-src]');
    images.forEach(img => observer.observe(img));
    
    return () => observer.disconnect();
  }, [visiblePairs]);

  const handleDownload = () => {
    window.open(PDF_URL, '_blank');
  };

  const loadMorePages = () => {
    if (!isLoadingMore && visiblePairs < totalPairs) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setVisiblePairs(prev => Math.min(prev + 3, totalPairs));
        setIsLoadingMore(false);
      }, 300);
    }
  };

  // Get page numbers for each image in a pair
  const getLeftPageNumber = (pairIndex) => {
    return pairIndex * 2 + 1;
  };

  const getRightPageNumber = (pairIndex) => {
    return pairIndex * 2 + 2;
  };

  // Render catalog view with pairs (2 images side by side)
  const renderCatalogView = () => {
    const hasMore = visiblePairs < totalPairs;
    
    return (
      <div className="catalog-scroll-view" ref={scrollContainerRef}>
        {visiblePairsData.map((pair, pairIndex) => (
          <div key={pairIndex} className="catalog-pair">
            {/* Left Image */}
            <div className="catalog-page-item">
              {isIOS ? (
                <img 
                  data-src={pair.left}
                  alt={`Product Catalog Page ${getLeftPageNumber(pairIndex)}`}
                  className="catalog-page-image lazy"
                  loading="lazy"
                />
              ) : (
                <img 
                  src={pair.left}
                  alt={`Product Catalog Page ${getLeftPageNumber(pairIndex)}`}
                  className="catalog-page-image"
                  loading="lazy"
                />
              )}
              <div className="catalog-page-number">Page {getLeftPageNumber(pairIndex)}</div>
            </div>
            
            {/* Right Image (if exists) */}
            {pair.right && (
              <div className="catalog-page-item">
                {isIOS ? (
                  <img 
                    data-src={pair.right}
                    alt={`Product Catalog Page ${getRightPageNumber(pairIndex)}`}
                    className="catalog-page-image lazy"
                    loading="lazy"
                  />
                ) : (
                  <img 
                    src={pair.right}
                    alt={`Product Catalog Page ${getRightPageNumber(pairIndex)}`}
                    className="catalog-page-image"
                    loading="lazy"
                  />
                )}
                <div className="catalog-page-number">Page {getRightPageNumber(pairIndex)}</div>
              </div>
            )}
          </div>
        ))}
        
        {hasMore && (
          <div className="loading-more-container">
            {isLoadingMore ? (
              <div className="loading-indicator">
                <div className="loader"></div>
                <p>Loading more pages...</p>
              </div>
            ) : (
              <button className="load-more-button" onClick={loadMorePages}>
                Load More Pages ({totalPairs - visiblePairs} pairs remaining)
              </button>
            )}
          </div>
        )}
        
        {!hasMore && visiblePairs > 0 && (
          <div className="end-of-catalog">
            <p>✓ End of Catalog</p>
            <p className="total-pages-count">Total {CATALOG_IMAGES.length} product pages</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <h1>RiM - Product Catalog 2025</h1>
        <p className="catalog-subtitle">
          Complete Electrical Switchgear Solutions
        </p>
        <p className="catalog-description">
          Changeover Switches • MCB Boxes • Control Panels • Busbar Chambers • DMC Connectors • MCCB • And More
        </p>
      </div>

      <div className="catalog-content">
        {renderCatalogView()}

        <div className="download-section">
          <button 
            className="download-button"
            onClick={handleDownload}
            aria-label="Download PDF catalog"
          >
            <span className="download-icon">📥</span>
            <span>Download Complete Product Catalog (PDF)</span>
            <span className="download-icon">📄</span>
          </button>
          <p className="download-info">RiM Electrical Switchgear Catalog 2025 • Complete product range with technical specifications</p>
          <p className="download-contact">📞 For bulk orders & custom requirements: <a href="tel:9815097851">98150-97851</a> | <a href="tel:7986295488">79862-95488</a></p>
        </div>
      </div>
    </div>
  );
};

export default Catalog;