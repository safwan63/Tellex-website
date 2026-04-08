import { useState, useEffect } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updatePath = () => {
      setCurrentPath(window.location.pathname);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Listen to browser back/forward buttons
    window.addEventListener('popstate', updatePath);
    
    // Listen to custom navigation events
    window.addEventListener('navigation', updatePath);

    // Listen to scroll events for glass effect
    window.addEventListener('scroll', handleScroll);
    
    // Check pathname periodically to catch programmatic navigation
    const interval = setInterval(updatePath, 200);

    return () => {
      window.removeEventListener('popstate', updatePath);
      window.removeEventListener('navigation', updatePath);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    setCurrentPath(href);
  };

  const getLinkClass = (href: string) => {
    const isActive = currentPath === href;
    return `px-3 py-2 text-base font-medium rounded-md transition-colors duration-300 ${
      isActive ? 'text-[#e1cfbc]' : 'text-white/90 hover:text-[#e1cfbc]'
    }`;
  };

  const isExplorePage = currentPath === '/explore';
  const shouldApplyGlassEffect = isScrolled || isExplorePage;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        shouldApplyGlassEffect
          ? 'bg-[#0E462B]/85 backdrop-blur-md shadow-lg border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <a
            href="/"
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
            style={{ color: '#FFFFFF', fontFamily: "'Playfair Display', serif" }}
          >
            Tellex
          </a>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/');
                  window.history.pushState({}, '', '/');
                }}
                className={getLinkClass('/')}
              >
                Home
              </a>
              <a
                href="/explore"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/explore');
                  window.history.pushState({}, '', '/explore');
                }}
                className={getLinkClass('/explore')}
              >
                Explore
              </a>
              <a
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/about');
                  window.history.pushState({}, '', '/about');
                }}
                className={getLinkClass('/about')}
              >
                About
              </a>
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/contact');
                  window.history.pushState({}, '', '/contact');
                }}
                className={getLinkClass('/contact')}
              >
                Contact
              </a>
              {user ? (
                <div className="pl-4">
                  <UserAvatar />
                </div>
              ) : (
                <a
                  href="/login"
                  className="ml-4 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white text-[#0E462B] font-bold hover:bg-[#e1cfbc] transition-all duration-300"
                >
                  <LogIn size={18} />
                  Login
                </a>
              )}
            </div>
          </div>


          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-white/10">
          <div
            className="px-4 pt-4 pb-4 space-y-2 backdrop-blur-[12px]"
            style={{
              backgroundColor: 'rgba(14, 70, 43, 0.95)',
            }}
          >
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/');
              }}
              className={`block py-3 text-base font-medium ${getLinkClass('/')}`}
            >
              Home
            </a>
            <a
              href="/explore"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/explore');
              }}
              className={`block py-3 text-base font-medium ${getLinkClass('/explore')}`}
            >
              Explore
            </a>
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/about');
              }}
              className={`block py-3 text-base font-medium ${getLinkClass('/about')}`}
            >
              About
            </a>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/contact');
              }}
              className={`block py-3 text-base font-medium ${getLinkClass('/contact')}`}
            >
              Contact
            </a>
            {user ? (
              <div className="py-3 border-t border-white/10 mt-2">
                <p className="text-[#e1cfbc] text-sm mb-3 px-3">Signed in as {user.email}</p>
                <div className="flex gap-4 px-3 flex-wrap">
                  <a href="/dashboard" className="text-white hover:text-[#e1cfbc] text-sm font-medium">Dashboard</a>
                  <a href="/my-orders" className="text-white hover:text-[#e1cfbc] text-sm font-medium">My Orders</a>
                  {isAdmin && (
                    <a href="/admin" className="text-amber-400 hover:text-amber-300 text-sm font-medium">Admin Panel</a>
                  )}
                </div>
              </div>
            ) : (
              <a
                href="/login"
                className="block py-3 mt-4 text-center rounded-xl bg-white text-[#0E462B] font-bold"
              >
                Login to Dashboard
              </a>
            )}
          </div>
        </div>

      )}
    </nav>
  );
}



