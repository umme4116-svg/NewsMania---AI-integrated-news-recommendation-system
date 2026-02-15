/**
 * Navbar component for News-Mania frontend.
 * Purpose: Provides navigation menu with links, search, theme toggle, and user authentication options.
 * Used for site-wide navigation and user interface controls.
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaSearch, FaUser, FaBookmark, FaSignOutAlt, FaCog, FaShieldAlt } from 'react-icons/fa';

const categories = [
  'Top Headlines',
  'Politics',
  'Technology',
  'Sports',
  'Business',
  'Health',
  'Entertainment',
  'International News',
];

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMore, setShowMore] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const moreRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Close dropdown on route change
    setShowMore(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setShowMore(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              NewsMania
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news..."
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </form>

          {/* Categories */}
          {/* Desktop: show only Top Headlines and More dropdown */}
          <div className="hidden lg:flex items-center space-x-4" ref={moreRef}>
            <Link
              to={`/`}
              className={`px-3 py-2 text-sm font-medium ${location.pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'} hover:text-blue-600 dark:hover:text-blue-400`}
            >
              Top Headlines
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowMore((s) => !s)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                aria-expanded={showMore}
                aria-haspopup="menu"
              >
                <span>More</span>
                <FaChevronDown className={`transition-transform duration-200 ${showMore ? 'transform rotate-180' : ''}`} />
              </button>

              <div className={`absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-50 transform transition-all duration-150 ${showMore ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                {categories.filter((c) => c !== 'Top Headlines').map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      navigate(`/category/${encodeURIComponent(cat)}`);
                      setShowMore(false);
                    }}
                    className={`w-full text-left block px-4 py-2 text-sm ${location.pathname.includes(`/category/${cat}`) ? 'text-blue-600 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-600`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <FaSun className="text-yellow-500 text-xl" />
              ) : (
                <FaMoon className="text-gray-700 text-xl" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/bookmarks"
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Bookmarks"
                >
                  <FaBookmark className="text-gray-700 dark:text-gray-300 text-xl" />
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Admin Panel"
                  >
                    <FaShieldAlt className="text-red-600 text-xl" />
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Profile"
                >
                  <FaUser className="text-gray-700 dark:text-gray-300 text-xl" />
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Logout"
                >
                  <FaSignOutAlt className="text-gray-700 dark:text-gray-300 text-xl" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Categories */}
        <div className="lg:hidden pb-4 overflow-x-auto">
          <div className="flex space-x-2">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/category/${cat}`}
                className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 whitespace-nowrap"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

