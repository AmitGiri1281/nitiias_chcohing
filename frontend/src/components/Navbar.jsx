

import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '../contexts/AuthContext';
import socket from "../utils/socket";
import { api } from "../utils/api";
import {
  Menu,
  X,
  ChevronDown,
  FileText,
  Home,
  BookOpen,
  Newspaper,
  Bell,
  Search
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsCount, setNotificationsCount] = useState(0);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
  const handleKey = (e) => {
    if (e.key === 'Escape') setIsOpen(false);
  };
  document.addEventListener('keydown', handleKey);
  return () => document.removeEventListener('keydown', handleKey);
}, []);

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
  // Load unread notifications count
useEffect(() => {
  if (!user) return;

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications/unread-count");
      setNotificationsCount(res.data.count);
    } catch (err) {
      console.error("Notification error:", err);
    }
  };

  fetchNotifications();
}, [user]);
// Real-time notification listener
useEffect(() => {
  if (!user) return;

  socket.emit("join", user._id); // connect user room

  socket.on("newNotification", () => {
    setNotificationsCount((prev) => prev + 1);
  });

  return () => {
    socket.off("newNotification");
  };
}, [user]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
  document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  return () => {
    document.body.style.overflow = 'auto';
  };
}, [isOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/courses', label: 'Courses', icon: BookOpen },
    { to: '/blog', label: 'Blogs', icon: Newspaper },
    { to: '/pyqs', label: 'PYQs', icon: FileText },
  ];

  const navLinkClass = ({ isActive }) =>
    `relative flex items-center gap-2 font-medium px-2 py-1 transition 
     ${
       isActive
         ? 'text-primary-600'
         : 'text-gray-700 hover:text-primary-600'
     }`;

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 
        ${
          scrolled
            ? 'bg-white shadow-md'
            : 'bg-white/70 backdrop-blur-lg border-b'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <img
                src="/logo.png"
                className="h-10 w-10 mr-3"
                alt="Niti IAS"
              />
              <div>
                <h1 className="text-2xl font-extrabold text-primary-600 tracking-tight">
  Niti IAS
</h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  सिविल सेवा कोचिंग
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={navLinkClass}>
                  {({ isActive }) => (
                    <span className="relative group flex items-center gap-2">
                      <item.icon size={18} />
                      {item.label}

                      {/* Animated underline */}
                      <span
                        className={`absolute left-0 -bottom-1 h-[2px] bg-primary-600 transition-all duration-300 
                          ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                      />
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Search Bar - Desktop */}
              <form onSubmit={handleSearch} className="hidden lg:block relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </form>

              {/* CTA Button */}
              <Link
                to="/pyqs"
                className="hidden md:block px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium"
              >
                Free Test
              </Link>

              {/* Notification Bell */}
              <button className="relative hidden md:block p-2 hover:bg-gray-100 rounded-full transition">
                <Bell size={20} className="text-gray-600" />
               {notificationsCount > 0 && (
  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
)}
              </button>

              {user ? (
                <div ref={profileRef} className="relative hidden md:block">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border hover:bg-gray-100 transition"
                  >
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {user?.name
                        ? user.name.charAt(0).toUpperCase()
                        : 'U'}
                    </div>
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {user?.name || 'User'}
                    </span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-64 bg-white shadow-xl rounded-xl border overflow-hidden"
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b bg-gray-50">
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          <p className="text-xs text-primary-600 mt-1 capitalize">{user.role}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="block px-4 py-3 hover:bg-gray-50 transition"
                          >
                            Profile Settings
                          </Link>

                          {user.role === 'admin' && (
                            <Link
                              to="/admin"
                              className="block px-4 py-3 hover:bg-gray-50 transition"
                            >
                              Admin Dashboard
                            </Link>
                          )}

                          {user.role === 'student' && (
                            <>
                              <Link
                                to="/my-courses"
                                className="block px-4 py-3 hover:bg-gray-50 transition"
                              >
                                My Courses
                              </Link>
                              <Link
                                to="/my-pyqs"
                                className="block px-4 py-3 hover:bg-gray-50 transition"
                              >
                                My PYQs
                              </Link>
                              <Link
                                to="/test-attempts"
                                className="block px-4 py-3 hover:bg-gray-50 transition"
                              >
                                Test Attempts
                              </Link>
                            </>
                          )}
                        </div>

                        <div className="border-t" />
                        
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition font-medium"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Login
                </Link>
              )}

              {/* Mobile Toggle */}
              <button
                aria-label="Toggle menu"
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "tween", duration: 0.3 }}
              className="md:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 shadow-xl overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <p className="text-xl font-bold text-primary-600">Menu</p>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="p-6 border-b">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </form>
              </div>

              {/* Navigation */}
              <div className="p-6 space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition 
                      ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <item.icon size={20} />
                    {item.label}
                  </NavLink>
                ))}
              </div>

              {/* CTA Button - Mobile */}
              <div className="px-6 mb-4">
                <Link
                  to="/pyqs"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
                >
                  Free Test Series
                </Link>
              </div>

              {/* User section */}
              <div className="border-t p-6">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-xl">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition"
                      >
                        Profile
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition"
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      {user.role === 'student' && (
                        <>
                          <Link
                            to="/my-courses"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition"
                          >
                            My Courses
                          </Link>
                          <Link
                            to="/my-pyqs"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition"
                          >
                            My PYQs
                          </Link>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full mt-4 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;