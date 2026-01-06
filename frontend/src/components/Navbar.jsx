import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, ChevronDown, FileText, Home, BookOpen, Newspaper, LogOut, Settings, BookMarked } from 'lucide-react';

const Navbar = () => {
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
      <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="Niti IAS कोचिंग संस्थान लोगो"
                className="h-10 w-10 mr-3"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary-600 leading-tight">
                  Niti IAS
                </span>
                <span className="text-xs text-gray-500 hidden sm:block">
                  सिविल सेवा कोचिंग
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                <Home size={18} className="mr-2" />
                होम
              </Link>
              <Link 
                to="/courses" 
                className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                <BookOpen size={18} className="mr-2" />
                कोर्सेज
              </Link>
              <Link 
                to="/blog" 
                className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                <Newspaper size={18} className="mr-2" />
                ब्लॉग
              </Link>
              <Link 
                to="/pyqs" 
                className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                <FileText size={18} className="mr-2" />
                पिछले वर्षों के प्रश्न
              </Link>
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  <Settings size={18} className="mr-2" />
                  एडमिन
                </Link>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Desktop Profile */}
              {user ? (
                <div ref={profileRef} className="relative hidden md:block">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors border border-gray-200"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User size={16} className="text-primary-600" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-900">{user.name}</span>
                      <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                    </div>
                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-lg border border-gray-200 py-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded">
                          {user.role === 'admin' ? 'एडमिन' : 'छात्र'}
                        </span>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User size={16} className="mr-3 text-gray-500" />
                          प्रोफाइल
                        </Link>
                        {user.role === 'student' && (
                          <Link
                            to="/my-courses"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <BookOpen size={16} className="mr-3 text-gray-500" />
                            मेरे कोर्सेज
                          </Link>
                        )}
                        <Link
                          to="/my-pyqs"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <BookMarked size={16} className="mr-3 text-gray-500" />
                          मेरे PYQs
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} className="mr-3" />
                          लॉगआउट
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:block">
                  <Link
                    to="/login"
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    लॉगिन
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden z-50 p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="नेविगेशन मेनू खोलें/बंद करें"
                onClick={() => {
                  setIsOpen(!isOpen);
                  setIsProfileOpen(false);
                }}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= मोबाइल मेनू ================= */}
      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white z-40 overflow-y-auto shadow-xl">
          <div className="px-6 py-8 space-y-1">
            {/* Navigation Links */}
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)} 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Home size={20} className="mr-3 text-gray-500" />
              होम
            </Link>

            <Link 
              to="/courses" 
              onClick={() => setIsOpen(false)} 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <BookOpen size={20} className="mr-3 text-gray-500" />
              कोर्सेज
            </Link>

            <Link 
              to="/blog" 
              onClick={() => setIsOpen(false)} 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Newspaper size={20} className="mr-3 text-gray-500" />
              ब्लॉग
            </Link>

            <Link 
              to="/pyqs" 
              onClick={() => setIsOpen(false)} 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FileText size={20} className="mr-3 text-gray-500" />
              पिछले वर्षों के प्रश्न
            </Link>

            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Settings size={20} className="mr-3 text-gray-500" />
                एडमिन
              </Link>
            )}

            <div className="border-t border-gray-200 my-4"></div>

            {/* User Section */}
            {user ? (
              <>
                <div className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded">
                        {user.role === 'admin' ? 'एडमिन' : 'छात्र'}
                      </span>
                    </div>
                  </div>
                </div>

                <Link 
                  to="/profile" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <User size={20} className="mr-3 text-gray-500" />
                  प्रोफाइल
                </Link>

                {user.role === 'student' && (
                  <Link 
                    to="/my-courses" 
                    onClick={() => setIsOpen(false)} 
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <BookOpen size={20} className="mr-3 text-gray-500" />
                    मेरे कोर्सेज
                  </Link>
                )}

                <Link 
                  to="/my-pyqs" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <BookMarked size={20} className="mr-3 text-gray-500" />
                  मेरे PYQs
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                >
                  <LogOut size={20} className="mr-3" />
                  लॉगआउट
                </button>
              </>
            ) : (
              <div className="pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  लॉगिन
                </Link>
              </div>
            )}

            {/* Contact Info */}
            <div className="px-4 py-6 mt-8 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">संपर्क जानकारी</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📞 +91 9795902017</p>
                <p>📧 info@nitiias.com</p>
                <p>📍 दिल्ली, भारत</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;