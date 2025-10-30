import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, ChevronDown, FileText } from 'lucide-react'; // Add FileText icon
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="Niti IAS Coaching Logo"
                className="h-10 md:h-12 w-auto mr-2"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              {/* Hidden heading for SEO / accessibility */}
              <h1 className="sr-only">Niti IAS</h1>
              <span className="text-2xl font-bold text-primary-600">Niti IAS</span>
            </a>
            {/* Desktop Links */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a
                href="/"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                {t('home')}
              </a>
              <a
                href="/courses"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                {t('courses')}
              </a>
              <a
                href="/blog"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                {t('blog')}
              </a>
              {/* Add PYQs Link Here */}
              <a
                href="/pyqs"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center"
              >
                <FileText size={16} className="mr-1" />
                PYQs
              </a>
              {user?.role === 'admin' && (
                <a
                  href="/admin"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  {t('admin')}
                </a>
              )}
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center space-x-1 bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition duration-300"
                  >
                    <span>{user.name}</span>
                    <ChevronDown size={16} />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t('profile')}
                      </a>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t('logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href="/login"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition duration-300"
                >
                  {t('login')}
                </a>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none transition duration-300"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-xl border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/"
              className="block px-3 py-3 text-gray-700 hover:text-primary-600 rounded-md text-base font-medium transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              {t('home')}
            </a>
            <a
              href="/courses"
              className="block px-3 py-3 text-gray-700 hover:text-primary-600 rounded-md text-base font-medium transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              {t('courses')}
            </a>
            <a
              href="/blog"
              className="block px-3 py-3 text-gray-700 hover:text-primary-600 rounded-md text-base font-medium transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              {t('blog')}
            </a>
            {/* Add PYQs Link to Mobile Menu */}
            <a
              href="/pyqs"
              className="block px-3 py-3 text-gray-700 hover:text-primary-600 rounded-md text-base font-medium transition duration-300 flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <FileText size={16} className="mr-2" />
              PYQs
            </a>
            {user?.role === 'admin' && (
              <a
                href="/admin"
                className="block px-3 py-3 text-gray-700 hover:text-primary-600 rounded-md text-base font-medium transition duration-300"
                onClick={() => setIsOpen(false)}
              >
                {t('admin')}
              </a>
            )}

            {/* Mobile User Section */}
            {user ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3 py-2">
                  <User className="h-8 w-8 text-gray-500 bg-gray-100 p-1 rounded-full" />
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <a
                  href="/profile"
                  className="block px-3 py-3 text-gray-700 hover:text-primary-600 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {t('profile')}
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-md text-base font-medium hover:bg-gray-200 transition duration-300 mt-2"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="bg-primary-600 text-white block px-3 py-3 rounded-md text-base font-medium hover:bg-primary-700 transition duration-300 mt-4"
                onClick={() => setIsOpen(false)}
              >
                {t('login')}
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;