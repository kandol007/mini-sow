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
    <div className="terms-page-wrapper" style={{ backgroundImage: `url(${WALLPAPER})` }}>
      {/* Top Navigation */}
      <nav className="terms-nav">
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
      </nav>

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
                {termsText.split('\n').map((paragraph, idx) => (
                  paragraph.trim() ? <p key={idx} style={{ marginBottom: '1rem' }}>{paragraph}</p> : <br key={idx} />
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