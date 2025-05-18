import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // For navigation and detecting current route
import { useAuth } from '@/context/AuthContext'; // Custom hook for auth state & actions
import { Button } from '@/components/ui/button';
import { LogOut, Ticket, Menu, X } from 'lucide-react'; // Icons
import { motion, AnimatePresence } from 'framer-motion'; // Animation helpers

const Navbar: React.FC = () => {
  // Destructure user info, auth status, and logout function from context
  const { user, isAuthenticated, logout } = useAuth();

  // Get current route location to highlight active links and close mobile menu on route change
  const location = useLocation();

  // State to track if user scrolled down, to change navbar style
  const [isScrolled, setIsScrolled] = useState(false);

  // State to control visibility of the mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Effect to add scroll listener to update isScrolled state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10); // true if scrolled more than 10px vertically
    };
    window.addEventListener('scroll', handleScroll);

    // Cleanup listener on unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to close mobile menu when user navigates to a new route
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]); // Runs whenever route path changes

  // Helper to check if a path is currently active (matches location)
  const isActive = (path: string) => location.pathname === path;

  // Dynamic navbar CSS classes depending on scroll state for backdrop, shadow, etc.
  const navBarClass = `fixed top-0 w-full z-30 transition-all duration-300 ${
    isScrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-transparent'
  }`;

  // Returns dynamic link classes based on if link is active and scroll state
  const linkClass = (path: string) => 
    `text-sm font-medium transition-colors relative px-2 py-1 rounded-md ${
      isActive(path) 
        ? 'text-primary' 
        : `${isScrolled ? 'text-gray-700' : 'text-gray-700'} hover:text-primary`
    }`;

  // Get user's display name, prefers first_name over username, fallback empty string
  const getUserDisplayName = () => {
    if (!user) return '';
    return user.first_name || user.username;
  };

  return (
    <header className={navBarClass}>
      {/* Main container with flex layout */}
      <div className="container mx-auto px-4 flex h-16 items-center justify-between bg-white/95 shadow-sm">
        
        {/* Logo and title with animation */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            initial={{ rotate: -10 }} // initial rotation for fun effect
            animate={{ rotate: 0 }} // animate rotation to normal
            transition={{ duration: 0.5 }}
          >
            <Ticket className="h-6 w-6 text-primary" />
          </motion.div>
          <motion.span 
            className="text-xl font-bold text-gray-900"
            initial={{ opacity: 0, x: -10 }} // fade in from left
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            TicketRax
          </motion.span>
        </Link>

        {/* Desktop navigation - hidden on small screens */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Home Link */}
          <Link to="/" className={linkClass('/')}>
            Home
            {/* Animated underline for active link */}
            {isActive('/') && (
              <motion.div 
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                layoutId="navIndicator" // shared animation id for smooth transition between active links
              />
            )}
          </Link>

          {/* Submit Ticket Link */}
          <Link to="/submit-ticket" className={linkClass('/submit-ticket')}>
            Submit a Ticket
            {isActive('/submit-ticket') && (
              <motion.div 
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                layoutId="navIndicator"
              />
            )}
          </Link>

          {/* Show Admin Login or Dashboard & Logout depending on auth status */}
          {!isAuthenticated ? (
            <Link to="/admin/login">
              <Button variant="default" size="sm" className="ml-4">
                Admin Login
              </Button>
            </Link>
          ) : (
            <>
              {/* Dashboard link */}
              <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>
                Dashboard
                {isActive('/admin/dashboard') && (
                  <motion.div 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    layoutId="navIndicator"
                  />
                )}
              </Link>

              {/* Display user name and logout button */}
              <div className="flex items-center space-x-4">
                <span className={`text-sm ${isScrolled ? 'text-gray-600' : 'text-black'}`}>
                  {getUserDisplayName()}
                </span>
                <Button 
                  size="sm" 
                  onClick={logout} // Calls logout from auth context
                  className={`flex items-center space-x-1 hover:bg-red-100 ${
                    isScrolled ? 'text-gray-600 hover:text-red-500' : 'text-white hover:text-red-500'
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </>
          )}
        </nav>

        {/* Mobile menu button visible only on small screens */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} // toggle mobile menu
            className="text-gray-700"
          >
            {/* Toggle icon between menu and close */}
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile navigation menu, animates in/out */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-white shadow-lg absolute top-16 left-0 right-0"
            initial={{ opacity: 0, height: 0 }} // start hidden and collapsed
            animate={{ opacity: 1, height: 'auto' }} // expand and fade in
            exit={{ opacity: 0, height: 0 }} // collapse and fade out on close
            transition={{ duration: 0.2 }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
              {/* Mobile links */}
              <Link to="/" className="text-gray-700 hover:text-primary py-2">
                Home
              </Link>
              <Link to="/submit-ticket" className="text-gray-700 hover:text-primary py-2">
                Submit a Ticket
              </Link>

              {/* Auth-dependent buttons */}
              {!isAuthenticated ? (
                <Link to="/admin/login" className="py-2">
                  <Button className="w-full">Admin Login</Button>
                </Link>
              ) : (
                <>
                  <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary py-2">
                    Dashboard
                  </Link>
                  {/* User info and logout */}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">
                      {getUserDisplayName()}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={logout}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
