import React, { useState, useEffect } from 'react';

const FLAG_SE = 'https://storage.123fakturere.no/public/flags/SE.png';
const FLAG_GB = 'https://storage.123fakturere.no/public/flags/GB.png';
const WALLPAPER = 'https://storage.123fakturera.se/public/wallpapers/sverige43.jpg';
const LOGO = 'https://storage.123fakturera.se/public/icons/diamond.png';

export default function Terms({ onBack }) {
  const [lang, setLang] = useState('en');
  const [texts, setTexts] = useState({});
  const [loading, setLoading] = useState(true);

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

  const termsText = texts['terms.body'] || 'Terms content not found. Make sure DB contains the key "terms.body" for the selected language.';

  return (
    <div className="terms-background" style={{ backgroundImage: `url(${WALLPAPER})` }}>
      {/* Top Navigation */}
      <nav className="login-nav">
        <div className="nav-left">
          <img src={LOGO} alt="logo" className="nav-logo" />
        </div>
        
        <div className="nav-right">
          <a href="#" className="nav-link">{texts['nav.home'] || 'Home'}</a>
          <a href="#" className="nav-link">{texts['nav.order'] || 'Order'}</a>
          <a href="#" className="nav-link">{texts['nav.customers'] || 'Our Customers'}</a>
          <a href="#" className="nav-link">{texts['nav.about'] || 'About us'}</a>
          <a href="#" className="nav-link">{texts['nav.contact'] || 'Contact Us'}</a>
          <div className="nav-lang">
            <span className="lang-label">{texts['nav.language'] || 'English'}</span>
            <div className="lang-flags">
              <img 
                src={FLAG_GB} 
                alt="English" 
                onClick={() => setLang('en')} 
                className="flag-icon"
                style={{ opacity: lang === 'en' ? 1 : 0.5 }}
              />
              <img 
                src={FLAG_SE} 
                alt="Svenska" 
                onClick={() => setLang('se')} 
                className="flag-icon"
                style={{ opacity: lang === 'se' ? 1 : 0.5 }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Terms Content */}
      <div className="terms-page-content">
        <h1 className="terms-page-title">{texts['terms.title'] || 'Terms'}</h1>
        
        <button onClick={onBack} className="terms-back-button">
          {lang === 'en' ? 'Close and Go Back' : 'Stäng och Gå Tillbaka'}
        </button>

        <div className="terms-text-box">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="terms-text-content">
              {termsText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}