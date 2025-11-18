import React, { useEffect, useState } from 'react';

function Input({ value, onChange, onBlur, placeholder }) {
  return (
    <input 
      className="pill" 
      value={value || ''} 
      onChange={e => onChange(e.target.value)} 
      onBlur={onBlur}
      placeholder={placeholder}
    />
  );
}

export default function Pricelist({ token, onLogout }){
  const [products, setProducts] = useState([]);
  const [searchArticle, setSearchArticle] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [lang, setLang] = useState('en');
  const [showMenu, setShowMenu] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(()=> {
    fetch('/api/products', { headers: { Authorization: 'Bearer ' + token }})
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

  async function saveProduct(p){
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

  function changeField(id, field, value){
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
      in_stock: ''
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
    <div className="pricelist-root">
      {/* Overlay for sidebar */}
      {showMenu && (
        <div className="sidebar-overlay" onClick={() => setShowMenu(false)}></div>
      )}

      {/* Desktop Sidebar Menu */}
      <aside className={`desktop-sidebar ${showMenu ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-sidebar" onClick={() => setShowMenu(false)}>✕</button>
        </div>
        <nav className="sidebar-nav">
          <button className="sidebar-item" onClick={() => setShowMenu(false)}>
            <span className="sidebar-icon">📊</span>
            Dashboard
          </button>
          <button className="sidebar-item active" onClick={() => setShowMenu(false)}>
            <span className="sidebar-icon">💰</span>
            Price List
          </button>
          <button className="sidebar-item" onClick={() => setShowMenu(false)}>
            <span className="sidebar-icon">📄</span>
            Invoices
          </button>
          <button className="sidebar-item" onClick={() => setShowMenu(false)}>
            <span className="sidebar-icon">👥</span>
            Customers
          </button>
          <button className="sidebar-item" onClick={() => setShowMenu(false)}>
            <span className="sidebar-icon">📦</span>
            Inventory
          </button>
          <button className="sidebar-item" onClick={() => setShowMenu(false)}>
            <span className="sidebar-icon">⚙️</span>
            Settings
          </button>
          <button className="sidebar-item logout" onClick={() => { setShowMenu(false); onLogout(); }}>
            <span className="sidebar-icon">🚪</span>
            Logout
          </button>
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="mobile-header-top">
          <button className="hamburger-btn" onClick={() => setShowMenu(!showMenu)}>☰</button>
          <div className="lang-toggle-mobile">
            <span>{lang === 'en' ? 'English' : 'Svenska'}</span>
            <img 
              src={`https://flagcdn.com/w40/${lang === 'en' ? 'gb' : 'se'}.png`}
              alt={lang} 
              onClick={() => setLang(lang === 'en' ? 'se' : 'en')}
              className="flag-img"
            />
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMenu && (
          <div className="mobile-menu">
            <button onClick={() => { setShowMenu(false); }}>Dashboard</button>
            <button onClick={() => { setShowMenu(false); }}>Price List</button>
            <button onClick={() => { setShowMenu(false); }}>Settings</button>
            <button onClick={() => { setShowMenu(false); onLogout(); }}>Logout</button>
          </div>
        )}

        {/* Search Boxes */}
        <div className="search-boxes">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search Article No ..." 
              value={searchArticle}
              onChange={(e) => setSearchArticle(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search Product ..." 
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="action-btn add-btn" onClick={addNewProduct} title="Add New Product">
            <span className="icon">➕</span>
          </button>
          <button className="action-btn print-btn" onClick={() => window.print()} title="Print">
            <span className="icon">🖨️</span>
          </button>
          <button className="action-btn advanced-btn" title="Advanced Mode">
            <span className="icon">⚙️</span>
          </button>
        </div>
      </header>

      {/* Tablet Header (medium screens) */}
      <header className="tablet-header">
        <div className="tablet-header-left">
          <button className="hamburger-btn" onClick={() => setShowMenu(!showMenu)}>☰</button>
          <h3>Price List</h3>
        </div>
        <div className="tablet-header-right">
          <button className="header-btn" onClick={addNewProduct}>+ New</button>
          <button className="header-btn" onClick={() => window.print()}>Print</button>
          <button className="header-btn" onClick={onLogout}>Logout</button>
        </div>
        
        {/* Mobile Menu Dropdown for Tablet */}
        {showMenu && (
          <div className="mobile-menu" style={{ position: 'absolute', top: '70px', left: '24px', right: '24px', zIndex: 100 }}>
            <button onClick={() => { setShowMenu(false); }}>Dashboard</button>
            <button onClick={() => { setShowMenu(false); }}>Price List</button>
            <button onClick={() => { setShowMenu(false); }}>Settings</button>
            <button onClick={() => { setShowMenu(false); onLogout(); }}>Logout</button>
          </div>
        )}
      </header>

      {/* Desktop Header */}
      <header className="desktop-header">
        <div className="desktop-header-left">
          <div className="hamburger" onClick={() => setShowMenu(!showMenu)}>☰</div>
          <h3>Price List</h3>
        </div>
        <div className="desktop-header-right">
          <div className="desktop-search-group">
            <input 
              type="text" 
              placeholder="Search Article..." 
              value={searchArticle}
              onChange={(e) => setSearchArticle(e.target.value)}
              className="desktop-search"
            />
            <input 
              type="text" 
              placeholder="Search Product..." 
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              className="desktop-search"
            />
          </div>
          <button className="header-btn primary" onClick={addNewProduct}>+ New Product</button>
          <button className="header-btn" onClick={() => window.print()}>Print</button>
          <button className="header-btn" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div className="pl-table">
        {/* Desktop Table Headers */}
        <div className="pl-headers">
          <div>Article No.</div>
          <div>Product/Service</div>
          <div>In Price</div>
          <div>Price</div>
          <div>Unit</div>
          <div>In Stock</div>
          <div>Actions</div>
        </div>

        {/* Tablet Column Labels */}
        <div className="tablet-columns">
          <div>Article</div>
          <div>Product/Service</div>
          <div>Price</div>
          <div></div>
        </div>

        {/* Mobile Column Labels */}
        <div className="mobile-columns">
          <div>Product/Service</div>
          <div>Price</div>
          <div></div>
        </div>

        <div className="pl-rows">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <p>No products found. {searchArticle || searchProduct ? 'Try adjusting your search.' : 'Click + to add a new product.'}</p>
            </div>
          ) : (
            filteredProducts.map(p => (
              <div className="pl-row" key={p.id}>
                <Input 
                  value={p.article_no} 
                  onChange={v => changeField(p.id, 'article_no', v)} 
                  onBlur={() => saveProduct(p)}
                  placeholder="Article #"
                />
                <Input 
                  value={p.product_service} 
                  onChange={v => changeField(p.id, 'product_service', v)} 
                  onBlur={() => saveProduct(p)}
                  placeholder="Product name"
                />
                <Input 
                  value={p.in_price} 
                  onChange={v => changeField(p.id, 'in_price', v)} 
                  onBlur={() => saveProduct(p)}
                  placeholder="In price"
                />
                <Input 
                  value={p.price} 
                  onChange={v => changeField(p.id, 'price', v)} 
                  onBlur={() => saveProduct(p)}
                  placeholder="Price"
                />
                <Input 
                  value={p.unit} 
                  onChange={v => changeField(p.id, 'unit', v)} 
                  onBlur={() => saveProduct(p)}
                  placeholder="Unit"
                />
                <Input 
                  value={p.in_stock} 
                  onChange={v => changeField(p.id, 'in_stock', v)} 
                  onBlur={() => saveProduct(p)}
                  placeholder="Stock"
                />
                <div className="row-actions">
                  <button 
                    className="row-menu-btn" 
                    onClick={() => setSelectedProduct(selectedProduct === p.id ? null : p.id)}
                    title="More options"
                  >
                    ⋯
                  </button>
                  {selectedProduct === p.id && (
                    <div className="row-menu-dropdown">
                      <button onClick={() => deleteProduct(p.id)}>Delete</button>
                      <button onClick={() => setSelectedProduct(null)}>Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}