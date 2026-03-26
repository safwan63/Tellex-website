"use client";
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = usePathname();

  const { isAdmin } = useAuth();

  const getLinkClass = (href: string) => {
    const isActive = currentPath === href;
    return `px-3 py-2 text-base font-medium rounded-md ${
      isActive ? '' : 'text-white hover:text-white'
    }`;
  };

  const getLinkStyle = (href: string) => {
    const isActive = currentPath === href;
    return isActive ? { color: '#e1cfbc' } : {};
  };

  return (
    <nav
      className="sticky top-0 w-full z-50"
      style={{
        backgroundColor: '#0E462B',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link
            href="/"
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
            style={{ color: '#FFFFFF', fontFamily: "'Playfair Display', serif" }}
          >
            Tellex
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <Link href="/" className={getLinkClass('/')} style={getLinkStyle('/')}>
                Home
              </Link>
              <Link href="/explore" className={getLinkClass('/explore')} style={getLinkStyle('/explore')}>
                Explore
              </Link>
              <Link href="/about" className={getLinkClass('/about')} style={getLinkStyle('/about')}>
                About
              </Link>
              {isAdmin && (
                <Link href="/admin" className={getLinkClass('/admin')} style={getLinkStyle('/admin')}>
                  <span className="flex items-center gap-1"><Shield size={16} /> Admin</span>
                </Link>
              )}
              <Link href="/contact" className={getLinkClass('/contact')} style={getLinkStyle('/contact')}>
                Contact
              </Link>
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
            className="px-4 pt-4 pb-4 space-y-2"
            style={{
              backgroundColor: '#0E462B',
            }}
          >
            <Link href="/" onClick={() => setIsOpen(false)} className={`block py-3 text-base font-medium ${getLinkClass('/')}`} style={getLinkStyle('/')}>
              Home
            </Link>
            <Link href="/explore" onClick={() => setIsOpen(false)} className={`block py-3 text-base font-medium ${getLinkClass('/explore')}`} style={getLinkStyle('/explore')}>
              Explore
            </Link>
            {isAdmin && (
              <Link href="/admin" onClick={() => setIsOpen(false)} className={`block py-3 text-base font-medium ${getLinkClass('/admin')}`} style={getLinkStyle('/admin')}>
                <span className="flex items-center gap-2"><Shield size={18} /> Admin Panel</span>
              </Link>
            )}
            <Link href="/about" onClick={() => setIsOpen(false)} className={`block py-3 text-base font-medium ${getLinkClass('/about')}`} style={getLinkStyle('/about')}>
              About
            </Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className={`block py-3 text-base font-medium ${getLinkClass('/contact')}`} style={getLinkStyle('/contact')}>
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
