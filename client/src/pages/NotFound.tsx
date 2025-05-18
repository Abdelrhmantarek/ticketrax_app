import { useLocation } from "react-router-dom";
import { useEffect } from "react";

/**
 * NotFound (404) Component:
 * Displays when users attempt to access non-existent routes.
 * Features:
 * - Error logging for debugging
 * - User-friendly error message
 * - Navigation back to safety
 * - Responsive design
 */
const NotFound = () => {
  const location = useLocation();

  // Log 404 errors to help with debugging
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    // Optionally send to error tracking service
    // logErrorToService('404', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
