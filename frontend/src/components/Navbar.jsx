import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Menu,
  X,
  ChevronDown,
  FileText,
  Home,
  BookOpen,
  Newspaper,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/courses', label: 'Courses', icon: BookOpen },
    { to: '/blog', label: 'Blogs', icon: Newspaper },
    { to: '/pyqs', label: 'PYQs', icon: FileText },
  ];

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 font-medium transition ${
      isActive
        ? 'text-primary-600'
        : 'text-gray-700 hover:text-primary-600'
    }`;

  return (
    <>
      <nav className="bg-white sticky top-0 z-50 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                className="h-10 w-10 mr-3"
                alt="Niti IAS"
              />
              <div>
                <p className="text-2xl font-bold text-primary-600">
                  Niti IAS
                </p>
                <p className="text-xs text-gray-500 hidden sm:block">
                  सिविल सेवा कोचिंग
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={navLinkClass}
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <div ref={profileRef} className="relative hidden md:block">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border hover:bg-gray-100"
                  >
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {user?.name
                        ? user.name.charAt(0).toUpperCase()
                        : 'U'}
                    </div>
                    <span className="text-sm font-medium">
                      {user?.name || 'User'}
                    </span>
                    <ChevronDown size={16} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg border overflow-hidden">
                      <Link
                        to="/profile"
                        className="block px-4 py-3 hover:bg-gray-50"
                      >
                        Profile
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-3 hover:bg-gray-50"
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      {user.role === 'student' && (
                        <Link
                          to="/my-courses"
                          className="block px-4 py-3 hover:bg-gray-50"
                        >
                          My Courses
                        </Link>
                      )}

                      <Link
                        to="/my-pyqs"
                        className="block px-4 py-3 hover:bg-gray-50"
                      >
                        My PYQs
                      </Link>

                      <div className="border-t" />

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Login
                </Link>
              )}

              {/* Mobile Toggle */}
              <button
                aria-label="Toggle menu"
                className="md:hidden"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 p-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="block px-4 py-3 rounded hover:bg-gray-100"
            >
              {item.label}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className="block px-4 py-3 rounded hover:bg-gray-100"
            >
              Admin Dashboard
            </NavLink>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block text-center px-4 py-3 bg-primary-600 text-white rounded"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
