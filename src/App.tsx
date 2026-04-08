import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Explore from './Explore';
import About from './About';
import Contact from './Contact';
import Privacy from './Privacy';
import Terms from './Terms';
import Shipping from './Shipping';
import Return from './Return';

// New Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Flow from './pages/Flow';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import PrivateRoute from './components/PrivateRoute';

function LegacyApp() {
  const [currentPage, setCurrentPage] = useState('home');

  // 1️⃣ Sync URL → page on load & back/forward
  useEffect(() => {
    const updatePageFromPath = () => {
      const path = window.location.pathname;

      if (path === '/explore') setCurrentPage('explore');
      else if (path === '/about') setCurrentPage('about');
      else if (path === '/contact') setCurrentPage('contact');
      else if (path === '/privacy-policy') setCurrentPage('privacy');
      else if (path === '/terms-of-service') setCurrentPage('terms');
      else if (path === '/shipping-policy') setCurrentPage('shipping');
      else if (path === '/return-refund-policy') setCurrentPage('return');
      else setCurrentPage('home');
    };

    updatePageFromPath();
    window.addEventListener('popstate', updatePageFromPath);

    return () => window.removeEventListener('popstate', updatePageFromPath);
  }, []);

  // 2️⃣ Intercept internal link clicks (SPA behavior)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (!link || !link.href) return;
      if (!link.href.startsWith(window.location.origin)) return;

      const url = new URL(link.href);
      const path = url.pathname;

      const validPaths = [
        '/',
        '/explore',
        '/about',
        '/contact',
        '/privacy-policy',
        '/terms-of-service',
        '/shipping-policy',
        '/return-refund-policy',
      ];

      if (!validPaths.includes(path)) return;

      e.preventDefault();
      window.history.pushState({}, '', link.href);

      if (path === '/explore') setCurrentPage('explore');
      else if (path === '/about') setCurrentPage('about');
      else if (path === '/contact') setCurrentPage('contact');
      else if (path === '/privacy-policy') setCurrentPage('privacy');
      else if (path === '/terms-of-service') setCurrentPage('terms');
      else if (path === '/shipping-policy') setCurrentPage('shipping');
      else if (path === '/return-refund-policy') setCurrentPage('return');
      else setCurrentPage('home');
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // 3️⃣ ✅ THE FIX — scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <>
      {currentPage === 'home' && <Home />}
      {currentPage === 'explore' && <Explore />}
      {currentPage === 'about' && <About />}
      {currentPage === 'contact' && <Contact />}
      {currentPage === 'privacy' && <Privacy />}
      {currentPage === 'terms' && <Terms />}
      {currentPage === 'shipping' && <Shipping />}
      {currentPage === 'return' && <Return />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/flow" element={<PrivateRoute><Flow /></PrivateRoute>} />
        <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/orders" element={<PrivateRoute><AdminOrders /></PrivateRoute>} />
        
        {/* Catch-all for existing state-based pages */}
        <Route path="*" element={<LegacyApp />} />
      </Routes>
    </Router>
  );
}

export default App;

