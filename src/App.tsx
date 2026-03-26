import { useState, useEffect } from 'react';
import Home from './Home';
import Explore from './Explore';
import About from './About';
import Contact from './Contact';
import Admin from './Admin';
import Privacy from './Privacy';
import Terms from './Terms';
import Shipping from './Shipping';
import Return from './Return';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // 1️⃣ Sync URL → page on load & back/forward
  useEffect(() => {
    const updatePageFromPath = () => {
      const path = window.location.pathname;

      if (path === '/explore') setCurrentPage('explore');
      else if (path === '/about') setCurrentPage('about');
      else if (path === '/contact') setCurrentPage('contact');
      else if (path === '/admin') setCurrentPage('admin');
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
        '/admin',
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
      else if (path === '/admin') setCurrentPage('admin');
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
      {currentPage === 'admin' && <Admin />}
      {currentPage === 'privacy' && <Privacy />}
      {currentPage === 'terms' && <Terms />}
      {currentPage === 'shipping' && <Shipping />}
      {currentPage === 'return' && <Return />}
    </>
  );
}

export default App;
