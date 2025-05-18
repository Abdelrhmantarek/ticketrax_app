import React from 'react';
// Navigate allows redirecting to a different route programmatically
// Outlet renders the matched child route component
import { Navigate, Outlet } from 'react-router-dom';
// Custom hook to get authentication state from context
import { useAuth } from '@/context/AuthContext';
// Sidebar component for admin navigation menu
import AdminSidebar from './AdminSidebar';

const AdminLayout: React.FC = () => {
  // Destructure auth state: whether user is logged in and loading status
  const { isAuthenticated, isLoading } = useAuth();

  // While auth status is being checked (e.g., fetching from server/local storage),
  // show a loading indicator to avoid flickering content
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If user is not authenticated, redirect to the admin login page
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  // If authenticated, render the admin layout with sidebar and main content area
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar navigation for admin pages */}
      <AdminSidebar />
      {/* Main content area takes remaining space and allows scrolling if content overflows */}
      <main className="flex-1 overflow-auto">
        {/* Padding around page content */}
        <div className="p-6">
          {/* Outlet renders whatever child route is matched under /admin */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
