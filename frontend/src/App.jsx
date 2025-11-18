import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Terms from './pages/Terms';
import Pricelist from './pages/Pricelist';

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [route, setRoute] = useState('login');
  const [previousRoute, setPreviousRoute] = useState('login');

  // Initialize route based on URL and token
  useEffect(() => {
    const path = window.location.pathname;
    
    if (path.includes('/terms')) {
      setRoute('terms');
    } else if (path.includes('/pricelist') && token) {
      setRoute('pricelist');
    } else if (token) {
      setRoute('pricelist');
      window.history.pushState({}, '', '/pricelist');
    } else {
      setRoute('login');
      window.history.pushState({}, '', '/login');
    }
  }, []);

  // Sync URL when route changes
  useEffect(() => {
    if (route === 'login') {
      window.history.pushState({}, '', '/login');
    } else if (route === 'pricelist') {
      window.history.pushState({}, '', '/pricelist');
    } else if (route === 'terms') {
      window.history.pushState({}, '', '/terms');
    }
  }, [route]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('/terms')) {
        setRoute('terms');
      } else if (path.includes('/pricelist')) {
        if (token) {
          setRoute('pricelist');
        } else {
          setRoute('login');
          window.history.pushState({}, '', '/login');
        }
      } else {
        setRoute('login');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [token]);

  // Function to navigate to terms and remember where we came from
  const goToTerms = () => {
    setPreviousRoute(route);
    setRoute('terms');
  };

  // Function to go back from terms to previous page
  const backFromTerms = () => {
    setRoute(previousRoute);
  };

  return (
    <div className="app-root">
      {route === 'login' && (
        <Login 
          onLogin={(t)=>{ 
            localStorage.setItem('token', t); 
            setToken(t); 
            setRoute('pricelist'); 
          }} 
          onShowTerms={goToTerms} 
        />
      )}
      
      {route === 'terms' && (
        <Terms onBack={backFromTerms} />
      )}
      
      {route === 'pricelist' && token && (
        <Pricelist 
          token={token} 
          onLogout={() => { 
            localStorage.removeItem('token'); 
            setToken(null); 
            setRoute('login'); 
          }}
          onShowTerms={goToTerms}
        />
      )}
    </div>
  );
}