import React, { useState, useEffect } from 'react';

const FLAG_SE = 'https://storage.123fakturere.no/public/flags/SE.png';
const FLAG_GB = 'https://storage.123fakturere.no/public/flags/GB.png';
const WALLPAPER = 'https://storage.123fakturera.se/public/wallpapers/sverige43.jpg';
const LOGO = 'https://storage.123fakturera.se/public/icons/diamond.png';

export default function Login({ onLogin, onShowTerms }) {
  const [lang, setLang] = useState('se');
  const [texts, setTexts] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch texts from database
  useEffect(() => {
    fetch(`/api/texts/${lang}`)
      .then(r => r.json())
      .then(data => setTexts(data))
      .catch(err => console.error('Error loading texts:', err));
  }, [lang]);

  async function handleSubmit() {
    if (!username || !password) {
      alert('Please enter both email and password');
      return;
    }
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        onLogin(data.token);
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      alert('Server error: ' + err.message);
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <div className="login-background" style={{ backgroundImage: `url(${WALLPAPER})` }}>
      {/* Top Navigation */}
      <nav className="login-nav">
        {/* Hamburger button – visible on mobile, on the LEFT */}
        <button 
          className="hamburger" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Logo - hidden on mobile when menu is open */}
        <div className="nav-left" style={{ display: menuOpen ? 'none' : 'flex' }}>
          <img src={LOGO} alt="logo" className="nav-logo" />
        </div>

        {/* Desktop Navigation Links */}
        <div className="nav-right">
          <a href="#" className="nav-link">
            {texts['nav.home'] || 'Hem'}
          </a>
          <a href="#" className="nav-link">
            {texts['nav.order'] || 'Beställ'}
          </a>
          <a href="#" className="nav-link">
            {texts['nav.customers'] || 'Våra Kunder'}
          </a>
          <a href="#" className="nav-link">
            {texts['nav.about'] || 'Om oss'}
          </a>
          <a href="#" className="nav-link">
            {texts['nav.contact'] || 'Kontakta oss'}
          </a>

          {/* Language Selector - part of nav-right on desktop */}
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

        {/* Mobile Menu Dropdown (accordion style) */}
        <div className={`mobile-nav-menu ${menuOpen ? "open" : ""}`}>
          <a href="#" className="nav-link" onClick={() => setMenuOpen(false)}>
            {texts['nav.home'] || 'Hem'}
          </a>
          <a href="#" className="nav-link" onClick={() => setMenuOpen(false)}>
            {texts['nav.order'] || 'Beställ'}
          </a>
          <a href="#" className="nav-link" onClick={() => setMenuOpen(false)}>
            {texts['nav.customers'] || 'Våra Kunder'}
          </a>
          <a href="#" className="nav-link" onClick={() => setMenuOpen(false)}>
            {texts['nav.about'] || 'Om oss'}
          </a>
          <a href="#" className="nav-link" onClick={() => setMenuOpen(false)}>
            {texts['nav.contact'] || 'Kontakta oss'}
          </a>
        </div>
      </nav>

      {/* Login Card - Centered */}
      <div className="login-content">
        <div className="login-card">
          <h2 className="login-title">{texts['login.title'] || 'Logga in'}</h2>
          
          <div className="login-form">
            <div className="form-group">
              <label className="form-label">{texts['login.email.label'] || 'Skriv in din epost adress'}</label>
              <input
                type="email"
                placeholder={texts['login.email.placeholder'] || 'Epost adress'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{texts['login.password.label'] || 'Skriv in ditt lösenord'}</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={texts['login.password.placeholder'] || 'Lösenord'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  👁️
                </button>
              </div>
            </div>

            <button onClick={handleSubmit} className="login-button">
              {texts['login.button'] || 'Logga in'}
            </button>

            <div className="login-links">
              <a href="#" onClick={(e) => { e.preventDefault(); }}>
                {texts['login.register'] || 'Registrera dig'}
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); onShowTerms && onShowTerms(); }}>
                {texts['login.forgot'] || 'Glömt lösenord?'}
              </a>
            </div>

            {/* Terms Link - Centered */}
            <div className="terms-link-container">
              <a href="#" onClick={(e) => { e.preventDefault(); onShowTerms && onShowTerms(); }} className="terms-link">
                {texts['terms.title'] || 'Villkor'}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="login-footer">
        <div className="footer-brand">{texts['footer.brand'] || '123 Fakturera'}</div>
        <div className="footer-links">
          <a href="#" className="footer-link">{texts['nav.home'] || 'Hem'}</a>
          <a href="#" className="footer-link">{texts['nav.order'] || 'Beställ'}</a>
          <a href="#" className="footer-link">{texts['nav.contact'] || 'Kontakta oss'}</a>
        </div>
      </footer>

      {/* Copyright */}
      <div className="login-copyright">
        {texts['footer.copyright'] || '© Lättfaktura. ORG no. 638537, 2025. All rights reserved.'}
      </div>
    </div>
  );
}