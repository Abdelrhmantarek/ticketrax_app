import React, { useState, useEffect } from 'react';
// Routes and Route for defining routing rules, useLocation to detect current route
import { Routes, Route, useLocation } from 'react-router-dom';
// AnimatePresence from framer-motion for smooth transitions between routes
import { AnimatePresence } from 'framer-motion';

// Components for layout and UI
import Navbar from "./Navbar";
import Loader from "./Loader";
import AdminLayout from "./admin/AdminLayout";

// Pages for different routes
import Index from "../pages/Index";
import SubmitTicket from "../pages/SubmitTicket";
import TicketSubmitted from "../pages/TicketSubmitted";
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import TicketList from "../pages/admin/TicketList";
import TicketDetail from "../pages/admin/TicketDetail";
import NotFound from "../pages/NotFound";

const AppRouter: React.FC = () => {
  // Get current route location to track navigation changes
  const location = useLocation();

  // State to track initial app loading (e.g., splash screen)
  const [isLoading, setIsLoading] = useState(true);
  // State to track navigation loading between routes
  const [isNavigating, setIsNavigating] = useState(false);

  // Simulate initial loading effect on app mount (e.g., show splash/loading screen for 1.5 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);  // After timeout, set loading false to render app content
    }, 1500);
    
    // Cleanup timer if component unmounts before timeout
    return () => clearTimeout(timer);
  }, []);

  // Run on every route change (location.pathname)
  useEffect(() => {
    if (!isLoading) {  // Only trigger navigation loading after initial loading finished
      setIsNavigating(true);  // Start navigation loading state
      
      // Simulate loading for route change (e.g., fetching data)
      const timer = setTimeout(() => {
        setIsNavigating(false);  // Stop navigation loading after 0.8 seconds
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isLoading]);

  return (
    <>
      {/* Show loader while app is initially loading or navigating between routes */}
      <AnimatePresence mode="wait">
        {(isLoading || isNavigating) && <Loader isLoading={true} />}
      </AnimatePresence>
      
      {/* Navbar is always visible, regardless of route */}
      <Navbar />
      
      {/* AnimatePresence wraps Routes for smooth page transitions */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* Public-facing routes */}
          <Route path="/" element={<Index />} />
          <Route path="/submit-ticket" element={<SubmitTicket />} />
          <Route path="/ticket-submitted" element={<TicketSubmitted />} />
          
          {/* Admin login page */}
          <Route path="/admin/login" element={<Login />} />
          
          {/* Admin routes wrapped inside AdminLayout for shared layout (sidebar, auth checks) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tickets" element={<TicketList />} />
            <Route path="tickets/:id" element={<TicketDetail />} />
          </Route>
          
          {/* Fallback route for any unmatched path, shows 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default AppRouter;
