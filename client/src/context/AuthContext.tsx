import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authService from '../services/authService';
import { useToast } from '@/hooks/use-toast';

/**
 * Type definitions for the User object and AuthContext structure.
 * Ensures type safety across the authentication flow.
 */
type User = {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
};

type AuthContextType = {
  user: User | null;           // Current logged-in user data (null if not authenticated)
  isLoading: boolean;          // Indicates if auth state is being checked (e.g., during app startup)
  isAuthenticated: boolean;    // Derived boolean flag for quick auth checks
  login: (email: string, password: string) => Promise<void>;  // Login function
  logout: () => void;          // Logout function
};

// Default context values (avoids undefined checks in consumers)
const initialContext: AuthContextType = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
};

// Create the context with initial values
const AuthContext = createContext<AuthContextType>(initialContext);

/**
 * Custom hook to access auth context.
 * Usage: const { user, login } = useAuth();
 */
export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;  // Wraps the entire app (usually in main.tsx)
};

/**
 * AuthProvider Component:
 * - Manages user authentication state globally.
 * - Handles session persistence (checks auth status on mount).
 * - Provides login/logout methods with toast notifications.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);  // Initial load check
  const { toast } = useToast();  // Toast notifications for user feedback

  /**
   * On component mount:
   * 1. Checks if a valid session exists (e.g., via stored token).
   * 2. Fetches user data if authenticated.
   * 3. Sets loading state to false once complete.
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await authService.isAuthenticated();
        
        if (isAuth) {
          const userData = await authService.getCurrentUser();
          setUser(userData as User);  // Update user state
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setIsLoading(false);  // Ensure loading ends even if errors occur
      }
    };
    
    checkAuth();
  }, []);

  /**
   * Login Function:
   * 1. Calls authService.login() with credentials.
   * 2. Updates user state on success.
   * 3. Shows toast notifications for success/error states.
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      setUser(response.user as User);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.user.username}!`,
      });
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",  // Error styling (if using shadcn/ui)
      });
      throw error;  // Re-throw for form error handling
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout Function:
   * 1. Calls authService.logout() to clear server session.
   * 2. Resets user state to null.
   * 3. Shows confirmation toast.
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Context value object (re-renders consumers when updated)
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,  // Converts user to boolean
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};