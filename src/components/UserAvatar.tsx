import { useState, useRef, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function UserAvatar() {
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut(auth);
    window.location.href = '/login';
  };

  // Get initials from displayName or email
  const getInitials = () => {
    if (user.displayName) {
      return user.displayName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return (user.email?.[0] ?? 'U').toUpperCase();
  };

  const fullName = user.displayName || user.email || 'User';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#0E462B] focus:ring-offset-2 transition-transform hover:scale-105"
        aria-label="User menu"
      >
        {user.photoURL ? (
          // Google profile photo
          <img
            src={user.photoURL}
            alt={fullName}
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          // Initials circle for email users
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-semibold text-sm"
            style={{ backgroundColor: '#2d6a4f' }}
          >
            {getInitials()}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 bg-white"
          style={{
            minWidth: '220px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: 1000,
          }}
        >
          {/* User info */}
          <div className="px-4 py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">{fullName}</p>
            {user.displayName && (
              <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
            )}
          </div>

          {/* My Orders / Admin Panel */}
          <div className="px-2 pt-2">
            <Link
              to="/my-orders"
              onClick={() => setOpen(false)}
              className="w-full block text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50 text-gray-700"
            >
              My Orders
            </Link>
            
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="w-full block text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-amber-50 text-amber-700"
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Sign Out */}
          <div className="px-2 py-2">
            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-red-50"
              style={{ color: '#e53e3e' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

