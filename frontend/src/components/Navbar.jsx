import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, ChevronDown, FileText } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Prevent background scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="Niti IAS Coaching Institute Logo"
                className="h-10 mr-2"
              />
              <h1 className="sr-only">
                Niti IAS Coaching Institute – UPSC & PCS Preparation
              </h1>
              <span className="text-2xl font-bold text-primary-600">
                Niti IAS
              </span>
            </Link>

           {/* Desktop Menu - Update the PYQs link */}
<div className="hidden md:flex items-center space-x-6">
  <Link to="/">{t('home')}</Link>
  <Link to="/courses">{t('courses')}</Link>
  <Link to="/blog">{t('blog')}</Link>
  <Link to="/pyqs" className="flex items-center">
    <FileText size={16} className="mr-1" /> PYQs
  </Link>
  {user?.role === 'admin' && <Link to="/admin">{t('admin')}</Link>}
</div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />

              {/* Desktop Profile */}
              {user ? (
                <div ref={profileRef} className="relative hidden md:block">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="bg-gray-100 px-4 py-2 rounded-md flex items-center"
                  >
                    {user.name}
                    <ChevronDown size={16} className="ml-1" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md border">
                      <div className="px-4 py-2 border-b">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md"
                >
                  {t('login')}
                </Link>
              )}

              {/* Mobile Button */}
              <button
                className="md:hidden z-50"
                aria-label="Toggle navigation menu"
                onClick={() => {
                  setIsOpen(!isOpen);
                  setIsProfileOpen(false);
                }}
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white z-40 overflow-y-auto shadow-xl">
          <div className="px-6 py-6 space-y-4 text-lg">

            <Link to="/" onClick={() => setIsOpen(false)} className="block">
              {t('home')}
            </Link>

            <Link to="/courses" onClick={() => setIsOpen(false)} className="block">
              {t('courses')}
            </Link>

            <Link to="/blog" onClick={() => setIsOpen(false)} className="block">
              {t('blog')}
            </Link>

            <Link to="/pyqs" onClick={() => setIsOpen(false)} className="flex items-center">
              <FileText size={18} className="mr-2" /> PYQs
            </Link>

            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block">
                {t('admin')}
              </Link>
            )}

            <hr />

            {user ? (
              <>
                <div className="flex items-center space-x-3">
                  <User className="w-8 h-8" />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <Link to="/profile" onClick={() => setIsOpen(false)} className="block">
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block bg-primary-600 text-white text-center py-3 rounded-md"
              >
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
