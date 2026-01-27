import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, ChevronDown, FileText, Home, BookOpen, Newspaper, LogOut, Settings, BookMarked } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close menu on route change
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

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/courses', label: 'Courses', icon: BookOpen },
    { to: '/blog', label: 'Blogs', icon: Newspaper },
    { to: '/pyqs', label: 'PYQs', icon: FileText },
  ];

  const navLinkClass = ({ isActive }) =>
    `flex items-center font-medium transition-colors ${
      isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
    }`;

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Niti IAS" className="h-10 w-10 mr-3" />
              <div>
                <p className="text-2xl font-bold text-primary-600">Niti IAS</p>
                <p className="text-xs text-gray-500 hidden sm:block">सिविल सेवा कोचिंग</p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map(item => (
                <NavLink key={item.to} to={item.to} className={navLinkClass}>
                  <item.icon size={18} className="mr-2" />
                  {item.label}
                </NavLink>
              ))}

              {user?.role === 'admin' && (
                <NavLink to="/admin" className={navLinkClass}>
                  <Settings size={18} className="mr-2" />
                  Admin
                </NavLink>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">

              {/* Profile */}
              {user ? (
                <div ref={profileRef} className="relative hidden md:block">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border"
                  >
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{user.name}</span>
                    <ChevronDown size={16} className={`${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white shadow-xl rounded-lg border">
                      <Link to="/profile" className="block px-4 py-3 hover:bg-gray-50">Profile</Link>
                      {user.role === 'student' && (
                        <Link to="/my-courses" className="block px-4 py-3 hover:bg-gray-50">My Courses</Link>
                      )}
                      <Link to="/my-pyqs" className="block px-4 py-3 hover:bg-gray-50">My PYQs</Link>
                      <div className="border-t" />
                      <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hidden md:block px-6 py-2 bg-primary-600 text-white rounded-lg">
                  Login
                </Link>
              )}

              {/* Mobile Button */}
              <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                {isOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 p-6 space-y-2">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} className="block px-4 py-3 rounded hover:bg-gray-100">
              {item.label}
            </NavLink>
          ))}

          {user ? (
            <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600">
              Logout
            </button>
          ) : (
            <Link to="/login" className="block text-center px-4 py-3 bg-primary-600 text-white rounded">
              Login
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
