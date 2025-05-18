import React from 'react';
// NavLink is used to create navigation links with active styling
import { NavLink } from 'react-router-dom';
// Custom auth context hook to access user info and logout function
import { useAuth } from '@/context/AuthContext';
// Icons from lucide-react library for UI decoration
import { Ticket, LayoutDashboard, List, User, LogOut } from 'lucide-react';
// UI components (Button, Separator) from your design system or UI library
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const AdminSidebar: React.FC = () => {
  // Get the current user object and logout function from auth context
  const { user, logout } = useAuth();

  return (
    // Sidebar container: fixed width, white background, border on right,
    // sticky position so it stays visible on scroll, full height minus header height (4rem)
    <div className="w-64 bg-white border-r flex flex-col sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      
      {/* Sidebar header with logo/icon and title */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <Ticket className="h-6 w-6 text-primary" /> {/* Ticket icon styled as primary color */}
          <span className="text-xl font-bold">Maharah</span> {/* App/Company name */}
        </div>
        <div className="text-xs text-gray-500">Admin Dashboard</div> {/* Subtitle */}
      </div>
      
      {/* Visual separator line */}
      <Separator />
      
      {/* Navigation links container, takes all available vertical space */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {/* Dashboard link */}
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'  // Active link styling
                    : 'text-gray-700 hover:bg-gray-100'       // Default & hover styles
                }`
              }
            >
              <LayoutDashboard className="h-4 w-4" /> {/* Icon for dashboard */}
              Dashboard
            </NavLink>
          </li>
          {/* Tickets link */}
          <li>
            <NavLink
              to="/admin/tickets"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <List className="h-4 w-4" /> {/* Icon for tickets */}
              Tickets
            </NavLink>
          </li>
        </ul>
      </nav>
      
      {/* User info and logout button section at the bottom */}
      <div className="p-4 mt-auto">
        <Separator className="mb-4" />
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gray-200 p-2 rounded-full">
            <User className="h-5 w-5 text-gray-700" /> {/* User icon */}
          </div>
          <div>
            <div className="text-sm font-medium">{user?.username}</div> {/* Display logged-in username */}
            <div className="text-xs text-gray-500">{user?.email}</div> {/* Display logged-in user email */}
          </div>
        </div>
        {/* Logout button calls logout function on click */}
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" /> {/* Logout icon */}
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
