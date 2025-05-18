import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Ticket, LogIn, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Login Component:
 * Handles admin authentication with:
 * - Form validation
 * - Error handling
 * - Loading states
 * - Animated transitions
 */
const Login: React.FC = () => {
  // Hooks for navigation and authentication
  const navigate = useNavigate();
  const { isAuthenticated, login, isLoading } = useAuth();
  const { toast } = useToast();
  
  // Form state management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: ''
  });

  // Redirect if already authenticated
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/admin/dashboard" />;
  }

  /**
   * Form Validation:
   * - Checks for empty fields
   * - Validates email format
   * - Enforces password length
   * @returns boolean - true if form is valid
   */
  const validateForm = () => {
    let isValid = true;
    const errors = { email: '', password: '' };
    
    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    setValidationErrors(errors);
    return isValid;
  };

  /**
   * Form Submission Handler:
   * - Validates form
   * - Calls auth service
   * - Handles success/error states
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-md mx-auto">
        {/* Animated Header Section */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo Animation */}
          <div className="inline-flex items-center justify-center mb-4">
            <motion.div
              initial={{ rotate: -10, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20 
              }}
            >
              <Ticket className="h-12 w-12 text-primary" />
            </motion.div>
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Admin Login
          </h1>
          <p className="text-gray-600">
            Access the Maharah ticket management dashboard
          </p>
        </motion.div>
        
        {/* Animated Card Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <form onSubmit={handleSubmit}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access the admin dashboard
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Email Input Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center justify-between">
                    Email
                    {validationErrors.email && (
                      <span className="text-xs text-destructive flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.email}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="maharah@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      // Clear error when user starts typing
                      if (validationErrors.email) {
                        setValidationErrors({...validationErrors, email: ''});
                      }
                    }}
                    className={`focus:ring-2 focus:ring-primary/30 transition-all duration-300 ${
                      validationErrors.email ? 'border-destructive' : ''
                    }`}
                    required
                  />
                </div>
                
                {/* Password Input Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center justify-between">
                    Password
                    {validationErrors.password && (
                      <span className="text-xs text-destructive flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.password}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      // Clear error when user starts typing
                      if (validationErrors.password) {
                        setValidationErrors({...validationErrors, password: ''});
                      }
                    }}
                    className={`focus:ring-2 focus:ring-primary/30 transition-all duration-300 ${
                      validationErrors.password ? 'border-destructive' : ''
                    }`}
                    required
                  />
                </div>
              </CardContent>
              
              {/* Submit Button */}
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full relative overflow-hidden group hover:shadow-md transition-all duration-300"
                  disabled={isSubmitting}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? 'Logging in...' : 'Log in'}
                    <LogIn className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {/* Animated button background */}
                  <span className="absolute inset-0 bg-primary/10 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;