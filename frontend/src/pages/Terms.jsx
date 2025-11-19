import React, { useState, useEffect } from 'react';

const FLAG_SE = 'https://storage.123fakturere.no/public/flags/SE.png';
const FLAG_GB = 'https://storage.123fakturere.no/public/flags/GB.png';
const WALLPAPER = 'https://storage.123fakturera.se/public/wallpapers/sverige43.jpg';
const LOGO = 'https://storage.123fakturera.se/public/icons/diamond.png';

export default function Terms({ onBack }) {
  const [lang, setLang] = useState('en');
  const [texts, setTexts] = useState({});
  const [loading, setLoading] = useState(true);
  const [navHidden, setNavHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/texts/${lang}`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch texts');
        return r.json();
      })
      .then(data => {
        setTexts(data || {});
      })
      .catch(err => {
        console.error('Error loading texts', err);
        setTexts({});
      })
      .finally(() => setLoading(false));
  }, [lang]);

  useEffect(() => {
  const scrollContainer = document.querySelector('.terms-scroll-container');
  if (!scrollContainer) return;

  let lastScrollYLocal = 0;
  let startY = 0;
  let isTouching = false;

  const handleScroll = () => {
    const currentScrollY = scrollContainer.scrollTop;

    // hide nav on scroll down; show on scroll up
    if (currentScrollY > lastScrollYLocal && currentScrollY > 80) {
      setNavHidden(true);
    } else if (currentScrollY < lastScrollYLocal) {
      setNavHidden(false);
    }
    lastScrollYLocal = currentScrollY;
  };

  // --- prevent iOS rubber-band overscroll ---
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      startY = e.touches[0].clientY;
      isTouching = true;
    }
  };

  const handleTouchMove = (e) => {
    if (!isTouching) return;
    const currentY = (e.touches && e.touches[0].clientY) || 0;
    const deltaY = currentY - startY;

    const atTop = scrollContainer.scrollTop === 0;
    const atBottom = Math.ceil(scrollContainer.scrollTop + scrollContainer.clientHeight) >= scrollContainer.scrollHeight;

    // If at top and pulling down (deltaY > 0) -> prevent default (stop body bounce)
    if (atTop && deltaY > 0) {
      e.preventDefault();
    }

    // If at bottom and pulling up (deltaY < 0) -> prevent default (stop body bounce)
    if (atBottom && deltaY < 0) {
      e.preventDefault();
    }
    // do NOT call stopPropagation — we only want to prevent the overscroll
  };

  const handleTouchEnd = () => {
    isTouching = false;
    startY = 0;
  };

  scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
  scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
  scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: false }); // passive:false so we can e.preventDefault()
  scrollContainer.addEventListener('touchend', handleTouchEnd, { passive: true });

  return () => {
    scrollContainer.removeEventListener('scroll', handleScroll);
    scrollContainer.removeEventListener('touchstart', handleTouchStart);
    scrollContainer.removeEventListener('touchmove', handleTouchMove);
    scrollContainer.removeEventListener('touchend', handleTouchEnd);
  };
}, []); // empty deps - set up once

  const termsText = texts['terms.body'] || 'Terms content not found. Make sure DB contains the key "terms.body" for the selected language.';

  return (
    <div className="terms-page-wrapper" style={{ backgroundImage: `url(${WALLPAPER})` }}>
      {/* Top Navigation */}
      <nav className={`terms-nav ${navHidden ? 'hidden' : ''}`}>
        {/* Hamburger button – visible on mobile */}
        <button 
          className="hamburger" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Logo - hidden on mobile when menu is open */}
        <div className="nav-left" style={{ visibility: menuOpen ? 'hidden' : 'visible' }}>
          <img src={LOGO} alt="logo" className="nav-logo" />
        </div>
        
        {/* Desktop Navigation Links */}
        <div className="nav-right">
          <a href="#" className="nav-link">{texts['nav.home'] || 'Home'}</a>
          <a href="#" className="nav-link">{texts['nav.order'] || 'Order'}</a>
          <a href="#" className="nav-link">{texts['nav.customers'] || 'Our Customers'}</a>
          <a href="#" className="nav-link">{texts['nav.about'] || 'About us'}</a>
          <a href="#" className="nav-link">{texts['nav.contact'] || 'Contact Us'}</a>
          
          {/* Language Selector - part of nav-right on desktop */}
          <div className="nav-lang">
            <span className="lang-label">{texts['nav.language'] || 'English'}</span>
            <div className="lang-flags">
              <img 
                src={FLAG_GB} 
                alt="English" 
                onClick={() => setLang('en')} 
                className="flag-icon"
                style={{ opacity: lang === 'en' ? 1 : 0.5, cursor: 'pointer' }}
              />
              <img 
                src={FLAG_SE} 
                alt="Svenska" 
                onClick={() => setLang('se')} 
                className="flag-icon"
                style={{ opacity: lang === 'se' ? 1 : 0.5, cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown (accordion style) */}
        <div className={`mobile-nav-menu ${menuOpen ? "open" : ""}`}>
          <a href="#" className="nav-link" onClick={() => setMenuOpen(false)}>
            {texts['nav.home'] || 'Home'}
          </a>
          <a href="#" className="nav-link" onClick={() => setMenuOpen(false)}>
            {texts['nav.order'] || 'Order'}
          </a>
          <a href="#" className="nav-link" onClick={() => setMenuOpen(false)}>
            {texts['nav.customers'] || 'Our Customers'}
          </a>
          <a href="#" className="nav-link" onClick={() => setMenuOpen(false)}>
            {texts['nav.about'] || 'About us'}
          </a>
          <a href="#" className="nav-link" onClick={() => setMenuOpen(false)}>
            {texts['nav.contact'] || 'Contact Us'}
          </a>
        </div>
      </nav>

      {/* Language Selector - Fixed in top-right on mobile */}
      <div className="terms-mobile-lang">
        <span className="lang-label">{lang === 'en' ? 'English' : 'Svenska'}</span>
        <div className="lang-flags">
          <img 
            src={FLAG_GB} 
            alt="English" 
            onClick={() => setLang('en')} 
            className="flag-icon"
            style={{ opacity: lang === 'en' ? 1 : 0.5, cursor: 'pointer' }}
          />
          <img 
            src={FLAG_SE} 
            alt="Svenska" 
            onClick={() => setLang('se')} 
            className="flag-icon"
            style={{ opacity: lang === 'se' ? 1 : 0.5, cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="terms-scroll-container">
        <div className="terms-content-inner">
          {/* Title */}
          <h1 className="terms-main-title">{texts['terms.title'] || 'Terms and conditions'}</h1>
          
          {/* Top Button */}
          <button onClick={onBack} className="terms-action-button">
            {lang === 'en' ? 'Close and Go Back' : 'Stäng och Gå Tillbaka'}
          </button>

          {/* Terms Text Box */}
          <div className="terms-content-box">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                <p>Loading...</p>
              </div>
            ) : (
              <div className="terms-text-display">
                {termsText.split('\n').filter(p => p.trim()).map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Button */}
          <button onClick={onBack} className="terms-action-button terms-bottom-button">
            {lang === 'en' ? 'Close and Go Back' : 'Stäng och Gå Tillbaka'}
          </button>
        </div>
      </div>
    </div>
  );
}

{/*random snippet for comparison*/}