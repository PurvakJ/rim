// components/Catalog.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollContainerRef = useRef(null);

  // Detect iOS device
  useEffect(() => {
    const checkIOS = () => {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    };
    setIsIOS(checkIOS());
  }, []);

  // Handle resize with debounce
  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        
        // Reset page when switching between mobile/desktop
        if (mobile !== isMobile) {
          setCurrentPage(0);
        }
        
        // Reset visible count for iOS when switching to mobile
        if (mobile && isIOS) {
          setVisibleCount(20);
        }
      }, 250);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [isMobile, isIOS]);

  // Progressive loading for iOS with Intersection Observer
  useEffect(() => {
    if (!isMobile || !isIOS || !scrollContainerRef.current) return;
    
    let observer;
    let loadingTimeout;
    
    const loadMoreImages = () => {
      if (isLoadingMore) return;
      if (visibleCount >= CATALOG_IMAGES.length) return;
      
      setIsLoadingMore(true);
      
      // Simulate loading delay for better UX
      loadingTimeout = setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + 10, CATALOG_IMAGES.length));
        setIsLoadingMore(false);
      }, 500);
    };
    
    // Create an observer to watch for the last image
    const setupObserver = () => {
      const lastImage = document.querySelector('.mobile-page-item:last-child');
      if (lastImage) {
        observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting && visibleCount < CATALOG_IMAGES.length) {
              loadMoreImages();
            }
          },
          { root: scrollContainerRef.current, threshold: 0.1, rootMargin: '100px' }
        );
        
        observer.observe(lastImage);
      }
    };
    
    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(setupObserver, 100);
    
    return () => {
      if (observer) observer.disconnect();
      clearTimeout(timeoutId);
      clearTimeout(loadingTimeout);
    };
  }, [isMobile, isIOS, visibleCount, isLoadingMore]);

  // Manual scroll listener as fallback
  useEffect(() => {
    if (!isMobile || !isIOS || !scrollContainerRef.current) return;
    
    let scrollTimeout;
    
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        
        const { scrollTop, scrollHeight, clientHeight } = container;
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
        
        // Load more when user scrolls to 80% of the content
        if (scrollPercentage > 0.8 && !isLoadingMore && visibleCount < CATALOG_IMAGES.length) {
          setIsLoadingMore(true);
          
          setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + 10, CATALOG_IMAGES.length));
            setIsLoadingMore(false);
          }, 300);
        }
      }, 150);
    };
    
    const container = scrollContainerRef.current;
    container.addEventListener('scroll', handleScroll);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isMobile, isIOS, visibleCount, isLoadingMore]);

  // Lazy load images with IntersectionObserver
  useEffect(() => {
    if (!isMobile || !isIOS) return;
    
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
    
    const images = document.querySelectorAll('.mobile-page-image[data-src]');
    images.forEach(img => observer.observe(img));
    
    return () => observer.disconnect();
  }, [isMobile, isIOS, visibleCount]);

  const totalPages = isMobile ? CATALOG_IMAGES.length : Math.ceil(CATALOG_IMAGES.length / 2);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 0 && !isFlipping && !isMobile) {
      setFlipDirection('right');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setTimeout(() => {
          setIsFlipping(false);
          setFlipDirection(null);
        }, 300);
      }, 150);
    }
  }, [currentPage, isFlipping, isMobile]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages - 1 && !isFlipping && !isMobile) {
      setFlipDirection('left');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setTimeout(() => {
          setIsFlipping(false);
          setFlipDirection(null);
        }, 300);
      }, 150);
    }
  }, [currentPage, totalPages, isFlipping, isMobile]);

  const getCurrentContent = useCallback(() => {
    if (isMobile) {
      return { single: CATALOG_IMAGES[currentPage] };
    } else {
      const startIndex = currentPage * 2;
      return {
        left: CATALOG_IMAGES[startIndex],
        right: CATALOG_IMAGES[startIndex + 1]
      };
    }
  }, [isMobile, currentPage]);

  const content = getCurrentContent();

  const handleDownload = () => {
    window.open(PDF_URL, '_blank');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isMobile && !isIOS) {
        if (e.key === 'ArrowLeft') {
          goToPreviousPage();
        } else if (e.key === 'ArrowRight') {
          goToNextPage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPreviousPage, goToNextPage, isMobile, isIOS]);

  // Handle touch events for iOS swipe
  useEffect(() => {
    if (!isMobile || !isIOS) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };
    
    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;
      
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe left - next page
        if (currentPage < totalPages - 1) {
          setCurrentPage(currentPage + 1);
        }
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe right - previous page
        if (currentPage > 0) {
          setCurrentPage(currentPage - 1);
        }
      }
    };
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [currentPage, totalPages, isMobile, isIOS]);

  // Preload adjacent images for desktop
  useEffect(() => {
    if (!isMobile && CATALOG_IMAGES[currentPage * 2 + 2]) {
      const img = new Image();
      img.src = CATALOG_IMAGES[currentPage * 2 + 2];
    }
    if (!isMobile && CATALOG_IMAGES[currentPage * 2 + 3]) {
      const img = new Image();
      img.src = CATALOG_IMAGES[currentPage * 2 + 3];
    }
  }, [currentPage, isMobile]);

  // Function to manually load more pages (for "Load More" button)
  const loadMorePages = () => {
    if (!isLoadingMore && visibleCount < CATALOG_IMAGES.length) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + 20, CATALOG_IMAGES.length));
        setIsLoadingMore(false);
      }, 300);
    }
  };

  // Render mobile view
  const renderMobileView = () => {
    const visibleImages = CATALOG_IMAGES.slice(0, visibleCount);
    const hasMore = visibleCount < CATALOG_IMAGES.length;
    
    return (
      <div className="mobile-scroll-view" ref={scrollContainerRef}>
        {visibleImages.map((image, index) => (
          <div key={index} className="mobile-page-item">
            {isIOS ? (
              <img 
                data-src={image}
                alt={`Product Catalog Page ${index + 1}`}
                className="mobile-page-image lazy"
                loading="lazy"
              />
            ) : (
              <img 
                src={image}
                alt={`Product Catalog Page ${index + 1}`}
                className="mobile-page-image"
                loading="lazy"
              />
            )}
            <div className="mobile-page-number">Page {index + 1}</div>
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
                Load More Pages ({CATALOG_IMAGES.length - visibleCount} remaining)
              </button>
            )}
          </div>
        )}
        
        {!hasMore && visibleCount > 0 && (
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
        <h1>RIM - Product Catalog 2025</h1>
        <p className="catalog-subtitle">
          Complete Electrical Switchgear Solutions
        </p>
        <p className="catalog-description">
          Changeover Switches • MCB Boxes • Control Panels • Busbar Chambers • DMC Connectors • MCCB • And More
        </p>
      </div>

      <div className="book-container">
        <div className={`book-spread ${isMobile ? 'mobile-view' : ''} ${isFlipping ? `flipping-${flipDirection}` : ''}`}>
          {isMobile ? (
            renderMobileView()
          ) : (
            <>
              <div className="book-page left-page">
                {content.left && (
                  <img 
                    src={content.left} 
                    alt={`Catalog page ${currentPage * 2 + 1}`}
                    className="page-image"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="book-page right-page">
                {content.right && (
                  <img 
                    src={content.right} 
                    alt={`Catalog page ${currentPage * 2 + 2}`}
                    className="page-image"
                    loading="lazy"
                  />
                )}
              </div>
            </>
          )}
        </div>

        {!isMobile && (
          <>
            <div className="navigation-controls">
              <button 
                className="nav-button prev-button"
                onClick={goToPreviousPage}
                disabled={currentPage === 0 || isFlipping}
                aria-label="Previous page"
              >
                <span className="nav-icon">◀</span>
                <span className="nav-text">Previous</span>
              </button>

              <div className="page-indicator">
                <span className="current-page">{currentPage + 1}</span>
                <span className="separator">/</span>
                <span className="total-pages">{totalPages}</span>
              </div>

              <button 
                className="nav-button next-button"
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1 || isFlipping}
                aria-label="Next page"
              >
                <span className="nav-text">Next</span>
                <span className="nav-icon">▶</span>
              </button>
            </div>

            <div className="keyboard-hint">
              ← Use keyboard arrows to flip pages →
            </div>
          </>
        )}

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
          <p className="download-info">RIM Electrical Switchgear Catalog 2025 • Complete product range with technical specifications</p>
          <p className="download-contact">📞 For bulk orders & custom requirements: <a href="tel:9815097851">98150-97851</a> | <a href="tel:7986295488">79862-95488</a></p>
        </div>
      </div>
    </div>
  );
};

export default Catalog;