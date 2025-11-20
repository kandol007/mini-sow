import React, { useEffect, useState } from 'react';

// Add flag constants
const FLAG_GB = 'https://flagcdn.com/w40/gb.png';
const FLAG_SE = 'https://flagcdn.com/w40/se.png';

// Placeholder for user avatar
const USER_AVATAR = 'https://ui-avatars.com/api/?name=John+Andre&background=0D8ABC&color=fff';

function Input({ value, onChange, onBlur, placeholder, className }) {
  return (
    <input
      className={`pill-input ${className || ''}`}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
    />
  );
}

export default function Pricelist({ token, onLogout }) {
  const [products, setProducts] = useState([]);
  const [searchArticle, setSearchArticle] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [lang, setLang] = useState('en');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetch('/api/products', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => {
        if (r.status === 401) throw new Error('unauthorized');
        return r.json();
      })
      .then(setProducts)
      .catch(err => {
        console.error(err);
        if (err.message === 'unauthorized') onLogout();
      });
  }, [token, onLogout]);

  async function saveProduct(p) {
    try {
      await fetch(`/api/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(p)
      });
    } catch (err) {
      console.error('Save error', err);
    }
  }

  function changeField(id, field, value) {
    setProducts(prev => prev.map(x => x.id === id ? { ...x, [field]: value } : x));
  }

  function addNewProduct() {
    const newProduct = {
      id: Date.now(),
      article_no: '',
      product_service: '',
      in_price: '',
      price: '',
      unit: '',
      in_stock: '',
      description: ''
    };
    setProducts(prev => [newProduct, ...prev]);
  }

  function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
      fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
      })
        .then(() => setProducts(prev => prev.filter(p => p.id !== id)))
        .catch(err => console.error('Delete error', err));
    }
    setSelectedProduct(null);
  }

  // Filter products based on search
  const filteredProducts = products.filter(p => {
    const articleMatch = !searchArticle || (p.article_no && p.article_no.toLowerCase().includes(searchArticle.toLowerCase()));
    const productMatch = !searchProduct || (p.product_service && p.product_service.toLowerCase().includes(searchProduct.toLowerCase()));
    return articleMatch && productMatch;
  });

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="main-header">
        <div className="header-left-group">
          <button className="hamburger-toggle" onClick={() => setShowMenu(!showMenu)}>
            ☰
          </button>
          <div className="header-user">
            <img src={USER_AVATAR} alt="User" className="user-avatar" />
            <div className="user-info">
              <div className="user-name">John Andre</div>
              <div className="user-company">Storfjord AS</div>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="lang-selector" onClick={() => setLangDropdownOpen(!langDropdownOpen)}>
            <span className="lang-text">{lang === 'en' ? 'English' : 'Svenska'}</span>
            <img src={lang === 'en' ? FLAG_GB : FLAG_SE} alt="Flag" className="lang-flag" />
            <span className="arrow">▼</span>
            {langDropdownOpen && (
              <div className="lang-dropdown">
                <div className="lang-option" onClick={() => setLang('en')}>
                  <span>English</span>
                  <img src={FLAG_GB} alt="English" className="lang-flag-small" />
                </div>
                <div className="lang-option" onClick={() => setLang('se')}>
                  <span>Svenska</span>
                  <img src={FLAG_SE} alt="Svenska" className="lang-flag-small" />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="main-layout">
        {/* Sidebar Overlay */}
        {showMenu && <div className="sidebar-overlay" onClick={() => setShowMenu(false)}></div>}

        {/* Sidebar */}
        <aside className={`sidebar ${showMenu ? 'open' : ''}`}>
          <div className="sidebar-header-mobile">
            <div className="sidebar-title">Menu</div>
            <button className="close-sidebar" onClick={() => setShowMenu(false)}>✕</button>
          </div>
          <div className="sidebar-title desktop-only">Menu</div>
          <nav className="sidebar-menu">
            <a href="#" className="menu-item">
              <span className="icon">📄</span> Invoices
            </a>
            <a href="#" className="menu-item">
              <span className="icon">👤</span> Customers
            </a>
            <a href="#" className="menu-item">
              <span className="icon">⚙️</span> My Business
            </a>
            <a href="#" className="menu-item">
              <span className="icon">📓</span> Invoice Journal
            </a>
            <a href="#" className="menu-item active">
              <span className="active-indicator">●</span>
              <span className="icon">🏷️</span> Price List
            </a>
            <a href="#" className="menu-item">
              <span className="icon">📑</span> Multiple Invoicing
            </a>
            <a href="#" className="menu-item">
              <span className="icon">❌</span> Unpaid Invoices
            </a>
            <a href="#" className="menu-item">
              <span className="icon">📝</span> Offer
            </a>
            <a href="#" className="menu-item">
              <span className="icon">📦</span> Inventory Control
            </a>
            <a href="#" className="menu-item">
              <span className="icon">💳</span> Member Invoicing
            </a>
            <a href="#" className="menu-item">
              <span className="icon">☁️</span> Import/Export
            </a>
            <a href="#" className="menu-item logout" onClick={onLogout}>
              <span className="icon">🚪</span> Log out
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="content-area">
          {/* Action Bar */}
          <div className="action-bar">
            <div className="search-group">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search Article No..."
                  value={searchArticle}
                  onChange={(e) => setSearchArticle(e.target.value)}
                />
                <span className="search-icon">🔍</span>
              </div>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search Product..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>
            <div className="button-group">
              <button className="btn-pill btn-new" onClick={addNewProduct}>
                New Product <span className="btn-icon">⊕</span>
              </button>
              <button className="btn-pill btn-print" onClick={() => window.print()}>
                Print List <span className="btn-icon">🖨️</span>
              </button>
              <button className="btn-pill btn-advanced">
                Advanced mode <span className="btn-icon">⚙️</span>
              </button>
            </div>
          </div>

          {/* Product List */}
          <div className="product-list-container">
            <div className="list-header">
              <div className="col-article">Article No. ↓</div>
              <div className="col-product">Product/Service ↓</div>
              <div className="col-inprice">In Price</div>
              <div className="col-price">Price</div>
              <div className="col-unit">Unit</div>
              <div className="col-stock">In Stock</div>
              <div className="col-desc">Description</div>
            </div>

            <div className="list-body">
              {filteredProducts.map(p => (
                <div className={`list-row ${selectedProduct === p.id ? 'selected' : ''}`} key={p.id}>
                  {selectedProduct === p.id && <div className="row-indicator">→</div>}
                  <div className="col-article">
                    <Input
                      value={p.article_no}
                      onChange={v => changeField(p.id, 'article_no', v)}
                      onBlur={() => saveProduct(p)}
                    />
                  </div>
                  <div className="col-product">
                    <Input
                      value={p.product_service}
                      onChange={v => changeField(p.id, 'product_service', v)}
                      onBlur={() => saveProduct(p)}
                    />
                  </div>
                  <div className="col-inprice">
                    <Input
                      value={p.in_price}
                      onChange={v => changeField(p.id, 'in_price', v)}
                      onBlur={() => saveProduct(p)}
                    />
                  </div>
                  <div className="col-price">
                    <Input
                      value={p.price}
                      onChange={v => changeField(p.id, 'price', v)}
                      onBlur={() => saveProduct(p)}
                    />
                  </div>
                  <div className="col-unit">
                    <Input
                      value={p.unit}
                      onChange={v => changeField(p.id, 'unit', v)}
                      onBlur={() => saveProduct(p)}
                    />
                  </div>
                  <div className="col-stock">
                    <Input
                      value={p.in_stock}
                      onChange={v => changeField(p.id, 'in_stock', v)}
                      onBlur={() => saveProduct(p)}
                    />
                  </div>
                  <div className="col-desc">
                    <Input
                      value={p.description}
                      onChange={v => changeField(p.id, 'description', v)}
                      onBlur={() => saveProduct(p)}
                    />
                    <button
                      className="row-menu-trigger"
                      onClick={() => setSelectedProduct(selectedProduct === p.id ? null : p.id)}
                    >
                      ⋯
                    </button>
                    {selectedProduct === p.id && (
                      <div className="row-actions-popup">
                        <button onClick={() => deleteProduct(p.id)}>Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}