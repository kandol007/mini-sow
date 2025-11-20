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
  const [langDropOpen, setLangDropOpen] = useState(false);

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

    const handleScroll = () => {
      if (!scrollContainer) return;
      const currentScrollY = scrollContainer.scrollTop;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down & past 80px
        setNavHidden(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setNavHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [lastScrollY]);

  const termsText = texts['terms.body'] || 'Terms content not found. Make sure DB contains the key "terms.body" for the selected language.';

  return (
    <>
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

        {/* Language Selector - part of nav-right on desktop */}
        <div className="nav-lang">
          <div className="lang-drop-container">
            <div
              className={`lang-drop-button ${langDropOpen ? 'open' : ''}`}
              onClick={() => setLangDropOpen(!langDropOpen)}
            >
              <span className="collectionItem">
                {lang === 'en' ? 'English' : 'Svenska'}
              </span>
              <img
                src={lang === 'en' ? FLAG_GB : FLAG_SE}
                alt={lang === 'en' ? 'English' : 'Svenska'}
                className="icon-flag-nav"
              />

              <span className="arrow">▼</span>
            </div>

            <div className={`dropdownList ${langDropOpen ? 'show' : ''}`}>
              <div className="language-box">
                <div
                  className="flag-name"
                  onClick={() => {
                    setLang('se');
                    setLangDropOpen(false);
                  }}
                >
                  <span className="collectionItem">Svenska</span>
                  <img src={FLAG_SE} alt="Svenska" className="icon-flag-nav" />
                </div>
                <div
                  className="flag-name"
                  onClick={() => {
                    setLang('en');
                    setLangDropOpen(false);
                  }}
                >
                  <span className="collectionItem">English</span>
                  <img src={FLAG_GB} alt="English" className="icon-flag-nav" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="terms-scroll-container">
          <div className="terms-content-inner">

            {/* Title */}
            <h1 className="terms-main-title">{texts['terms.title'] || 'Terms'}</h1>

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
    </>
  );
}